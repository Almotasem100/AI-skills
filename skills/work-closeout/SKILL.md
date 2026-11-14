---
name: work-closeout
description: Reconcile genuinely completed bounded work when the user explicitly requests closeout, durable reconciliation or project-record updates. Capture actual outcomes, unresolved follow-ups and relevant durable changes; validate consequential citations. Not automatic at implementation completion, chat ending or child-slice completion. Archival/removal needs separate applicable authorization.
---

# Work closeout

Use only for explicitly requested reconciliation of a genuinely completed feature or bounded item. A new chat/model,
pause or routine implementation completion does not trigger closeout; normal working state supports continuation.
A request to finish implementation is not authorization to archive or clear working artifacts.

## Establish completion scope

Read the canonical project/closeout policy, existing working record and the affected repositories/documents of record.
Identify the bounded item and applicable completion conditions; ask only for a missing decision that matters.
Inspect actual artifacts, changes, review/disposition and execution evidence, not just a completion summary.
Distinguish authored/revised, checked unchanged and independently verified. Final consistency does not prove earlier
prerequisite order or companion reconciliation; preserve late corrections and unmet gates accurately. Report code,
deployment and acceptance separately; preserve estimates/assumptions as such, not verified outcomes. One passing
check is not completion of all outcomes.

## Reconcile current working state

Use final requirements, design, plan, review and verification artifacts to establish approved intent, implemented
behavior and verified results. Correct unsupported working-state claims before propagating them. Keep the existing
scratchpad compact: objective/item, final stage, decisions, blockers/follow-ups, verification state and next/closed
state. Link detailed evidence and proposed durable updates instead of duplicating them or creating a competing report.

## Update only changed durable facts

Update/propose only canonical documents whose owned facts changed, under existing project authorization. Do not
promote temporary task-context into permanent documentation automatically. Replace superseded guidance and affected
active references instead of appending a competing amendment; retain displaced rationale in on-demand history/Git
when useful or required, while preserving applicable technical constraints.

Keep temporary restrictions and unresolved follow-ups in current work/state with a next action and explicit
completion/removal condition. Retire obsolete reminders, pauses and gates only when that condition is met; retain
the ongoing procedure and remaining limitations. Closing this item does not retire unresolved work or active
parent-feature context. Apply existing project authorization to commits, push, PR/merge, deployment and cleanup;
reconciliation grants no additional authority.

When source citations are used, run the bundled checker on the working record and relevant changed cited Markdown:

```text
node <skill-dir>/scripts/check-citations.mjs <working-record.md> --root <repo1> [--root <repo2> ...]
```

Fix/reverify consequential STALE citations or leave dependent closeout blocked. A checker pass validates locators,
not interpretation, implementation or acceptance. Never invent verification, review, deployment or publication results.

## Report and separately authorized cleanup

Report actual completion/acceptance, changed durable documents, deferred follow-ups, repository/publication/deployment
state, evidence limits and any proposed cleanup inventory. Perform archival/removal only when current explicit
project/user authorization covers that inventory. Preserve owner-inspectable working files and active parent context;
no automatic clearing, draft archiving or handoff generation. Handoff is for genuine transfer friction, not closure.
Before approved cleanup, inspect the inventory for workflow feedback, unresolved findings and other unique content
whose only copy would be removed. Preserve that content in an existing approved durable record and verify it is
saved before clearing its source. Keep observations, proposed remedies and accepted policy distinct; never promote
feedback into instructions automatically. If its destination needs separate authorization, retain the source and
report the pending choice. Do not copy confidential project/customer content into a portable workflow repository.
