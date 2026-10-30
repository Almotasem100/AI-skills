import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, validateLanes, expectedAnswer, assessRelay, repoRoot } from './run.mjs';

const lane = { implementer: 'opencode', model: 'openai/gpt-6-luna', variant: 'low' };
const answer = { token: 'fixture-a', sum: 11, count: 2 };
const result = { status: 'completed', exitCode: 0, tool: 'opencode', lane: 'smoke-opencode-luna',
  laneSource: 'project', model: lane.model, variant: lane.variant, finalMessage: JSON.stringify(answer) };
const assess = (overrides = {}, code = 0, unchanged = true) => assessRelay({ ...result, ...overrides }, code, answer, result.lane, lane, unchanged);

test('model calls require explicit live selection and bounded timeout', () => {
  assert.equal(parseArgs([]).live, false);
  assert.equal(parseArgs(['--live']).live, true);
  assert.throws(() => parseArgs(['--timeout', '0']));
  assert.throws(() => parseArgs(['--timeout']));
  assert.throws(() => parseArgs(['--unexpected']));
});
test('dedicated map uses test-only names and regular Luna', () => {
  const map = JSON.parse(readFileSync(join(repoRoot, 'test/native-smoke/lanes.json'), 'utf8'));
  assert.equal(validateLanes(map).length, 3);
  assert.equal(map.lanes['smoke-opencode-luna'].model, 'openai/gpt-6-luna');
  assert.throws(() => validateLanes({ version: 'delegate-fleet.v1', lanes: { 'implement-code': lane } }));
  assert.throws(() => validateLanes({ version: 'delegate-fleet.v1', lanes: { 'smoke-x': { ...lane, sandbox: 'off' } } }));
});
test('expected answer is independently computed from approved fixture rows', () => {
  assert.deepEqual(expectedAnswer({ token: answer.token, items: [
    {approved:true,amount:7},{approved:false,amount:900},{approved:true,amount:4}] }), answer);
});
test('correct response and matching requested route pass', () => assert.equal(assess().status, 'passed'));
test('exit zero with absent, malformed or wrong response fails', () => {
  for (const finalMessage of ['', 'done', 'null', '[]', '{"token":"fixture-a","sum":911,"count":3}']) {
    assert.equal(assess({ finalMessage }).status, 'failed');
  }
  assert.equal(assess({}, 1).status, 'failed');
});
test('wrong lane/model/variant or changed workspace fails', () => {
  for (const overrides of [{ lane: 'implement-code' }, { model: 'other/model' }, { variant: 'max' }, { laneSource: 'global' }]) {
    assert.equal(assess(overrides).status, 'failed');
  }
  assert.equal(assess({}, 0, false).status, 'failed');
});
test('missing binary is unavailable, runtime failures remain failures', () => {
  assert.equal(assess({ status: 'opencode_unavailable', exitCode: 127 }, 127).status, 'unavailable');
  assert.equal(assess({ status: 'failed', exitCode: 1 }, 1).status, 'failed');
});
test('workflow verifier catches original bug and test tampering, then runs the actual fix', () => {
  const root = mkdtempSync(join(tmpdir(), 'smoke-runner-test-'));
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT; // Nested node --test must run as an independent process.
  try {
    mkdirSync(join(root, 'missing-skills')); mkdirSync(join(root, 'missing-instructions'));
    const preparation = spawnSync(process.execPath, [join(repoRoot, 'test/native-smoke/run.mjs'),
      '--skills-root', join(root, 'missing-skills'), '--instructions-root', join(root, 'missing-instructions')], { encoding: 'utf8', env });
    assert.equal(preparation.status, 2);
    const runDir = preparation.stdout.match(/Run directory: (.+)/)[1].trim();
    try {
      const walkthrough = readFileSync(join(runDir, 'WALKTHROUGH.md'), 'utf8');
      assert.doesNotMatch(walkthrough, /\{\{[A-Z_]+\}\}/);
      assert.match(walkthrough, /use AI Skills delegation mode/);
      assert.match(walkthrough, /Do not\s+run any delegate\/model calls/);
      assert.match(readFileSync(join(runDir, 'TASKS.md'), 'utf8'), /Hypothetical full-feature walkthrough/);
      const hosts = readFileSync(join(runDir, 'HOST-CHECKS.md'), 'utf8');
      assert.doesNotMatch(hosts, /\{\{[A-Z_]+\}\}/);
      assert.match(hosts, /Claude CLI is \*\*not/);
      assert.match(hosts, /without invoking a skill or supplying instruction paths/);
      const verify = () => spawnSync(process.execPath, [join(repoRoot, 'test/native-smoke/run.mjs'), '--verify', runDir], { encoding: 'utf8', env });
      assert.equal(verify().status, 1); // Original helper incorrectly includes pending rows.
      writeFileSync(join(runDir, 'workflow/total.mjs'), 'export const totalApproved = items => items.filter(item => item.approved === true).reduce((n,item) => n+item.amount,0);\n');
      assert.equal(verify().status, 2); // Runtime passes; semantic skill reviews are still pending.
      const summary = JSON.parse(readFileSync(join(runDir, 'summary.json')));
      assert.equal(summary.sessionCases.find(item => item.case === 'workflow-tests').status, 'passed');
      assert.ok(summary.sessionCases.filter(item => item.case !== 'workflow-tests').every(item => item.status === 'skipped'));
      assert.equal(summary.hostCases.find(item => item.case === 'claude-cli').status, 'not-applicable');
      assert.ok(summary.hostCases.filter(item => item.case !== 'claude-cli').every(item => item.status === 'skipped'));
      writeFileSync(join(runDir, 'responses/gemini-skill-activation.md'), 'Behavior checked; activation evidence requires review.');
      writeFileSync(join(runDir, 'responses/workflow-walkthrough.md'), 'A walkthrough still requires semantic review.');
      verify();
      const reviewedSummary = JSON.parse(readFileSync(join(runDir, 'summary.json')));
      assert.equal(reviewedSummary.sessionCases.find(item => item.case === 'workflow-walkthrough').status, 'needs-review');
      assert.equal(reviewedSummary.hostCases.find(item => item.case === 'gemini-skill-activation').status, 'needs-review');
      writeFileSync(join(runDir, 'workflow/total.test.mjs'), '// disabled\n');
      assert.equal(verify().status, 1);
    } finally { rmSync(runDir, { recursive: true, force: true }); }
  } finally { rmSync(root, { recursive: true, force: true }); }
});


