import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
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
