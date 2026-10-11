---
name: plan-review
description: Read-only, one-model critique of a proposed plan before implementation. Use when the user asks to review, challenge, or sanity-check a plan or dedicated planning record for contradictions, unsupported claims, missing decisions, dependencies, verification gaps, and risks; do not use for code/PR review or a multi-reviewer debate.
---

# Plan review

Critique the proposed approach before work begins. Inspect and report; do not rewrite the plan, decide on the
owner's behalf, or treat a clean review as proof that the plan is safe. This is a single review, not a debate.

## Inputs and boundaries

- Accept the plan directly, whether supplied as text, a plan file, a dedicated temporary planning record, or an
  existing handoff. Do not require a separate implementation brief.
- A project's normal scratchpad is compact execution/resume state. It may identify the active work item, stage,
  decisions, blockers and next action, but do not expect or encourage it to contain the full plan, evidence excerpts
  or review exchange.
- Read applicable project instructions and the relevant authoritative sources clearly referenced by the plan.
  Keep the search within scope. If a source is unavailable, identify the gap rather than guessing.
- Distinguish working notes/summaries from authority. Preserve source locators and revision/state for consequential
  claims when useful; a locator is navigation to evidence, not proof of the interpretation.
- This skill is read-only. It does not edit the plan, project scratchpad, handoff, code or durable project documents.
  Use enforced read-only access or an immutable snapshot only when a real containment boundary requires it.

## Review

1. Identify the proposed outcome, scope/exclusions, sequence, delivery slices if any, dependencies, verification
   strategy, material rollback/recovery needs, assumptions and unresolved decisions.
2. Compare consequential premises with available primary sources. Re-check important references rather than accepting
   prior findings as authority; note stale/unverified evidence explicitly.
3. Challenge feasibility, ordering, omitted dependencies, unsupported scope, unsafe sequencing and verification gaps
   only where they matter. Do not manufacture findings.
4. Classify findings accurately:
   - **Observed contradiction:** inspected sources or the plan and an inspected source disagree.
   - **Concern:** plausible risk/gap with observed basis and the condition under which it matters.
   - **Unsupported assertion:** a consequential statement lacks adequate accessible evidence.
5. Prioritize blockers first, then material risks, then minor issues. Give the smallest concrete recommendation or
   next check for each.
6. A reviewer may challenge an existing approved choice when new evidence materially undermines its premise, but does
   not execute a material deviation on its own.

## Response

Return a concise review in the conversation:

- **Findings:** severity, classification, affected step/claim, evidence locator or explicit evidence gap, impact and
  recommended next action.
- **Assumptions / unresolved decisions:** keep these separate from observed contradictions.
- **Verification limits:** relevant sources or runtime checks that were unavailable.

If no blocker is found, say that none was found in the inspected material and name significant limits. Return control
to the calling workflow. A clean review neither proves safety nor creates a new approval gate inside an already
authorized parent workflow. This skill does not implement anything or dispatch additional reviewers.
