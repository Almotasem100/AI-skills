---
name: create-lld
description: Write a low-level design (LLD) section for one ticket, in the team's design-document template, written for an architect's review. Forward mode designs a ticket before the work from the ticket details, the customer's slides and the code; retro mode documents already-finished work from its branch. Use when the user asks for an LLD, a technical design, a design section or design documentation for a ticket, before or after implementing it.
---

# create-lld

Writes an LLD section in `templates/lld-section.md`, for an architect who will review it. When customer
slides are provided, it also writes a companion Functional Design using
`templates/functional-design.md`. The Functional Design describes expected behavior; the LLD describes
technical structure and implementation choices. It explains what the problem is, what was chosen, what else
was possible, and why — with every claim checkable against its source.

`<skill-dir>` below means the folder that contains this file.

## Inputs
Use whatever the user gives; anything missing in the header becomes `[NEEDS INPUT]` and is asked about in one
message (step 6), never guessed.
- **Jira ID** and **internal ticket** (ID, title, description), pasted by the user — ticket systems are not
  reachable.
- **Customer slides**: `.pptx`, `.pdf` or screenshots.
- Release / sprint, tech designer name.
- Optional: constraints, notes, what the user already decided.
- **Retro mode**: the branch or commit range that holds the finished work.
- **Functional Design**: produced alongside the LLD by default when slides are supplied; can also be
  requested without slides when the ticket contains enough functional requirements.
- Where to save the LLD. If not given: the location in the project's `AGENTS.md`, otherwise the system temp
  folder. **Never create files inside a code repository unless the user says so.**

## Forward mode (before the work)

1. **Read the slides.** See "Reading customer slides" below for what to take from them.
   - `.pptx`: `node <skill-dir>/scripts/slides.mjs <file.pptx> --media-dir <temp>/lld-slides` — then look at
     the extracted images too; customer slides often carry the requirement in a picture.
   - `.pdf`: read it directly. If you can't, try `pdftotext -layout <file> -` when it's installed. Text
     extraction misses mockups and screenshots, so ask the user for screenshots of the image-heavy slides
     (AS-IS / TO-BE pictures) when you can't view the pages.
   - Images: read them directly.
   - **Check the ticket description matches the slides** (same stories, same scope). If they disagree, say so
     and put it in the open questions.
2. **Read the project.** Its `AGENTS.md` (rules, glossary, where LLDs go), a generated code map if there is
   one, then the code the ticket touches. Record the current state with evidence (`file:line`).
3. **Size it**: small (one concern, one layer, no new endpoint, no data change) or normal. Tell the user which.
4. **Find the real decisions.** For each, lay out the chosen option and at least one real alternative (keeping
   the current behaviour counts), and a *why* tied to a fact or constraint. Recommend; don't decide alone when
   the project's rules say design choices belong to the user. If the ticket is too ambiguous for that, say so
   and suggest a grilling/interview session first.
5. **Write the Functional Design and LLD as separate artifacts** when slides are supplied.
   - Functional Design: describe the user/business-visible behavior, actors, flows, business rules, acceptance
     criteria, UI behavior and user-visible errors supported by the sources. Trace each requirement to its
     ticket/story or slide. Copy business-rule tables exactly. Mark missing decisions `[NEEDS INPUT]`; do not
     turn design suggestions or slide examples into approved requirements.
   - LLD: follow `references/writing-guide.md`; `references/example-lld.md` shows the bar. Focus on the
     technical design, implementation choices, alternatives, impacts and verification. Refer to Functional
     Design requirements by ID instead of duplicating their full descriptions.
   Both artifacts start as `Draft`. If no slides were supplied, produce only the LLD unless the user asks for
   a Functional Design.
6. **Check and ask — in one message.** Run
   `node <skill-dir>/scripts/check-lld.mjs <lld.md> --size <small|normal>`, fix every error, then show the
   user both artifacts when applicable, the remaining LLD warnings, and **at most 5 questions**: the decisions
   to confirm and the `[NEEDS INPUT]` gaps that matter most. Manually verify the Functional Design's source
   traceability and behavior claims; `check-lld.mjs` checks only the LLD. Confirmation-shaped with a guess
   where possible.
