---
name: scenario-test-cases
description: Turn approved requirements and an LLD into traceable browser test-case scenarios that a tester can follow or automate; use an implementation-task handoff when available for scope and execution context. Use when the user asks to draft, derive, or refine browser test scenarios or test cases. Never invent expected behavior to fill gaps.
---

# Scenario test cases

Create browser-oriented test scenarios in the project's requested format, or use the portable template in
`references/scenario-template.md`. The scenarios should be clear enough for a tester to execute manually and
structured enough to automate. This skill writes test cases, not browser automation code.

## Inputs and source rules

- Use the user-approved requirements / acceptance criteria and the approved LLD for expected behavior.
- Use the implementation-task handoff, if one exists for this work, to understand the implementation slice,
  dependencies, and execution context. It does not silently override approved requirements or LLD decisions.
- Read the project's `AGENTS.md` and any supplied testing conventions that govern test environment, browser,
  accounts, or output location.
- Prefer files or paths the user supplies. When a ticket or feature is identified and no matching handoff path
  is supplied, look in the current project's relevant task / handoff documentation area for a clearly matching
  implementation-task handoff. Do not search unrelated repositories. If none is found, say so and continue from
  the provided approved sources when possible.
- If expected-behavior sources are missing, ask for them. Do not derive requirements from the current UI or
  implementation unless the user explicitly asks for characterization tests.

**Authority:** approved requirements and acceptance criteria define what must happen. The approved LLD refines
those requirements with decided behavior. A task handoff scopes the implementation and may point to relevant
requirements, but is not permission to invent behavior. If sources conflict, identify the exact conflict and ask
which source governs; do not silently choose. LLD open questions remain open, not test expectations.

## Workflow

1. **Establish scope.** Identify the ticket / feature, approved sources, and implementation slice. Note whether a
   relevant implementation-task handoff was found. Keep out-of-scope behavior out of the scenarios.
2. **Extract testable statements.** Map each scenario to the exact requirement ID, acceptance criterion, LLD
   section/decision, or handoff item that supports it. Preserve source terms and stated values. Do not add
   unstated roles, data, states, UI elements, dimensions, timing, browsers, or outcomes.
3. **Resolve gaps before asserting.** If a missing detail changes what a tester should do or expect, list it under
   `Clarifications needed` and ask the smallest useful set of questions. Draft only scenarios supported by settled
   behavior; label any affected requirement as blocked instead of guessing.
4. **Write one behavior per scenario** using the numbered `Scenario N: <behavior>` heading and Given / When / Then
   style in the reference template.
   - **Given:** the observable starting state and only the setup needed for this scenario.
   - **When:** ordered, concrete browser actions a tester can perform (page, visible control, input, and action as
     supported by the sources).
   - **Then / And:** observable outcomes, phrased so a tester can verify them in the browser.
   - Use one primary behavior per scenario. Split materially different states or outcomes instead of hiding them
     in a compound step. Avoid duplicate scenarios and unnecessary combinations.
5. **Make scenarios automation-friendly without guessing selectors.** Use accessible names, labels, roles, and
   stable test identifiers only when the source or project testing conventions establish them. Otherwise describe
   the visible target in user-facing terms and flag a missing stable locator only if it prevents reliable
   automation. Do not invent CSS selectors, waits, animation durations, pixel values, test data, or browser setup.
6. **Check traceability and coverage.** Every expected outcome must trace to an approved source. Report in-scope
   requirements with no scenario, unresolved conflicts, and blocked expectations under `Clarifications needed`.
   Do not claim complete coverage unless every in-scope testable requirement is mapped.
7. **Present the cases.** By default, return Markdown in the conversation. Write a file only when the user asks
   for one or project instructions require it; follow the named location and never create a file in a code repo
   without permission.

## Output rules

- Preserve the user's requested style. Otherwise follow `references/scenario-template.md`.
- Cite source IDs / headings on each scenario when available. Never fabricate IDs or line references; for pasted
  requirements without IDs, use a short distinctive source label.
- Keep `Clarifications needed` separate from executable scenarios. A question or assumption must never appear as
  an expected result.
- Do not generate Selenium, Playwright, Cypress, or other automation code unless separately requested.
- Do not claim the scenarios were run or verified in a browser unless that actually happened.

## What this skill does not do

- It does not approve requirements, decide between conflicting documents, or answer LLD open questions.
- It does not infer expected behavior from implementation or mockups when the approved requirements do not state
  it (unless the user explicitly requests characterization testing).
- It does not replace `test-guard`, which reviews automated test code.
