#!/usr/bin/env node
// Native smoke preparation/relay execution. No host installation or global config writes.
import { spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = path => join(repoRoot, path);
const read = path => readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const json = path => JSON.parse(read(path));
const digest = value => createHash('sha256').update(value).digest('hex');
const sameContent = (a, b) => digest(read(a).replaceAll('\r\n', '\n')) === digest(read(b).replaceAll('\r\n', '\n'));
const save = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const quote = value => JSON.stringify(value);
const invoke = (file, args, cwd) => spawnSync(process.execPath, [file, ...args], {
  cwd, encoding: 'utf8', timeout: 15_000, maxBuffer: 4 * 1024 * 1024, windowsHide: true,
});
const git = (args, cwd) => spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 15_000, windowsHide: true });

export function parseArgs(argv) {
  const opts = { live: false, skillsRoot: join(homedir(), '.agents/skills'),
    instructionsRoot: join(homedir(), '.config/ai-skills'), project: repoRoot,
    lanes: source('test/native-smoke/lanes.json'), hostInstructions: null, seconds: 120, only: null, verify: null };
  const names = { '--skills-root': 'skillsRoot', '--instructions-root': 'instructionsRoot',
    '--host-instructions': 'hostInstructions', '--project': 'project', '--lanes': 'lanes', '--only': 'only', '--verify': 'verify', '--timeout': 'seconds' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--live') opts.live = true;
    else if (argv[i] === '--help') opts.help = true;
    else if (names[argv[i]]) {
      const key = names[argv[i]], value = argv[++i];
      if (!value || value.startsWith('--')) throw Error(`Missing value for ${argv[i - 1]}`);
      opts[key] = key === 'seconds' ? Number(value) : value;
    } else throw Error(`Unknown argument: ${argv[i]}`);
  }
  if (!Number.isInteger(opts.seconds) || opts.seconds < 10 || opts.seconds > 600) throw Error('--timeout must be 10–600 seconds');
  for (const key of ['skillsRoot', 'instructionsRoot', 'project', 'lanes']) opts[key] = resolve(opts[key]);
  if (opts.hostInstructions) opts.hostInstructions = resolve(opts.hostInstructions);
  return opts;
}

export function validateLanes(config) {
  if (config.version !== 'delegate-fleet.v1' || !config.lanes || typeof config.lanes !== 'object' || Array.isArray(config.lanes)) throw Error('Expected delegate-fleet.v1 lanes');
  const entries = Object.entries(config.lanes);
  if (!entries.length) throw Error('No test lanes');
  for (const [name, lane] of entries) {
    if (!/^smoke-[a-z0-9-]+$/.test(name)) throw Error(`Test lanes must use smoke- names: ${name}`);
    if (!['gemini', 'opencode'].includes(lane.implementer)) throw Error(`Unsupported implementer: ${name}`);
    if (typeof lane.model !== 'string' || !lane.model.trim()) throw Error(`Missing model: ${name}`);
    if (Object.keys(lane).some(key => !['implementer', 'model', 'variant'].includes(key))) throw Error(`Unexpected dial in ${name}`);
    if (lane.variant !== undefined && (lane.implementer !== 'opencode' || !/^[a-z0-9_-]+$/i.test(lane.variant))) throw Error(`Invalid variant in ${name}`);
  }
  return entries;
}

export function expectedAnswer(fixture) {
  const kept = fixture.items.filter(item => item.approved);
  return { token: fixture.token, sum: kept.reduce((n, item) => n + item.amount, 0), count: kept.length };
}

