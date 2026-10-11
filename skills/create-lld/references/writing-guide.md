# Writing guide — concise design artifacts

- Functional Design: customer/business-facing observable behavior; create only when required/requested.
- LLD: architect-facing forward design before implementation planning.
- Technical Design: optional as-built artifact only when the project/team explicitly requires one.
- Implementation plan: separate artifact that sequences delivery slices, dependencies, branch/order strategy,
  implementation and concrete verification.

Rules:
1. Design at the parent-feature scope when a project uses feature + delivery-slice tracking.
2. Use project-approved identifiers; do not expose child-ticket mechanics unless the audience needs them.
3. Inputs are evidence, not deliverable citations. Keep source locators/evidence maps in working notes.
4. Be concise. Do not repeat requirements in multiple sections or write alternatives essays/source inventories.
5. Omit conditional sections rather than inventing rollout, risks, questions, components or metadata.
6. Functional Design says **what** is observable; LLD says the intended **technical boundary**.
7. Preserve estimates/targets/assumptions as such. Never present proposed verification as passed.
8. Ask only about consequential ambiguity.

Run the structural LLD checker, then manually check concision, grounding and audience fit. A checker pass is not
approval or implementation evidence.
