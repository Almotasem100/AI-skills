// Structural invariants of the setup. These guard layout, install paths and layer separation; they deliberately
// do not pin wording, so instructions can be rewritten freely.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');

function markdownFiles(dir) {
  return readdirSync(join(root, dir)).flatMap(name => {
    const path = join(dir, name);
    if (statSync(join(root, path)).isDirectory()) return markdownFiles(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

const ownMarkdown = ['README.md', 'GUIDE.md', 'AGENTS.md', 'manifest.md',
  ...['instructions', 'skills', 'docs', 'templates', 'tools', 'test', 'overlays'].flatMap(markdownFiles)];
const skillNames = readdirSync(join(root, 'skills')).filter(name => existsSync(join(root, 'skills', name, 'SKILL.md')));

test('relative Markdown links resolve', () => {
  const broken = [];
  for (const file of ownMarkdown) {
    const text = read(file).replace(/```[\s\S]*?```/g, '');
    for (const [, target] of text.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(target)) continue;
      if (!existsSync(resolve(root, dirname(file), target))) broken.push(`${file} -> ${target}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('first-party skills have portable frontmatter', () => {
  for (const name of skillNames) {
    const text = read(`skills/${name}/SKILL.md`);
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(match, `${name}: missing frontmatter`);
    const keys = [...match[1].matchAll(/^([A-Za-z-]+):/gm)].map(m => m[1]);
    assert.deepEqual(keys.sort(), ['description', 'name'], `${name}: only name and description allowed`);
    assert.match(match[1], new RegExp(`^name: ${name}\\s*$`, 'm'), `${name}: name must equal folder`);
    const description = match[1].match(/^description: (.+)$/m)?.[1] ?? '';
    assert.ok(description.length > 40 && description.length <= 1024, `${name}: description length`);
  }
});

test('portable layers stay free of project specifics', () => {
  const files = [...markdownFiles('instructions'), ...markdownFiles('skills')];
  for (const file of files) {
    assert.doesNotMatch(read(file), /\b(?:HDC|PDC|TDC|CodeBeamer|CADE-\d+)\b/, file);
  }
});

function installGroup(name) {
  const match = read('GUIDE.md').match(new RegExp(`\\${name} = @\\(([\\s\\S]*?)\\n\\)`));
  assert.ok(match, name);
  return [...match[1].matchAll(/"([^"]+)"/g)].map(m => m[1].replaceAll('\\', '/'));
}

test('documented install paths exist and keep the delegation stack optional', () => {
  const guide = read('GUIDE.md');
  const shared = installGroup('$folders');
  const optional = installGroup('$delegationFolders');
  for (const path of [...shared, ...optional, 'skills/plan-debate']) assert.ok(existsSync(join(root, path, 'SKILL.md')), path);
  for (const name of skillNames.filter(name => name !== 'plan-debate')) assert.ok(shared.includes(`skills/${name}`), name);
  assert.ok(!shared.some(path => /delegate|debate/.test(path)), 'shared install excludes delegation and debate');
  assert.ok(optional.some(path => path.endsWith('/delegate-setup')));
  for (const [, file] of guide.matchAll(/"\$setup\/(instructions\/[^"]+)"/g)) assert.ok(existsSync(join(root, file)), file);
});

// Evaluate the copy block's selection logic for each answer combination, using its own lines.
function installOutcome(withDelegation, standaloneDebate) {
  const guide = read('GUIDE.md');
  assert.match(guide, /\$withPlanDebate = \$withDelegation -or \(\(Read-Host "Also install standalone plan-debate/);
  const withPlanDebate = withDelegation || standaloneDebate;
  const skills = [...installGroup('$folders')];
  assert.match(guide, /if \(\$withDelegation\) \{ \$folders \+= \$delegationFolders \}/);
  if (withDelegation) skills.push(...installGroup('$delegationFolders'));
  const debate = guide.match(/if \(\$withPlanDebate\) \{ \$folders \+= "([^"]+)" \}/);
  assert.ok(debate, 'plan-debate install line');
  if (withPlanDebate) skills.push(debate[1].replaceAll('\\', '/'));
  const instructionCopies = guide.match(/\$instructionRoot = [\s\S]*?\n# 3\./)[0];
  const always = [...instructionCopies.split('if ($withDelegation)')[0].matchAll(/instructions\/([^"]+)" \$instructionRoot/g)].map(m => m[1]);
  const optional = [...instructionCopies.split('if ($withDelegation)')[1].matchAll(/instructions\/([^"]+)" \$instructionRoot/g)].map(m => m[1]);
  return { skills: skills.map(path => path.split('/').pop()), instructions: withDelegation ? [...always, ...optional] : always };
}

test('each install choice yields the intended skills and instruction files', () => {
  const shared = installOutcome(false, false);
  assert.ok(!shared.skills.some(name => /delegate|debate/.test(name)), shared.skills.join());
  assert.deepEqual(shared.instructions, ['orchestration-contract.md']);
  assert.ok(installOutcome(false, true).skills.includes('plan-debate'));
  const delegation = installOutcome(true, false);
  for (const name of ['delegate-setup', 'debate-review', 'plan-debate', 'opencode-delegate']) assert.ok(delegation.skills.includes(name), name);
  assert.deepEqual(delegation.instructions.sort(), ['ai-skills-delegation.md', 'cli-dispatch.md', 'delegation-lanes.md', 'orchestration-contract.md']);
});

test('installed instruction pointers resolve to installed instruction files', () => {
  const guide = read('GUIDE.md');
  const installed = new Set([...guide.matchAll(/"\$setup\/instructions\/([^"]+)" \$instructionRoot/g)].map(m => m[1]));
  const global = read('instructions/global-instructions.md');
  const pointers = [...global.matchAll(/`~\/\.config\/ai-skills\/([^`]+)`/g)].map(m => m[1]);
  assert.ok(pointers.includes('orchestration-contract.md'));
  for (const pointer of pointers) assert.ok(installed.has(pointer), pointer);
  // Installed companions link only to siblings, which the install copies together.
  for (const file of installed) {
    for (const [, target] of read(`instructions/${file}`).matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      assert.ok(installed.has(target), `${file} -> ${target}`);
    }
  }
});

test('shared instructions do not depend on the optional delegation profile', () => {
  const global = read('instructions/global-instructions.md');
  const delegationLines = global.split('\n').filter(line => /delegat/i.test(line));
  assert.equal(delegationLines.length, 1, 'exactly one opt-in pointer');
  assert.match(delegationLines[0], /explicitly selects \*\*AI Skills delegation mode\*\*/);
  const contract = read('instructions/orchestration-contract.md');
  assert.doesNotMatch(contract, /ai-skills-delegation|delegation-lanes|cli-dispatch|execution\.json|delegation mode|orchestrator|\blanes?\b/i);
  for (const name of ['task-context', 'plan-review', 'plan-debate']) {
    assert.doesNotMatch(read(`skills/${name}/SKILL.md`), /orchestrator|configured lanes?|delegation mode|challenge-plan|Gemini CLI/i, name);
  }
});

test('optional profile guards activation before any routing', () => {
  const profile = read('instructions/ai-skills-delegation.md');
  const firstSection = profile.indexOf('\n## ');
  assert.match(profile.slice(0, firstSection), /Do not read further or apply these instructions unless the user has explicitly selected/);
  assert.match(profile, /^## Ownership and activation$/m);
  assert.match(profile, /^## Execution mechanism$/m);
  assert.match(read('instructions/delegation-lanes.md').split('\n## ')[0], /Activation guard/);
});

test('contract keeps the nine Full Feature outcomes in order', () => {
  const section = read('instructions/orchestration-contract.md').split('## Full Feature delivery contract')[1].split('\n## ')[0];
  const outcomes = [...section.matchAll(/^\d+\. \*\*([^*:]+):\*\*/gm)].map(m => m[1]);
  assert.deepEqual(outcomes, ['Intake and clarification', 'Working context', 'Feature design', 'QA scenarios',
    'Implementation plan', 'Plan challenge/acceptance', 'Implementation and checks', 'Code review and corrections',
    'Delivery reporting and PR preparation']);
});

test('records stay out of the routinely loaded layers', () => {
  for (const file of [...markdownFiles('instructions'), ...markdownFiles('skills')]) {
    assert.doesNotMatch(read(file), /docs\/records\//, `${relative(root, file)} must not depend on records`);
  }
});
