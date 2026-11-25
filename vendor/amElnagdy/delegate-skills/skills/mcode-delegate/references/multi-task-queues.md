# Multi-task queues

The single-task loop scales to a queue, and that's where delegation pays off most — a removal split
across layers, a migration touching many files, a refactor sweep. The discipline that makes a queue
trustworthy is sequencing and bookkeeping, not parallelism.

## Run sequentially

**LOCAL CHANGE:** After review and passing gates, only the orchestrator commits, and only with existing applicable authority; otherwise leave the work intact and uncommitted.
Record the pre-dispatch state and review each task's own delta, including staged and untracked changes. Preserve partial and user work; routine in-scope corrections may continue.

Resist the urge to fan out the whole queue at once. Run tasks **one at a time, in dependency order**,
reviewing each and running its gates before dispatching the next. Later briefs can
rely on earlier reviewed work that remains available, committed or not.

With MiniMax Code there is another reason: an implementation run has no
filesystem sandbox. Two concurrent write-capable runs in one tree can interleave writes to the same
file with nothing arbitrating between them, and the resulting diff belongs to neither task. If you do need
parallelism, give each run its own tree — `git worktree add` per task, or a container — rather than
running two of them side by side in the same checkout. Default to sequential.

## Carry decided constraints forward

Implementation surfaces facts the original plan didn't have: a helper got named, a fixture lives in a
specific place, an interface was chosen. When a later task depends on one of those, **fold it into that
task's brief** as an explicit line. MiniMax Code has no memory of the earlier run, so a constraint that
emerged in task 2 must be restated in task 5's brief or it won't hold. This is the queue equivalent of
keeping briefs self-contained.

(`--session` does carry one run's context into its own rework, but that's for reworking a single task —
not a channel for handing task 2's discoveries to task 5. Each task in a queue gets a fresh dispatch.)

## Keep a progress file

For anything longer than two or three tasks — especially a run the human steps away from — maintain a
single progress file alongside the work. It's the durable record that survives your own context limits
and lets the human catch up at a glance. A shape that works:

- **Status table** — each task: queued / at-implementer / reviewed (uncommitted or with a commit hash).
- **Per-task review notes** — what changed, what you verified, the gate outcome. One short paragraph.
- **"Needs your eyes"** — design decisions MiniMax Code made, non-blocking nitpicks, any write that
  fell outside the brief's paths, anything you want the human to overrule or confirm. This is the
  section they read first.
- **End-of-run checklist** — what happens after the last task (authorized push or PR actions, manual checks
  the human should do).

Update it after each task review, not in a batch at the end — if the run is interrupted, the file is still
accurate.

## Watch the per-task budget

Each dispatch has its own step limit and its own `--timeout` if you set one. In a long queue those
limits bite unevenly: the task in the middle that touches twenty files is the one that stops at
`execStatus: limit_exceeded` with a half-applied change. Size briefs so no single task needs the whole budget, and treat a capped task as an unfinished one — inspect
the tree, then re-dispatch or split, rather than letting the queue move on past it.

## Close with a coherence check

Per-task review proves each step in isolation; it doesn't prove the steps cohere. After the last task,
verify the whole:

- Run the full test/build once more on the final tree — not just the last task's slice.
- Do a repo-wide check for the thing the queue was about (e.g. after a removal, grep the entire tree
  for any surviving reference; after a rename, confirm no stragglers).
- For schema work, replay all the new migrations from a clean state and check for drift.
- Then, if authorized, push and open or update the PR, with a description that reflects what actually shipped.

## When to stop and ask

Proceed without asking on anything that follows from the agreed plan — that's the point of the human
opting into the queue. Stop and surface when:

- A task can't be completed correctly within its brief's scope (a scope change is the human's call).
- A review finds something that calls the *plan* into question, not just the implementation.
- The gates reveal a problem that affects tasks already "done."

Then report where you are, what is uncommitted or committed, and what the open question is — and wait. A queue that
quietly works around a broken assumption produces more changes in the wrong direction.
