---
name: task-context
description: Preserve fragmented task inputs, source references, approved scope, consequential clarification Q&A, decisions and unresolved questions in one temporary intake-first record for downstream work. Use when several inputs or participants need a shared intake; skip simple tasks whose inputs are already clear.
---

# Task context

Create or refresh one intake-first record, not another design, plan or permanent project document. Preserve what
was supplied, asked and decided without making the intake author's technical interpretation the default handoff.
When the project has a Feature / Delivery Slice hierarchy, keep one feature-level context and reference it from
slice assignments. The scratchpad tracks execution progress and next action; this record preserves intake and
source navigation. Keep the existing skill name and approved artifact path; no second mandatory document is needed.

## Gather and record

Read the available, authorized requirements, consequential grilling answers, relevant visual evidence, project
rules and supplied source observations. Inspect additional code only to resolve a consequential intake question;
do not start a broad technical survey to fill the record or repeat adequately evidenced, current investigation.

Use `references/task-context-template.md` or the project's equivalent. Cover five flexible sections:

1. **Objective and approved scope:** requested outcome, supplied rationale, explicit in/out boundaries and
   consequential approved behavior/constraints, with their sources. Do not infer business rationale from code.
2. **Source inventory:** pointers to original requirements, visual inputs, canonical rules and relevant existing
   artifacts, with sections/pages and revision/state where useful. A list of filenames is not a technical summary.
3. **Clarification Q&A and decisions:** preserve consequential original questions and answers with enough wording
   to retain qualifiers, conditions and intent. Attribute approvals; mark corrections and superseded decisions
   clearly so old answers cannot regain authority. Do not turn an author's suggested solution into approval.
4. **Open questions and conflicts:** undecided behavior, contradictory sources and unverified premises, with
   source pointers. Keep uncertainty explicit; do not silently resolve it or create questions just for completeness.
5. **Consequential observations (only when needed):** retain a sourced observation or cross-source concern that
   would otherwise be easy to lose and could change a consequential decision. Separate observation from inference,
   state uncertainty and the question to verify, and do not prescribe an implementation. Combining facts into a
   concern is allowed; treating that concern as established behavior is not.

State each item once in the most useful section. Omit empty sections; add subheadings only when they help.
Do not copy whole PDFs, transcripts, screenshots, code or design/plan documents. Preserve source terminology and
consequential Q&A faithfully; concision must not erase exclusions, meaningful visual constraints or owner decisions.
Do not routinely add architecture overviews, reuse recommendations, solution proposals or a broad code digest to
the initial handoff. Approved technical constraints still belong with their source; this boundary must not discard
critical evidence merely because it is technical. Source selection and Q&A can still frame the recipient's view;
an intake-first record reduces inherited interpretation, not all bias.

## Evidence and gaps

Keep supplied facts, approved decisions, observations, inferences and open questions distinguishable in the text.
Keep estimates/targets separate from measured or verified outcomes, wherever they belong; preserve qualifiers
such as expected, estimated, reported and observed. Never invent requirements, rationale, results or approval.
When sources conflict, retain the conflict and references rather than silently resolving it.

Attach precise source pointers near consequential findings (path, symbol/section/page and revision when useful).
A source map is navigation, not proof of an interpretation. Canonical requirements and project rules remain
authoritative; recipients verify consequential claims against those sources as needed, not reread every input
merely because they received a context file. Respect project data-sharing rules; never copy secrets/credentials.

Surface consequential unresolved gaps to the caller for targeted grilling/decision work. This is intake capture,
not another interview: do not ask questions merely to fill the template or restart unrelated workflow stages.

## Save and maintain

Use the project's approved working-artifact location. If none exists, present the context in chat or write only
to an explicitly approved path. Do not promote it into durable documentation automatically.

Update affected scope, decisions and uncertainty when materially changed; label superseded decisions rather than
leaving contradictory answers active. Link to current design, plan, review and verification artifacts instead of
copying them. An artifact change alone does not require rewriting intake; do not append a chronological log.
Completing a slice does not retire the record while the parent feature remains active.

If later work genuinely needs established technical understanding across slices, participants or compaction, add
a concise, clearly labeled later working synthesis to this same artifact, with source/state and uncertainty.
Do not create it automatically, present it as original intake, or require another maintained document. Older rich
task-context files remain usable: distinguish their technical synthesis from approved inputs and follow sources
for consequential claims; no blanket rewrite or deletion is needed.

Downstream assignments receive this context plus the additional sources/artifacts their responsibility needs.
It supports, but does not replace, requirements, Functional Design/LLD, implementation plans or verification evidence.
