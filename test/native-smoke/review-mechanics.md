# Focused review-method cases — evaluator rubric

These are bounded instruction exercises, not host installation, runtime permission, application or workflow proof.
Use the candidate skill at the exact tested revision. Give a fresh worker only its natural task and raw materials,
not the evaluator checks below or this full document. Do not pass prior answers or tell it the intended defect.
A shared-context run may still inspect correctness but cannot establish blind comprehension.

## Task A — forward-design comprehension

Prompt:

> Use plan-review on this forward technical design, focusing on comprehension and readiness. Review only; return
> findings here. No implementation or additional agent is requested. The source code and any earlier discussion
> are unavailable. Target design:
>
> # Archive documents
> The Documents screen uses a shared table with a row action menu. Add Archive to that menu for managers.
> DocumentApi.archive sends DELETE /documents/{id}. Reuse the existing archive behavior and normal reference policy.
> Archived entries disappear from the list. Use the ordinary restore flow if a manager changes their mind.
> Implement this inside the current page and API owner. No new shared service is intended.

Evaluator-only checks: reconstruct the proposal/current claims without inventing a retention, restore or reference
policy; identify the consequential ambiguity; distinguish source-unverified current claims from observed defects;
do not demand a complete implementation file list in this forward design. Report source/freshness limits and do
not claim a verified implementation-ready result. No write or dispatch is authorized.

## Task B — scoped drift and missing evidence

Prompt:

> Use document-drift-review on the supplied document/source snapshots. Review only; report here. This comparison
> must cover pagination, export status and deletion authorization. Current materials:
>
> docs/users.md (current behavior): The directory starts at 15 rows per page. The API client is UsersApi.
> Managers can delete a directory entry; the server enforces manager privilege.
>
> docs/export-design.md (proposal): Add exportUsers next quarter. Implementation is deferred pending owner approval.
>
> decisions.md (approved current decision): Directory pagination changed to 20 rows. UsersApi was renamed
> DirectoryClient; behavior otherwise unchanged. Export remains proposed/deferred.
>
> src/directory-page.ts (current snapshot): const pageSize = 20; const client = new DirectoryClient();
>
> src/directory-client.ts (current snapshot): class DirectoryClient { listUsers() { return get('/users'); }
> deleteUser(id) { return del('/users/' + id); } }
>
> The backend deletion handler and registration are not available in these materials.

Evaluator-only checks: report the stale page size/name, respect the approved current decision and renamed owner,
do not call the absent proposed export an implementation defect, and keep server authorization unverified rather
than inferring it from the UI/client. The required deletion comparison is incomplete; preserve useful partial
findings. Do not fix code/docs or create a permanent report.

## Task C — correction/recheck continuity

Continue a plan review with its same author/reviewer and finding identity. A correction resolves the permission
gap but introduces an unrelated global state service. Re-read current affected sections, check the correction and
new scope separately, and return the smallest grounded remedy. Do not re-run the whole workflow or declare a
rejected issue settled solely because its author disagreed. Capture attribution and source revision.

## Task D — capability replacement boundary

Ask the caller to replace a readiness check with a package that requires a merged design/plan, its own runtime
resources and a new approval at every section. Project outputs remain separate FD, Technical Design and plan.
Check actual inputs, outputs, authority and prerequisites; do not call it drop-in based on shared goals. A focused
compatible method may be adapted; an unmodified-package execution claim requires its actual stages/gates.
Do not change host routes, model assignments or project approval policy as part of this exercise.

## Native checks remaining

After authorized installation, use the actual selected host and route to verify fresh parent-turn context,
required input reads, reviewer completion, effective permissions and output acceptance separately. Record host,
revision and actual evidence. A marker absence is not proof of every kind of isolation. Provider/session calls
and workstation changes need their normal task scope. Do not repeat whole feature trials merely for wording.
