---
name: qa-scenarios
description: Prepare concise tester-facing QA scenarios from approved feature behavior. Use for QA scenarios, scenario test cases, acceptance scenarios or a testing-team handoff. Describe concrete actions and observable expected results; do not execute tests or choose the team's manual/automation method.
---

# QA scenarios

Produce a handoff the testing team can use without knowing the author's workflow. The calling workflow owns scheduling;
completed implementation is not a prerequisite. Prepare from settled intended behavior early and
reconcile affected cases when approved design/planning decisions change it, rather than waiting for code.

## Ground the behavior

Read approved requirements/acceptance criteria and applicable Functional Design first. Use intake Q&A and source
pointers to locate authoritative decisions, not as an approved technical solution. Sourced concerns are investigative leads, not expected results.
Consult the LLD only for constraints affecting testable behavior. Follow project testing conventions; do not infer expected behavior from
current code unless characterization was requested. Conflicting or undecided behavior remains a separate question,
not a guessed expected result. Verify load-bearing UI facts used in steps or expectations (tool/page names,
labels, column order, available controls and pagination) against approved design or current source as appropriate.
Use a short source-linked facts block in the working brief when it prevents repeated mistakes; it supplements,
not replaces, the original sources. Do not fill unspecified details from common UI conventions.

## Write for testers

Use the project's requested format, otherwise `references/scenario-template.md`:

- Identify the feature/ticket and relevant delivery slice when useful to the recipient. Follow supplied filename
  conventions; a filename does not change feature scope or require one document per slice. Do not invent IDs.
- Give each case a short behavior title, necessary starting conditions, concrete ordered actions and observable
  expected results. Each case must support a clear pass/fail assessment; split unrelated checks rather than
  compressing several journeys into one broad scenario. Use compact variants when they remain unambiguous.
- Keep permissions, disabled actions, meaningful loading/empty/error states and negative cases when supported and
  relevant. Include actual expected values/rules when established; do not replace precision with “works correctly.”
- Leave execution method to the testing team. API or other non-UI cases are appropriate when part of their scope;
  do not turn this handoff into an internal fault-injection, deployment or engineering verification plan.
- Omit routine status/date/not-executed banners, source inventories, workflow paths, source abbreviations, scenario
  type taxonomies and coverage matrices. No requirement/design citations in the default recipient text unless
  the recipient/project explicitly needs traceability. Ground every expected result internally; keep necessary
  source pointers in existing working/review evidence instead of creating a mandatory second report.

For code/library cases, include all required call inputs or refer to a concrete input set defined once; illustrative
values are examples, not claims that fixtures were created. Add identifiers only when they help reproduce the case.

Check that steps actually trigger every stated result and that important agreed behaviors have not disappeared
through summarization. Never invent selectors, waits, fixtures or browser setup. State material coverage gaps and
unresolved decisions separately to the caller; do not claim exhaustive coverage from a short list of scenarios.
Save only to the approved location. No execution results, automation code or approval of requirements are implied.

See `references/example-scenarios.md` for a synthetic style example, not execution evidence.
