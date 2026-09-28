# Writing guide — an LLD an architect can review

The reader is an architect who will review the design and give an opinion. They need to see **what the
problem is, what was chosen, what else was possible, and why** — and be able to check every claim against the
code.

## Rules
1. **Name what you touch.** Every design statement names the class, endpoint, table, component or file, in
   backticks. "Add a filter interceptor on task-worker routes" is uncheckable; "Add `OfyTaskFilter` on
   `/taskqueues/*` in `web.xml`" is checkable.
2. **Context before design, with evidence.** Numbers, `file:line`, observed behaviour. If there's no
   measurement, write `[NEEDS INPUT]` — never estimate one.
3. **A decision needs a real alternative.** If nothing else was possible, it isn't a decision; put it in the
   design sections. The current behaviour is a valid alternative ("keep doing X").
4. **Why is tied to a constraint or a fact**, not to taste: a bottleneck, a requirement from the slides, a
   project rule, a cost.
5. **Every risk has a mitigation.** If there is none, say so in the open questions.
6. **Verification is observable**: "Verified <behaviour> <outcome>", checkable by someone else.
7. **Scale to the ticket.** Remove sections and subsections that don't apply; never write "N/A".
8. **No vague wording**: "seamlessly", "robust", "cleanly", "leverage", "absolute", "etc." say nothing
   checkable. Say what actually happens.
9. **Never invent** measurements, reasons, test results, names of endpoints that don't exist yet, or the
   customer's intent. Use `[NEEDS INPUT]` and ask.

## Forward vs retro
- **Forward** (before the work): you are proposing a design. Decisions are recommendations; the status stays
  `Draft` until the user approves. If the project's rules say design choices belong to the user (see its
  `AGENTS.md`), present every decision as a proposal and ask, don't pick.
- **Retro** (after the work): you are documenting what was built. *Chosen* comes from the code. *Alternatives*
  and *Why* come only from the user, the ticket, the slides, commit messages or code comments; otherwise
  `[NEEDS INPUT]`. Tests in the diff may be cited in section 7 as evidence ("Verified by `AuthGuardSpec`: …").

## Citing sources
Say where a fact comes from when it isn't the code: "(PO, slide 9)", "(ticket description)", "(comment in
`auth.ts`)". An architect can then tell a customer requirement from a design choice.

## Small vs normal
- **Small** (one concern, one layer, no new endpoint, no data change): sections 1, 2, 4 and/or 5, 7, plus 3
  only if a real choice was made.
- **Normal**: everything, minus subsections that don't apply.

## Example
`example-lld.md` is the team's CADE-1421 entry (Projects list performance) rewritten into this template. It
uses only facts from the original; everything the original didn't say is `[NEEDS INPUT]`, which is exactly what
the skill must do too.
