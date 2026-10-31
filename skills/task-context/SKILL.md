---
name: task-context
description: Synthesize fragmented task evidence into a shared, temporary working context for design, planning, implementation, testing, review, and PR-description work. Use when requirements, grilling decisions, UX evidence or technical findings are spread across inputs, or several participants need the same understanding; skip simple tasks whose context is already clear.
---

# Task context

Create or refresh a shared understanding of the task, not another design, plan or permanent project document.
When the project has a Feature / Delivery Slice hierarchy, keep one feature-level context and reference it from
slice assignments. The scratchpad tracks execution progress and next action; this context preserves understanding.

## Gather and synthesize

Read the available, authorized requirements, consequential grilling answers, relevant visual evidence, project
rules and source findings. Inspect additional code only where needed to understand behavior or constraints;
do not repeat an investigation whose findings are already adequately evidenced and current.

Use `references/task-context-template.md` or the project's equivalent. Cover five flexible sections:

1. **Objective and scope:** requested outcome, supplied business rationale, affected users/processes and explicit
   exclusions. Do not infer business rationale from the implementation.
2. **Approved behavior and decisions:** requirements, business rules, meaningful UX/visual conclusions,
   acceptance criteria and consequential owner decisions. Preserve the clarification question and answer, or an
   unambiguous sourced decision summary, when the answer alone would lose meaning.
3. **Relevant current-system findings and constraints:** existing behavior, reusable components and material
   architecture, API, data, security or platform boundaries. Distinguish what exists from what is requested.
4. **Open questions and assumptions:** unresolved conflicts, consequential gaps and unverified premises.
   Include an evidence-backed author observation only when useful; label it as a proposal, never approval,
   and leave solution development to design/planning rather than drafting a competing plan here.
5. **Source references:** a compact map to the authoritative inputs and current working artifacts.

State each item once in the most useful section. Omit empty sections; add subheadings only when they help.
Summarize conclusions rather than copying PDFs, transcripts, screenshots, code or whole design/plan documents.
Preserve source terminology and enough detail for downstream work; concision must not erase requirements,
exclusions, meaningful visual constraints or consequential owner decisions.

## Evidence and gaps

Keep facts, approved decisions, assumptions, proposals and open questions distinguishable in the text.
Keep estimates/targets separate from measured or verified outcomes, wherever they belong; preserve qualifiers
such as expected, estimated, reported and observed. Never invent requirements, rationale, results or approval.
When sources conflict, retain the conflict and references rather than silently resolving it.

Attach precise source pointers near consequential findings (path, symbol/section/page and revision when useful).
A source map is navigation, not proof of an interpretation. Canonical requirements and project rules remain
authoritative; recipients verify consequential claims against those sources as needed, not reread every input
merely because they received a context file. Respect project data-sharing rules; never copy secrets/credentials.

Surface consequential unresolved gaps to the caller for targeted grilling/decision work. This is synthesis,
not another interview: do not ask questions merely to fill the template or restart unrelated workflow stages.

## Save and maintain

Use the project's approved working-artifact location. If none exists, present the context in chat or write only
to an explicitly approved path. Do not promote it into durable documentation automatically.

Update the affected content when task understanding materially changes. Link to the current design, plan,
reviews and verification records for their details; an artifact change alone does not require rewriting context.
Replace stale understanding instead of appending a chronological log. Completing a slice does not retire context
while the parent feature remains active.

Downstream assignments receive this context plus the additional sources/artifacts their responsibility needs.
It supports, but does not replace, requirements, Functional Design/LLD, implementation plans or verification evidence.
