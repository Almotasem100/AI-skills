---
name: task-context
description: Synthesize fragmented task evidence into one rich, temporary working context for downstream planning, design, implementation, testing, review, and PR-description work. Use when a task has multiple requirements sources, grilling decisions, screenshots/CSS, business rationale, constraints, or several downstream consumers that should not each reread all raw inputs.
---

# task-context

Create or refresh a **working synthesis**, not a human-facing design document and not a new project-of-record file.

Use this skill when the task understanding is fragmented across several inputs or when multiple downstream roles
would otherwise need to reread the same raw evidence. Skip it for simple tasks whose objective, expected behavior,
constraints and rationale are already clear enough to carry directly.

## Role in the workflow

```text
raw task evidence
  -> grilling / clarification when needed
  -> task-context synthesis
  -> concise design artifacts / plan / implementation / tests / review / PR
```

This skill does **not** replace requirements, Functional Design, LLD, the implementation plan, the session
scratchpad, or canonical project documentation.

- Requirements and approved project documents remain authoritative sources.
- The session scratchpad remains compact coordination state.
- Human-facing Functional Design / LLD / Technical Design stay concise and audience-specific.
- The task context is a temporary, rich map of the task for AI/workflow consumption.

## Inputs

Use only inputs available and authorized for this task, for example:

- Jira/ticket title, description and acceptance criteria.
- Approved requirements, PDFs/slides and customer material.
- Grilling answers and explicit owner decisions.
- Screenshots, Figma evidence, copied CSS or other UX evidence.
- Relevant project instructions, architecture decisions and domain glossary.
- Relevant source-code inspection when needed to understand constraints or current behavior.
- Existing Functional Design / LLD / Technical Design / plan when refreshing context later.

Do not ingest unrelated session history or copy entire repositories merely because they are available.

## Output location

Prefer the project's approved working-artifact location. If the project defines no such location, present the
context in chat or write it only to an explicitly approved path.

The artifact is temporary working context. Do not silently promote it into permanent project documentation.

## Required structure

Use `references/task-context-template.md` unless the project defines an equivalent structure.

The synthesis should cover, when applicable:

1. **Objective** — the requested outcome.
2. **Business rationale** — why the work exists, who/processes are affected, and expected value.
3. **Approved requirements / behavior** — what must be true.
4. **Business rules / domain constraints**.
5. **UX / visual conclusions** — only the relevant conclusions from screenshots, Figma, CSS, etc.
6. **Technical constraints / boundaries** — architecture, API, data, security, compatibility or platform facts.
7. **Acceptance criteria / verification expectations**.
8. **Decisions already made** — including the decision owner where relevant.
9. **Non-goals / explicitly excluded scope**.
10. **Estimates / targets / measurements** — preserve their status exactly.
11. **Assumptions**.
12. **Unresolved questions / blockers**.
13. **Source map** — concise pointers to the authoritative evidence used.

Omit empty sections rather than filling them with noise.

## Evidence discipline

Keep these categories distinct:

- **Fact:** directly supported by authoritative evidence.
- **Decision:** explicitly approved/selected.
- **Estimate / target / expectation:** projected value, not an observed result.
- **Assumption:** plausible but not established.
- **Open question:** unresolved and consequential.

Never convert an estimate into a measured outcome. Preserve qualifiers such as `estimated`, `expected`,
`target`, `projected`, `reported`, and `observed`.

Examples:

- Good: `Requirements estimate a 20% reduction in development time; this is a target, not a measured result.`
- Bad: `The change reduces development time by 20%.`

When two sources conflict, record the conflict and source pointers. Do not silently reconcile them.

## Synthesis rules

- Summarize conclusions; do not duplicate full PDFs, slide decks, code listings or screenshots.
- Preserve the terminology used by approved requirements and project documents.
- Keep enough provenance that a downstream role can verify a consequential claim against the original source.
- Prefer the most authoritative/current source when several repeat the same fact, but note meaningful conflicts.
- Do not invent business rationale from implementation details.
- Do not invent expected behavior from the current code when requirements are missing.
- Do not turn implementation observations into approved requirements.
- Sensitive inputs remain subject to project data-sharing rules; never copy secrets or credentials.

## Questions and grilling

This is a synthesis skill, not another interview workflow.

If a consequential gap remains:
- record it under **Unresolved questions / blockers**;
- surface it to the orchestrator;
- let the normal grilling/decision workflow resolve it when required.

Do not start a long new interview merely to make every section complete.

## Updating the context

Refresh the same task context when material understanding changes:
- a requirement is clarified,
- an owner decision is made,
- implementation reveals an important constraint,
- a design is approved or materially revised,
- verification changes what is known.

Keep the artifact aligned with current approved understanding. Do not append an unbounded chronological log; the
scratchpad/history mechanism owns chronology.

## Downstream use

Downstream roles should receive this context plus only the additional artifact/source access their job needs.

Examples:
- **create-lld:** task context + authoritative sources as needed -> concise Functional Design / LLD.
- **planner:** task context + approved design -> implementation plan.
- **scenario-test-cases:** task context + approved requirements/design -> test scenarios.
- **implementer:** task context + approved plan + relevant source access -> bounded code change.
- **describe-pr:** task context for the Why, git/diff for What changed, verification evidence for Testing.

A downstream role must still verify consequential claims against canonical sources when precision matters.
