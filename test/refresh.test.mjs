import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, readdirSync, symlinkSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { pinnedSpec, plan, apply } from '../tools/refresh/refresh.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(repo, 'tools/refresh/refresh.mjs');
const run = (home, ...args) => spawnSync(process.execPath, [script, '--home', home, '--skip-pinned', ...args], { encoding: 'utf8' });
const temp = prefix => mkdtempSync(join(tmpdir(), prefix));

function fakeHome() {
  const home = temp('refresh-home-');
  const skills = join(home, '.agents', 'skills');
  mkdirSync(skills, { recursive: true });
  cpSync(join(repo, 'skills/task-context'), join(skills, 'task-context'), { recursive: true });
  cpSync(join(repo, 'skills/plan-review'), join(skills, 'plan-review'), { recursive: true });
  writeFileSync(join(skills, 'plan-review', 'SKILL.md'), 'stale');
  mkdirSync(join(skills, 'my-own-skill'));
  for (const name of ['delegate-setup', 'gemini-delegate']) {
    mkdirSync(join(skills, name));
    writeFileSync(join(skills, name, 'SKILL.md'), `old ${name}`);
  }
  mkdirSync(join(home, '.config', 'ai-skills'), { recursive: true });
  writeFileSync(join(home, '.config', 'ai-skills', 'orchestration-contract.md'), 'old contract');
  mkdirSync(join(home, '.claude'));
  writeFileSync(join(home, '.claude', 'CLAUDE.md'), 'personal rules');
  return home;
}

