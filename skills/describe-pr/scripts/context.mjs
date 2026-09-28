#!/usr/bin/env node
// Builds the git context for a PR description: branch, base, commits, per-file diffs, signals.
// Deterministic: no model calls, no network, never writes inside the repository.
//
// Usage: node context.mjs [--base <branch>] [--budget <chars>] [--config <file>] [--out <file>]
// Run it from anywhere inside the repository. Prints JSON (or writes it to --out).

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const DEFAULTS = {
  baseBranches: { story: 'develop', bugfix: 'develop', hotfix: 'master', release: 'master' },
  budget: 60000,
  scopes: [],
  exclude: [],
  extraSignals: {},
  templatesDir: null,
  designDocUrl: null,
};

const EXCLUDE = [
  '**/package-lock.json', '**/npm-shrinkwrap.json', '**/yarn.lock', '**/pnpm-lock.yaml', '**/bun.lockb',
  '**/*.min.js', '**/*.min.css', '**/*.map', '**/dist/**', '**/build/**', '**/target/**', '**/out/**',
  '**/node_modules/**', '**/*.snap', '**/__snapshots__/**', '**/generated/**', '**/*.generated.*',
  '**/i18n/**', '**/*.svg',
];

// Files whose content never leaves the machine, only their path.
const SENSITIVE = [
  '**/.env', '**/.env.*', '**/*.pem', '**/*.key', '**/*.p12', '**/*.pfx', '**/*.jks', '**/*.keystore',
  '**/id_rsa*', '**/id_ed25519*', '**/*credentials*.json', '**/*service-account*.json', '**/.npmrc', '**/.netrc',
];
const SENSITIVE_ALLOWED = /\.(example|sample|template)$/i;

const SECRET_PATTERNS = [
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/g],
  ['github-token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{22,}\b/g],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ['slack-token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
  ['npm-token', /(_authToken\s*=\s*)(\S+)/g],
  ['credential-assignment',
    /((?:password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|client[_-]?secret)["']?\s*[:=]\s*["'])([^"'\s]{8,})(["'])/gi],
];

const SIGNALS = {
  migration: { test: p => /(^|\/)(changelog|migrations?|liquibase|flyway)(\/|\.)|db\.changelog|\.sql$/i.test(p), weight: 5 },
  permissions: { test: p => /(guard|role|auth|security|permission|acl|iap|oauth)/i.test(basename(p)), weight: 4 },
  apiContract: { test: p => /(controller|resource|endpoint|dto|routes?|api-urls?)[^/]*\.(java|kt|ts|js)$/i.test(basename(p)), weight: 4 },
  config: {
    test: p => /(^|\/)\.env\.(example|sample|template)$|(^|\/)application[^/]*\.(properties|ya?ml)$|appengine-web[^/]*\.xml$|(^|\/)(cron|dispatch|queue|index|app)\.yaml$|(^|\/)environments?\/|proxy\.conf\.json$|(^|\/)web\.xml$/i.test(p),
    weight: 3,
  },
  dependencies: { test: p => /(^|\/)(package\.json|pom\.xml|build\.gradle(\.kts)?|requirements\.txt)$/i.test(p), weight: 3 },
  releaseNotes: { test: p => /releasenotes\.ts$/i.test(p), weight: 2 },
  ui: { test: p => /\.(html|css|scss|sass|less)$|\.component\.ts$/i.test(p), weight: 0 },
  tests: { test: p => /\.(spec|test)\.[jt]s$|(^|\/)(tests?|__tests__)\/|Tests?\.java$/.test(p), weight: 0 },
};

const STRICT_BRANCH = [/^(story|bugfix|hotfix)\/\d{6,10}_[a-z][A-Za-z0-9]{2,39}$/, /^release\/R\d+\.\d+(\.\d+)?$/];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1];
    i++;
  }
  return args;
}

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
      .replace(/\r\n/g, '\n');
  } catch (e) {
    if (allowFail) return null;
    throw new Error(`git ${args.join(' ')} failed: ${(e.stderr || e.message).toString().trim()}`);
  }
}

function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; } else re += '.*';
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, 'i');
}

const matchesAny = (path, globs) => globs.some(g => globToRegExp(g).test(path));

