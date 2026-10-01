---
name: plan-review
description: Read-only, one-model critique of a proposed plan before implementation. Use when the user asks to review, challenge, or sanity-check a plan, working session scratchpad, or existing handoff for contradictions, unsupported claims, missing decisions, and risks; do not use for code or PR review or a multi-reviewer debate.
---

# Plan review

Critique the proposed approach before work begins. Inspect and report; do not rewrite the plan, decide on the
owner's behalf, or treat a clean review as proof that the plan is safe. This is a single review, not a debate.

## Inputs and boundaries

- Accept the plan directly, whether supplied as text, a working session scratchpad, or an existing handoff. Do
  not require a separate implementation brief or copy the input into a new artifact.
- Read applicable project instructions and the relevant source files, slides, tickets, and decisions that are
  supplied or clearly referenced and accessible. Keep the search within the proposed work's scope. If a source
  is unavailable, identify the gap rather than guessing what it says or claiming to have verified it.
- A working session scratchpad may combine task notes, source references and necessary excerpts, grill answers,
  findings, draft plan, reviewer comments and responses, decisions, and unresolved questions. Use these to
  follow the reasoning, but distinguish working notes and summaries from the underlying sources. Preserve the
  links to source files, slide numbers, ticket sections, or other locators; verify against the source when a
  claim needs that evidence. Do not treat a draft or reviewer response as an approved decision.
- The scratchpad is a working draft, not a project document of record or a substitute for a task handoff or
  session closeout. This skill never edits the scratchpad, plan, handoff, code, or project documents, and never
  proposes applying document changes without owner approval.

## Review

1. Identify the proposed outcome, scope, constraints, sequence, dependencies, verification/rollback approach
   where relevant, and who must make each unresolved decision. Separate explicit decisions from assumptions.
2. Compare consequential claims with the available primary sources. Cite both sides of a conflict. For a
   cited excerpt or summary, check the original when accessible; otherwise mark source verification pending.
   Do not invent citations, requirements, or acceptance criteria.
3. Challenge feasibility, ordering, omitted dependencies, failure/rollback paths, and verification gaps only
   where they matter to the plan. Do not perform a general implementation-code review or PR review.
4. Classify each finding accurately:
   - **Observed contradiction:** two inspected sources, or the plan and an inspected source, disagree; identify
     both locations and the precise disagreement.
   - **Concern:** a plausible risk or gap, with the observed basis and the condition under which it matters;
     do not present a prediction as a fact.
   - **Unsupported assertion:** a consequential statement lacks adequate accessible evidence; say what source
     would establish it, without asserting it is false.
5. Prioritize findings by impact on the proposed work: blockers first, then material risks, then minor issues.
   Offer a concrete recommendation or smallest next check for each; leave design and approval choices to the
   owner. Do not manufacture findings to fill a category.

## Response

Return a concise review in the conversation, not edits to files:

- **Findings (highest priority first):** severity, classification, the specific claim or step, evidence with
  source locator(s) (or an explicit verification gap), impact, and recommended next action. Cite plan/scratchpad
  locations as well as primary sources where available; do not use a summary as proof of its own claim.
- **Assumptions and missing decisions:** what the plan assumes, what remains undecided, and who should resolve
  it if known. Keep these distinct from observed contradictions.
- **Risks and questions:** residual risks after proposed fixes and a short, prioritized set of questions for
  the owner. Do not silently answer open questions or turn a suggested choice into an approved one.

If no blocker is found, say only that none was found in the inspected material, name significant unverified
sources or limits, and leave the go/no-go decision with the owner. Do not dispatch other reviewers or implement
anything as part of this skill.