7. **Revise** with the answers and re-run the LLD check. Each artifact remains `Draft` or `In review` until the
   user approves it; mark both `Approved` only if the user approves both.

## Reading customer slides
- **Skip the boilerplate** most change-request decks carry: agile definitions, "what is an acceptance
  criterion", test-report templates, version history.
- **Q&A / "discussions" slides are decisions already made** with the product owner. Use them as the *why*
  (cite them: "PO, slide 9"), don't ask them again.
- **Copy business-rule tables exactly** (e.g. a truth table of answers → result) into the design. Never
  paraphrase a rule table.
- **The PO's numbers are evidence** for the context: ROI, time saved, effort estimates, data volumes (e.g.
  "about 1,200 eBBs"). Cite them as the PO's estimate.
- **Scope notes matter:** a slide saying a story "will be developed in a new ticket" makes it out of scope.
- **Several user stories in one ticket:** one LLD for the ticket; each story becomes an objective, and design
  bullets say which story they serve (`US2`). If one story is independent of the others, suggest splitting it
  into its own ticket.

## Retro mode (documenting finished work)

1. **Read the change.**
   - **On a branch:** find the base (usually `develop`; ask if unsure), then `git log --oneline <base>..<branch>`
     and `git diff --stat <base>...<branch>`, and read the changed source files.
   - **Already merged** (e.g. a feature from an old release): find the implementation by searching the code
     for the names in the slides (button labels, column names, entity names), then read those files. Tell the
     user which files you're documenting, so they can correct you.
   - Skip lockfiles and generated files, and **never open secrets files** (`.env*`, keys, keystores, `.npmrc`,
     credentials).
   - If slides exist for the ticket, read them as in forward step 1: they are the best source for the *why*.
2. **Write the LLD from the code**, following the guide:
   - *Context* and *Objectives*: from the ticket, the user and the removed code (the before-state).
   - *Chosen*: what the code does. *Alternatives* and *Why*: only from the user, the ticket, the slides, commit
     messages or code comments — otherwise `[NEEDS INPUT]`.
   - Where the code differs from the slides, say so neutrally in the open questions: the difference may be a
     later agreement, or a gap.
   - *Verification*: cite tests in the diff as evidence; anything else is `[NEEDS INPUT]`.
3. If slides exist, also write the companion Functional Design. Distinguish intended behavior in the slides/ticket
   from behavior actually implemented; record discrepancies as open questions rather than silently reconciling
   them. Keep the LLD's *Chosen* statements grounded in the code.
4. **Check and ask** as in forward steps 6–7, focusing the questions on the decisions' *why*.

## Output
- One markdown file named `LLD_<JIRA-ID>_<short-title>.md`; when slides are supplied, also
  `Functional_<JIRA-ID>_<short-title>.md` in the same folder. If the user gives a save location, save both
  there; otherwise follow the existing LLD default and place both together.
- Tell the user it's ready to paste into the release's design document. Google Docs can paste markdown with
  formatting when markdown is enabled in its preferences; otherwise paste as plain text and fix the headings.
- The LLD feeds the PR later: its verification plan becomes the PR's testing section, its decisions the
  reviewer notes, and its IDs the PR title.

## Files
- `templates/lld-section.md`: the approved template, with its rules in comments.
- `templates/functional-design.md`: the companion functional-behavior template, adapted from the shared
  release-design document while excluding its application-specific examples and draft placeholders.
- `scripts/slides.mjs`: text, speaker notes and images from a `.pptx`, slide by slide. No dependencies.
- `scripts/check-lld.mjs`: checks header, required sections, empty sections, "N/A", decision rows, risks,
  named identifiers, verification phrasing, vague wording; counts `[NEEDS INPUT]`.
- `references/writing-guide.md`: the rules and forward vs retro.
- `references/example-lld.md`: a real team entry rewritten into the template.