function parseBranch(name) {
  const problems = [];
  let rest = name;
  if (rest.startsWith('origin/')) {
    problems.push('starts with "origin/" (local branch created from a remote ref name)');
    rest = rest.slice('origin/'.length);
  }
  const result = { name, type: null, ticketId: null, slug: null, releaseVersion: null, valid: false, problems };
  const m = rest.match(/^([^/]+)\/(.+)$/);
  if (!m) {
    problems.push('no type prefix (story/, bugfix/, hotfix/, release/)');
    return result;
  }
  result.type = m[1].toLowerCase();
  const tail = m[2];
  if (!['story', 'bugfix', 'hotfix', 'release'].includes(result.type)) problems.push(`unknown type prefix "${m[1]}/"`);
  if (result.type === 'release') {
    const r = tail.match(/^(R?)(\d+\.\d+(?:\.\d+)?)$/);
    if (r) {
      result.releaseVersion = `R${r[2]}`;
      if (!r[1]) problems.push('release version without the "R" prefix');
    } else problems.push('release version not in the form R<major>.<minor>[.<patch>]');
  } else {
    const t = tail.match(/^(\d{6,10})(?:[_-](.*))?$/);
    if (t) { result.ticketId = t[1]; result.slug = t[2] || ''; } else { result.slug = tail; problems.push('no ticket ID'); }
    if (/[^A-Za-z0-9_]/.test(tail)) problems.push('illegal characters in the name');
  }
  result.valid = STRICT_BRANCH.some(r => r.test(name));
  if (!result.valid && problems.length === 0) problems.push('does not match the naming standard');
  return result;
}

function resolveRef(name) {
  for (const candidate of [name, `origin/${name}`]) {
    if (git(['rev-parse', '--verify', '--quiet', `${candidate}^{commit}`], { allowFail: true })) return candidate;
  }
  return null;
}

function shannonEntropy(s) {
  const counts = {};
  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
  return Object.values(counts).reduce((h, n) => h - (n / s.length) * Math.log2(n / s.length), 0);
}

function redact(diff, path, redactions) {
  const lines = diff.split('\n');
  return lines.map((line, index) => {
    if (/^(diff --git|index |--- |\+\+\+ |@@)/.test(line)) return line;
    let out = line;
    for (const [name, pattern] of SECRET_PATTERNS) {
      out = out.replace(pattern, (...m) => {
        redactions.push({ file: path, diffLine: index + 1, reason: name });
        if (name === 'credential-assignment') return `${m[1]}[REDACTED:${name}]${m[3]}`;
        if (name === 'npm-token') return `${m[1]}[REDACTED:${name}]`;
        return `[REDACTED:${name}]`;
      });
    }
    out = out.replace(/[A-Za-z0-9+/=_-]{32,}/g, token => {
      if (/\d/.test(token) && /[A-Za-z]/.test(token) && shannonEntropy(token) >= 4.3) {
        redactions.push({ file: path, diffLine: index + 1, reason: 'high-entropy-string' });
        return '[REDACTED:high-entropy-string]';
      }
      return token;
    });
    return out;
  }).join('\n');
}

function sizing(totalLines, fileCount) {
  if (totalLines < 20 && fileCount <= 1) return 'small';
  if (totalLines > 800) return 'large';
  return 'normal';
}

function templateKind(type) {
  return ['story', 'bugfix', 'hotfix'].includes(type) ? type : 'story';
}

