# Multi-task queues

Scale the single-task loop through sequencing and bookkeeping, not a larger brief.

## Run sequentially

**LOCAL CHANGE:** After review and passing gates, only the orchestrator commits, and only with existing applicable authority; otherwise leave the work intact and uncommitted.
Record the pre-dispatch state and review each task's own delta, including staged and untracked changes. Preserve partial and user work; routine in-scope corrections may continue.

Dispatch one task, review it, and rerun its gates before the next:

```bash
node "<skill-dir>/scripts/relay.mjs" --brief task-01.txt --cd /path/to/repo
```

- Later briefs can rely on earlier reviewed work that remains available, committed or not.
- Parallelize only genuinely independent tasks in separate worktrees.

## Carry constraints forward

Fresh Qoder sessions do not know earlier queue decisions. Put any helper name, fixture location, or
interface needed later into the later brief.

Resume only for rework on the same task. Send a delta with `--resume-last` or `--resume <id>` from that
task's `result.json`. Start unrelated items in fresh sessions.

## Keep a progress file

For more than two or three tasks, track:

- queued / at-implementer / reviewed status (uncommitted or with a commit hash);
- per-task review notes and gate outcomes;
- design choices and questions needing human review;
- the final cross-task verification.

Update it after every task review.

## Close coherently

After the last task, run the full gates once more, search repository-wide for the changed concept,
round-trip migrations when applicable, and only then, if authorized, push or open a pull request.

Stop and ask if a task cannot fit its brief, review invalidates the plan, or gates reveal a problem in
already-reviewed work. Report uncommitted work, any commit hashes, and the open question before resuming affected work.
