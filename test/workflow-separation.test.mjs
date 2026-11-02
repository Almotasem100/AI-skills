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
const lanes = read('docs/delegation-lanes.md');
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
  assert.match(profile, /standing-authorizes automatic fallback/);
  assert.match(profile, /process\/relay success/);
  assert.match(profile, /response success/);
  assert.match(profile, /task acceptance/);
  for (const [, target] of profile.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    assert.ok(existsSync(resolve(root, 'docs', target)), target);
  }
});

test('optional profile uses CLI routes without native preference setup and preserves ownership', () => {
  assert.match(profile, /orchestrator authors and revises the implementation plan by default/);
  assert.match(profile, /separate plan review through the configured `challenge-plan` responsibility/);
  assert.match(profile, /Self-checks do not\s+replace this separate review/);
  assert.match(profile, /missing review route is a blocker/);
  assert.match(profile, /configured CLI delegation skills/);
  assert.match(profile, /user need not name a lane or choose a mechanism/);
  assert.match(profile, /including Gemini CLI/);
  assert.match(profile, /does not read local execution.json/);
  assert.match(profile, /shell\/process access as well as edit-tool permissions/);
  assert.match(guide, /Do not create,[\s\S]*?delete existing local execution.json/);
  assert.doesNotMatch(profile, /native-preferred|relay-preferred|roleMechanisms/);
  assert.doesNotMatch(guide, /Copy-Item.*execution.example|\$executionFile/);
  assert.doesNotMatch(globalInstructions + contract, /execution\.json|Gemini CLI|native-preferred|relay-preferred/);
});

