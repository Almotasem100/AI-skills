// Disposable, host-neutral feature fixture. This module never dispatches models or writes global configuration.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
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
  // Validate the expected manifest independently, not just the saved manifest's arbitrary keys.
  const names = ['POLICY.md','acceptance.test.mjs','requirements.md'];
  let unchanged = false;
  try {
    const baseline = JSON.parse(readFileSync(join(base,'baseline.json'),'utf8'));
    unchanged = JSON.stringify(Object.keys(baseline).sort()) === JSON.stringify(names) &&
      names.every(name=>hash(join(base,name)) === baseline[name]) &&
      readFileSync(join(base,'requirements.md'),'utf8') === requirements &&
      readFileSync(join(base,'POLICY.md'),'utf8') === policy &&
      readFileSync(join(base,'acceptance.test.mjs'),'utf8') === acceptance;
    const files = [];
    function walk(path) { for (const entry of readdirSync(path,{withFileTypes:true})) {
      const next=join(path,entry.name); if(entry.isSymbolicLink()) throw Error('Symlink outside fixture scope');
      if (next === join(base,'.git') && entry.isDirectory()) continue;
      if(entry.isDirectory()) walk(next); else files.push(relative(base,next).replaceAll('\\','/'));
    } }
    walk(base);
    const setup=JSON.parse(readFileSync(join(dir,`full-${host}-setup.json`),'utf8'));
    const head=fixtureGit(base,['rev-parse','HEAD']);
    unchanged = unchanged && setup.status==='passed' && head.status===0 && head.stdout.trim()===setup.baselineCommit;
    unchanged = unchanged && files.every(name=> ['baseline.json',...names,'project/drafts.mjs'].includes(name) ||
      name.startsWith('project/docs/') || name.startsWith('project/working/'));
  } catch { unchanged = false; }
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  const run = unchanged ? spawnSync(process.execPath,['--test','acceptance.test.mjs'],{cwd:base,encoding:'utf8',timeout:15000,env}) :
    {status:null,stdout:'',stderr:'Not executed: immutable fixture inputs or file scope changed.'};
  writeFileSync(join(dir,`full-${host}-test-output.txt`),`${run.stdout||''}\n${run.stderr||''}`);
  return {case:`full-${host}-acceptance`,status:unchanged && run.status===0?'passed':'failed',
    reason: unchanged?'Fixed feature acceptance tests executed; routing, artifacts and lifecycle require separate review':'Protected fixture inputs or allowed file scope changed'};
}