export function assessRelay(result, childExit, expected, laneName, lane, unchanged) {
  if (!unchanged) return { status: 'failed', reason: 'Fixture changed during a response-only relay task' };
  if (!result) return { status: 'failed', reason: 'Relay produced no readable result.json' };
  if (String(result.status).endsWith('_unavailable')) return { status: 'unavailable', reason: result.status };
  if (childExit !== 0 || result.exitCode !== 0 || result.status !== 'completed') return { status: 'failed', reason: `Relay/process failed: ${result.status}; exit ${childExit}/${result.exitCode}` };
  if (result.lane !== laneName || result.laneSource !== 'project' || result.tool !== lane.implementer || result.model !== lane.model || (lane.implementer === 'opencode' && result.variant !== lane.variant)) {
    return { status: 'failed', reason: 'Returned route metadata does not match the selected test lane' };
  }
  if (typeof result.finalMessage !== 'string' || !result.finalMessage.trim()) return { status: 'failed', reason: 'Process completed without a final response' };
  let answer;
  try { answer = JSON.parse(result.finalMessage.trim().replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```$/, '')); }
  catch { return { status: 'failed', reason: 'Final response is not the requested JSON' }; }
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return { status: 'failed', reason: 'Expected a JSON object' };
  if (JSON.stringify(Object.keys(answer).sort()) !== JSON.stringify(['count', 'sum', 'token']) ||
      answer.token !== expected.token || answer.sum !== expected.sum || answer.count !== expected.count) {
    return { status: 'failed', reason: 'Final response does not match the independently computed result' };
  }
  return { status: 'passed', reason: 'Process, response, selected route, result and unchanged fixture verified' };
}

function snapshot(dir) {
  const out = {};
  function visit(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) out[relative(dir, path)] = digest(readFileSync(path));
      else out[relative(dir, path)] = 'non-regular-entry';
    }
  }
  visit(dir);
  return JSON.stringify(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function parity(opts) {
  const checks = [];
  const names = readdirSync(source('skills')).filter(name => existsSync(source(`skills/${name}/SKILL.md`)));
  for (const name of names) {
    const installed = join(opts.skillsRoot, name);
    const mismatches = [], missing = [];
    let files = 0;
    function visit(current) {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const from = join(current, entry.name);
        if (entry.isDirectory()) visit(from);
        else if (entry.isFile()) {
          files++;
          const path = relative(source(`skills/${name}`), from);
          const target = join(installed, path);
          if (!existsSync(target)) missing.push(path);
          else if (!sameContent(from, target)) mismatches.push(path);
        }
      }
    }
    visit(source(`skills/${name}`));
    checks.push({ case: `installed-${name}`, status: !existsSync(installed) ? 'unavailable' : missing.length || mismatches.length ? 'failed' : 'passed',
      reason: 'Source skill files checked for normalized content parity; not native activation evidence', files, missing, mismatches });
  }
  checks.push({ case: 'host-instructions', status: !opts.hostInstructions ? 'skipped' : !existsSync(opts.hostInstructions) ? 'unavailable' : sameContent(source('templates/global-user-instructions/AGENTS.md'), opts.hostInstructions) ? 'passed' : 'failed',
    reason: opts.hostInstructions ? 'Shared host instruction file normalized content parity; loading still needs observation' : 'Pass --host-instructions with the instruction file used by this host' });
  for (const name of ['orchestration-contract.md', 'ai-skills-delegation.md', 'delegation-lanes.md']) {
    const installed = join(opts.instructionsRoot, name);
    checks.push({ case: `installed-${name}`, status: !existsSync(installed) ? 'unavailable' : sameContent(source(`docs/${name}`), installed) ? 'passed' : 'failed', reason: 'Companion instruction normalized content parity' });
  }
  return checks;
}

function productionRoutes(opts, setup) {
  const config = join(setup, 'scripts/config.mjs');
  const laneScript = join(setup, 'scripts/lane.mjs');
  if (!existsSync(config) || !existsSync(laneScript)) return { case: 'actual-configuration', status: 'unavailable', reason: 'Installed delegate-setup scripts missing' };
  const loaded = invoke(config, ['load', '--cwd', opts.project], opts.project);
  if (loaded.status !== 0) return { case: 'actual-configuration', status: 'failed', reason: 'Actual configuration failed to load; inspect configured setup separately' };
  let effective;
  try { effective = JSON.parse(loaded.stdout); } catch { return { case: 'actual-configuration', status: 'failed', reason: 'Invalid config load response' }; }
  const routes = Object.entries(effective.lanes || {}).map(([name, lane]) => {
    const resolved = invoke(laneScript, ['resolve', '--cwd', opts.project, '--lane', name, '--implementer', lane.implementer], opts.project);
    return { role: name, status: resolved.status === 0 ? 'passed' : 'failed', implementer: lane.implementer, model: lane.model, variant: lane.variant };
  });
  return { case: 'actual-configuration', status: routes.some(r => r.status === 'failed') ? 'failed' : !routes.length ? 'unavailable' : 'passed',
    reason: 'Actual role resolution only; no production-lane model calls or configuration changes', routes };
}

function prepareTasks(dir, opts) {
  const skill = name => quote(join(opts.skillsRoot, name, 'SKILL.md'));
  const contract = quote(join(opts.instructionsRoot, 'orchestration-contract.md'));
  const out = name => quote(join(dir, 'responses', name));
  mkdirSync(join(dir, 'responses'));
  const work = join(dir, 'workflow'); mkdirSync(work);
  writeFileSync(join(work, 'total.mjs'), 'export function totalApproved(items) {\n  return items.reduce((sum, item) => sum + item.amount, 0);\n}\n');
  writeFileSync(join(work, 'total.test.mjs'), `import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { totalApproved } from './total.mjs';\ntest('approved amounts only', () => assert.equal(totalApproved([{approved:true,amount:7},{approved:false,amount:90},{approved:true,amount:4}]),11));\ntest('empty input', () => assert.equal(totalApproved([]),0));\ntest('pending only', () => assert.equal(totalApproved([{approved:false,amount:9}]),0));\n`);
  save(join(dir, 'workflow-baseline.json'), { testHash: digest(readFileSync(join(work, 'total.test.mjs'))) });
  writeFileSync(join(dir, 'TASKS.md'), `# Session-run native cases\n\nUse installed files, not source substitutes. Skip a case as unavailable if its installed skill/instructions are missing or stale; do not silently substitute source files. The three skill cases do not select our delegation profile. Report observable skill file access/native activation separately. Use only the disposable paths below.\n\n## 1. task-context\nRead ${skill('task-context')}. Requirement R1: owners can rename their own draft. Grilling decision D1: whitespace-only names are invalid. Duplicate-name behavior remains undecided. Use task-context and write the Markdown result to ${out('task-context.md')}.\n\nAccept when: R1 and D1 are preserved, duplicate-name behavior remains unresolved, and no implementation/test results are invented.\n\n## 2. plan-review\nRead ${skill('plan-review')}. Requirement R1: only draft owners may rename drafts. Plan P1: show Rename to every signed-in user and update by draft ID without an ownership check. Use plan-review, return findings without editing the inputs; capture returned findings at ${out('plan-review.md')} as caller if reviewer access is read-only.\n\nAccept when: identifies the non-owner authorization contradiction, cites R1/P1, recommends ownership enforcement and does not claim runtime verification.\n\n## 3. qa-scenarios\nRead ${skill('qa-scenarios')}. Approved requirements R1: owners can rename their own draft; R2: whitespace-only names are rejected. Duplicate-name policy is undecided. Write QA scenarios to ${out('qa-scenarios.md')}.\n\nAccept when: covers owner rename and whitespace rejection, keeps duplicate-name expectations under clarifications and never claims execution.\n\n## 4. Bounded workflow\nRead the installed shared contract at ${contract}. In ${quote(work)}, fix totalApproved so it sums only items with approved === true. Amounts are integers; no new validation or dependencies. Inspect, fix, verify with node --test total.test.mjs, review against the requirement, then stop. Do not change total.test.mjs, publish, commit or create feature-level paperwork. You may change only total.mjs. Record actual verification and limits at ${out('workflow.md')}.\n\nAccept when: the original tests pass, test source is unchanged, only the requested helper changed, and the report matches actual verification. Run the verification command below to independently recheck.\n\n## Final report\nRun: node ${quote(source('test/native-smoke/run.mjs'))} --verify ${quote(dir)}\nRead the three skill outputs and check the acceptance criteria above. Write a short results.md in this run directory listing each case as passed/failed/unavailable/skipped with observed evidence and limits. The verifier reports skill outputs as needs-review, never semantic success from file existence. Keep actual dispatch evidence separate from source checks.\n`);
}

export function verifyRun(dir) {
  dir = resolve(dir);
  const cases = [];
  for (const name of ['task-context', 'plan-review', 'qa-scenarios']) {
    const path = join(dir, 'responses', `${name}.md`);
    cases.push({ case: name, status: existsSync(path) && read(path).trim() ? 'needs-review' : 'skipped', reason: 'Session must inspect output against TASKS.md; file existence is not skill correctness' });
  }
  const work = join(dir, 'workflow');
  const baseline = json(join(dir, 'workflow-baseline.json'));
  const unchanged = digest(readFileSync(join(work, 'total.test.mjs'))) === baseline.testHash &&
    JSON.stringify(readdirSync(work).sort()) === JSON.stringify(['total.mjs', 'total.test.mjs']);
  const run = unchanged ? spawnSync(process.execPath, ['--test', 'total.test.mjs'], { cwd: work, encoding: 'utf8', timeout: 15_000 })
    : { status: null, stdout: '', stderr: 'Not executed: test source or workflow file inventory changed.' };
  writeFileSync(join(dir, 'workflow-test-output.txt'), `${run.stdout || ''}\n${run.stderr || ''}`);
  cases.push({ case: 'workflow-tests', status: unchanged && run.status === 0 ? 'passed' : 'failed', reason: unchanged ? 'Original fixture tests independently executed; inspect workflow.md for process evidence' : 'Test fixture was modified' });
  const summary = { ...json(join(dir, 'summary.json')), sessionCases: cases };
  save(join(dir, 'summary.json'), summary);
  return summary;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log('node test/native-smoke/run.mjs [--live] [--skills-root PATH] [--instructions-root PATH] [--host-instructions FILE] [--project PATH] [--lanes JSON] [--only smoke-NAME] [--timeout SECONDS]\nnode test/native-smoke/run.mjs --verify RUN_DIRECTORY\nDefault: prepare/check only, no model calls. --live: one serial call per selected test lane.'); return;
  }
  if (opts.verify) {
    const summary = verifyRun(opts.verify);
    console.log(JSON.stringify(summary, null, 2));
    process.exitCode = summary.sessionCases.some(item => item.status === 'failed') ? 1 : 2;
    return;
  }
  const entries = validateLanes(json(opts.lanes));
  if (opts.only && !entries.some(([name]) => name === opts.only)) throw Error('Unknown --only test lane');
  const dir = mkdtempSync(join(tmpdir(), 'ai-skills-native-'));
  const checks = parity(opts);
  const setup = join(opts.skillsRoot, 'delegate-setup');
  checks.push(productionRoutes(opts, setup));
  const revision = git(['rev-parse', 'HEAD'], repoRoot);
  const state = git(['status', '--porcelain'], repoRoot);
  const summary = { schema: 'ai-skills-native-smoke.v1', revision: revision.stdout?.trim() || null,
    sourceDirty: state.status === 0 ? Boolean(state.stdout.trim()) : null,
    startedAt: new Date().toISOString(), live: opts.live, skillsRoot: opts.skillsRoot,
    instructionsRoot: opts.instructionsRoot, hostInstructions: opts.hostInstructions, project: opts.project, lanesFile: opts.lanes, cases: checks };
  prepareTasks(dir, opts);
  save(join(dir, 'test-lanes.json'), json(opts.lanes));
  save(join(dir, 'summary.json'), summary);
  for (const [name, lane] of entries) {
    if (opts.only && name !== opts.only) { checks.push({ case: name, status: 'skipped', reason: 'Not selected' }); continue; }
    if (!opts.live) { checks.push({ case: name, status: 'skipped', reason: 'Use --live to make model calls' }); continue; }
    const relay = join(opts.skillsRoot, `${lane.implementer}-delegate/scripts/relay.mjs`);
    const config = join(setup, 'scripts/config.mjs');
    if (!existsSync(relay) || !existsSync(config)) { checks.push({ case: name, status: 'unavailable', reason: 'Installed relay or delegate-setup missing' }); continue; }
    const work = join(dir, name); mkdirSync(work);
    if (git(['init', '--quiet'], work).status !== 0) { checks.push({ case: name, status: 'unavailable', reason: 'Cannot initialize disposable Git workspace' }); continue; }
    // The approved test map is written/trusted only in this disposable project, never globally.
    const selectedConfig = join(dir, `${name}-lanes.json`);
    save(selectedConfig, { version: 'delegate-fleet.v1', lanes: { [name]: lane } });
    const configured = invoke(config, ['write', '--scope', 'project', '--cwd', work, selectedConfig], work);
    if (configured.status !== 0) {
      writeFileSync(join(dir, `${name}-setup-error.txt`), `${configured.stdout || ''}\n${configured.stderr || ''}`);
      checks.push({ case: name, status: 'failed', reason: 'Installed setup rejected test project config', evidence: join(dir, `${name}-setup-error.txt`) }); continue;
    }
    const fixture = { token: randomBytes(12).toString('hex'), items: [
      { approved: true, amount: 10 + randomBytes(1)[0] }, { approved: false, amount: 900 },
      { approved: true, amount: 10 + randomBytes(1)[0] }] };
    save(join(work, 'input.json'), fixture);
    const brief = join(dir, `${name}-brief.txt`);
    writeFileSync(brief, 'Read input.json in the working directory. Do not edit any files or run other agents. Sum amount only for items whose approved is true; count those items. Return exactly JSON with keys token (copied from the file), sum and count. No other text.');
    const before = snapshot(work), artifactDir = join(dir, `${name}-relay`);
    const args = [relay, '--brief', brief, '--cd', work, '--lane', name, '--timeout', `${opts.seconds}s`, '--out-dir', artifactDir];
    if (lane.implementer === 'opencode') args.push('--read-only');
    else args.push('--approval-mode', 'plan'); // Not an enforced read-only guarantee; verify observed mutations.
    console.log(`Running ${name} (${lane.model})…`);
    const child = spawnSync(process.execPath, args, { cwd: work, encoding: 'utf8', timeout: (opts.seconds + 30) * 1000,
      maxBuffer: 4 * 1024 * 1024, windowsHide: true });
    writeFileSync(join(dir, `${name}-stdout.txt`), child.stdout || '');
    writeFileSync(join(dir, `${name}-stderr.txt`), child.stderr || '');
    let result = null;
    try { result = json(join(artifactDir, 'result.json')); } catch { /* missing/invalid output is an explicit failure */ }
    const verdict = assessRelay(result, child.status, expectedAnswer(fixture), name, lane, before === snapshot(work));
    checks.push({ case: name, ...verdict, artifacts: artifactDir, relaySha256: digest(readFileSync(relay)),
      cliVersion: result?.opencodeVersion || result?.geminiVersion || null,
      requestedModel: result?.model || null, requestedVariant: result?.variant || null, processError: child.error?.code || null });
    save(join(dir, 'summary.json'), summary);
  }
  save(join(dir, 'summary.json'), summary);
  for (const item of checks) console.log(`${item.status.toUpperCase()} ${item.case}${item.status === 'passed' ? '' : ` — ${item.reason}`}`);
  console.log(`Run directory: ${dir}\nNext: execute ${join(dir, 'TASKS.md')} in the current session, then --verify this directory.`);
  if (checks.some(check => check.status === 'failed')) process.exitCode = 1;
  else if (checks.some(check => check.status === 'unavailable' || check.status === 'skipped')) process.exitCode = 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
