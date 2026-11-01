import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { prepareFullScenarios, verifyFullScenario } from './full-scenario.mjs';
const reference = `export const listOwnDrafts=(rows, actor)=>rows.filter(row=>row.ownerId===actor);
export function renameDraft(rows, actor, id, name) {
 const row=rows.find(row=>row.id===id);
 if(!row) throw Error('not-found');
 if(row.ownerId!==actor) throw Error('forbidden');
 const title=name.trim(); if(!title) throw Error('invalid-name');
 return rows.map(row=>row.id===id?{...row,title}:row);
}
`;
function fixture(fn) {
  const dir=mkdtempSync(join(tmpdir(),'full-scenario-test-'));
  try { mkdirSync(join(dir,'responses')); prepareFullScenarios(dir); fn(dir); }
  finally { rmSync(dir,{recursive:true,force:true}); }
}
test('fresh host fixtures are separate and absent reports never establish execution', ()=>fixture(dir=>{
  assert.equal(verifyFullScenario(dir,'opencode').status,'skipped');
  writeFileSync(join(dir,'responses/full-opencode.md'),'Claimed complete, requiring independent checks.');
  assert.equal(verifyFullScenario(dir,'opencode').status,'failed');
  assert.equal(verifyFullScenario(dir,'zadloop').status,'skipped');
  assert.throws(()=>verifyFullScenario(dir,'unknown'));
}));
test('fixed acceptance checks cover feature behavior without accepting lifecycle or routing claims', ()=>fixture(dir=>{
  const env=process.env.NODE_TEST_CONTEXT; delete process.env.NODE_TEST_CONTEXT;
  try {
    writeFileSync(join(dir,'responses/full-opencode.md'),'Report still requires semantic review.');
    const code=join(dir,'full-opencode/project/drafts.mjs');
    writeFileSync(code,reference);
    assert.equal(verifyFullScenario(dir,'opencode').status,'passed');
    // Wrong error precedence is an observable requirements failure, even with most positive behavior intact.
    writeFileSync(code,reference.replace("if(row.ownerId!==actor) throw Error('forbidden');",'').replace("const title=name.trim();", "if(!name.trim()) throw Error('invalid-name'); if(row.ownerId!==actor) throw Error('forbidden'); const title=name.trim();"));
    assert.equal(verifyFullScenario(dir,'opencode').status,'failed');
    assert.equal(verifyFullScenario(dir,'zadloop').status,'skipped');
  } finally { if(env!==undefined) process.env.NODE_TEST_CONTEXT=env; }
}));
test('verification records exact commands, integrity and durable failure-to-success history', ()=>fixture(dir=>{
  const base=join(dir,'full-opencode');
  writeFileSync(join(dir,'responses/full-opencode.md'),'Verbatim response is captured separately; assess claims independently.');
  const failed=verifyFullScenario(dir,'opencode');
  assert.equal(failed.status,'failed');
  const before=JSON.parse(readFileSync(failed.detailsPath,'utf8'));
  assert.equal(before.failureStage,'acceptance-tests');
  assert.equal(before.acceptance.executed,true);
  assert.notEqual(before.acceptance.exitCode,0);
  const firstStdout=readFileSync(before.acceptance.stdoutPath,'utf8');
  assert.match(firstStdout,/renameDraft is not a function/);
  writeFileSync(join(base,'project/drafts.mjs'),reference);
  const passed=verifyFullScenario(dir,'opencode');
  const after=JSON.parse(readFileSync(passed.detailsPath,'utf8'));
  assert.equal(passed.status,'passed');
  assert.deepEqual(after.acceptance.command,[process.execPath,'--test','acceptance.test.mjs']);
  assert.equal(after.acceptance.cwd,base);
  assert.equal(after.acceptance.exitCode,0);
  assert.ok(after.integrity.inputs.every(input=>input.matchesRecorded && input.matchesPreparedSource));
  assert.equal(after.integrity.git.expectedCommit,after.integrity.git.observedCommit);
  assert.equal(after.workflowAssessment,'needs-review');
  assert.match(after.verifierSha256,/^[a-f0-9]{64}$/);
  assert.ok(Date.parse(after.finishedAt)>=Date.parse(after.startedAt));
  assert.equal(readdirSync(join(dir,'full-opencode-verification')).length,2);
  assert.notEqual(after.acceptance.stdoutPath,before.acceptance.stdoutPath);
  assert.equal(readFileSync(before.acceptance.stdoutPath,'utf8'),firstStdout);
}));

test('integrity diagnostics identify changed inputs and forbidden paths without running acceptance', ()=>fixture(dir=>{
  const base=join(dir,'full-opencode');
  writeFileSync(join(dir,'responses/full-opencode.md'),'Claim requiring inspection.');
  writeFileSync(join(base,'requirements.md'),'Changed requirement');
  writeFileSync(join(base,'project/forbidden.txt'),'Outside permitted file set');
  const result=verifyFullScenario(dir,'opencode');
  const details=JSON.parse(readFileSync(result.detailsPath,'utf8'));
  assert.equal(result.status,'failed');
  assert.equal(details.failureStage,'fixture-integrity');
  assert.equal(details.acceptance.executed,false);
  const input=details.integrity.inputs.find(input=>input.path==='requirements.md');
  assert.equal(input.matchesRecorded,false);
  assert.equal(input.matchesPreparedSource,false);
  assert.deepEqual(details.integrity.scopeViolations,['project/forbidden.txt']);
  assert.equal(readFileSync(details.acceptance.stdoutPath,'utf8'),'');
}));