function requiredSections(kind, signals, size) {
  const has = s => signals.includes(s);
  if (size === 'small') return kind === 'story' ? ['why'] : ['problem', 'fix'];
  if (kind === 'story') {
    const req = ['why', 'whatChanged', 'testing'];
    if (['migration', 'config', 'dependencies', 'apiContract', 'permissions'].some(has)) req.push('impactAndRisk');
    if (has('ui')) req.push('screenshots');
    return req;
  }
  const req = ['problem', 'rootCause', 'fix', 'regressionAndTesting'];
  if (kind === 'hotfix' || has('migration')) req.push('rollback');
  if (kind === 'hotfix') req.push('mergeBack');
  return req;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = git(['rev-parse', '--show-toplevel']).trim();
  process.chdir(root);

  const configPath = args.config || join(root, '.describe-pr.json');
  const repoConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
  const config = { ...DEFAULTS, ...repoConfig, baseBranches: { ...DEFAULTS.baseBranches, ...(repoConfig.baseBranches || {}) } };
  const budget = Number(args.budget || config.budget);
  const warnings = [];

  const branchName = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  const branch = parseBranch(branchName);
  if (branch.type === 'release') warnings.push('Release PRs are not supported yet; the story template is used.');

  const baseName = args.base || config.baseBranches[branch.type] || 'develop';
  const baseRef = resolveRef(baseName);
  if (!baseRef) throw new Error(`Base branch "${baseName}" not found locally or on origin. Pass --base <branch>.`);
  const mergeBase = git(['merge-base', baseRef, 'HEAD']).trim();
  const range = `${baseRef}...HEAD`;

  const commits = git(['log', '--no-merges', '--format=%h%x09%s', `${baseRef}..HEAD`]).split('\n').filter(Boolean)
    .map(l => { const [sha, ...s] = l.split('\t'); return { sha, subject: s.join('\t') }; });
  if (commits.length === 0) warnings.push(`No commits between ${baseRef} and HEAD.`);

  // -z output: renames are "R100\0old\0new\0" (name-status) and "a\tr\t\0old\0new\0" (numstat).
  const status = {};
  const ns = git(['diff', '--name-status', '-M', '-z', range]).split('\0');
  for (let i = 0; i < ns.length - 1;) {
    const s = ns[i++];
    if (/^[RC]/.test(s)) { const from = ns[i++]; status[ns[i++]] = { status: 'R', renamedFrom: from }; } else status[ns[i++]] = { status: s[0] };
  }

  const files = [];
  const num = git(['diff', '--numstat', '-M', '-z', range]).split('\0');
  for (let i = 0; i < num.length - 1;) {
    const [a, r, p] = num[i++].split('\t');
    const path = p === '' ? (i++, num[i++]) : p;
    const binary = a === '-';
    const extra = Object.entries(config.extraSignals).filter(([, globs]) => matchesAny(path, globs)).map(([n]) => n);
    const signals = [...Object.entries(SIGNALS).filter(([, s]) => s.test(path)).map(([n]) => n), ...extra];
    files.push({
      path, status: status[path]?.status || 'M', renamedFrom: status[path]?.renamedFrom,
      added: binary ? 0 : Number(a), removed: binary ? 0 : Number(r), binary, signals,
    });
  }

  const redactions = [];
  // Budget priority: high-signal source first, then plain source, then markup/styles/config, tests and docs last.
  const weight = f => {
    if (f.signals.includes('tests')) return 0.5;
    const base = /\.(java|kt|ts|tsx|js|jsx|py|go|cs)$/i.test(f.path) ? 2
      : /\.(md|txt)$|(^|\/)\.(vscode|idea|settings)\//i.test(f.path) ? 0 : 1;
    const signal = f.signals.reduce((w, s) => w + (SIGNALS[s]?.weight ?? 3), 0);
    const deletionOnly = f.added === 0 ? 0.5 : 1;
    return (base + signal) * deletionOnly;
  };
  const candidates = [];
  for (const f of files) {
    if (matchesAny(f.path, SENSITIVE) && !SENSITIVE_ALLOWED.test(f.path)) {
      f.included = 'redacted';
      f.reason = 'sensitive file: content never sent, only its path';
      redactions.push({ file: f.path, reason: 'sensitive-file' });
    } else if (matchesAny(f.path, [...EXCLUDE, ...config.exclude])) {
      f.included = 'stat';
      f.reason = 'excluded (lockfile, generated, minified, snapshot, translation or asset)';
    } else if (f.binary) {
      f.included = 'stat';
      f.reason = 'binary';
    } else if (f.status === 'D') {
      f.included = 'stat';
      f.reason = 'deleted (content not needed to describe the removal)';
    } else candidates.push(f);
  }

  let remaining = budget;
  candidates.sort((x, y) => weight(y) - weight(x) || (x.added + x.removed) - (y.added + y.removed));
  for (const f of candidates) {
    const paths = f.renamedFrom ? [f.renamedFrom, f.path] : [f.path];
    const raw = git(['diff', '--no-color', '--no-ext-diff', '-M', '-U3', range, '--', ...paths]);
    const diff = redact(raw, f.path, redactions);
    if (diff.length <= remaining) {
      f.included = 'full';
      f.diff = diff;
      remaining -= diff.length;
    } else {
      f.included = 'stat';
      f.reason = 'over the diff budget';
    }
  }

  const overBudget = files.filter(f => f.reason === 'over the diff budget').length;
  if (overBudget) warnings.push(`${overBudget} file(s) sent as stats only because the diff budget (${budget} chars) was reached.`);
  if (!branch.valid) warnings.push(`Branch name "${branchName}": ${branch.problems.join('; ')}.`);

  const totalAdded = files.reduce((n, f) => n + f.added, 0);
  const totalRemoved = files.reduce((n, f) => n + f.removed, 0);
  const allSignals = [...new Set(files.flatMap(f => f.signals))];
  const size = sizing(totalAdded + totalRemoved, files.length);
  const kind = templateKind(branch.type);
  if (size === 'large') warnings.push('Large change (> 800 lines): check whether it bundles unrelated concerns and should be split.');

  const context = {
    repo: basename(root),
    root,
    branch,
    base: { name: baseName, ref: baseRef, mergeBase },
    commits,
    stats: { files: files.length, added: totalAdded, removed: totalRemoved },
    sizing: size,
    template: kind,
    signals: allSignals,
    requiredSections: requiredSections(kind, allSignals, size),
    scopes: config.scopes,
    designDocUrl: config.designDocUrl,
    templatesDir: config.templatesDir,
    files,
    redactions,
    warnings,
  };

  const json = JSON.stringify(context, null, 2);
  if (args.out) writeFileSync(args.out, json); else process.stdout.write(json + '\n');
}

try {
  main();
} catch (e) {
  process.stderr.write(`describe-pr context: ${e.message}\n`);
  process.exit(1);
}
