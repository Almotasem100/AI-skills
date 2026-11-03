# Writing guide

The goal is not a nice description. It is: **derive the *what* from implementation evidence, recover the *why*
from authoritative task evidence, and ask the developer only for what the workflow does not already know.**
A short accurate description beats a long polished one.

## Title
Default: `<type>[#<ticketId>]: <imperative summary>`, at most 72 characters.
- Example: `feat[#123456]: add notification preferences`.
- No scope or repeated ticket suffix in this default. Keep the summary understandable on its own.
- A repository requiring conventional titles can set `titleFormat: "conventional"` in its existing
  `.describe-pr.json`; this preserves `<type>(<scope>): <summary> [#<ticketId>]`. Follow an established project
  convention, but do not edit persistent project configuration merely to draft a PR. The context carries the
  selected format; explicit supplied context may carry it without a config write. Release titles retain their
  existing `release: <version>` format.

## Evidence split
- **Purpose / problem:** explicit rationale and approved requirements are primary; task-context may preserve their
  decisions and source pointers, but its inferences are not approval. Concise approved design docs are useful
  secondary evidence; the diff is never enough to invent business rationale.
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
- **Scale to the change.** For a tiny change, keep the required purpose/problem and other relevant content brief; the ticket is already in the title. Over 800 lines or
  more than 2 unrelated concerns: say so and suggest splitting — a description can't fix a PR-size problem.
- **Testing is one observable outcome per line**: "Verified X does Y." See `exemplars/example-b-testing.md`.
- **Renames and deletions:** say what was moved or removed and why, not its contents.
- **Divergence from the LLD** (when an LLD section is provided) goes in optional review considerations, stated neutrally.
- **Review readiness, only when relevant:** briefly surface documentation/API-doc changes, available CI/check status, unresolved conflicts or unrelated changes in review considerations. Distinguish observed results from checks not run or not accessible; never claim CI is green, a self-review is complete, or documentation is updated solely because a checklist asks for it. Do not create a mandatory checkbox section for trivial changes.

## Examples
- `exemplars/example-c-current.md` — current recipient presentation, with an illustrative design link.
- `exemplars/example-a.md` — the team's best structure: problem-then-fix per concern, the mechanism explained,
  specific identifiers. (Missing: ticket, testing, risk, rollback; and it bundles two concerns.)
- `exemplars/example-b-testing.md` — the testing discipline to copy.

## Recipient presentation

- The feature heading is **Purpose**; bugfixes use **Problem**. Do not repeat the title's ticket as a body metadata
  line. A parent feature reference can remain when it explains context rather than duplicating the internal ID.
- Link the applicable forward LLD/Technical Design using its actual internal descriptive title and an accessible
  destination. Omit routine authoring dates, private amendment labels and a missing-design placeholder. Do not
  invent a hyperlink or substitute Functional Design for the technical reference. Version identity matters only
  when needed to identify the reviewed design.
- Use separate **Impact and risks** bullets by material concern. Do not repeat the same compatibility dependency
  under review considerations. Mention unchanged dependencies only when relevant.
- **Review considerations** is optional: retain useful stacked-base/retargeting information, important design
  deviations and non-obvious focus. Omit generic “review carefully” text and inaccessible local-update claims.
- **Screenshots** is optional even for UI changes. Include useful existing/authorized images when available;
  otherwise omit without routinely asking. Capture/request only for a real evidence need or project requirement,
  under existing authority. A browser test pass does not show the UI to the reviewer. Do not fill the section with
  “No screenshots attached” or manual-acceptance narration.
