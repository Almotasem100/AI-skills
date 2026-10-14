# QA scenarios

Use one block per independently verifiable behavior. Keep the heading and Given / When / Then / And style; cite
the supporting approved requirement or design decision by stable ID/title/section where available, without changing its meaning. Do not expose investigative code paths or file:line citations in tester-facing scenarios unless the testing contract explicitly calls for them; keep detailed source pointers in temporary task-context or internal review evidence.

```markdown
Scenario 1: <specific, observable behavior>
Source: <requirement / acceptance criterion / Functional Design rule; LLD only when relevant>
Enabled by: <delivery slice(s), if the project uses them>
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
