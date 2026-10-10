# Writing guide

The goal is not a nice description. It is: **derive the *what* from implementation evidence, recover the *why*
from authoritative task evidence, and ask the developer only for what the workflow does not already know.**
A short accurate description beats a long polished one.

## Title
`<type>(<scope>): <imperative summary> [#<ticketId>]`, at most 72 characters.
- Imperative mood: "restrict checklist imports", not "restricting" or "restricted".
- It must stand alone: someone reading only the title in a release list understands the change.
- `fix(checklist): restrict category import to empty checklists [#18581400]`
- `feat(kpi): add project status and multi-code filtering [#14972296]`

## Evidence split
- **Why / problem:** task context and approved requirements are primary. Concise design docs are useful secondary
  evidence; the diff is never enough to invent business rationale.
- **What changed:** git/diff and implemented code are primary.
- **Testing:** actual verification evidence or the developer's report is primary.
- **Impact/risk:** combine approved requirements with the actual implementation; distinguish expected impact from
  measured results.
- Preserve qualifiers such as **estimated**, **expected**, **target**, **projected**, **reported**, and
  **observed**. Do not strengthen them.

## Body
- **Problem, then fix, per concern.** State what was wrong or requested before what changed.
- **Explain the mechanism, not the file list.** "The endpoint now builds rows from `activeChecklist.getRules()`
  so it mirrors what the checklist UI shows" beats "updated ProjectVsEbbService.java".
- **Name the real identifiers** — classes, endpoints, flags, components — so a reviewer can find them.
- **Group by concern, not by file.** A file list is what the diff already shows.
- **Write for someone who wasn't in your head.** No private shorthand; use the project's domain terms (from the
  project's `AGENTS.md` glossary when there is one).
- **Scale to the change.** Under 20 lines in one file: title, ticket and one sentence of why. Over 800 lines or
  more than 2 unrelated concerns: say so and suggest splitting — a description can't fix a PR-size problem.
- **Testing is one observable outcome per line**: "Verified X does Y." See `exemplars/example-b-testing.md`.
- **Renames and deletions:** say what was moved or removed and why, not its contents.
- **Divergence from the LLD** (when an LLD section is provided) goes in reviewer notes, stated neutrally.

## Examples
- `exemplars/example-a.md` — the team's best structure: problem-then-fix per concern, the mechanism explained,
  specific identifiers. (Missing: ticket, testing, risk, rollback; and it bundles two concerns.)
- `exemplars/example-b-testing.md` — the testing discipline to copy.
