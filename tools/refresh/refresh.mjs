#!/usr/bin/env node
// Refresh this machine's installed skills and workflow instructions from this checkout.
// Only items that are already installed and differ from their source are replaced; each one is backed up first.
import { readFileSync, readdirSync, existsSync, lstatSync, mkdirSync, mkdtempSync, cpSync, rmSync, renameSync,
  writeFileSync, appendFileSync } from 'node:fs';
import { join, resolve, dirname, relative, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const USAGE = `usage: node tools/refresh/refresh.mjs [--dry-run] [--gemini] [--host-instructions] [--skip-pinned]
                                      [--home DIR]

  --dry-run            Report what would change; change nothing in your home. Pinned skills are still
                       fetched into a temp cache to compare them (use --skip-pinned to avoid the network).
  --gemini             Also refresh an installed Gemini relay: builds delegate-setup and gemini-delegate from
                       the vendored delegate-skills plus overlays/gemini-delegate (needs git). Without it,
                       an installed gemini-delegate and delegate-setup are left untouched.
  --host-instructions  Also replace host instruction files (AGENTS.md/CLAUDE.md/GEMINI.md) that differ.
                       Without it they are only reported, because they may hold personal additions.
  --skip-pinned        Do not fetch the pinned third-party skills (no network). Fetching needs git and tar.
  --home DIR           Home directory to refresh (default: your home).

Linked (symlink/junction) skills or folders are never written through; they are reported and left as is.`;

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export function parseArgs(argv) {
  const opts = { dryRun: false, gemini: false, hostInstructions: false, skipPinned: false, home: homedir(), help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help') opts.help = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--host-instructions') opts.hostInstructions = true;
    else if (a === '--skip-pinned') opts.skipPinned = true;
    else if (a === '--gemini') opts.gemini = true;
    else if (a === '--home') {
      if (!argv[i + 1]) throw new Error('--home needs a directory');
      opts.home = resolve(argv[++i]);
    } else throw new Error(`unknown option ${a}`);
  }
  return opts;
}

const isLink = path => { try { return lstatSync(path).isSymbolicLink(); } catch { return false; } };
const isDir = path => { try { return lstatSync(path).isDirectory(); } catch { return false; } };

// True when any existing component from home down to path is a symlink or junction.
export function linkedUnder(home, path) {
  let current = resolve(home);
  if (isLink(current)) return true;
  for (const part of relative(current, path).split(sep).filter(Boolean)) {
    current = join(current, part);
    if (isLink(current)) return true;
  }
  return false;
}

const listFiles = dir => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (isLink(path)) throw new Error(`linked entry inside ${dir}: ${name}`);
  return isDir(path) ? listFiles(path).map(f => join(name, f)) : [name];
}).sort();
const normalized = path => readFileSync(path).toString('latin1').replace(/\r\n/g, '\n');

export function sameContent(source, installed) {
  if (!existsSync(installed) || isLink(installed)) return false;
  if (!isDir(source)) return !isDir(installed) && normalized(source) === normalized(installed);
  if (!isDir(installed)) return false;
  const a = listFiles(source), b = listFiles(installed);
  return a.length === b.length && a.every((f, i) => f === b[i] && normalized(join(source, f)) === normalized(join(installed, f)));
}

const skillDirs = base => existsSync(base)
  ? readdirSync(base).filter(n => existsSync(join(base, n, 'SKILL.md'))).map(n => [n, join(base, n)]) : [];

