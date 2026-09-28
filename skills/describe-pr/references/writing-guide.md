# Writing guide

The goal is not a nice description. It is: **extract the *what* automatically, and get the *why* from the
developer with as little friction as possible.** A short accurate description beats a long polished one.

## Title
`<type>(<scope>): <imperative summary> [#<ticketId>]`, at most 72 characters.
- Imperative mood: "restrict checklist imports", not "restricting" or "restricted".
- It must stand alone: someone reading only the title in a release list understands the change.
- `fix(checklist): restrict category import to empty checklists [#18581400]`
- `feat(kpi): add project status and multi-code filtering [#14972296]`

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
