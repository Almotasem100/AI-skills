# Friction-log audit and proposed changes

## Scope and evidence

Review of `review/friction-log-notes` at `61a7215`, against `master` at `1d00fab`.
The working branch is `improve/friction-log-followups`, based on master with the original notes
copied unchanged from that source revision. This review is working evidence, not startup policy or an execution profile.
Merge remains an owner decision. No workstation installation, lane/model change, plugin edit or HDC change is included.

The 16 new entries are the previous orchestrator's reports, partly recovered after scratchpad cleanup.
They identify useful failure modes, but raw run logs and the deleted scratchpad are unavailable here.
Claims about runtime behavior, speed, model quality and permissions are attributed reports rather than independently
reproduced results. Source inspection can establish a guidance gap or contradiction without establishing a live defect.
The three older entries are also assessed below; no historical failures are silently marked resolved.

## Earlier entries

### 1. Gemini skill loading and automatic selection

**Report:** Explicit invocation worked after approved context access; automatic application of a guard was inconclusive.
**Assessment:** Instruction discovery, source readability and actual skill application are separate. A listed skill is
not proof that its instructions were applied. The current README already discloses host-specific discovery limits;
GUIDE and native smoke material provide loading/parity checks.
**Disposition:** Retain as historical evidence. No global context-access change or automatic-selection claim.
Revisit only with a current failing host/version and actual invocation evidence; do not repeat all prior host trials.

### 2. Plan-mode discovery denial, missing sandbox prerequisites and successful explicit relay

**Report:** Discovery was denied, a sandbox could not start without its dependencies, but an interactive relay ran.
**Assessment:** Those are different capabilities, not contradictory results. The current dispatch reference already
separates lookup, resolution and dispatch, and forbids configuration/permission changes as a diagnostic shortcut.
**Disposition:** Existing rules cover it. No new permission mode or sandbox installation. Readiness guidance added
for entry 8 also makes the distinction between an accessible route and its actual tools/inputs concrete.

### 3. Windows orphan-near-timeout smoke failures

**Report:** Five near-deadline fake-CLI cases failed; vendor provenance later records a separate seven-failure run.
**Assessment:** Different runs/counts must retain their own provenance. Fake-CLI failures do not diagnose live
Gemini approvals. Linux results cannot close Windows process launch/drain timing questions.
**Disposition:** Unresolved historical host-specific issue. No watchdog rewrite or broad Windows test request in this
batch. Reopen with the failed case IDs, Node/OS revision and captured outputs if it blocks an actual update.

## CADE-1814 entries

### 4. Numbered grilling with recommendations

**Report:** Clarification rounds settled owner decisions without ambiguity-driven rework.
**Assessment:** Useful positive feedback. The portable contract already requires consequential clarification before
dependent design/planning. The unchanged external grilling skill is not ours to rewrite in place.
**Disposition:** Keep the practice. No universal round size, mandatory extra interview or copied grilling policy.
The reported absence of rework is not a controlled causal finding.

### 5. Parallel frontend/backend implementation

**Report:** Separate writers in separate repositories worked against a pinned wire contract without reported drift.
**Assessment:** Worth preserving as an option. Contract agreement is necessary but insufficient: shared generated
files, unfinished prerequisites or unstable interfaces can still make concurrent writes unsafe.
**Change:** The contract's ownership section explicitly permits implementation overlap when inputs are settled,
write scopes are disjoint and dependencies allow it, with integrated verification before acceptance.
**Not adopted:** An unconditional parallel-implementation default or a new participant/model assignment.

### 6. Reviewer-session reuse and documentation review

**Report:** Continuing the reviewer session helped rechecks; review found two documentation errors.
**Assessment:** Existing relay continuation guidance already supports delta briefs and recorded sessions. Reuse must
still preserve independence, relevant current inputs and source-grounded review; it is not proof of lower token cost.
**Change:** Relevant review includes affected documentation/examples, checking implemented fields against serialized
contracts. Existing review boundaries remain; no second mandatory documentation reviewer is introduced.

### 7. Intermittent emulator/persistence tests

**Report:** An implementer reported 9/0, but one of four later orchestrator runs failed.
**Assessment:** A real warning about evidence quality; cause is unknown. Five passes would not prove determinism or
repair a race. Always repeating every test and every worker's gates conflicts with proportionate verification.
**Change:** Verification preserves failed attempts, calls for diagnosis and bounded repetition targeted to the
intermittent failure, and reports counts/failures/skips and uncertainty. A subsequent green run does not erase a failure.
**Not adopted:** A universal five-run loop or automatic duplicate execution. Reopen a project-specific repeat gate
only if the owner wants one for a named suite with a defined purpose and cost.

