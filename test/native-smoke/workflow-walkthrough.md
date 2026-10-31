# Hypothetical full-feature walkthrough — session prompt

For this explanation-only exercise, **use AI Skills delegation mode**. Read the installed shared workflow contract,
the guarded profile and lane catalog, and inspect the actual configured routes for the selected project. Do not
run any delegate/model calls, implement anything, create feature artifacts, change configuration, publish or deploy.
Only read relevant instructions/configuration and return the requested explanation. The caller may save the answer
in the disposable run directory.

Installed sources:
- Shared contract: {{SHARED_CONTRACT}}
- Profile: {{PROFILE}}
- Lane catalog: {{LANE_CATALOG}}
- Installed configuration reader: {{CONFIG_READER}}
- Project whose route inventory is inspected: {{PROJECT}}

Read local execution.json if present, including native mappings and standing/session/task overrides. Explain
which roles would use native agents or external relays, and why. Do not treat missing native setup as a reason
to change V3 ownership or bypass required permissions. Then use the installed setup's read-only `load`/`resolve` operations. Report route gaps rather than inventing assignments
or treating a configured model as proven available. The real project is used only for its lane inventory; the
following fictional project policy defines this scenario's requirements and gates.

## Fictional ticket and project policy

This is explicitly a **Full Feature** delivery request: add private saved filters to an existing records page.
Users may save, rename, apply and delete their own filters. Other users must not access or mutate them.
Whitespace-only names are invalid. The customer has not yet decided whether duplicate names are allowed.
An existing records table and authenticated backend are available for reuse; exact source surfaces have not been
inspected, so do not invent classes, paths or API signatures.

The project requires a customer-facing Functional Design and a forward LLD, with owner approval of design before
dependent implementation planning. Relevant automated tests/builds must run. Applicable API regressions and QA
preparation are part of delivery. Security review is explicitly requested for the ownership boundary. Existing
project-approved working records should be reused where present. PR-description preparation is authorized;
push, opening a PR, merge and deployment are not authorized. No unattended fallback authorization was given.

## Your answer

Explain how you would take this ticket from intake to its authorized endpoint using the actual loaded rules.
Use a compact table identifying the stage, prerequisites, outcome, responsible participant, applicable skill or
capability, and actual configured lane/implementer/model/variant where relevant. Distinguish direct coordination,
specialist deliverables and deterministic checks. Explain optional/inapplicable work rather than forcing every
installed skill into the sequence.

Identify the first unresolved owner decision and how it affects dependent work. Explain the review/correction
ownership, verification and completion criteria, continuation/approval boundaries, and how you would handle a
hypothetical unavailable route under the authorization above. Identify missing routes/capabilities explicitly.
Make no claims that any of this work has been performed or any provider has been tested.

Return the explanation; the caller should capture it at {{OUTPUT}}. This is evidence of workflow understanding,
not execution of the full feature. If required installed sources or lane-reading capabilities are missing/stale,
report that limitation instead of substituting source or remembered assignments silently.