test('live driver dispatches through an isolated test config (synthetic relay, no provider calls)', () => {
  const root = mkdtempSync(join(tmpdir(), 'smoke-live-driver-test-'));
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  const setup = join(root, 'delegate-setup/scripts');
  const relay = join(root, 'opencode-delegate/scripts');
  mkdirSync(setup, { recursive: true }); mkdirSync(relay, { recursive: true });
  writeFileSync(join(setup, 'config.mjs'), `import {readFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
const args=process.argv.slice(2);
if(args[0]==='load') console.log(JSON.stringify({lanes:{}}));
else {
 if(args[args.indexOf('--scope')+1]!=='project') throw Error('Unexpected config mutation');
 const cwd=args[args.indexOf('--cwd')+1];
 mkdirSync(join(cwd,'.delegate'),{recursive:true});
 copyFileSync(args.at(-1),join(cwd,'.delegate/config.json'));
 console.log('{"ok":true}');
}
`);
  writeFileSync(join(setup, 'lane.mjs'), 'console.log("{}");');
  writeFileSync(join(relay, 'relay.mjs'), `import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];
const cwd=get('--cd'),name=get('--lane'),out=get('--out-dir');
const lane=JSON.parse(readFileSync(join(cwd,'.delegate/config.json'))).lanes[name];
const input=JSON.parse(readFileSync(join(cwd,'input.json'))),items=input.items.filter(x=>x.approved);
mkdirSync(out,{recursive:true});
writeFileSync(join(out,'result.json'),JSON.stringify({status:'completed',exitCode:0,tool:'opencode',lane:name,laneSource:'project',model:lane.model,variant:lane.variant,finalMessage:JSON.stringify({token:input.token,sum:items.reduce((n,x)=>n+x.amount,0),count:items.length})}));
`);
  let runDir;
  try {
    const child = spawnSync(process.execPath, [join(repoRoot,'test/native-smoke/run.mjs'), '--live',
      '--only','smoke-opencode-luna','--skills-root',root,'--instructions-root',join(root,'missing-instructions')], { encoding:'utf8',env });
    assert.equal(child.status,2); // No installed skills; synthetic relay is independently assessed.
    runDir=child.stdout.match(/Run directory: (.+)/)[1].trim();
    const summary=JSON.parse(readFileSync(join(runDir,'summary.json')));
    assert.equal(summary.cases.find(item=>item.case==='smoke-opencode-luna').status,'passed');
    const savedConfig=JSON.parse(readFileSync(join(runDir,'smoke-opencode-luna/.delegate/config.json')));
    assert.ok(Object.keys(savedConfig.lanes).every(name=>name.startsWith('smoke-')));
  } finally {
    if(runDir) rmSync(runDir,{recursive:true,force:true});
    rmSync(root,{recursive:true,force:true});
  }
});


test('vendored setup accepts/trusts/resolves the isolated Luna lane without Gemini support', () => {
  const root = mkdtempSync(join(tmpdir(), 'smoke-config-test-'));
  const env = { ...process.env, XDG_CONFIG_HOME: join(root,'config-home') };
  delete env.NODE_TEST_CONTEXT;
  try {
    assert.equal(spawnSync('git',['init','--quiet'],{cwd:root}).status,0);
    const path=join(root,'lane.json');
    writeFileSync(path,JSON.stringify({version:'delegate-fleet.v1',lanes:{'smoke-opencode-luna':lane}}));
    const setup=join(repoRoot,'vendor/amElnagdy/delegate-skills/skills/delegate-setup/scripts');
    const wrote=spawnSync(process.execPath,[join(setup,'config.mjs'),'write','--scope','project','--cwd',root,path],{encoding:'utf8',env});
    assert.equal(wrote.status,0,wrote.stderr);
    assert.equal(JSON.parse(wrote.stdout).projectTrusted,true);
    const resolved=spawnSync(process.execPath,[join(setup,'lane.mjs'),'resolve','--cwd',root,'--lane','smoke-opencode-luna','--implementer','opencode'],{encoding:'utf8',env});
    assert.equal(resolved.status,0,resolved.stderr);
    assert.equal(JSON.parse(resolved.stdout).dials.model,'openai/gpt-6-luna');
    assert.equal(JSON.parse(resolved.stdout).source,'project');
  } finally { rmSync(root,{recursive:true,force:true}); }
});
