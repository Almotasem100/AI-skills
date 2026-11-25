# Review and land

MiniMax Code did the typing; you own the judgment. This is where delegation earns its keep or quietly
ships a mistake. The discipline is simple to state and easy to skip under time pressure: **verify
against reality, never against the self-report — and read the diff as generated code, which fails in
ways a green gate can't see.**

One thing to add to the usual routine here: the run had no sandbox. An implementation dispatch goes out
under `--permission smart`, which approves writes and deletions headlessly, so "did it stay inside the brief's paths?" is a question you answer from `touchedFiles`,
not one the tooling answered for you.

## Check the tests before trusting the gates

If the diff touches existing tests, review those edits *first* — before the gate re-run means anything.
A weakened assertion, an added skip, or a deleted test makes the gate measure less than it did before
the run; green is only meaningful if the yardstick wasn't shortened.

- **Unbriefed edits to existing tests are a contract change, not part of the fix.** The brief asked for
  an implementation; nothing in it authorized moving the goalposts. Flag them, don't absorb them.
- **Skipped, disabled, or commented-out tests added in this diff:** treat the underlying test as failing
  until proven otherwise, whatever the annotation's comment claims.
- **Loosened assertions** (exact match relaxed to contains/truthy, error-type checks broadened, tolerance
  widened): same treatment.

## Re-run the gates yourself

`result.json` carries MiniMax Code's own claim that the gates passed. Treat that as a claim, not
evidence — re-run the project's actual test/lint/build commands in the working tree and read the output.
And keep the result in proportion: **passing is necessary, not sufficient.** An implementer can *game* a
gate, not just misreport it — that is what the test check above and the sweep below exist to catch.

For changes with their own verification shape, go further:

- **Migrations / schema:** round-trip them (apply, reverse, re-apply on a scratch target) and check for
  drift, rather than trusting that "the migration is reversible."
- **Removals / renames:** grep the codebase for dangling references to whatever was removed.
- **Anything stateful:** exercise the actual behavior, don't just confirm it compiles.

## Read the diff against the brief

Open the diff (`touchedFiles` in the result is your starting list) and hold it against what you asked
for:

- **Out-of-scope writes and deletions** — this is the first check here, not an afterthought. Nothing
  stopped a write or delete outside `--cd` or outside the paths the brief named; look for ` D` lines in
  `touchedFiles` as hard as for ` M`. `touchedFiles` is a
  `git status` review aid, not containment proof: it misses ignored files and anything outside the
  repository. A worktree isolates the checkout but not the process. Use a container or another
  OS-enforced boundary when writes outside the target tree are unacceptable.
- **Scope creep** — did it change things the brief said to leave untouched? Unasked refactors, renames,
  "while I was here" edits. These are the most common quality problem in delegated work.
- **Scope shortfall** — did it do the whole task, including the edge cases and cleanup, or stop at the
  first plausible version? An `execStatus` of `limit_exceeded` in `result.json` is a strong hint of a run
  that stopped mid-task rather than finishing.
- **Quiet judgment calls** — sometimes MiniMax Code makes a defensible decision the brief didn't
  anticipate. Don't just accept it because it looks reasonable; understand it and decide.
- **A commit it made itself** — the brief forbids it, but nothing enforced that. Compare `HEAD` with
  the pre-dispatch baseline, then inspect status, staged and unstaged diffs, and the intervening log.
  Review the committed range with `git diff <recorded-baseline>..HEAD` without moving `HEAD`.
  Report the unexpected commits and preserve their IDs, the index, and the working tree. Do not
  rewrite history automatically; any authorized recovery must retain a recoverable copy first.

## The implementer sweep

Generated code fails in systematic ways that gates are structurally blind to — each of these can sit in
a diff whose tests are all green. Walk them against every diff during review:

- **Hardcoded success or fixture data** on a path the brief says does real work — a canned
  `{status: "ok"}` or default return passes tests *by design*. If MiniMax Code couldn't implement
  something, the diff should fail loudly, not pretend.
- **Catch-all error handling that returns a default** instead of propagating — the suppressed failure is
  exactly what the gate would have caught. A broad catch is only acceptable with a recovery path the
  contract documents.