### 8. Gemini test author could not execute gates

**Report:** `auto_edit` did not permit the needed shell command, and a broken skip name reached the coordinator.
**Source check:** The Gemini overlay already says `auto_edit` auto-approves edit tools, **not all shell actions**.
It does not establish that all shell execution is universally impossible. Effective settings and installed versions matter.
**Change:** The dispatch reference requires actual tool/input readiness and explicit execution ownership when a test
author cannot run gates. Authored tests and executed results must be reported separately. No silent permission escalation.
**Decision D1:** Keep the existing author route with execution/correction feedback performed by an authorized executor
(recommended for this batch), or explicitly reassign executable test-writing to an existing approved shell-capable route?
The latter needs the actual local lane/model selection and is not a repository-only fix. No fleet changes were made.
The separate Gemini provider-plugin workstream remains separate from this CLI relay observation.

### 9. Gemini could not read findings outside its workspace

**Report:** A temp-folder findings file could not be opened from the selected workspace.
**Assessment:** A path can be correct yet unreadable. Workspace containment and Git-ignore filtering are distinct;
the overlay already documents approved access for ignored inputs. This report does not prove a universal Gemini restriction.
**Change:** Dispatch readiness requires readable source/brief/findings locations or concise relevant inline text.
No broader workspace grant, ignore-setting change or blanket instruction to commit temporary findings.

### 10. ECONNRESET, timeout and successful bounded retry

**Report:** A connection reset and a 30-minute timeout occurred; one bounded retry worked.
**Assessment:** The contract already requires bounded recovery and preserving partial effects. Retrying a live or
unknown writer can duplicate changes; the selected execution policy owns that recovery decision.
**Disposition:** Existing rules cover the portable lesson. No universal 30-minute timeout, automatic retry count,
transport swap or plugin change. Inspect actual state before retrying; successful retry does not diagnose the cause.

### 11. QA invented UI facts

**Report:** Wrong tool/page-size/control/column details appeared in QA scenarios.
**Assessment:** This is a grounding failure, not evidence that a particular model always fails. QA prepares intended
behavior early, so current code must not override approved changes merely because it already exists.
**Change:** `qa-scenarios` explicitly checks load-bearing labels, columns, controls and pagination against approved
design/current sources as appropriate. A short source-linked facts block is optional working context, not another
mandatory artifact or a source inventory in the tester handoff. No model upgrade is imposed.

### 12. Documentation invented an example API field

**Report:** An example field was unsupported by the real API.
**Assessment:** Plausible JSON is not an implemented contract. A new designed field can be valid when clearly
proposed; examples of current behavior need actual serialization evidence, including getters/projection rules.
**Change:** Relevant review checks documentation and payload examples against actual contracts. Review can be combined
with the existing code-review responsibility. No runtime schema framework, extra reviewer or copied JSON inventory.

### 13. Plan omitted documentation/inventory work and exact safe verification command

**Report:** Review found missing maintenance work and a wrapper default that performed mutations.
**Assessment:** The current planning section links verification to requirements, but leaves these omissions implicit.
The correct fix belongs in portable planning semantics; there is no first-party implementation-plan template here.
**Change:** Plans include affected maintained docs/generated inventories when their facts change, plus concrete
commands/options, prerequisites and the distinction between read-only probes and fixture/data mutations. Inspect
wrapper defaults. HDC owns its actual runner names, credentials/fixtures and environment authorization.

### 14. Windows line-ending churn

**Report:** A worker introduced CRLF-only backend churn.
**Assessment:** Avoidable scope noise and potential merge trouble. Equal diff-stat strings are not a content proof:
two different changes may have equal totals, and platform display/configuration can differ.
**Change:** Verification requires preserving existing endings/formatting outside the intended change and investigating
unexpected churn. Comparing normal and `--ignore-cr-at-eol` diffs is a diagnostic, not an equality-based acceptance gate.
No mass normalization, `.gitattributes` rewrite or repeated boilerplate in every brief.

### 15. Expired authenticated runner sign-in

**Report:** Saved sign-in expired after about a day and blocked unattended verification.
**Assessment:** Environment prerequisite, not an application defect or a reliable universal session lifetime. Asking
the owner to reauthenticate at every deployment would add ceremony even when a session is still valid.
**Disposition:** Existing verification/recovery rules already report missing login and blocked acceptance honestly;
planning now names prerequisites. Check readiness at the relevant verification checkpoint, use the supported
interactive refresh only when needed, and retain completed work. No credential handling or automatic login refresh.