test('dry run reports stale items and changes nothing', () => {
  const home = fakeHome();
  try {
    const result = run(home, '--dry-run');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /would update .*plan-review/);
    assert.match(result.stdout, /would update .*orchestration-contract\.md/);
    assert.doesNotMatch(result.stdout, /task-context/);
    assert.equal(readFileSync(join(home, '.agents/skills/plan-review/SKILL.md'), 'utf8'), 'stale');
    assert.ok(!existsSync(join(home, '.config/ai-skills/refresh-backups')));
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('refresh updates only stale installed items, backs them up and keeps Gemini and personal files', () => {
  const home = fakeHome();
  try {
    const result = run(home);
    assert.equal(result.status, 0, result.stderr);
    const skills = join(home, '.agents/skills');
    assert.equal(readFileSync(join(skills, 'plan-review/SKILL.md'), 'utf8'), readFileSync(join(repo, 'skills/plan-review/SKILL.md'), 'utf8'));
    assert.equal(readFileSync(join(home, '.config/ai-skills/orchestration-contract.md'), 'utf8'),
      readFileSync(join(repo, 'instructions/orchestration-contract.md'), 'utf8'));
    assert.ok(!existsSync(join(home, '.config/ai-skills/ai-skills-delegation.md')), 'does not add uninstalled files');
    assert.equal(readFileSync(join(skills, 'delegate-setup/SKILL.md'), 'utf8'), 'old delegate-setup');
    assert.equal(readFileSync(join(skills, 'gemini-delegate/SKILL.md'), 'utf8'), 'old gemini-delegate');
    assert.equal(readFileSync(join(home, '.claude/CLAUDE.md'), 'utf8'), 'personal rules');
    assert.ok(existsSync(join(skills, 'my-own-skill')));
    assert.match(result.stdout, /unmanaged .*my-own-skill/);
    assert.doesNotMatch(result.stdout, /unmanaged .*gemini-delegate/);
    assert.match(result.stdout, /differs .*CLAUDE\.md/);
    assert.ok(!readdirSync(skills).some(name => /\.refresh-(new|old)$/.test(name)), 'no staging leftovers');
    const backups = join(home, '.config/ai-skills/refresh-backups');
    const [backup] = readdirSync(backups);
    assert.equal(readFileSync(join(backups, backup, '.agents/skills/plan-review/SKILL.md'), 'utf8'), 'stale');
    assert.match(readFileSync(join(backups, backup, 'BACKUP-INFO.txt'), 'utf8'), /plan-review/);
    assert.match(run(home).stdout, /Nothing to update/);
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('host instructions are replaced only on request', () => {
  const home = fakeHome();
  try {
    assert.equal(run(home, '--host-instructions').status, 0);
    assert.equal(readFileSync(join(home, '.claude/CLAUDE.md'), 'utf8'), readFileSync(join(repo, 'instructions/global-instructions.md'), 'utf8'));
  } finally { rmSync(home, { recursive: true, force: true }); }
});

const tempDirs = prefix => readdirSync(tmpdir()).filter(name => name.startsWith(prefix)).length;

test('--gemini builds the overlay from this checkout and refreshes both skills without leaving temp files', () => {
  const home = fakeHome();
  try {
    const before = tempDirs('ai-skills-gemini-');
    const result = run(home, '--gemini');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(tempDirs('ai-skills-gemini-'), before);
    const relay = join(home, '.agents/skills/gemini-delegate/scripts/relay.mjs');
    const help = spawnSync(process.execPath, [relay, '--help'], { encoding: 'utf8' });
    assert.equal(help.status, 0, help.stderr);
    assert.match(readFileSync(join(home, '.agents/skills/delegate-setup/scripts/implementers.mjs'), 'utf8'), /gemini-delegate/);
    assert.match(run(home, '--gemini').stdout, /Nothing to update/);
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('linked skills folders and skills are never written through', () => {
  const home = fakeHome();
  const outside = temp('refresh-outside-');
  try {
    cpSync(join(home, '.agents/skills/plan-review'), join(outside, 'plan-review'), { recursive: true });
    rmSync(join(home, '.agents/skills/plan-review'), { recursive: true });
    symlinkSync(join(outside, 'plan-review'), join(home, '.agents/skills/plan-review'), 'junction');
    mkdirSync(join(home, '.claude/skills'));
    rmSync(join(home, '.claude/skills'), { recursive: true });
    symlinkSync(outside, join(home, '.claude/skills'), 'junction');
    const result = run(home);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /linked .*plan-review/);
    assert.match(result.stdout, /linked .*\.claude[\\/]skills/);
    assert.equal(readFileSync(join(outside, 'plan-review/SKILL.md'), 'utf8'), 'stale');
  } finally { rmSync(home, { recursive: true, force: true }); rmSync(outside, { recursive: true, force: true }); }
});

const opts = home => ({ home, skipPinned: true, geminiSource: null, hostInstructions: false });

test('a failed swap restores the previous copy and leaves no staging folders', () => {
  const home = fakeHome();
  try {
    const item = plan(opts(home)).items.find(i => i.installed.endsWith('plan-review'));
    const logs = [];
    const failingRename = (from, to) => {
      if (from.endsWith('.refresh-new')) throw new Error('simulated lock');
      renameSync(from, to);
    };
    assert.throws(() => apply(opts(home), { items: [item] }, { log: line => logs.push(line), rename: failingRename }), /old copy restored/);
    assert.equal(readFileSync(join(item.installed, 'SKILL.md'), 'utf8'), 'stale');
    assert.ok(!readdirSync(dirname(item.installed)).some(name => /\.refresh-(new|old)$/.test(name)));
    assert.match(logs.join('\n'), /Backup folder:/);
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('an interrupted run is reported during planning and blocks applying', () => {
  const home = fakeHome();
  try {
    const skills = join(home, '.agents/skills');
    renameSync(join(skills, 'plan-review'), join(skills, 'plan-review.refresh-old'));
    const result = run(home);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /plan-review\.refresh-old is the previous copy; rename it back to plan-review/);
    assert.match(result.stdout, /Not applying/);
    assert.doesNotMatch(result.stdout, /unmanaged .*refresh-old/);
    assert.ok(!existsSync(join(home, '.config/ai-skills/refresh-backups')));
  } finally { rmSync(home, { recursive: true, force: true }); }
});

test('a linked .config ancestor is refused before any folder is created through it', () => {
  const home = fakeHome();
  const outside = temp('refresh-outside-');
  try {
    rmSync(join(home, '.config'), { recursive: true });
    symlinkSync(outside, join(home, '.config'), 'junction');
    const result = run(home);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /backup folder is linked/);
    assert.deepEqual(readdirSync(outside), []);
  } finally { rmSync(home, { recursive: true, force: true }); rmSync(outside, { recursive: true, force: true }); }
});

test('a linked backups folder is refused before anything is written', () => {
  const home = fakeHome();
  const outside = temp('refresh-outside-');
  try {
    symlinkSync(outside, join(home, '.config/ai-skills/refresh-backups'), 'junction');
    const result = run(home);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /backup folder is linked/);
    assert.deepEqual(readdirSync(outside), []);
    assert.equal(readFileSync(join(home, '.agents/skills/plan-review/SKILL.md'), 'utf8'), 'stale');
  } finally { rmSync(home, { recursive: true, force: true }); rmSync(outside, { recursive: true, force: true }); }
});

test('the pinned spec comes from the GUIDE install block', () => {
  const spec = pinnedSpec(readFileSync(join(repo, 'GUIDE.md'), 'utf8'));
  assert.match(spec.commit, /^[0-9a-f]{40}$/);
  assert.ok(spec.folders.includes('productivity/grilling'));
});
