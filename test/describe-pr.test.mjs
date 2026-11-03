import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const skill = fileURLToPath(new URL('../skills/describe-pr/', import.meta.url));
const context = {root:'.', branch:{ticketId:'79505219'}, template:'story', requiredSections:['why','whatChanged','testing'], scopes:['ebbs']};
const draft = {title:{type:'feat',scope:'ebbs',summary:'add overview and shared command feedback'}, sections:{why:{text:'Provide the agreed eBB overview.'},whatChanged:{text:'- Add the overview.'},testing:{text:'- Fixture checks only; no application execution is claimed.'}}};
function render(ctx=context, doc=draft, strict=false) {
 const dir=mkdtempSync(join(tmpdir(),'pr-render-'));
 try {
  const c=join(dir,'context.json'),d=join(dir,'draft.json');writeFileSync(c,JSON.stringify(ctx));writeFileSync(d,JSON.stringify(doc));
  const r=spawnSync(process.execPath,[join(skill,'scripts/render.mjs'),'--context',c,'--draft',d,...(strict?['--strict']:[])],{encoding:'utf8'});
  return {status:r.status, error:r.stderr, result:r.stdout?JSON.parse(r.stdout):null};
 } finally {rmSync(dir,{recursive:true,force:true});}
}
test('ticket-first title is exact and optional body metadata/evidence is absent without filler',()=>{
 const r=render(context,draft,true);assert.equal(r.status,0,r.error);
 assert.equal(r.result.title,'feat[#79505219]: add overview and shared command feedback');
 assert.match(r.result.body,/## Purpose/);assert.match(r.result.body,/## Verification/);
 assert.doesNotMatch(r.result.body,/\*\*Ticket:|\*\*Design:|## Screenshots|## Review considerations|none|\[NEEDS INPUT\]/);
});
test('useful design reference, risk bullets and review considerations survive rendering',()=>{
 const doc=structuredClone(draft);doc.fields={designDoc:'[eBBs Table — Technical Design](https://example.invalid/design)'};
 doc.sections.impactAndRisk={text:'- Requires the companion backend.\n- Older clients use a different contract.'};
 doc.sections.reviewerNotes={text:'- This slice targets its unmerged predecessor.'};
 doc.sections.screenshots={text:'![Overview](https://example.invalid/overview.png)'};
 const r=render(context,doc);assert.equal(r.status,0,r.error);
 assert.match(r.result.body,/\*\*Design:\*\* \[eBBs Table — Technical Design\]/);
 assert.match(r.result.body,/## Impact and risks\n- Requires the companion backend\.\n- Older clients/);
 assert.match(r.result.body,/## Review considerations/);assert.match(r.result.body,/## Screenshots/);
});
test('explicit conventional format preserves scope and unknown formats fail visibly',()=>{
 assert.equal(render({...context,titleFormat:'conventional'}).result.title,'feat(ebbs): add overview and shared command feedback [#79505219]');
 const invalid=render({...context,titleFormat:'unknown'});assert.equal(invalid.status,1);assert.match(invalid.error,/Unsupported titleFormat/);
});
test('strict mode retains missing ticket and verification blockers',()=>{
 const doc=structuredClone(draft);delete doc.sections.testing;
 const r=render({...context,branch:{}},doc,true);assert.equal(r.status,2);assert.equal(r.result.needsInput,2);
 assert.match(r.result.body,/## Verification\n\[NEEDS INPUT\]/);
});
test('bugfix and release conventions remain usable without repeating a body ticket',()=>{
 const r=render({...context,template:'bugfix',requiredSections:['problem','fix']},{title:{type:'fix',summary:'preserve saved preferences'},fields:{severity:'low',foundIn:'DEV'},sections:{problem:{text:'Saving resets untouched categories.'},fix:{text:'Merge only submitted categories.'}}},true);
 assert.equal(r.status,0,r.error);assert.match(r.result.body,/## Problem/);assert.doesNotMatch(r.result.body,/\*\*Ticket:/);
 assert.equal(render({...context,branch:{releaseVersion:'R1.2'}},{...draft,title:{type:'release',summary:'release version'}}).result.title,'release: R1.2');
});
test('real git context leaves UI screenshots optional and carries explicit project title convention',()=>{
 const dir=mkdtempSync(join(tmpdir(),'pr-ui-context-'));
 const git=(...args)=>{const r=spawnSync('git',args,{cwd:dir,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout;};
 try {
  git('init','-b','main');writeFileSync(join(dir,'README.md'),'Synthetic fixture.\n');git('add','.');
  git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','baseline');
  git('checkout','-b','story/123456_addPanel');
  writeFileSync(join(dir,'panel.component.ts'),Array.from({length:30},(_,i)=>`// Fixture UI line ${i}`).join('\n'));
  git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','add panel');
  const invoke=()=>{const r=spawnSync(process.execPath,[join(skill,'scripts/context.mjs'),'--base','main'],{cwd:dir,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
  const c=invoke();assert.ok(c.signals.includes('ui'));assert.ok(c.requiredSections.includes('testing'));assert.ok(!c.requiredSections.includes('screenshots'));assert.equal(c.titleFormat,'ticket-first');
  writeFileSync(join(dir,'.describe-pr.json'),JSON.stringify({titleFormat:'conventional'}));assert.equal(invoke().titleFormat,'conventional');
 } finally {rmSync(dir,{recursive:true,force:true});}
});
