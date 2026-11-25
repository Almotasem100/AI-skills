# Multi-task queues

A queue is a list of briefs run through Warp one at a time, each reviewed before the next is
dispatched. It is the shape to reach for when the user hands you a backlog rather than a single
task.

## Run them sequentially

**LOCAL CHANGE:** After review and passing gates, only the orchestrator commits, and only with existing applicable authority; otherwise leave the work intact and uncommitted.
Record the pre-dispatch state and review each task's own delta, including staged and untracked changes. Preserve partial and user work; routine in-scope corrections may continue.

Dispatch one brief, review it and run its gates, then dispatch the next. Parallel runs against the same
working tree interleave edits into a diff nobody can review — and because `oz agent run` has no
sandbox, there is nothing to keep two runs out of each other's files.

If tasks are genuinely independent and you want them concurrent, give each its own checkout (a git
worktree) and its own `--cd`. Otherwise, keep the queue serial.

## Carry constraints forward

Each brief is self-contained, so a constraint discovered in task 2 does not reach task 5 by itself.
Keep a short running list and paste the relevant lines into every subsequent brief:

- Conventions you had to correct in an earlier review ("use the existing `Result` type, not
  exceptions").
- Files that are off-limits for the whole queue.
- Gates that turned out to be slow, flaky, or need a flag.
- Decisions already made, so a later task does not relitigate them.

A constraint that had to be corrected twice belongs in the repository's own skill directory
(`.agents/skills/`, `.warp/skills/`) instead — then pass it with `--skill` and stop re-pasting it.

## One out-dir per task

Give every dispatch its own `--out-dir` so artifacts do not overwrite each other:

```bash
node "<skill-dir>/scripts/relay.mjs" --brief briefs/03-stream-export.txt \
  --cd /path/to/repo --out-dir /tmp/warp-queue/03 --name "queue-03-stream-export"
```

`--name` labels the run in Warp's own run list, which makes a queue far easier to follow later.
Keeping the out-dirs numbered means `result.json`, `events.jsonl`, and `final.txt` for any task stay
recoverable after the queue has moved on.

## Track progress where the user can see it

Maintain a visible checklist — the orchestrator's task list, or a scratch file — with one line per
task and its state: pending, dispatched, under review, reviewed (uncommitted or with a commit hash),
or skipped. Record why a task was skipped.

## When a task fails

Do not roll straight into the next brief. Decide first:

- **Rework** — the diff is close. Continue the conversation with `--conversation <id>` and a delta
  brief.
- **Re-scope** — if the task was too big or the brief was wrong, split and requeue within existing authority.
- **Skip** — record the unmet prerequisite, preserve the changes, and continue only independent work; skipping is not authorization to discard or revert.

Inspect and record the retained changes before another dispatch so the next task has a distinguishable delta.

## Stop the queue when

- Two consecutive tasks fail for the same underlying reason — the shared assumption is wrong, and
  the remaining briefs probably inherit it.
- A task reveals the plan itself is wrong. Re-plan with the user rather than working the list.
- The gates start failing for reasons unrelated to the current task; something earlier in the queue
  broke and the diff is no longer trustworthy.

## Final coherence pass

Ten individually correct diffs can still add up to an incoherent whole. When the queue is done,
review the aggregate task changes against the recorded pre-queue state, including uncommitted work:

- Duplicated helpers that separate tasks each introduced.
- Naming that drifted between early and late tasks.
- Docs, types, or tests that an earlier task's assumption made stale.
- Dead code left by a later task superseding an earlier one.

Fix these yourself if small. If the cleanup is substantial, it is one more brief — dispatch it with
the aggregate diff as the current state.
