# Review and land

Warp edits the working tree. The reviewer verifies the work; **commit only when existing authorization covers the commit** and the gates and diff pass. Otherwise preserve the work intact and uncommitted.

## Why the review is not optional here

Every delegate skill asks you to verify the implementer's claims. Warp raises the stakes: `oz agent
run` has no sandbox, no permission mode, and no read-only run, so nothing constrained what the run
could touch while it worked. The diff is not a courtesy record — it is the only record.

## The checklist

Work through these in order. Stop at the first one that fails. Preserve the result and working tree; rework within authority or report the issue. Do not destructively abandon work without applicable authority.

1. **Read `result.json` first.** Require `status: "completed"` and `exitCode: 0` for normal review.
   If the result is missing or unsuccessful, inspect stderr and the working tree, preserve partial
   evidence, and report the state. Do not retry or resume writes until process or session evidence
   confirms the previous implementer stopped or never started. A missing result or an early
   `aborted` result is not that evidence.
2. **Start from `touchedFiles`.** It is `git status --porcelain` taken after the run: post-run,
   git-visible worktree state, not a log of what the agent did. It cannot show an ignored file, an
   edit the run made and then reverted, or a write outside the repository, and it includes anything
   already dirty before dispatch. Start there, but do not read it as the complete set. `null` means
   git could not report — inspect the tree by hand. `[]` on a run that claimed edits is a
   contradiction worth chasing.
3. **Re-run the gates yourself.** Do not accept "tests pass" from `finalMessage`. Run the project's
   actual lint, typecheck, build, and test commands and read the output. Take "actual" from
   `CONTRIBUTING.md`, the CI config, or `package.json`: a project's gate set often includes a
   packaging, manifest, or schema validation step that lint and test do not cover, and that is
   exactly the gate a run can break without any test going red.
4. **Read the task delta against the brief.** Compare `git diff`, `git diff --staged`, and untracked
   contents with the pre-dispatch state. Open untracked files directly, including files inside an
   untracked directory. Do not treat the whole index or every untracked file as Warp's work. Ask of
   each task hunk and each new file: did the brief ask for this?
5. **Check what should NOT have changed.** Lockfiles, CI config, formatter config, unrelated
   modules, and anything the brief listed under "leave untouched".
6. **Grep for dangling references** after any removal or rename — imports, string keys, docs.
7. **Round-trip migrations.** Apply and roll back before trusting a schema change.
8. **Run guard skills** if the repository has them installed.
9. **Confirm nothing was committed.** `git log -1` should still be your last commit. The relay never
   commits; if a commit exists, the agent made it despite the brief — treat that as a finding.

## Reading `finalMessage` correctly

`finalMessage` is Warp's self-report: a claim, not evidence. Read it for two things only —

- **Decisions it made that the brief did not specify.** These are the parts you most need to surface
  to the user.
- **What it says it could not do.** Usually accurate, and it tells you where to look first.

Everything else in it — "all tests pass", "no other files changed" — is a hypothesis your gates and
your diff read either confirm or refute. If `finalMessage` is empty on a run that exited 0, read
`events.jsonl` rather than assuming the run did nothing.

## Rework through a conversation

When the diff is close but wrong, continue the same conversation rather than starting cold:

```bash
node "<skill-dir>/scripts/relay.mjs" --brief delta-brief.txt --cd /path/to/repo \
  --conversation "$(jq -r .conversationId /tmp/warp-run-1/result.json)"
```

Warp still holds the earlier exchange, so send only the delta — what was wrong, what to change, what
to leave alone. See [writing-the-brief.md](writing-the-brief.md#delta-briefs).

If `conversationId` is `null`, the stream did not carry one; dispatch a fresh run with a brief that
restates the corrected requirements.

Do not discard/revert result files or remove a worktree as routine recovery. Preserve the working tree, including untracked and pre-existing files, inspect `git status`, the staged and unstaged diffs, and untracked contents, then report out-of-scope or premise-invalid changes. Continue ordinary scoped corrections, including removing verified task-created files when needed. Preserve partial evidence. Destructive abandonment requires applicable authority. A safe scoped stash that preserves the affected work and keeps it recoverable is not abandonment. Rewrite the brief before any authorized re-dispatch.

## Landing

**LOCAL CHANGE:** The implementer never commits. The orchestrator may commit only when existing authorization covers the commit and the gates pass and the diff holds; otherwise leave all work intact and uncommitted. Reuse applicable standing authority without asking again. If authorized, write a message describing the change, not the delegation, and follow project co-authorship conventions.

## Surface, don't absorb

Delegation alone authorizes neither commits nor destructive abandonment. Two limits stay with you:

- **Surface, don't absorb.** Report Warp's design decisions, its defensible-but-unasked turns, and
  the non-blocking nitpicks you chose not to fix. Silently smoothing them over hides the
  implementer's judgment from the person who owns the code.
- **Stop for scope changes.** If finishing correctly requires going beyond the brief — a dependency
  bump, a schema change, an interface the brief did not mention — ask rather than expanding the
  mandate yourself.

Snapshot egress is a decision you make **before** dispatch, not something you report after it. `oz
agent run` uploads an end-of-run workspace snapshot by default, so reading `snapshotDisabled: false`
off a finished run tells you only that the upload already happened. If the repository is sensitive,
pass `--no-snapshot` on the dispatch and confirm `snapshotDisabled: true` in `result.json` before
going further. Keep reporting the field either way — it is the evidence of which way the run went.

Also surface the `runUrl` when someone will want to inspect the run in Warp.
