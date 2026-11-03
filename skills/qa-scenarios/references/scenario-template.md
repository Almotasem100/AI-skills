# Tester-facing scenario format

Follow the recipient's format when supplied. Otherwise use this compact structure, without copying these notes
into the handoff. Given/When/Then or a table is equally suitable when actions and outcomes remain explicit.

```markdown
# QA scenarios — <supplied ticket>: <feature title>

## 1. <specific behavior>
Starting condition: <only the role, record state or setup needed to understand this case>
Steps:
1. <concrete action>
2. <next action, when needed>
Expected result: <specific observable outcome>

## 2. <next independently checkable behavior>
Steps:
1. <action>
Expected result: <observable outcome>
```

Omit unnecessary starting conditions. A print result needs a Print action; one vague search action should not
claim to test every independent filter. Prefer enough short cases to preserve meaning over a target case count.
Ticket/slice identification is useful recipient context; internal source maps and execution status are not default
handoff content. Keep undecided expectations out of cases and report consequential questions separately.