### 16. Read-only reviewer had write tools exposed

**Report:** No writes occurred, but the reviewer had tools capable of writing.
**Source check:** The OpenCode relay selects `plan` and omits `--auto`; it does not install a sandbox or revoke
host-configured permissions. The old skill/brief text overstated this as an inability to edit.
**Change:** Three vendored OpenCode guidance files distinguish requested read-only behavior from enforced containment,
with LOCAL CHANGE markers, provenance and a regenerated patch. Effective installed permission behavior remains unverified.
**Disposition:** No host-policy change. If a project requires enforced containment, a verified approved boundary is a
prerequisite; otherwise disclose the limitation. No observed writes is not proof that writes were impossible.

### 17. Design drift toward unnecessary complexity / duplicated authorization

**Report:** Later reviews removed broader selectors and client copies of server role policies.
**Assessment:** Worth addressing earlier, but “the server is the only authorization gate” is too imprecise for portable
policy. Client affordances/routes and server security checks have different purposes. Some offline/multi-tier designs
have other legitimate requirements; one project's exact mechanism must not become a universal prohibition.
**Change:** `create-lld` starts from the smallest sufficient design and justifies extra state/abstractions/business-rule
copies. Permission-sensitive design distinguishes client visibility/interaction from authoritative server enforcement,
using an established capability contract where available. HDC-specific conventions remain in HDC.

### 18. Variant without model on resumed OpenCode 2.x session

**Report:** The resumed invocation failed before task execution.
**Source check:** The existing relay already rejects a variant without a model on 2.x and joins model+variant when both
are supplied. The writing guide incorrectly said resumed runs “don't take” a model. This is a concrete documentation
contradiction, not a missing runtime guard.
**Change:** Correct the vendored writing and dispatch references: inherit the session model when no model dial is
supplied; if specifying a variant on 2.x, provide the same authorized model explicitly or via the resolved lane.
Do not combine an already joined model value with another variant. Preserve recorded session identity and delta briefs.
**Not adopted:** A new relay implementation, model substitution, or mandatory explicit flags when a lane already resolves them.

### 19. Cleanup removed the only workflow-improvement notes

**Report:** Notes existed only in the scratchpad and were later recovered from conversation context.
**Assessment:** The strongest direct continuity gap. Cleanup authorization alone says nothing about whether unique
content has a safe durable home. Existing retention rules reduce the risk but do not explicitly check feedback.
**Change:** `work-closeout` inspects unique feedback/findings before approved cleanup, preserves them in an existing
approved durable record, verifies the save and only then clears the source. If the destination requires separate
authority, keep the source. Observations/proposals must not silently become accepted policy.
For this authorized review, the original portable feedback is preserved in `docs/friction-log.md`; project/customer
material must stay in its approved project record rather than being copied to a portable/public workflow repository.
No automatic cross-repository publication or mandatory new feedback document is introduced.

## Proposed branch outcome

- Preserve all original observations unchanged; this audit records dispositions separately.
- Edit the owning contract/skills/references rather than adding reminders to global startup instructions.
- Correct OpenCode guidance and preserve reproducible vendor provenance; leave relay runtime and Gemini overlay unchanged.
- Leave D1 route reassignment pending. Keep bounded repetition, conditional parallel work and effective-permission
  disclosure as the default recommendations above; broader fixed policies need an explicit owner choice.
- Review/merge this branch only after owner discussion. Source checks do not establish installed-host compliance.

## Validation

- `node --test test/*.test.mjs test/native-smoke/*.test.mjs`: **47 passed, 0 failed, 0 skipped** on Linux.
  Includes Gemini overlay application, syntax, parity and focused fake-CLI checks.
- `node test/relay-smoke.mjs --only opencode` from the vendor checkout: all selected fake-CLI checks passed.
  Covers model/variant argument mapping, requested plan-agent arguments, and existing rejection cases;
  it does not establish actual host permissions or native session behavior.
- Reconstructed the vendored upstream file state by reversing the pre-existing local patch, applied the regenerated
  zero-context patch with `git apply --check --unidiff-zero` / `git apply --unidiff-zero`, and compared all five
  patched files byte-for-byte with this branch. This is local patch reproducibility, not a fresh upstream audit.
- `git diff --check`: passed after patch formatting reconciliation.
- No application, Windows, installed-harness, authenticated-environment or provider-session tests were run.
  No relay runtime or Gemini overlay code changed; no live containment or performance claim follows.
