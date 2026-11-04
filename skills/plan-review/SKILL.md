---
name: plan-review
description: Read-only critique of a proposed plan or planning record before implementation. Use for review, challenge or sanity-check requests about contradictions, unsupported claims, missing decisions, dependencies, verification gaps and risks; not code/PR review or a multi-reviewer debate.
---

# Plan review

Inspect the proposed approach and return evidence-backed findings. Do not rewrite the plan, make owner decisions,
implement recommendations or dispatch other reviewers. The calling workflow owns participants and progression;
a clean review is not proof of safety or a new approval gate.

## Inputs and access

Accept plan text, a file, planning record or existing handoff; no separate implementation brief is required.
Read relevant authorized original requirements, project rules, approved constraints and sources. Intake Q&A/source
pointers are navigation, not a mandatory technical synthesis: do not treat a sourced concern as an approved
requirement. If evidence is unavailable or contradictory, state the gap rather than guessing.

Keep the plan, sources, code, durable documents and scratchpad read-only. Use supported reviewer restrictions and
apply the calling workflow/project's actual boundary requirements. A snapshot stabilizes inputs but does not enforce
filesystem containment; disclose enforcement limits without claiming isolation or inventing a stronger gate.

## Review

- Identify the outcome, scope/exclusions, approach, dependencies, sequence/slices, assumptions, open decisions and
  verification/recovery strategy. Focus on consequential gaps; do not manufacture findings.
- Verify material premises against current primary sources and look for contradictory evidence where warranted.
  A citation is navigation, not proof; distinguish owner-approved requirements from author recommendations.
- Classify findings as **Observed contradiction**, **Concern**, or **Unsupported assertion**, with the affected
  claim, severity/impact, source locator or evidence gap, and the smallest useful correction/check.
- Prioritize blockers and material risks before minor issues. New evidence can challenge a settled choice but
  does not authorize the reviewer to execute a deviation or demand unrelated documentation.

For architectural/transition plans, inspect actual owners and callers, whether a smaller design meets the need,
and disposition of superseded paths/tests/docs. Challenge blind deletion, unsupported shared abstractions or
mandatory splitting. Check whether verification reaches the real UI/HTTP/task entry and relevant failure/retry
paths; a tested helper alone is not end-to-end evidence. Apply these questions only where risk warrants them.

## Findings and output

Return findings, separate assumptions/open decisions, and material source/runtime verification limits. If no blocker
is found, say so within the inspected scope. Return findings through the caller to the actual plan author for
reasoned disposition and any affected-material recheck; standalone review does not require a revision.

Default to returning findings directly. If explicitly requested, write the same findings as Markdown to one designated
temporary output path, including the reviewed plan path/revision when useful, only when output-only access is safely
permitted. That file is the sole write exception; do not relax permissions or overwrite another reviewer's work.
Otherwise the caller saves returned findings. Keep normal resume state compact, with links rather than full reviews.
