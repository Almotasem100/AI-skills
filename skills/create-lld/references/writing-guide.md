# Writing guide — concise design artifacts

- Functional Design: customer/business-facing observable behavior; create only when required/requested.
- LLD: architect-facing forward design before implementation planning.
- Technical Design: optional as-built artifact only when the project/team explicitly requires one.
- Implementation plan: separate artifact that sequences delivery slices, dependencies, branch/order strategy,
  implementation and concrete verification.

Rules:
1. Design at the parent-feature scope when a project uses feature + delivery-slice tracking.
2. Use project-approved identifiers; do not expose child-ticket mechanics unless the audience needs them.
3. Evidence is required for internal grounding, not automatically for display. Keep investigative file/line citations, evidence maps and source inventories in working notes or task-context. Include technical identifiers only when the document's audience needs them: generally none in customer-facing Functional Design; selected planned APIs, classes or logical paths in forward LLD; verified implementation identifiers where essential in an explicitly required as-built Technical Design. Avoid brittle source line references in durable prose unless an authoritative document contract expressly requires them. Do not remove meaningful requirement IDs, decision references, public API names or approved traceability.
4. Be concise. Do not repeat requirements in multiple sections or write alternatives essays/source inventories.
5. Omit conditional sections rather than inventing rollout, risks, questions, components or metadata.
6. Functional Design says **what** is observable; LLD says the intended **technical boundary**.
7. Preserve estimates/targets/assumptions as such. Never present proposed verification as passed.
8. Ask only about consequential ambiguity.

Run the structural LLD checker, then manually check concision, grounding and audience fit. A checker pass is not
approval or implementation evidence.
