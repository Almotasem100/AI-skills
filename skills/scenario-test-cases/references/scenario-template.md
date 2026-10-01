# Browser test scenarios

Use one block per independently verifiable behavior. Keep the heading and Given / When / Then / And style; cite
the supporting requirement and design source without changing their meaning.

```markdown
Scenario 1: <specific, observable behavior>
Source: <requirement / acceptance criterion; LLD section or decision; task handoff item if relevant>
Given <observable starting state and necessary setup>
When <concrete browser action, in order>
Then <observable result that the source requires>
And <additional observable result required by the same behavior>

Scenario 2: <next independently verifiable behavior>
Source: <supporting source references>
Given <starting state>
When <browser action>
Then <observable expected result>
```

When a requirement is ambiguous, conflicting, or lacks a required expected value, do not put a guessed result in a
scenario. Put it in a separate section:

```markdown
## Clarifications needed
- <source and section>: <what is unspecified or conflicting, and what decision is needed before a reliable case
  can be written>
```

If all testable in-scope requirements are represented and no questions remain, say so explicitly. Otherwise state
which requirements remain uncovered or blocked; do not label partial coverage as complete.
