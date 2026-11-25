# Multi-task queues

The single-task loop scales to a queue, and that is where delegation pays off most - a removal split
across layers, a migration touching many files, a refactor sweep. The discipline that makes a queue
trustworthy is sequencing and bookkeeping, not parallelism.

## Run sequentially

**LOCAL CHANGE:** After review and passing gates, only the orchestrator commits, and only with existing applicable authority; otherwise leave the work intact and uncommitted.
Record the pre-dispatch state and review each task's own delta, including staged and untracked changes. Preserve partial and user work; routine in-scope corrections may continue.

Run tasks **one at a time, in dependency order**,
reviewing each and running its gates before dispatching the next. Later briefs can
rely on earlier reviewed work that remains available, committed or not.

Parallelism is occasionally worth it for genuinely independent tasks on separate files, but it
makes attribution and review harder. Default to sequential.

## Carry decided constraints forward

Implementation surfaces facts the original plan did not have: a helper got named, a fixture lives in a
specific place, an interface was chosen. When a later task depends on one of those, fold it into that
task's brief as an explicit line. A fresh Antigravity conversation has no memory of the earlier run, so
a constraint that emerged in task 2 must be restated in task 5's brief or it will not hold.

## Keep a progress file

For anything longer than two or three tasks - especially a run the human steps away from - maintain a
single progress file alongside the work:

- **Status table** - each task: queued / at-implementer / reviewed (uncommitted or with a commit hash).
- **Per-task review notes** - what changed, what you verified, the gate outcome.
- **Needs your eyes** - design decisions Antigravity made, non-blocking nitpicks, anything you want the
  human to overrule or confirm.
- **End-of-run checklist** - what happens after the last task.

Update it after each task review, not in a batch at the end.

## Close with a coherence check

Per-task review proves each step in isolation; it does not prove the steps cohere. After the last task,
verify the whole:

- Run the full test/build once more on the final tree.
- Do a repo-wide check for the thing the queue was about.
- For schema work, replay all the new migrations from a clean state and check for drift.
- Then, if authorized, push and open or update the PR, with a description that reflects what actually shipped.

## When to stop and ask

Proceed without asking on anything that follows from the agreed plan. Stop and surface when:

- A task cannot be completed correctly within its brief's scope.
- A review finds something that calls the *plan* into question, not just the implementation.
- The gates reveal a problem that affects tasks already done.

Then report where you are, what is uncommitted or committed, and what the open question is - and wait.
