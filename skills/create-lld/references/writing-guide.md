# Writing for the recipient

A good deliverable lets its reader make the intended decision without knowing the author's tools or sessions.

- Forward LLD (project label may be **Technical Design**): a concrete technical blueprint for architect review.
  Name relevant components, important methods/contracts, data changes and interactions; verify existing names
  and distinguish proposed ones. Include only affected layers. A full code listing is not a design.
- Functional Design: the proposed observable solution for the customer. When appended to a requirements deck,
  use concise slide-ready content instead of repeating requirements and unchanged business process. One or two
  slides is a useful ordinary-feature budget, not permission to hide material scope.
- Implementation plan: sequencing and concrete work/verification; do not duplicate it into the design.
- As-built record: separate and explicitly required only. A forward document named Technical Design is not one.

Keep delivery labels, filename conventions, tracker prefixes and paths supplied by the active project. Do not
invent IDs or force a single project's naming onto other projects. Describe meaningful constraints directly;
private source inventories, file:line citations, decision numbers, status/history and local operations remain in
existing working evidence unless the recipient explicitly needs them.

Replace superseded content, check affected companion artifacts and return one current coherent design. Preserve
history outside the recipient document. Label pre-change behavior as the preparation baseline; do not leave stale
“currently” claims or imply delivered work is absent. A forward design need not become a separate as-built report.
Promise persistence only when the approved behavior provides it; use recipient-understandable language.
Keep meaningful security/failure/data-integrity behavior when affected,
but omit unrelated environment operations and ritual sections. Proposed checks are not execution evidence.

Run the structural checker and manually assess technical specificity, grounding, concision and audience fit.
