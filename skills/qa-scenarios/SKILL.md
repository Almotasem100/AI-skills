---
name: qa-scenarios
description: Turn approved feature behavior into traceable QA scenarios that testers can prepare and execute manually or automate later. Use when the user asks for QA scenarios, scenario test cases, acceptance scenarios, or tester-facing cases. This skill specifies observable behavior; it does not run tests or generate automation code unless separately requested.
---

# QA scenarios

Create behavior-focused QA scenarios early enough that QA can prepare before implementation is finished. This is a
**specification/design role**, not an execution test runner.

When the project has a Feature / Delivery Slice hierarchy, scenarios are normally feature-level and may be tagged with
the slice(s) that make each scenario testable.

## Sources and authority

Use approved requirements/acceptance criteria and Functional Design/business rules first. Use feature task-context as
a navigation map. Use the LLD only when a technical constraint materially affects observable behavior. Follow project
testing conventions. Do not require an implementation handoff and do not derive expected behavior from current code
unless characterization scenarios are explicitly requested.

If sources conflict or behavior is undecided, record the gap separately. Never invent the expected result.

## Workflow

1. Establish feature scope, authoritative sources and any approved delivery-slice mapping.
2. Extract observable behaviors: happy paths plus meaningful alternate states, permissions, loading/empty/error and
   negative cases where supported and useful.
3. Write one independently verifiable behavior per scenario using the project format or
   `references/scenario-template.md`.
4. Preserve traceability: every expected outcome maps to approved evidence; never fabricate IDs or locators.
5. Map scenarios to delivery slices when useful (for example `Enabled by: Slice B`). This is coordination metadata,
   not a new requirement.
6. Put unresolved behavior under `Clarifications needed`, never inside an executable expected result.
7. Present/write scenarios only to the approved working or deliverable location.

## Quality rules

- Given = observable starting state and necessary setup only.
- When = concrete user action(s), in order.
- Then/And = observable outcomes required by approved behavior.
- Avoid duplicate combinations and implementation detail.
- Never invent CSS selectors, waits, dimensions, test data or browser setup.
- Do not claim full coverage unless every in-scope testable requirement is mapped.

For a simple tester-facing handoff, when requested, provide only the requested actions and expected results and omit
source/coverage metadata from the tester-facing text. Keep undecided behavior out and ask separately.

This skill does not execute tests, replace unit/integration/API regression/build/guard verification, generate browser
automation unless separately requested, approve requirements, or resolve conflicts by itself.
