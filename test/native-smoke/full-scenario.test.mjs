import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
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
test('tampered test/manifest and out-of-scope files prevent execution', ()=>fixture(dir=>{
  const base=join(dir,'full-zadloop');
  writeFileSync(join(dir,'responses/full-zadloop.md'),'Claimed complete.');
  writeFileSync(join(base,'acceptance.test.mjs'),"throw Error('tampered-test-executed');");
  writeFileSync(join(base,'baseline.json'),'{}');
  assert.equal(verifyFullScenario(dir,'zadloop').status,'failed');
  assert.doesNotMatch(readFileSync(join(dir,'full-zadloop-test-output.txt'),'utf8'),/tampered-test-executed/);
  prepareFullScenarios(dir);
  writeFileSync(join(base,'project/unrequested.mjs'),'// out of scope');
  assert.equal(verifyFullScenario(dir,'zadloop').status,'failed');
}));
