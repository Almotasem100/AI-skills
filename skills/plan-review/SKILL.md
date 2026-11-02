---
name: plan-review
description: Read-only, one-model critique of a proposed plan before implementation. Use when the user asks to review, challenge, or sanity-check a plan or dedicated planning record for contradictions, unsupported claims, missing decisions, dependencies, verification gaps, and risks; do not use for code/PR review or a multi-reviewer debate.
---

# Plan review

Critique the proposed approach before work begins. Inspect and report; do not rewrite the plan or decide on the
owner's behalf. Return control to the calling workflow, which owns review/debate progression and role assignments.
A clean review is not proof of safety.

## Inputs and boundaries

- Accept the plan directly, whether supplied as text, a plan file, a dedicated temporary planning record, or an
  existing handoff. Do not require a separate implementation brief.
- A project's normal scratchpad is compact execution/resume state. It may identify the active work item, stage,
  decisions, blockers and next action, but do not expect or encourage it to contain the full plan, evidence excerpts
  or review exchange.
- Read applicable project instructions and the relevant authoritative sources clearly referenced by the plan.
  Keep the search within scope. If a source is unavailable, identify the gap rather than guessing.
- Distinguish working notes/summaries and their author's recommendations from approved requirements or decisions. Preserve source locators and revision/state for consequential
  claims when useful; a locator is navigation to evidence, not proof of the interpretation.
- Use intake Q&A and source pointers without expecting a prewritten technical synthesis. Verify consequential
  concerns against originals and challenge the plan's framing where evidence warrants it; do not treat a sourced
  concern as an approved requirement or demand a second context artifact merely to review.
- This skill is read-only. It does not edit the plan, project scratchpad, handoff, code or durable project documents.
  Use the supported enforced read-only boundary when required. A snapshot stabilizes inputs; it does not enforce
  filesystem containment. Report a missing required boundary rather than claiming it from the absence of edits.

## Optional review artifact

- **Default:** return concise findings to the calling workflow; do not create a file merely because a review ran.
- When the caller requests a reusable review artifact (e.g., a substantive review, comparison between independent reviewers, or an author revision), produce the same structured findings as Markdown at **one explicitly designated temporary output path** in the approved working area. Record the reviewed plan path and revision/hash when available. Do not create a second project-of-record document or overwrite another reviewer's output.
- **Read-only review still applies:** never edit the reviewed plan, source, requirements, normal scratchpad, or durable project documents. A designated temporary output file is the sole permitted write for this mode, and only when the execution boundary can enforce or safely scope it.
- If the reviewer is restricted to strict read-only access or output-only write permission cannot be assured, return the structured findings to the caller, which may save them to the designated path. Do not relax general filesystem permissions just to generate the artifact.
- When a file is produced, return its path, status, material blockers and verification limits. The downstream plan author should read that file directly rather than receive a rewritten copy of the entire critique. When no file is produced, the normal direct findings remain authoritative for that review.

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

## Architecture and transition checks (when applicable)

For a plan that changes architectural responsibilities or replaces an existing workflow:

- Identify the actual owners and relevant current callers from source; challenge unsupported new services, facades, shared primitives or mandatory splitting. Ask what present coupling/change cost the abstraction removes, whether a smaller local design works, and what necessary guarantee could be lost by simplification.
- If a prior design is superseded, look for an explicit disposition of old execution paths, related tests, readers and documentation: active, compatibility/historical, deferred or obsolete. Do not recommend blind deletion from a filename or apparent non-use.
- Check that verification reaches the real consumer entry point and meaningful failure/retry/uncertain paths. A tested helper not wired to a visible control, HTTP route or worker is not end-to-end evidence.

Apply only when relevant to the proposed change. Record specific concerns with evidence; do not create additional checklists or a blanket refactoring requirement.

## Response

Return a concise review to the calling workflow (directly by default, or through the optional designated Markdown artifact):

- **Findings:** severity, classification, affected step/claim, evidence locator or explicit evidence gap, impact and
  recommended next action.
- **Assumptions / unresolved decisions:** keep these separate from observed contradictions.
- **Verification limits:** relevant sources or runtime checks that were unavailable.

Return findings to the actual plan author through the caller for disposition and any affected-material recheck.
Do not implement recommendations or demand unrelated documentation. Standalone review does not require a plan
revision or start another participant; the calling workflow decides progression under its applicable rules.

If no blocker is found, say that none was found in the inspected material and name significant limits. Return control
to the calling workflow. A clean review neither proves safety nor creates a new approval gate inside an already
authorized parent workflow. This skill does not implement anything or dispatch additional reviewers.
