---
name: plan-review
description: Read-only critique of a proposed plan, forward technical design or planning record before implementation. Use for review, challenge, comprehension, simplicity or implementation-readiness checks. Return source-grounded contradictions, missing decisions and verification gaps; not code/PR review or a multi-reviewer debate.
---

# Plan review

Inspect the proposed approach and return evidence-backed findings. Do not rewrite the plan, make owner decisions,
implement recommendations or dispatch other reviewers. The calling workflow owns participants and progression;
a clean review is not proof of safety or a new approval gate.

## Inputs and access

Accept a plan, forward technical design, planning record or existing handoff, plus any requested review focus;
no separate implementation brief or merged design/plan document is required. Review only applicable aspects of the
artifact: missing execution steps in a forward design are not automatically a defect.
Read relevant authorized original requirements, project rules, approved constraints and sources. Intake Q&A/source
pointers are navigation, not a mandatory technical synthesis: do not treat a sourced concern as an approved
requirement. If evidence is unavailable or contradictory, state the gap rather than guessing.

Keep the plan, sources, code, durable documents and scratchpad read-only. Enforce this with the reviewer's
supported restrictions and any boundary the calling workflow or project states. A snapshot stabilizes inputs but does
not enforce filesystem containment; state enforcement limits rather than claiming isolation.

## Establish understanding

For a substantial artifact, first reconstruct the proposed behavior, relevant current behavior and important
scope/constraints in a short paragraph from the target and its declared references. Mark what those materials do
not explain before consulting separate requirements or decisions; do not silently repair the explanation from
earlier conversation or a persuasive author summary. Then check the reconstruction against authorized primary
sources and distinguish a document gap from a mistaken reading. A reconstruction is not approval of the proposal.
For tiny reviews, the finding itself may demonstrate understanding without another summary.

The caller supplies any fresh review session. Do not claim a blind comprehension check if prior conversation,
memory or author explanations were available; disclose that limit. A specifically required fresh-context check
remains incomplete when freshness cannot be established. Fresh conversation does not imply instruction-file or
filesystem isolation.

## Review

- Identify the outcome, scope/exclusions, approach, dependencies, sequence/slices, assumptions, open decisions and
  verification/recovery strategy. Focus on gaps that would change the outcome; do not manufacture findings. Use the requested focus
  or applicable questions in `references/review-lenses.md`, without adding reviewers or a fixed stage sequence.
- Verify material premises against current primary sources and look for contradictory evidence where warranted.
  A citation is navigation, not proof; distinguish owner-approved requirements from author recommendations.
- Classify findings as **Observed contradiction**, **Concern**, or **Unsupported assertion**, with the affected
  claim, severity/impact, source locator or evidence gap, and the smallest useful correction/check.
- Prioritize blockers and significant risks before minor issues. New evidence can challenge a settled choice but
  does not authorize the reviewer to execute a deviation or demand unrelated documentation.

For architectural/transition plans, inspect actual owners and callers, whether a smaller design meets the need,
and disposition of superseded paths/tests/docs. Challenge blind deletion, unsupported shared abstractions or
mandatory splitting. Check whether verification reaches the real UI/HTTP/task entry and relevant failure/retry
paths; a tested helper alone is not end-to-end evidence. Apply these questions only where risk warrants them.

## Findings and output

Name the reviewed artifact revision or current state, inspected sources and any material unreadable/missing inputs.
Use stable finding labels when issues carry across rounds; keep author responses and rechecks tied to the same issue.
Re-read affected current sections before judging a revision instead of trusting old line ranges. Recheck whether
material corrections introduced new complexity, scope or contradictions; reopen a rejected finding only with new
evidence, and a supposedly fixed finding when its underlying issue remains or recurs.

Return findings, separate assumptions/open decisions, and material source/runtime verification limits. If no blocker
is found, say so within the inspected scope. Return findings through the caller to the artifact's author (the plan author for a plan) for a reasoned disposition and
a recheck of affected sections; a standalone review does not require a revision. A missing result or a required source
that cannot be read makes the affected review incomplete, not clean; report useful partial findings
without implying full coverage. Stop when material findings are resolved or explicitly dispositioned under the
calling workflow; no required count of clean rounds and no automatic new approval checkpoint.

Default to returning findings directly. If explicitly requested, write the same findings as Markdown to one designated
temporary output path, including the reviewed plan path/revision when useful, only when the reviewer has output-only access. That file is the sole write exception; do not relax permissions or overwrite another reviewer's work.
Otherwise the caller saves returned findings. Keep normal resume state compact, with links rather than full reviews.