test('planning ownership stays consistent through routing, corrections and optional debate', () => {
  assert.match(lanes, /Do not dispatch `write-plan` merely because the lane exists/);
  assert.match(profile, /Only an explicit user assignment delegates plan authorship/);
  assert.match(lanes, /plan author owns revisions and evidence-backed findings disposition/);
  assert.match(lanes, /reviewer checks affected material revisions before the plan is called ready/);
  const debate = read('skills/plan-debate/SKILL.md');
  assert.match(debate, /Preserve the calling workflow's plan author/);
  assert.match(debate, /do not dispatch a replacement author/);
  assert.match(debate, /challenge reviewer\s+distinct from the author/);
  for (const source of [profile, lanes, read('README.md'), read('test/native-smoke/README.md'),
    read('test/native-smoke/full-scenario.md')]) {
    assert.doesNotMatch(source, /configured planner authors|delegated planner authorship|planner authors and orchestrator critiques|orchestrator reviews\. Ordinary/);
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

test('operator boundaries retain evidence, stop plan-only work and batch verification', () => {
  assert.match(contract, /same planning task, not feature implementation/);
  assert.match(contract, /Preserve working inputs, design, plans and review\/verification evidence/);
  assert.match(contract, /does not automatically invoke work-closeout/);
  assert.match(contract, /concise Markdown record of substantive review findings/);
  assert.match(contract, /pause\s+only dependent work and continue genuinely independent work/);
  assert.match(contract, /cosmetic edit does not justify unrelated full-suite or API-regression runs/);
  assert.match(contract, /Do not deploy after every edit/);
  assert.match(read('skills/work-closeout/SKILL.md'), /request to finish implementation is not authorization/);
  assert.match(read('skills/plan-debate/SKILL.md'), /first gives a reasoned objection to a consequential technical finding/);
});

test('debate starts at first material technical disagreement without restarting review or overriding owner choices', () => {
  const debate = read('skills/plan-debate/SKILL.md');
  assert.match(profile, /When the author first disputes a\s+consequential technical finding/);
  assert.match(profile, /No second reviewer refusal, extra permission/);
  assert.match(debate, /existing review, reuse its finding as the initial challenge/);
  assert.match(debate, /author cannot unilaterally close a consequential finding/);
  assert.match(debate, /Accepted corrections and minor preferences remain ordinary/);
  assert.match(debate, /Investigate missing facts, and ask the owner/);
  assert.match(debate, /Stop cycling when another round is not changing a material issue/);
  assert.match(guide, /\$withPlanDebate = \$withDelegation -or/);
  assert.doesNotMatch(profile + lanes + debate + globalInstructions,
    /Require explicit debate selection|structured debate only when explicitly selected|run `plan-debate` only when explicitly selected/);
});

test('implementation evidence preserves discretion, plan ownership and focused revision boundaries', () => {
  const section = contract.split('### New evidence during implementation')[1].split('## Evidence and authority')[0];
  assert.match(section, /do not knowingly follow the invalid step/);
  assert.match(section, /routine adjustments within the approved behavior, scope and architectural approach/);
  assert.match(section, /return the evidence and proposed\s+adjustment to the plan author before proceeding with dependent work/);
  assert.match(section, /reconcile\s+affected design\/QA artifacts with their owners/);
  assert.match(section, /focused review of material revisions/);
  assert.match(section, /outside that authority requires the owner's decision/);
  assert.match(section, /Pause only dependent work/);
  assert.match(profile, /orchestrator as plan author \(or the explicitly assigned\s+external author\)/);
});

test('recovery distinguishes transport, quota and unknown-worker status without new configuration', () => {
  assert.match(profile, /whether the owner is present or offline/);
  assert.match(profile, /same configured model\/effort and approved account\/environment/);
  assert.match(profile, /Switching transport does not bypass provider quota/);
  assert.match(profile, /prior worker did not start or has stopped/);
  assert.match(profile, /unresolved timeout is not permission to run a duplicate writer/);
  assert.match(profile, /do not configure agents or infer equivalence/);
  assert.match(profile, /No special planning-lane fallback prohibition is added/);
  assert.doesNotMatch(profile + lanes, /Only (?:an )?explicit.*unattended-continuation authorization/);
  for (const caseName of ['Plan only', 'Offline blocker', 'Completion and cadence', 'Relay-only failure',
    'Exhausted quota', 'Unknown timeout']) assert.ok(read('test/native-smoke/operator-scenarios.md').includes(caseName));
});

test('standalone context and plan review do not require configured routing', () => {
  for (const path of ['skills/task-context/SKILL.md', 'skills/plan-review/SKILL.md']) {
    assert.doesNotMatch(read(path), /\b(?:orchestrator|configured lanes?|delegation mode)\b/i, path);
  }
  assert.match(read('skills/task-context/SKILL.md'), /targeted grilling\/decision work/);
  assert.match(read('skills/plan-review/SKILL.md'), /plan author/);
});

test('intake skill and template preserve decisions and narrow evidence without a mandatory technical handoff', () => {
  const skill = read('skills/task-context/SKILL.md');
  const template = read('skills/task-context/references/task-context-template.md');
  assert.match(skill, /consequential original questions and answers/);
  assert.match(skill, /corrections and superseded decisions/);
  assert.match(skill, /sourced observation or cross-source concern/);
  assert.match(skill, /do not prescribe an implementation/);
  assert.match(skill, /later working synthesis to this same artifact/);
  assert.match(skill, /Older rich\s+task-context files remain usable/);
  for (const heading of ['Objective and approved scope', 'Source inventory', 'Clarification Q&A and decisions',
    'Open questions and conflicts', 'Consequential observations']) assert.ok(template.includes(`## ${heading}`));
  assert.doesNotMatch(template, /## Relevant current-system findings|reuse opportunities/);
});

test('intake consumers retain source authority and do not require an upstream technical solution', () => {
  assert.match(contract, /optional intake-first working record/);
  assert.match(read('skills/create-lld/SKILL.md'), /absent technical summary is not a missing-input blocker/);
  assert.match(read('skills/qa-scenarios/SKILL.md'), /investigative leads, not expected results/);
  assert.match(read('skills/plan-review/SKILL.md'), /do not treat a sourced\s+concern as an approved requirement/);
  const pr = read('skills/describe-pr/SKILL.md');
  assert.doesNotMatch(pr, /authoritative task context|explicit user rationale -> task context/);
  assert.match(pr, /Task-context itself does not grant authority/);
  assert.match(read('skills/describe-pr/references/draft-contract.md'), /`taskContext` records the carrier, not approval/);
});

function installGroup(name) {
  const escaped = name.replaceAll('$', '\\$');
  const match = guide.match(new RegExp(`${escaped} = @\\(([\\s\\S]*?)\\n\\)`));
  assert.ok(match, name);
  return [...match[1].matchAll(/"([^"]+)"/g)].map(match => match[1].replaceAll('\\', '/'));
}

test('documented install separates optional runtime dependencies and includes conditional debate', () => {
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
