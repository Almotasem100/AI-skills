import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');

test('work-closeout captures meaningful observations without inventing blank entries or auto-editing policy', () => {
  const skill = read('skills/work-closeout/SKILL.md');
  assert.match(skill, /explicitly requested closeout/i);
  assert.match(skill, /friction and positive patterns/i);
  assert.match(skill, /Do \*\*not\*\* invent observations or write blank entries/i);
  assert.match(skill, /never automatic policy modification/i);
  assert.match(skill, /Never copy confidential content into a shared repository/i);
  // Non-trigger control: routine implementation completion must still not trigger closeout.
  assert.match(skill, /routine implementation completion does not trigger closeout/i);
});

test('scratchpad template prompts for resumable blocker context and multi-request tracking', () => {
  const scratchpad = read('skills/work-closeout/templates/scratchpad.md');
  assert.match(scratchpad, /decision\/question needed/i);
  assert.match(scratchpad, /affected dependency/i);
  assert.match(scratchpad, /recommended option/i);
  assert.match(scratchpad, /resume pointer/i);
  assert.match(scratchpad, /multi-request Change\/Bug/i);
});

test('orchestration contract includes selective property/differential check guidance without mandating dependencies', () => {
  const contract = read('instructions/orchestration-contract.md');
  assert.match(contract, /property\/invariant or differential checks/i);
  assert.match(contract, /without adding unnecessary dependencies/i);
});
