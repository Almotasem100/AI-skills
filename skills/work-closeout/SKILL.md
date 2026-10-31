---
name: work-closeout
description: Reconcile a genuinely completed feature or other bounded work item using the project's designated working record. Capture verified/unverified outcomes, decisions, deferred items, repo state and relevant durable write-backs; validate consequential source citations before relying on them. Use when the user asks to close out, wrap up completed work, reconcile the feature, or update durable project records. Do not invoke merely because a chat/session is ending, or for routine completion of a child/delivery slice while its parent feature remains active; update normal workflow state instead.
---

# Work closeout

Closeout is a **work-lifecycle** action, not a conversation-lifecycle action. A new chat/model, a pause, or a completed
delivery slice does not require closeout when the parent work remains active.

Use this skill when a feature or other agreed bounded work item is actually complete enough that durable project
state, acceptance evidence, follow-ups or cleanup should be reconciled.

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
state. Do not call a delivery slice, feature, deployment or acceptance complete merely because code exists or one
check passed.

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

Cleanup is destructive. Perform it only when the current project/user authorization covers it. Preserve active parent
feature context when only a child delivery slice completed. Do **not** automatically offer or create a handoff;
handoff is for genuine transfer friction.

## What this skill never does

- Treat ending a chat as proof that work is complete.
- Invent tests, deployment, acceptance, publication or reviewer outcomes.
- Erase unresolved follow-ups or convert estimates/assumptions into results.
- Delete active feature context because one delivery slice completed.
- Assume closeout authorizes commit, push, PR/merge, deployment or destructive cleanup; project policy decides those
  external effects.
