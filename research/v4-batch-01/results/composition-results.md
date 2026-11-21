# Composition experiment results

All fixtures are synthetic and live under `research/v4-batch-01/fixtures/`. `node --test research/v4-batch-01/fixtures/composition.test.mjs` passed 4/4 after correcting one fixture omission label. The test checks structured scope and evidence properties only; model judgment and live capability are not test assertions.

## F1 — Ticket-scoped visual verification

**Fixture:** `research/v4-batch-01/fixtures/composition-cases.json`, `scope.ticketCapabilities[0]`.

- **Expected:** A local, read-only visual check applies to `FE-SYN-01`, uses fixed baseline `ui-acceptance-v1`, requires two observed interactions and screenshots, and expires at ticket completion. It does not apply to backend-only `BE-SYN-02`, a distinct frontend ticket, or a completed ticket.
- **Observed deterministic result:** Pass. The exact ticket and open-state predicate includes only `FE-SYN-01`; the backend, next frontend ticket, and completed control do not match.
- **Acceptance:** Test verifies applicability only. No browser was launched and no screenshot or interaction result was created. Actual visual acceptance remains **unverified**.
- **Minimum V3 mapping:** Approved ticket requirements + one temporary task/scratchpad overlay carrying trigger, baseline, run conditions, evidence, and expiry; use an authorized host browser capability if available. No global visual rule or new framework.

## F2 — Security-audit replacement

**Fixture:** `research/v4-batch-01/fixtures/composition-cases.json`, `securityReplacement`.

- **Expected:** Accept only a separate read-only reviewer whose output preserves scope, exact input revision, evidence references, limitations, findings, and disposition. Reject missing evidence or unsafe mutation.
- **Observed deterministic result:** `R1-compatible` passes the structural boundary; `R2-incompatible` is rejected because it lacks scope/revision/evidence/limitations, is not independent/read-only, and proposes auto-fixing in the audit run.
- **Acceptance:** This proves the fixture checker rejects those records. Neither scanner nor reviewer was executed. There is no live security finding or security proof.
- **Minimum V3 mapping:** Keep `skills/security-audit/SKILL.md` as the outcome contract; at the caller boundary compare accepted inputs/output, evidence, authority, and independent reviewer role. Map a compatible result into existing review/working records. If a required field or permission cannot be retained, block the replacement. No policy fork or new framework.

## F3 — Project-scoped CI and publication

**Fixture:** `research/v4-batch-01/fixtures/composition-cases.json`, `projectGate`.

- **Expected:** A project-only, tool-independent CI gate applies to `SYN-HDC`, not `SYN-OTHER`. Passing a local command cannot satisfy unavailable corporate CI. Prepared PR text is not an opened/published PR.
- **Observed deterministic result:** Pass for the project-scope and state distinctions. CI is recorded as `unavailable`, and publication is not recorded as opened.
- **Acceptance:** No company CI, ticket tracker, or PR service was accessed. The recorded prepared-description state is synthetic, not an actual PR description.
- **Minimum V3 mapping:** Project instructions define applicability and the gate; the task record captures exact command/run identity, result and blockers; the host supplies the authorized CI capability. Do not promote local evidence into a remote result. No global CI requirement.

## S3 — V3 surface map and minimum configuration

| Fixture | Contract | Skill | Project policy | Task scratchpad | Host capability |
|---|---|---|---|---|---|
| F1 | Outcome/verification and acceptance semantics remain global. | Visual verification may be a capability only if a suitable skill/tool exists; none was added. | Defines which ticket criteria trigger it and local access boundary. | Carries baseline, run conditions, evidence and expiry. | Browser is required for runtime evidence; availability was not tested. |
| F2 | Replacement boundary preserves evidence and authority. | `security-audit` defines the read-only review outcome. | Supplies approved project security requirements where applicable. | Records inspected revision, evidence, limitations and disposition. | Scanner/reviewer route needs genuine independent read-only access; not tested here. |
| F3 | Planning/verification and blocked-completion semantics. | Existing test/CI skills may execute a named gate but cannot invent its scope. | Defines project-only trigger, checker, failure/retry and publication rules. | Records local, CI, PR-preparation and PR-publication states separately. | Actual CI and PR publication capability must be confirmed independently. |

**Result:** The examples fit existing V3 layers. A project/ticket record adds scoped facts; it does not become a second authoritative global workflow. The simplest alternative is the existing contract plus one concise project/ticket mapping and the existing task record (zero new production abstractions). No V3 behavior change is recommended by this experiment.

## S4 — One Gemini native reasoning smoke test

One bounded Gemini native subagent call classified only the synthetic cases, without being shown the deterministic expected classifications. Its report agreed that:

- F1 applies only to the named ticket and remains incomplete without the required observations/screenshots.
- R1 is structurally compatible and R2 is blocked for missing evidence and unsafe auto-fix.
- F3 remains blocked when mandatory corporate CI and publication are unavailable; local pass/PR preparation do not establish either.

**Review of model output:** The response also said the F1 baseline had “expired upon completion,” although the supplied scenario did not state that the ticket was completed; exact-ticket scope, not a completed-state observation, is what excludes later tickets. It described synthetic R1 fields as “observed capability”; these are supplied fixture values, not an executed scanner/reviewer. Those overclaims are not accepted as evidence. This is one model report, not an independent source or runtime result.

## Evidence classification

- **Test assertions:** 4/4 deterministic Node tests pass on the final fixture/test files.
- **Model report:** one Gemini native subagent classification, with the scope and evidence overclaims above corrected.
- **Runtime evidence:** none for visual/browser, scanner/reviewer, corporate CI, PR publication, or installed harness behavior.
