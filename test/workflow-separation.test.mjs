import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');
const globalInstructions = read('templates/global-user-instructions/AGENTS.md');
const contract = read('docs/orchestration-contract.md');
const profile = read('docs/ai-skills-delegation.md');
const guide = read('GUIDE.md');

// Source regressions: these do not establish model adherence or native host loading.
test('shared entry has one explicit opt-in pointer and no execution-mode policy', () => {
  const lines = globalInstructions.split('\n');
  const pointer = lines.filter(line => /delegat/i.test(line));
  assert.equal(pointer.length, 1);
  assert.match(pointer[0], /When the user explicitly selects \*\*AI Skills delegation mode\*\*, read/);
  const common = lines.filter(line => line !== pointer[0]).join('\n');
  assert.doesNotMatch(common, /\b(?:delegat\w*|orchestrator|lanes?|fallback|Standard Mode|session mode)\b/i);
  assert.doesNotMatch(contract, /\b(?:delegat\w*|orchestrator|lanes?|fallback|Standard Mode|session mode)\b/i);
});

test('optional instructions guard activation before routing and retain continuity/recovery', () => {
  const guardEnd = profile.indexOf('## Ownership');
  assert.ok(guardEnd > 0);
  assert.match(profile.slice(0, guardEnd), /Do not read further or apply these instructions unless the user has explicitly selected/);
  assert.match(profile.slice(0, guardEnd), /AI Skills delegation mode/);
  assert.match(profile, /same session/);
  assert.match(profile, /new session must not infer activation from an older/);
  assert.match(profile, /unattended-continuation authorization/);
  assert.match(profile, /process\/relay success/);
  assert.match(profile, /response success/);
  assert.match(profile, /task acceptance/);
  for (const [, target] of profile.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    assert.ok(existsSync(resolve(root, 'docs', target)), target);
  }
});

test('shared workflow retains nine outcomes, prerequisite order and independent review', () => {
  const section = contract.split('## Full Feature delivery contract')[1].split('## Work hierarchy')[0];
  const outcomes = [...section.matchAll(/^\d+\. \*\*([^*]+)\*\*/gm)].map(match => match[1]);
  assert.deepEqual(outcomes, ['Intake and clarification:', 'Working context:', 'Feature design:',
    'QA scenarios:', 'Implementation plan:', 'Plan challenge/acceptance:', 'Implementation and checks:',
    'Code review and corrections:', 'Publication and closeout:']);
  assert.match(section, /QA scenarios:[\s\S]*?\*\*before implementation planning\*\*/);
  assert.match(section, /use a separate technical reviewer for substantive Full Feature code changes by default/);
  assert.match(contract, /accept\/revise, reject with evidence, or leave open/);
  assert.match(contract, /self-checks and outcome verification do not substitute for independent review/);
  assert.match(section, /unless the owner explicitly omits/);
});

test('standalone context and plan review do not require configured routing', () => {
  for (const path of ['skills/task-context/SKILL.md', 'skills/plan-review/SKILL.md']) {
    assert.doesNotMatch(read(path), /\b(?:orchestrator|configured lanes?|delegation mode)\b/i, path);
  }
  assert.match(read('skills/task-context/SKILL.md'), /targeted grilling\/decision work/);
  assert.match(read('skills/plan-review/SKILL.md'), /plan author/);
});

function installGroup(name) {
  const escaped = name.replaceAll('$', '\\$');
  const match = guide.match(new RegExp(`${escaped} = @\\(([\\s\\S]*?)\\n\\)`));
  assert.ok(match, name);
  return [...match[1].matchAll(/"([^"]+)"/g)].map(match => match[1].replaceAll('\\', '/'));
}

test('documented install separates optional runtime dependencies and leaves debate opt-in', () => {
  const shared = installGroup('$folders');
  const optional = installGroup('$delegationFolders');
  for (const path of [...shared, ...optional]) assert.ok(existsSync(join(root, path, 'SKILL.md')), path);
  assert.ok(shared.includes('skills/task-context'));
  assert.ok(shared.includes('skills/plan-review'));
  assert.ok(!shared.some(path => /delegate-skills|debate-review|plan-debate/.test(path)));
  assert.ok(optional.some(path => path.endsWith('/delegate-setup')));
  assert.ok(optional.some(path => path.endsWith('/debate-review')));
  assert.match(guide, /if \(\$withDelegation\) \{ \$folders \+= \$delegationFolders \}/);
  assert.match(guide, /if \(\$withPlanDebate\) \{ \$folders \+= "skills\\plan-debate" \}/);
});

test('companion file layout resolves the installed pointers with and without optional files', () => {
  const home = mkdtempSync(join(tmpdir(), 'ai-skills-layout-'));
  try {
    const destination = join(home, '.config/ai-skills');
    mkdirSync(destination, { recursive: true });
    copyFileSync(join(root, 'docs/orchestration-contract.md'), join(destination, 'orchestration-contract.md'));
    assert.ok(existsSync(join(destination, 'orchestration-contract.md')));
    assert.ok(!existsSync(join(destination, 'ai-skills-delegation.md')));
    // The ordinary shared instruction path contains no dependency on the optional file.
    assert.doesNotMatch(contract, /ai-skills-delegation\.md|delegation-lanes\.md/);
    for (const file of ['ai-skills-delegation.md', 'delegation-lanes.md']) {
      assert.ok(guide.includes(`Copy-Item -Force "$setup/docs/${file}" $instructionRoot`));
      copyFileSync(join(root, 'docs', file), join(destination, file));
    }
    for (const [, pointer] of globalInstructions.matchAll(/`(~\/\.config\/ai-skills\/[^`]+)`/g)) {
      assert.ok(existsSync(pointer.replace('~', home)), pointer);
    }
    for (const [, target] of profile.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      assert.ok(existsSync(resolve(destination, target)), target);
    }
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});
