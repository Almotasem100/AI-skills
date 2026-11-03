import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const checker = fileURLToPath(new URL('../skills/create-lld/scripts/check-lld.mjs', import.meta.url));
const body = '\n\n## Context\nOwners rename drafts.\n\n## Objectives & constraints\nPreserve ownership.\n\n## Design\nCheck ownership before renaming.\n';

function check(header, content = body) {
  const dir = mkdtempSync(join(tmpdir(), 'lld-heading-'));
  try {
    const path = join(dir, 'lld.md');
    writeFileSync(path, header + content);
    const result = spawnSync(process.execPath, [checker, path, '--size', 'small'], {encoding: 'utf8'});
    return {status: result.status, output: JSON.parse(result.stdout)};
  } finally { rmSync(dir, {recursive: true, force: true}); }
}

test('LLD accepts a supplied identifier or title-only heading without invented metadata', () => {
  for (const title of ['# LLD — DRAFT-RENAME: Rename drafts', '# LLD — Access revocation', '# Technical Design — APP-104: Notification preferences', '# Technical Design Document — Notification preferences']) {
    const result = check(title);
    assert.equal(result.status, 0, JSON.stringify(result.output));
    assert.deepEqual(result.output.errors, []);
  }
});

test('LLD still rejects missing titles and unrelated document headings', () => {
  for (const title of ['# LLD — ', '# LLD — FEATURE-1:', '# Functional Design — Rename drafts']) {
    const result = check(title);
    assert.equal(result.status, 1);
    assert.ok(result.output.errors.some(error => error.startsWith('First line must be:')));
  }
});

test('title-only support does not bypass missing-core or empty-section validation', () => {
  const result = check('# LLD — Rename drafts', '\n\n## Context\n\n## Objectives & constraints\nOwners only.\n');
  assert.equal(result.status, 1);
  assert.ok(result.output.errors.some(error => error.includes('Required core section missing: Design')));
  assert.ok(result.output.errors.some(error => error.includes('Section "Context" is empty')));
});

test('forward Technical Design omits context padding but still rejects an empty Design section', () => {
  const result = check('# Technical Design — Notification preferences', '\n\n## Design\nThe resource validates and merges changed categories into account preferences.\n');
  assert.equal(result.status, 0, JSON.stringify(result.output));
  assert.equal(check('# Technical Design — Notification preferences', '\n\n## Design\n').status, 1);
});
