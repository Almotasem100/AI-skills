---
name: plan-debate
description: Resolve a consequential technical finding disputed by the plan author through a focused evidence-backed author/reviewer debate, starting at the first reasoned disagreement, or when the user explicitly requests debate. Reuse existing review evidence; accepted corrections, minor preferences, missing-fact investigation and owner product decisions are not automatic debate triggers. Not for code/PR review.
---

# Plan debate

Start when the plan author first gives a reasoned objection to a consequential technical finding, or when the
user explicitly requests debate. The author's objection is the first response: no second reviewer refusal or
extra owner permission is needed. Continue with the existing plan, finding, evidence and participants; do not
restart review or automatically recruit another agent. Accepted corrections and minor preferences remain ordinary
review. Investigate missing facts, and ask the owner for material product preferences/approval instead of debating
an answer into existence. A clean debate is not agreement manufactured by exhaustion.

Debate a plan before implementation. The working output is one **temporary debate record** plus the resulting plan,
not a second project-of-record document and not the project's compact execution scratchpad. A clean debate is not
proof of safety. Material unresolved decisions are escalated; resolved findings inside an already authorized workflow
do not create a new approval gate.

## Set up

1. Read project instructions and identify the plan-author role, challenge-reviewer role, any justified independent
   reviewer, and the applicable owner/material gates. Preserve the calling workflow's plan author, including when
   the orchestrator is that author; do not dispatch a replacement author merely because a planning lane exists.
   Resolve external roles through configured lanes unless explicitly overridden. Keep the challenge reviewer
   distinct from the author; do not present the orchestrator's self-review as independent.
2. Gather only the task context and authoritative sources needed to test material premises. Record provenance and
   revision/state where useful. Prior delegate findings are leads, not authority.
3. Use one dedicated temporary debate record outside durable project documentation unless the project explicitly
   defines a planning-work location. The normal project scratchpad remains compact execution state and may point to
   the debate/plan, but it must not become a dump of excerpts, full review exchanges or duplicate requirements.
4. The orchestrator owns coordination state; the plan author owns the plan; reviewers own their findings. Delegated
   roles return attributed outputs. Parallelize independent reviewers only when useful and avoid competing writers.
5. Give each role the minimum useful context and source access. Use snapshots/worktrees only when a real
   containment/read-only/concurrency need exists.

## Debate

### 1. Draft
Reuse the existing plan if one is already under review; do not commission a second draft merely to start debate.
The author states the outcome, scope/exclusions, proposed steps or delivery slices, dependencies, material decisions,
assumptions, risks, verification strategy, conditional recovery/rollback needs and open questions. Consequential
factual premises carry source locators where useful. Unknowns stay unknown.

### 2. Challenge
When continuing an existing review, reuse its finding as the initial challenge and the author's reasoned objection
as the first response. Continue at the unresolved claim; do not request another initial review or wait for another
reviewer refusal just to satisfy this section's sequence.
Give the reviewer the plan, requirements/scope, relevant design constraints and source access needed to verify
material premises. Avoid persuasive author framing and collect the reviewer's initial evidence-grounded findings before sharing an author's defense or starting response rounds; this is a critique of the plan, not a request to redesign the feature independently. Ask for numbered findings with:
- classification: **Observed contradiction**, **Concern**, or **Unsupported assertion**;
- evidence locator/revision or explicit evidence gap;
- impact;
- recommended check/change.

The reviewer should seek contradictory evidence for material claims when warranted and must not invent requirements,
citations or test results.

### 3. Independent check when justified
A separate reviewer may assess the plan and first review independently. Give it the plan and evidence, not a merged
persuasive narrative. Preserve its findings/limits separately. Skip this stage when it adds little value.

### 4. Author response
Route each finding back to the same author role. For every finding: accept/revise, reject with evidence, or leave open
with the missing check/decision. Preserve attribution and disagreement. If revision changes a material premise,
re-check only the affected parts rather than restarting everything.

### 5. Stop or escalate
The author cannot unilaterally close a consequential finding while the reviewer still identifies an unresolved
problem. If it remains disputed, pause affected work and return both positions, evidence, alternatives and a
recommendation to the owner. Genuinely independent authorized work may continue. Resolution needs evidence or an
applicable owner decision, not merely someone yielding. Stop cycling when another round is not changing a material issue. Repeated equivalent failure should revisit the
diagnosis/evidence or change strategy rather than loop indefinitely. Escalate only material contested choices,
unresolved requirements, consequential unsupported assumptions, or changes outside the current authorization.

## Outputs and boundaries

Return the settled plan, participant ledger, unresolved items and verification/evidence limits to the calling workflow.
Update the project's compact scratchpad only with the resulting execution state that matters (for example plan ready,
material decision pending, next action), not the full debate transcript.

This skill does not implement code, approve design on someone's behalf, create a PR, perform durable write-backs or
trigger closeout. `work-closeout` handles genuinely completed bounded work; `handoff` is only for real transfer
friction. For one-shot plan feedback use `plan-review`; code/PR review remains separate.
