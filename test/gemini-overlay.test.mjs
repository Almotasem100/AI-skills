import assert from 'node:assert/strict';
import test from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('Gemini overlay applies, passes parity and its focused relay regressions', () => {
  const work = mkdtempSync(join(tmpdir(), 'gemini-overlay-regression-'));
  const patch = join(repo, 'overlays/gemini-delegate/changes.patch');
  try {
    cpSync(join(repo, 'vendor/amElnagdy/delegate-skills'), work, { recursive: true });
    for (const args of [['apply', '--check', patch], ['apply', patch]]) {
      const child = spawnSync('git', args, { cwd: work, encoding: 'utf8', timeout: 15_000 });
      assert.equal(child.status, 0, child.stderr);
    }
    const file = join(work, 'test/relay-parity.mjs');
    const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8', timeout: 15_000 });
    assert.equal(syntax.status, 0, syntax.stderr);
    const parity = spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 15_000 });
    assert.equal(parity.status, 0, parity.stdout + parity.stderr);
    assert.match(parity.stdout, /relay parity: all checks passed/);
    const smoke = spawnSync(process.execPath, ['test/relay-smoke.mjs', '--only', 'gemini'], {
      cwd: work, encoding: 'utf8', timeout: 60_000,
    });
    assert.equal(smoke.status, 0, smoke.stdout + smoke.stderr);
    assert.match(smoke.stdout, /relay smoke: all green/);
    // Package setup still contains the Gemini-specific conversion after applying the corrected patch.
    assert.match(readFileSync(join(work, 'skills/delegate-setup/scripts/lane.mjs'), 'utf8'), /approvalMode/);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});