// Read the Pocock pin and folders from the GUIDE install block, so the pin lives in one place.
export function pinnedSpec(guide) {
  const commit = guide.match(/\$pin\s*=\s*"([0-9a-f]{40})"/)?.[1];
  const list = guide.match(/\$pinned = (.+)/)?.[1];
  if (!commit || !list) throw new Error('GUIDE.md install block: pinned skills not found');
  return { commit, folders: [...list.matchAll(/"([^"]+)"/g)].map(m => m[1].replaceAll('\\', '/')) };
}

// Extract exactly the pinned folders at the pinned commit into a fresh directory; the cache may hold anything.
function fetchPinned({ commit, folders }) {
  const cache = join(tmpdir(), 'ai-skills-mattpocock.git');
  const git = (...args) => execFileSync('git', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  if (!existsSync(cache)) git('clone', '--quiet', '--bare', 'https://github.com/mattpocock/skills', cache);
  try { git('-C', cache, 'cat-file', '-e', `${commit}^{commit}`); } catch { git('-C', cache, 'fetch', '--quiet', 'origin', commit); }
  const out = mkdtempSync(join(tmpdir(), 'ai-skills-pinned-'));
  try {
    const archive = join(out, 'pinned.tar');
    git('-C', cache, 'archive', '--format=tar', '-o', archive, commit, ...folders.map(f => `skills/${f}`));
    execFileSync('tar', ['-xf', archive, '-C', out], { stdio: ['ignore', 'pipe', 'pipe'] });
    rmSync(archive);
    return { out, skills: folders.map(f => {
      const dir = join(out, 'skills', ...f.split('/'));
      if (!existsSync(join(dir, 'SKILL.md'))) throw new Error(`pinned commit has no skills/${f}`);
      return [f.split('/').pop(), dir];
    }) };
  } catch (error) { rmSync(out, { recursive: true, force: true }); throw error; }
}

// Build the Gemini-enabled delegate skills the way overlays/gemini-delegate/README.md does: vendored copy + patch.
export function buildGemini() {
  const vendor = join(repo, 'vendor', 'amElnagdy', 'delegate-skills');
  const overlay = join(repo, 'overlays', 'gemini-delegate');
  const base = readFileSync(join(overlay, 'base-commit.txt'), 'utf8').trim();
  if (!readFileSync(join(vendor, 'UPSTREAM.md'), 'utf8').includes(base)) {
    throw new Error(`Gemini overlay base ${base.slice(0, 8)} does not match the vendored delegate-skills; rebase the overlay first`);
  }
  const out = mkdtempSync(join(tmpdir(), 'ai-skills-gemini-'));
  try {
    cpSync(vendor, out, { recursive: true });
    execFileSync('git', ['apply', join(overlay, 'changes.patch')], { cwd: out, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    rmSync(out, { recursive: true, force: true });
    throw new Error(`Gemini overlay does not apply: ${String(error.stderr || error.message).split('\n')[0]}`);
  }
  return out;
}

export function sources(opts) {
  const map = new Map([...skillDirs(join(repo, 'skills'))]);
  const problems = [];
  let cleanup = () => {};
  for (const owner of readdirSync(join(repo, 'vendor'))) {
    for (const name of readdirSync(join(repo, 'vendor', owner))) {
      for (const [skill, dir] of skillDirs(join(repo, 'vendor', owner, name, 'skills'))) map.set(skill, dir);
    }
  }
  const temps = [];
  cleanup = () => { for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true }); };
  try {
    if (opts.gemini) {
      const built = buildGemini();
      temps.push(built);
      for (const skill of ['delegate-setup', 'gemini-delegate']) map.set(skill, join(built, 'skills', skill));
    } else {
      map.delete('gemini-delegate');
    }
    if (!opts.skipPinned) {
      try {
        const pinned = fetchPinned(pinnedSpec(readFileSync(join(repo, 'GUIDE.md'), 'utf8')));
        temps.push(pinned.out);
        for (const [skill, dir] of pinned.skills) map.set(skill, dir);
      } catch (error) { problems.push(`pinned skills not checked: ${String(error.message).split('\n')[0]}`); }
    }
  } catch (error) { cleanup(); throw error; }
  return { map, problems, cleanup };
}

export function plan(opts) {
  const { map: skills, problems, cleanup } = sources(opts);
  try {
    return planWith(opts, skills, problems, cleanup);
  } catch (error) { cleanup(); throw error; }
}

function planWith(opts, skills, problems, cleanup) {
  const items = [], notes = [];
  const leftovers = dir => {
    if (!existsSync(dir) || linkedUnder(opts.home, dir)) return;
    for (const name of readdirSync(dir).filter(n => /\.refresh-(new|old)$/.test(n))) {
      const original = join(dir, name.replace(/\.refresh-(new|old)$/, ''));
      problems.push(name.endsWith('.refresh-old') && !existsSync(original)
        ? `interrupted refresh: ${join(dir, name)} is the previous copy; rename it back to ${basename(original)}`
        : `interrupted refresh: inspect and remove ${join(dir, name)}`);
    }
  };
  for (const dir of [join(opts.home, '.claude', 'skills'), join(opts.home, '.agents', 'skills'), join(opts.home, '.config', 'ai-skills'),
    join(opts.home, '.config', 'opencode'), join(opts.home, '.agents'), join(opts.home, '.claude'), join(opts.home, '.gemini')]) leftovers(dir);
  const pinned = new Set(pinnedSpec(readFileSync(join(repo, 'GUIDE.md'), 'utf8')).folders.map(f => f.split('/').pop()));
  const linked = path => { if (!linkedUnder(opts.home, path)) return false; notes.push(`linked ${path} (symlink/junction; left as is)`); return true; };

  for (const target of [join(opts.home, '.claude', 'skills'), join(opts.home, '.agents', 'skills')]) {
    if (!existsSync(target) || linked(target)) continue;
    const geminiInstalled = existsSync(join(target, 'gemini-delegate'));
    for (const name of readdirSync(target).sort()) {
      const installed = join(target, name);
      if (linked(installed) || !isDir(installed)) continue;
      if (!opts.gemini && geminiInstalled && (name === 'delegate-setup' || name === 'gemini-delegate')) {
        notes.push(`kept ${installed}: Gemini relay installed; pass --gemini to refresh it`);
        continue;
      }
      const source = skills.get(name);
      if (!source) {
        if (pinned.has(name) && (opts.skipPinned || problems.length)) notes.push(`skipped ${installed} (pinned; not fetched)`);
        else notes.push(`unmanaged ${installed} (no source here; left as is)`);
        continue;
      }
      if (!sameContent(source, installed)) items.push({ source, installed });
    }
  }
  const instructionRoot = join(opts.home, '.config', 'ai-skills');
  for (const name of readdirSync(join(repo, 'instructions')).filter(n => n !== 'global-instructions.md')) {
    const installed = join(instructionRoot, name);
    if (existsSync(installed) && !linked(installed) && !sameContent(join(repo, 'instructions', name), installed)) {
      items.push({ source: join(repo, 'instructions', name), installed });
    }
  }
  const template = join(repo, 'instructions', 'global-instructions.md');
  for (const host of ['.config/opencode/AGENTS.md', '.agents/AGENTS.md', '.claude/CLAUDE.md', '.gemini/GEMINI.md']) {
    const installed = join(opts.home, host);
    if (!existsSync(installed) || linked(installed) || sameContent(template, installed)) continue;
    if (opts.hostInstructions) items.push({ source: template, installed });
    else notes.push(`differs ${installed} (host instructions; review it, or rerun with --host-instructions)`);
  }
  return { items, notes, problems, cleanup };
}

// Per item: stage and verify the new copy, back up the old one, swap by rename, and restore the old one on failure.
export function apply(opts, { items }, { stamp = new Date().toISOString().replace(/[:.]/g, '-'), log = console.log,
  rename = renameSync } = {}) {
  if (!items.length) return null;
  const backupsDir = join(opts.home, '.config', 'ai-skills', 'refresh-backups');
  if (linkedUnder(opts.home, backupsDir)) throw new Error(`backup folder is linked: ${backupsDir}`);
  mkdirSync(backupsDir, { recursive: true });
  if (linkedUnder(opts.home, backupsDir)) throw new Error(`backup folder is linked: ${backupsDir}`);
  const backupRoot = mkdtempSync(join(backupsDir, `${stamp}-refresh-`));
  const info = join(backupRoot, 'BACKUP-INFO.txt');
  writeFileSync(info, `Refresh from ${repo}\nEach line below is backed up here under the same path relative to your home.\n`);
  log(`Backup folder: ${backupRoot}`);
  for (const { source, installed } of items) {
    if (linkedUnder(opts.home, installed)) throw new Error(`refusing to write through a link: ${installed}`);
    const staged = `${installed}.refresh-new`, old = `${installed}.refresh-old`;
    for (const leftover of [staged, old]) {
      if (existsSync(leftover)) throw new Error(`leftover ${leftover} from an interrupted refresh; inspect it, then remove it`);
    }
    cpSync(source, staged, { recursive: true });
    if (!sameContent(source, staged)) { rmSync(staged, { recursive: true, force: true }); throw new Error(`staging failed for ${installed}`); }
    const backup = join(backupRoot, relative(opts.home, installed));
    mkdirSync(dirname(backup), { recursive: true });
    cpSync(installed, backup, { recursive: true });
    appendFileSync(info, `${installed}\n`);
    try {
      rename(installed, old);
    } catch (error) {
      rmSync(staged, { recursive: true, force: true });
      throw new Error(`could not move ${installed} aside (left unchanged): ${error.message}`);
    }
    try {
      rename(staged, installed);
    } catch (error) {
      renameSync(old, installed);
      rmSync(staged, { recursive: true, force: true });
      throw new Error(`could not replace ${installed} (old copy restored): ${error.message}`);
    }
    rmSync(old, { recursive: true, force: true });
    log(`updated ${installed}`);
  }
  return backupRoot;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) { console.log(USAGE); process.exit(0); }
    const result = plan(opts);
    try {
      for (const note of result.notes) console.log(`- ${note}`);
      for (const problem of result.problems) console.log(`! ${problem}`);
      if (opts.dryRun) {
        for (const { installed } of result.items) console.log(`would update ${installed}`);
        console.log(result.items.length ? `${result.items.length} item(s) would change. Rerun without --dry-run to apply.`
          : 'Nothing to update among the checked items.');
      } else if (result.problems.some(p => p.startsWith('interrupted refresh'))) {
        console.log('Not applying until the interrupted refresh above is resolved.');
      } else if (result.items.length) {
        apply(opts, result);
        console.log(`Updated ${result.items.length} item(s). Start a new agent session to load them.`);
      } else {
        console.log('Nothing to update among the checked items.');
      }
    } finally { result.cleanup(); }
    if (result.problems.length) process.exit(1);
  } catch (error) {
    console.error(`refresh: ${error.message}`);
    process.exit(1);
  }
}
