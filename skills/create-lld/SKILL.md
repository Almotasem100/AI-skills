---
name: create-lld
description: Create concise design artifacts for one Jira ticket: a forward LLD before the plan/implementation, an optional customer-facing Functional Design, or an as-built Technical Design after implementation. Uses requirements and source code internally for accuracy but keeps attachment citations and source-file paths/lines out of deliverables.
---

# create-lld

Use this skill for one Jira ticket. A ticket may contain multiple stages or implementation slices; cover the approved ticket scope in one LLD rather than splitting it by internal/CB tracking IDs.

## Artifact roles and timing

- **Functional Design (customer-facing):** what users and business processes will observe. Create it when the project workflow requires it or the owner asks. It may be included with the customer requirements document. Do not repeat Purpose/Scope already present there; do not add Status or a link to the LLD.
- **LLD (architect-facing, forward):** before plan approval and implementation. State the intended scope and essential component/API boundaries. This is a concise proposed design, not an as-built account.
- **Plan:** a separate artifact/workflow after the LLD is approved. It sequences work, dependencies, verification and gates; this skill does not write or approve it.
- **Technical Design (architect-facing, as-built):** after implementing the approved plan. Describe the delivered solution and material differences from the approved LLD/plan, then submit it for Architect review. Do not generate it during forward LLD work.

## Deliverable rules

1. Use the Jira ticket ID as the only ticket identifier in deliverables. Do not include internal/CB ticket IDs or describe internal ticket breakdowns.
2. Read supplied requirements, screenshots, PDFs, slides, CSS, code and project instructions as needed. If a
   `task-context` working synthesis exists, use it as the navigation map for the task, then verify consequential
   claims against authoritative sources as needed. Treat all of these as working inputs only; do not mention or
   cite input artifact names/pages in the deliverables.
3. Inspect relevant source code and verify consequential claims internally. Do not include source-code filenames, paths, line numbers, or code-location inventories in the deliverables. Keep evidence in the project's working notes when its workflow provides them.
4. Keep each artifact concise and focused on what is required or planned. Avoid repeating scope already in the customer requirements, long rationale, rejected-option essays, and speculative implementation detail. Include only enough component/API-boundary information for an Architect to assess the LLD or Technical Design.
5. Never invent requirements, decisions, names, endpoints, measurements, implementation details, or test results. Ask the owner about consequential gaps, one at a time, and keep artifacts in Draft until approved.

## Forward mode: LLD before implementation

1. Read the Jira ticket, applicable project instructions, supplied requirements, and an existing task-context
   synthesis when available. The task context helps avoid rereading every raw input, but it does not replace
   authoritative requirements. Use supporting artifacts as evidence internally; do not cite them in the LLD or
   Functional Design.
2. Inspect relevant code and architecture as needed. Record source locators in working notes, not in customer/architect deliverables.
3. Grill only unresolved decisions that affect scope, user behavior, data/API contracts, permissions, or acceptance. Respect project approval gates.
4. Draft one concise LLD for the Jira ticket, covering all approved stages in that ticket. Name logical components and API boundaries where useful; do not give code file paths or line citations.
5. Draft the Functional Design separately when required/requested. Describe visible behavior, business rules, flows, and acceptance outcomes. Do not include implementation details, source citations, a Status field, a Related LLD field, or a duplicate Purpose/Scope section.
6. Keep both as Draft. Do not write the plan, implement, or mark approval without the owner's direction.

## Technical Design mode: after implementation

1. Read the approved LLD and plan, then inspect the completed change and verification evidence.
2. Write one concise, as-built Technical Design for the same Jira ticket. Summarize delivered components, API/data boundaries, user-visible outcomes, important differences from the approved design, and verified checks.
3. Do not cite attachments or source-code files/lines. Do not present unrun checks as passed or invent reasons for deviations.
4. Keep it in review until the Architect has reviewed it; do not claim approval on the Architect's behalf.

## Check and present

- Run `node <skill-dir>/scripts/check-lld.mjs <lld.md> --size <small|normal>` and fix errors. Report any remaining warnings and validation limits.
- Manually check the Functional Design against the approved Jira behavior; the checker validates only the LLD.
- Present the requested artifact(s) for owner approval. Ask only the next necessary question and wait at approval gates.

## Inputs

- Jira ID and pasted ticket title/description/acceptance criteria (ticket systems may not be reachable).
- Project instructions and approved requirements; an optional task-context working synthesis; optional supporting
  artifacts and source code for internal inspection.
- Release/sprint, tech designer names, and approved save location when applicable.
- For Technical Design mode: approved LLD/plan, implemented change, and verification evidence.

## Files

- `templates/lld-section.md`: concise forward LLD format.
- `templates/functional-design.md`: customer-facing behavior format.
- `templates/technical-design.md`: concise as-built design format.
- `scripts/check-lld.mjs`: checks the LLD structure and metadata.
- `scripts/slides.mjs`: optional internal extraction helper for `.pptx` requirements; its outputs are not deliverable citations.
- `references/writing-guide.md` and `references/example-lld.md`: writing rules and synthetic example.
