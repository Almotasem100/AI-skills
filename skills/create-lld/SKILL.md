---
name: create-lld
description: Create concise feature-level design artifacts: a forward architect-facing LLD before planning/implementation and, when required, a customer-facing Functional Design. Support an as-built Technical Design only when the active project explicitly requires one. Use task context and source evidence internally without leaking evidence inventories into the deliverable.
---

# create-lld

Use this skill for one **feature / parent work item**. A project may map that to Jira or another tracker. If the
feature is delivered through several internal delivery slices, keep one feature-level LLD rather than splitting the
design by child ticket IDs unless the project explicitly requires otherwise.

## Artifact roles
- **Functional Design:** customer/business-facing observable behavior; create only when required/requested.
- **LLD:** architect-facing forward design before the implementation plan.
- **Implementation plan:** separate artifact; may decompose the feature into delivery slices.
- **Technical Design:** optional as-built artifact only when the active project/team explicitly requires one.

## Deliverable rules
1. Use the project-approved parent feature identifier and terminology. Do not expose internal delivery-slice IDs in
   customer/architect deliverables unless the project requires them.
2. Use task-context as a navigation map when available, then verify consequential claims against authoritative
   sources. Do not dump task-context evidence classes, source maps, attachment names/pages or code-location
   inventories into the deliverable.
3. Inspect relevant source internally as needed; keep file/line evidence in working notes.
4. Be concise. Do not repeat the same requirement across sections merely to fill the template. Omit conditional
   sections that add no value.
5. Never invent requirements, components, endpoints, release/sprint metadata, decisions, measurements, rollout
   mechanics, test results or questions merely because a template has a heading.
6. Ask only about unresolved consequential behavior/design decisions. Omit nonessential metadata when absent.

## Forward LLD
Read feature requirements, project instructions and existing feature task-context when available. Inspect current
architecture/source only as needed. Resolve only consequential ambiguity.

Draft one concise feature-level LLD. Core content is Context, Objectives & constraints, applicable design boundaries,
and Material decisions. Impact/risks, verification intent, rollout/rollback and open questions are conditional and
appear only when materially relevant. Verification stays at design-intent level; concrete commands belong in the
implementation plan/workflow.

## Functional Design
Create only when required/requested.
- Functional requirements state **what** behavior exists.
- User flows explain meaningful interaction sequence, not a paraphrase of every requirement.
- Business rules capture conditions/permissions that affect behavior.
- States/actions include meaningful loading/empty/error/disabled/permission states only.
- Acceptance criteria are externally testable completion conditions, not duplicates of requirements.
- Omit empty sections and absent optional release/sprint metadata.

## Optional as-built Technical Design
Only when project instructions/team practice explicitly require it. Inspect approved design/plan, delivered change
and real verification evidence; describe verified logical boundaries and material approved deviations; report only
checks that actually ran. Do not create it merely because implementation finished.

## Check and present
- Run `node <skill-dir>/scripts/check-lld.mjs <lld.md> --size <small|normal>` for an LLD. A structural pass is not
  a content-quality or architect-approval result.
- Manually check Functional Design against approved feature behavior.
- Present requested artifacts for the applicable project review/approval boundary.

## Files
- `templates/lld-section.md`
- `templates/functional-design.md`
- `templates/technical-design.md` — optional/project-required only
- `scripts/check-lld.mjs`
- `scripts/slides.mjs`
- `references/writing-guide.md`
- `references/example-lld.md`