test('malformed manifests preserve the inspection error rather than a generic availability claim', ()=>fixture(dir=>{
  writeFileSync(join(dir,'responses/full-opencode.md'),'Claim requiring inspection.');
  writeFileSync(join(dir,'full-opencode/baseline.json'),'{broken');
  const result=verifyFullScenario(dir,'opencode');
  const details=JSON.parse(readFileSync(result.detailsPath,'utf8'));
  assert.equal(details.failureStage,'fixture-integrity');
  assert.equal(details.acceptance.executed,false);
  assert.equal(details.integrity.errors.length,1);
}));
test('tampered test/manifest and out-of-scope files prevent execution', ()=>{
  fixture(dir=>{
    const base=join(dir,'full-zadloop');
    writeFileSync(join(dir,'responses/full-zadloop.md'),'Claimed complete.');
    writeFileSync(join(base,'acceptance.test.mjs'),"throw Error('tampered-test-executed');");
    writeFileSync(join(base,'baseline.json'),'{}');
    assert.equal(verifyFullScenario(dir,'zadloop').status,'failed');
    assert.doesNotMatch(readFileSync(join(dir,'full-zadloop-test-output.txt'),'utf8'),/tampered-test-executed/);
    assert.throws(()=>prepareFullScenarios(dir),/Refusing to overwrite/);
  });
  fixture(dir=>{
    writeFileSync(join(dir,'responses/full-zadloop.md'),'Claimed complete.');
    writeFileSync(join(dir,'full-zadloop/project/unrequested.mjs'),'// out of scope');
    assert.equal(verifyFullScenario(dir,'zadloop').status,'failed');
  });
});
test('fixture handoff is a clean root repository with a baseline and working-tree diff', ()=>fixture(dir=>{
  for(const host of ['opencode','zadloop']) {
    const base=join(dir,`full-${host}`), setup=JSON.parse(readFileSync(join(dir,`full-${host}-setup.json`),'utf8'));
    assert.equal(setup.status,'passed',setup.reason);
    for(const cwd of [base,join(base,'project')]) {
      const root=spawnSync('git',['rev-parse','--show-toplevel'],{cwd,encoding:'utf8'});
      assert.equal(root.status,0); assert.equal(resolve(root.stdout.trim()),resolve(base));
    }
    const git=(...args)=>spawnSync('git',args,{cwd:base,encoding:'utf8'});
    assert.equal(git('rev-list','--count','HEAD').stdout.trim(),'1');
    assert.equal(git('remote').stdout.trim(),'');
    assert.equal(git('status','--porcelain').stdout.trim(),'');
    writeFileSync(join(base,'project/drafts.mjs'),reference);
    assert.equal(git('diff','--name-only','HEAD').stdout.trim(),'project/drafts.mjs');
  }
}));
test('installed-style loader resolves global roles from root and child without project config', ()=>fixture(dir=>{
  const configHome=join(dir,'isolated-config'); mkdirSync(join(configHome,'delegate-skills'),{recursive:true});
  const map={version:'delegate-fleet.v1',lanes:{'draft-feature-design':{implementer:'opencode',model:'fixture/model',variant:'low'}}};
  writeFileSync(join(configHome,'delegate-skills/config.json'),JSON.stringify(map));
  const setup=fileURLToPath(new URL('../../vendor/amElnagdy/delegate-skills/skills/delegate-setup/scripts/',import.meta.url));
  const env={...process.env,XDG_CONFIG_HOME:configHome}; delete env.NODE_TEST_CONTEXT;
  const configPath=join(configHome,'delegate-skills/config.json'), original=readFileSync(configPath,'utf8');
  for(const cwd of [join(dir,'full-opencode'),join(dir,'full-opencode/project')]) {
    const load=spawnSync(process.execPath,[join(setup,'config.mjs'),'load','--cwd',cwd],{encoding:'utf8',env});
    assert.equal(load.status,0,load.stderr); const fleet=JSON.parse(load.stdout);
    assert.equal(fleet.projectPresent,false); assert.equal(fleet.globalPresent,true);
    assert.equal(fleet.lanes['draft-feature-design'].source,'global');
    const result=spawnSync(process.execPath,[join(setup,'lane.mjs'),'resolve','--cwd',cwd,'--lane','draft-feature-design','--implementer','opencode'],{encoding:'utf8',env});
    assert.equal(result.status,0,result.stderr); const lane=JSON.parse(result.stdout);
    assert.equal(lane.source,'global'); assert.equal(lane.skill,'opencode-delegate');
    assert.equal(lane.dials.model,'fixture/model');
  }
  assert.equal(readFileSync(configPath,'utf8'),original);
}));
