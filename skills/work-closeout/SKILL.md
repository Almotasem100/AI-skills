---
name: work-closeout
description: Reconcile a genuinely completed feature or bounded work item when the user explicitly asks for closeout, durable reconciliation or project-record updates. Capture verified/unverified outcomes, decisions, deferred items and repo state; validate consequential citations. Do not invoke automatically after end-to-end implementation, a chat ending or a completed delivery slice. Preserve working files unless archival/removal is explicitly authorized.
---

# Work closeout

Closeout is a **work-lifecycle** action, not a conversation-lifecycle action. A new chat/model, a pause, or a completed
delivery slice does not require closeout when the parent work remains active.

Use this skill only when durable reconciliation/closeout is explicitly selected and the bounded work item is
complete enough for it. Ordinary implementation completion updates normal working state without invoking this
skill. Keep requirements, design, plans, review findings/responses and verification evidence available for owner
inspection; a request to finish implementation is not authorization to archive or clear them.

## Inputs

1. Read the project's canonical instructions and closeout profile, if one exists.
2. Reuse the project's designated working record/scratchpad. Do not create a competing report when the project
   already has one.
3. Identify the bounded work item being closed and its completion conditions.
4. Inspect every repository/document of record touched by that work.

If the project does not define a closeout location, durable documents or cleanup policy, ask only for the missing
decision that actually matters.

## Establish completion scope

Confirm from evidence what is complete, what is deferred, what verification actually ran, and the current repository
state. Check required outcomes against actual artifacts, relevant changes, reviewer responses and execution
results; do not rely solely on a prior completion summary. Distinguish authored/revised, inspected and left unchanged,
and independently verified. A revision to one design does not prove its companion was reconciled. If evidence
contradicts a working-record claim, correct that claim before propagating it. Preserve material unmet prerequisites
or late corrections accurately; final consistency does not prove the required sequence occurred.
Do not call a delivery slice, feature, deployment or acceptance complete merely because code exists or one check passed.

## Reconcile the working record

Reconcile relevant final working artifacts (requirements, design, plan, review and verification evidence) before
writing durable updates. Use the scratchpad to navigate them, not as their sole substitute. Distinguish approved
intent, implemented behavior and verified outcomes; do not copy or archive every draft automatically.

Preserve the project's format and keep the normal scratchpad compact. Confirm that its objective/work item, final
stage, material decisions, blockers/deferred items, verification state and next/closed state are accurate. Do not turn
it into a duplicate closeout report, evidence dump, full plan/review transcript or proposed-text queue. Gather detailed
repository state and candidate durable write-backs separately for the closeout response/workflow. For consequential
real-source claims, follow the project's evidence/revision rules.

## Reconcile only relevant durable documents

Do not refresh every project document. Update or propose only the documents whose owned fact actually changed.
Follow the project's authorization policy: apply already-authorized write-backs, or present exact proposed text when
the project reserves them for approval. Do not promote temporary task-context into permanent documentation by default.

Replace superseded guidance in its canonical document and affected active references instead of appending a
competing amendment. Preserve displaced rationale/evidence in on-demand history when useful or required by project
policy; keep applicable technical constraints intact.

Keep temporary restrictions and unresolved follow-ups in current work/state records with a next action and an
explicit completion/removal condition. Once that condition is met, remove obsolete reminders, pauses and gates from
active guidance; retain the ongoing procedure and real remaining limitations. Do not retire unresolved items merely
because the current work item is closing.

## Validate citations and claims

When the project uses source citations, run:

```
node <skill-dir>/scripts/check-citations.mjs <working-record.md> --root <repo1> [--root <repo2> ...]
```

Run it on changed durable Markdown too when those documents carry checked source citations. STALE consequential
citations must be fixed/reverified or the dependent closeout remains blocked. A checker pass validates locators, not
the interpretation, implementation or acceptance outcome.

## Finish according to project policy

Report the work item closed, durable write-backs, verification/acceptance actually established, deferred follow-ups,
repository/publication/deployment state and any cleanup inventory.

Cleanup is destructive. Perform archival/removal only when the current explicit project/user authorization covers
the identified inventory; requesting reconciliation alone does not clear the working folder. Preserve active parent
feature context when only a child delivery slice completed. Do **not** automatically offer or create a handoff;
handoff is for genuine transfer friction.

## What this skill never does

- Treat ending a chat as proof that work is complete.
- Invent tests, deployment, acceptance, publication or reviewer outcomes.
- Erase unresolved follow-ups or convert estimates/assumptions into results.
- Delete active feature context because one delivery slice completed.
- Assume closeout authorizes commit, push, PR/merge, deployment or destructive cleanup; project policy decides those
  external effects.
