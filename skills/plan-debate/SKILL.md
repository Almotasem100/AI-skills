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

1. Read applicable project constraints and preserve the calling workflow's plan author and a challenge reviewer
   distinct from the author. Do not dispatch a replacement author or select models/routes here; the caller supplies
   participants and execution mechanism. Reuse an existing review's participants when continuing its disagreement.
2. Gather the plan and authorized original sources needed to test disputed premises. Prior findings are leads,
   not authority; record relevant evidence gaps and revision/state.
3. Use one approved temporary debate record for attributed findings/responses. Keep normal execution state compact;
   do not duplicate requirements or overwrite another participant's work. The author owns plan mutations and
   reviewers own findings; return results to the caller for coordination.
4. Give participants minimum useful context and original-source access. Use snapshots/worktrees only for a real
   containment or concurrency need. A separate session alone does not guarantee independent reasoning.

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