- **Unverified imports and API calls** — confirm every new dependency, method, and signature exists in
  the *installed* version (read the lockfile or the package, don't trust plausibility).
- **Dead weight** — unused imports, helpers nothing calls, unreachable branches, "Step 1/Step 2"
  comment scaffolding, comments that restate the line below them.
- **A second way to do what the file already does** — a new HTTP client, error idiom, or logging style
  introduced beside the existing one instead of reusing it.
- **New tests that assert internals** — asserting that an internal helper was called, or mocking the
  project's own functions to isolate a "unit." Green, brittle, and worthless as regression cover.
- **Near-duplicate test bodies** differing by one value — fold into one data-driven test or drop the
  copies; bloat reads as coverage but isn't.
- **Speculative surface** — optional parameters, config flags, or abstractions with no caller in this
  diff or the repo. Delegated work gets the concrete behavior the brief asked for, nothing extra.
- **Guards for impossible cases** — null/type checks for values the code's own contract already
  excludes. Noise that buries the validation that matters at real trust boundaries.

Anything the sweep catches goes back to MiniMax Code as a delta brief (below) or gets fixed in the tree
before verification — and either way is reported to the user (see "Surface, don't absorb").

If the `guard-skills` package is installed, run the relevant guard on the diff for the full treatment —
`clean-code-guard` on production code, `test-guard` on tests, `docs-guard` on documentation. The sweep
above is the built-in floor; the guards go deeper.

## The commit boundary

**LOCAL CHANGE:** The orchestrator may commit only under existing applicable authority and
after the gates pass and the diff holds; otherwise preserve verified work uncommitted.
Reuse applicable standing authority without asking again. MiniMax Code must not commit. With no sandbox it can write `.git`, so inspect the baseline and report unexpected Git changes. If authorized, write a clear message and record project co-authorship as usual.

After dispatch, the uncommitted working tree is the authoritative copy of the
implementer's work — the only one you can commit from, and often the only copy at all. Do not reflexively run
`git checkout`, `reset`, `clean`, or a branch switch in the workspace after dispatch —
however messy an interrupted run looks, inspect it first: `git status`, `git diff`, `git diff --cached`
for anything the implementer staged (plain `git diff` is blind to the index), and open any untracked
files (`??` in `git status`) directly — Git diffs do not show untracked contents. Compare with pre-dispatch status, staged and
unstaged diffs, and untracked contents to isolate the task delta; do not treat the whole index
or every untracked file as task work. The tree is evidence, not clutter.
Continue ordinary scoped corrections, including removing verified task-created files when needed.
Preserve user and pre-existing work and partial evidence; destructive abandonment requires applicable authority.

## Reworking: send the delta, not the whole task

If the review turns up problems, don't restate the entire brief. Continue the same MiniMax Code session
with just the correction:

```bash
echo "The fix is right, but the test mocks the DB session - use the real migrated fixture instead, and
drop the now-unused import." | node "<skill-dir>/scripts/relay.mjs" --session <sessionId> --cd /path/to/repo
```

(`<skill-dir>` is this skill's install directory — see [dispatch-and-poll.md](dispatch-and-poll.md).
`<sessionId>` is the field of that name from the prior `result.json`.)

`--session <sessionId>` keeps the context from the first run, so a short delta is enough. The relay
offers no "continue the latest session" fallback: MiniMax Code's latest session is shared with every
other run in that workspace. Then review again — rework gets the same gate-rerun, test check, diff-read, and sweep as the
original, no shortcuts. Repeat until the work holds.

## Surface, don't absorb

Keep the human informed about anything that changes the shape of the work:

- **Report design decisions** MiniMax Code made, and any defensible-but-unrequested turns it took.
- **Note non-blocking nitpicks** you chose not to block on, so the human can overrule you.
- **Report any write outside the brief's paths**, and any `readOnlyViolation: true` on a read-only
  dispatch, even when the change itself looks harmless. Those say something about the run's containment,
  which is the human's call to weigh, not yours to normalize.
- **Stop and ask** if correct completion requires going beyond the brief — don't expand the mandate on
  your own. A scope change is the human's call, not yours or MiniMax Code's.

For a multi-task run, capture these in the progress file rather than letting them scroll past — see
[multi-task-queues.md](multi-task-queues.md).
