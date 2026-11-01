// Disposable, host-neutral feature fixture. This module never dispatches models or writes global configuration.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
export const scenarioHosts = ['opencode', 'zadloop'];
export const featurePrompt = `You are in AI Skills delegation mode.
Deliver DRAFT-RENAME as a complete Full Feature in this disposable fixture.

Read POLICY.md and requirements.md in the current workspace root, then inspect project/. Follow the installed
workflow and applicable project instructions. Real bounded assignments through existing configured routes are authorized.

Only project/ is writable, within POLICY.md's permitted paths. Do not modify requirements, policy or fixed tests.
Do not change global configuration, install software or publish anything.

Complete the feature within that scope and verify it from the workspace root using:
node --test acceptance.test.mjs

Preserve actual assignment and verification evidence under project/working/. Return a concise report of delivered
outcomes, routes/tools actually used, test results, review/corrections, blockers and limitations. Distinguish observed
execution from assumptions.
`;
function fixtureGit(base, args) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith('GIT_')) delete env[key];
  return spawnSync('git', ['-c','core.autocrlf=false','-c','commit.gpgsign=false',
    '-c',`core.hooksPath=${join(base,'.git','disabled-hooks')}`, ...args],
    {cwd:base,encoding:'utf8',timeout:15000,env});
}
function gitBaseline(base) {
  const commands = [ ['init','--quiet'], ['symbolic-ref','HEAD','refs/heads/main'],
    ['add','--force','--','POLICY.md','requirements.md','acceptance.test.mjs','baseline.json','project/drafts.mjs'],
    ['-c','user.name=AI Skills Fixture','-c','user.email=fixture@example.invalid','commit','--quiet','-m','Fixture baseline'] ];
  for (const args of commands) {
    const result=fixtureGit(base,args);
    if(result.status!==0) return {status:'unavailable',reason:`Fixture Git baseline failed: ${result.error?.message || result.stderr || result.status}`};
  }
  return {status:'passed',baselineCommit:fixtureGit(base,['rev-parse','HEAD']).stdout.trim(),
    reason:'Fixture root is a local Git repository with one preparation commit, no remote or nested repository'};
}
const requirements = `# Feature DRAFT-RENAME
Add owner-only draft renaming to the existing in-memory draft library.
R1: renameDraft(drafts, actorId, draftId, name) returns a new array containing the renamed draft; inputs stay unchanged.
R2: missing draft throws Error with message not-found; another owner's draft throws forbidden.
R3: check ownership before name validation. Trim names; reject empty/whitespace-only names with invalid-name.
R4: duplicate names are allowed. Preserve every other field, other drafts and listOwnDrafts behavior.
Inputs are trusted arrays of records with unique string IDs, string ownerId/title, and string actorId/draftId/name.
No persistence, UI, server/API, dependencies, sharing or deletion. No additional validation is requested.
`;
const policy = `# Disposable project policy
This is Full Feature delivery, not a direct helper fix. Use installed shared workflow/skills.
Only project/drafts.mjs, project/docs/** and project/working/** may change. Never change this policy,
requirements.md, acceptance.test.mjs, baseline.json or any other file outside project/.
Use docs/ for final artifacts and working/ for compact state, context, plan/review evidence and test results.
Produce a small customer Functional Design and architect LLD, QA scenarios, implementation plan with critique
and author disposition, implemented code/tests, separate code review and disposition, PR description and local closeout.
Use task-context here: requirements, current code and this policy are separate inputs for downstream specialists.
Tests are the fixed external acceptance.test.mjs plus relevant implementer-authored checks under working/.
API regressions and an as-built Technical Design are inapplicable: this is a pure in-memory library.
No separate design approval gate is required for this fully settled fixture. Report consequential ambiguities if found;
routine technical decisions and corrections are authorized. Do not automatically stack plan debate or extra plan reviews.
A separate technical reviewer must inspect substantive code changes; do not call implementer self-review independent.
The preparation baseline commit is fixture scaffolding, not feature delivery. Compare uncommitted changes against
that baseline. A commit-only PR helper may not represent the working tree; use verified worktree evidence for local
PR text instead of fabricating a develop branch or making feature commits to satisfy the helper.
Prepare PR text, but do not commit, push, open PRs, merge, deploy, change global settings or install/upgrade tools.
Local closeout reconciles final docs and working state; retain review/dispatch evidence for this test.
`;
const acceptance = `import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as api from './project/drafts.mjs';
const rows = () => [{id:'a',ownerId:'u1',title:'Old',status:'draft'}, {id:'b',ownerId:'u2',title:'Other'}, {id:'c',ownerId:'u1',title:'Duplicate'}];
test('existing listing unchanged', () => assert.deepEqual(api.listOwnDrafts(rows(),'u1').map(x=>x.id), ['a','c']));
test('rename trims and preserves inputs/fields/other drafts', () => { const input=rows(), before=structuredClone(input); const out=api.renameDraft(input,'u1','a',' New '); assert.notStrictEqual(out,input); assert.deepEqual(input,before); assert.deepEqual(out,[{...input[0],title:'New'},input[1],input[2]]); });
test('non-owner denied before name validation', () => { for(const name of ['X','   ']) assert.throws(()=>api.renameDraft(rows(),'u2','a',name), {message:'forbidden'}); });
test('unknown draft rejected', () => assert.throws(()=>api.renameDraft(rows(),'u1','missing','New'), {message:'not-found'}));
test('blank name rejected', () => { for(const name of ['','  ','\\t']) assert.throws(()=>api.renameDraft(rows(),'u1','a',name), {message:'invalid-name'}); });
test('duplicates allowed', () => assert.equal(api.renameDraft(rows(),'u1','a','Duplicate')[0].title,'Duplicate'));
`;
export function prepareFullScenarios(dir) {
  for (const host of scenarioHosts) if (existsSync(join(dir, `full-${host}`)))
    throw Error('Refusing to overwrite an existing full-scenario fixture; prepare a fresh run');
  const prepared = [];
  writeFileSync(join(dir,'OPENCODE-PROMPT.md'), featurePrompt);
  for (const host of scenarioHosts) {
    const base = join(dir, `full-${host}`), project = join(base, 'project');
    mkdirSync(join(project, 'docs'), { recursive: true });
    mkdirSync(join(project, 'working'), { recursive: true });
    writeFileSync(join(project, 'drafts.mjs'), 'export const listOwnDrafts = (drafts, actorId) => drafts.filter(draft => draft.ownerId === actorId);\n');
    writeFileSync(join(base, 'requirements.md'), requirements);
    writeFileSync(join(base, 'POLICY.md'), policy);
    writeFileSync(join(base, 'acceptance.test.mjs'), acceptance);
    const protectedFiles = ['requirements.md', 'POLICY.md', 'acceptance.test.mjs'];
    writeFileSync(join(base, 'baseline.json'), JSON.stringify(Object.fromEntries(protectedFiles.map(name=>[name,hash(join(base,name))])),null,2));
    const setup={host,workspaceRoot:base,writableRoot:project,...gitBaseline(base)};
    writeFileSync(join(dir,`full-${host}-setup.json`),JSON.stringify(setup,null,2));
    prepared.push(setup);
  }
  return prepared;
}
export function verifyFullScenario(dir, host) {
  if (!scenarioHosts.includes(host)) throw Error('Unknown scenario host');
  const report = join(dir, 'responses', `full-${host}.md`), base = join(dir, `full-${host}`);
  if (!existsSync(report) || !readFileSync(report,'utf8').trim()) return { case:`full-${host}-acceptance`, status:'skipped', reason:'No session report; fixture not treated as executed' };
  const details = {
    version: 'ai-skills.feature-verification.v1', host, startedAt: new Date().toISOString(),
    workspaceRoot: base, reportPath: report, nodeVersion: process.version,
    verifierSha256: hash(fileURLToPath(import.meta.url)),
    integrity: { inputs: [], scopeViolations: [], errors: [] },
    acceptance: { executed: false, command: [process.execPath, '--test', 'acceptance.test.mjs'], cwd: base },
    // Code execution cannot authenticate the session's routing, review or lifecycle claims.
    workflowAssessment: 'needs-review',
  };
  // Validate the expected manifest independently, not just the saved manifest's arbitrary keys.
  const names = ['POLICY.md','acceptance.test.mjs','requirements.md'];
  let unchanged = false;
  try {
    const baseline = JSON.parse(readFileSync(join(base,'baseline.json'),'utf8'));
    details.integrity.manifestKeysMatch = JSON.stringify(Object.keys(baseline).sort()) === JSON.stringify(names);
    const sources = {'POLICY.md': policy, 'acceptance.test.mjs': acceptance, 'requirements.md': requirements};
    details.integrity.inputs = names.map(name => {
      const observed = hash(join(base,name));
      const expected = createHash('sha256').update(sources[name]).digest('hex');
      return {path:name, recordedSha256:baseline[name] ?? null, observedSha256:observed,
        expectedSha256:expected, matchesRecorded:observed===baseline[name], matchesPreparedSource:observed===expected};
    });
    unchanged = details.integrity.manifestKeysMatch &&
      details.integrity.inputs.every(input=>input.matchesRecorded && input.matchesPreparedSource);
    const files = [];
    function walk(path) { for (const entry of readdirSync(path,{withFileTypes:true})) {
      const next=join(path,entry.name); if(entry.isSymbolicLink()) throw Error(`Symlink outside fixture scope: ${relative(base,next)}`);
      if (next === join(base,'.git') && entry.isDirectory()) continue;
      if(entry.isDirectory()) walk(next); else files.push(relative(base,next).replaceAll('\\','/'));
    } }
    walk(base);
    const setup=JSON.parse(readFileSync(join(dir,`full-${host}-setup.json`),'utf8'));
    const head=fixtureGit(base,['rev-parse','HEAD']);
    details.integrity.git = {setupStatus:setup.status, expectedCommit:setup.baselineCommit ?? null,
      observedCommit:(head.stdout||'').trim(), exitCode:head.status, stderr:head.stderr||'',
      error:head.error?.message ?? null};
    unchanged = unchanged && setup.status==='passed' && head.status===0 && head.stdout.trim()===setup.baselineCommit;
    details.integrity.scopeViolations = files.filter(name=> !(['baseline.json',...names,'project/drafts.mjs'].includes(name) ||
      name.startsWith('project/docs/') || name.startsWith('project/working/')));
    unchanged = unchanged && details.integrity.scopeViolations.length===0;
  } catch (error) {
    unchanged = false;
    details.integrity.errors.push(error.message);
  }
  details.integrity.passed = unchanged;
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  details.acceptance.startedAt = new Date().toISOString();
  const run = unchanged ? spawnSync(process.execPath,['--test','acceptance.test.mjs'],{cwd:base,encoding:'utf8',timeout:15000,env}) :
    {status:null,stdout:'',stderr:'Not executed: immutable fixture inputs or file scope changed.'};
  Object.assign(details.acceptance, {attempted:unchanged, executed:unchanged && (run.pid||0)>0, finishedAt:new Date().toISOString(),
    exitCode:run.status, signal:run.signal ?? null, error:run.error?.message ?? null, errorCode:run.error?.code ?? null});
  details.status = unchanged && run.status===0 ? 'passed' : 'failed';
  details.failureStage = !unchanged ? 'fixture-integrity' : run.error || run.signal ? 'command-execution' : run.status!==0 ? 'acceptance-tests' : null;
  // Preserve every verification attempt, including failures; stable filenames remain latest-result pointers.
  const attemptDir=join(dir,`full-${host}-verification`,`${Date.now()}-${randomUUID()}`);
  mkdirSync(attemptDir,{recursive:true});
  details.acceptance.stdoutPath=join(attemptDir,'stdout.txt');
  details.acceptance.stderrPath=join(attemptDir,'stderr.txt');
  writeFileSync(details.acceptance.stdoutPath,run.stdout||'');
  writeFileSync(details.acceptance.stderrPath,run.stderr||'');
  details.finishedAt=new Date().toISOString();
  writeFileSync(join(attemptDir,'result.json'),JSON.stringify(details,null,2)+'\n');
  const detailsPath=join(dir,`full-${host}-verification.json`);
  writeFileSync(detailsPath,JSON.stringify(details,null,2)+'\n');
  writeFileSync(join(dir,`full-${host}-test-output.txt`),`${run.stdout||''}\n${run.stderr||''}`);
  return {case:`full-${host}-acceptance`,status:details.status, detailsPath,
    reason: unchanged?'Fixed feature acceptance tests executed; routing, artifacts and lifecycle require separate review':'Protected fixture inputs or allowed file scope changed'};
}
