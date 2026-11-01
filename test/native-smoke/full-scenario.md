# Full-scenario trial — runner instructions

These are real feature deliveries in disposable fixtures. Preparation/verification never dispatch models; the
session prompt separately authorizes bounded assignments on existing approved routes. Preserve old runs and
configuration. Use a fresh host session and a fresh run for each automatic-routing retest.

**ZadLoop is on hold.** Its fixture remains separate scaffolding; do not launch or resume its trial during this work.
Do not add its internal routing/fallback rules to the shared instructions or our optional CLI profile.

## Workspace handoff — OpenCode

**Open this exact workspace root:** {{OPENCODE_ROOT}}

It contains `POLICY.md`, `requirements.md`, `acceptance.test.mjs`, `baseline.json`, `.git/`, and `project/`.
The **only feature-writable directory** is {{OPENCODE_PROJECT}}, within POLICY.md's narrower permitted paths.
Do not open `project/` as a separate workspace or initialize another repository inside it.

The runner creates one local baseline commit at the workspace root with no remote. It records the result in
`full-opencode-setup.json`. If preparation reports a Git failure, resolve/report that before launch; do not
silently change the workspace to a child directory. Confirm `git rev-parse --show-toplevel` from the root and
project/ resolves to the same fixture root, and that the working tree is clean. Do not migrate existing runs.
Use the same revision's runner for verification of each run.

Before launch, the **setup caller** checks installed-file parity, required tools and existing CLI lane resolution.
Do not write production configuration or substitute smoke-* lanes. Record the source revision and installed paths.
Copy **only the generated `OPENCODE-PROMPT.md`** into the fresh session. Its natural request selects our named
profile but gives no loader paths, lane choices or stage checklist. Do not paste diagnostic findings or the rubric
below into that session. A guided relay diagnostic must use a separate session; it is not an automatic-routing pass.

## Capture preflight — setup caller only

Before another feature trial, demonstrate that the installed host's supported export/log facilities retain a tiny
isolated probe's original user text, file-read path/output, terminal command/result and final assistant response,
with event IDs and individual tool timestamps sufficient to establish order. Keep this probe separate from the
feature session. If capture is insufficient, report the gap before repeating the feature. Do not infer capability
from a missing dedicated event tool; inspect installed CLI help and verify the actual export.

Locate the completed feature by exact workspace and title in session metadata, then verify its identity before
exporting only that session. Save the original final response verbatim, never reconstructed from artifacts.
Keep raw exports local and protect unrelated content/credentials. Compare actual tool times, not export listing
order or later summaries. Record user intervention and distinguish missing evidence from contradiction.

Requirements: {{OPENCODE_REQUIREMENTS}}
Project policy: {{OPENCODE_POLICY}}

## Optional follow-up — same session, after the feature

> Create a short customer-facing functional guide for the delivered draft-renaming feature. Use verified
> requirements and final behavior; cover who can rename, blank-name rejection and allowed duplicate names.
> Write it at project/docs/customer-guide.md from the workspace root. This is a standalone documentation update;
> do not regenerate feature design, reopen implementation, change code or publish anything.

This follow-up tests a different intent under the standing profile without giving a lane/transport hint. Keep its
result separate from the feature's initial routing and lifecycle result.

## Caller capture and independent verification

The caller saves the final report at {{OPENCODE_REPORT}}, outside the feature-writable directory. Preserve actual
commands/tool events, result metadata and child/session IDs under project/working/. Redact secrets. Record any
manual workspace or routing intervention; successful guided recovery does not erase the original failure.
The caller runs `node {{RUNNER}} --verify {{RUN_DIRECTORY}}` and inspects actual outputs. An exit 2 can mean
unrun smoke/skill/host cases; it is incomplete coverage, not failed acceptance. Do not turn file existence or a
code pass into a routing/lifecycle pass. No provider calls are launched by the verifier.

The verifier writes `full-<host>-verification.json` with its own SHA-256, runtime version, command/arguments,
working directory, timestamps, exit code/signal/error, protected-input hashes, baseline commit and forbidden paths.
`failureStage` distinguishes fixture-integrity, command-execution and acceptance-test failures. Each invocation
keeps a separate `full-<host>-verification/<attempt>/` result plus exact stdout/stderr, so a successful rerun does
not erase the first failure. Stable JSON/text filenames point to the latest attempt. An absent feature report
remains skipped; the verifier never certifies workflow behavior from a code pass.

### Debuggable caller report

Reuse the run's `results.md`; do not create extra feature deliverables or paste this rubric into the feature prompt.
Keep the actual final response verbatim in the designated response file, separate from the assessment. Include:

- **Identity:** source revision, installed-file parity result, exact workspace, root session ID/title and reported
  agent/model/effort; raw export path and capture limits. Locate by exact metadata before inspecting content.
- **Case verdicts:** for code, intake, design/QA prerequisites, plan authorship/review/disposition, implementation,
  separate code review/corrections and retained completion state, give expected behavior, observed behavior, verdict and evidence
  locator. Distinguish passed/failed/blocked/unverified/skipped; do not collapse missing evidence into failure.
- **Chronology and assignments:** relevant event IDs and timestamps, configured role/route, invocation/result
  paths, child session ID, output and reviewed artifact version/hash where captured. Show profile/fleet access
  before dispatch, prerequisite readiness and material reviewer rechecks. Metadata reports the requested/reported
  route, not proof of internal provider routing. Include question-tool answers when assessing user intervention.
- **Failures and recovery:** preserve the first actual error, exact relevant command/tool input, cwd, exit code,
  stdout/stderr or raw event pointer, attempted correction, fresh output directory and continuation session ID.
  State what remained failed, what recovered and what was accepted separately; do not replace failed runs with
  successful summaries. Record unsupported claims without inventing a permission/provider cause.
- **Next action:** smallest evidence-supported correction for each unresolved blocker, plus native/containment
  limits. Missing original events stay unverified; do not reconstruct them or automatically repeat the feature.

Redact credentials and unrelated conversation content; do not collect environment dumps or account identity merely
to fill report fields. File existence or narration is not evidence of authorship, review or execution. Automatic
verification details supplement, rather than replace, the captured root/relay records.

## Evaluator rubric — do not paste as task instructions

- Confirm observed reads of the current profile and actual loader/resolver use. The retired execution.json and
  semantic catalog are not the live fleet. A claimed absent route needs actual discovery/invocation evidence;
  general feature authorization does not permit direct specialist work outside this profile's ownership rules.
  Implementation-plan authorship is the orchestrator's default responsibility, not a missing-route exception.
- Feature-design responsibility covers requested FD and LLD together, before dependent planning/implementation.
  Check output content, assignment scope and chronology. A post-implementation design fix must remain identified
  as late; passing a structural checker or final behavioral consistency cannot establish earlier compliance.
- Intake preserves source pointers, approved scope, consequential Q&A/decisions and open questions without
  preselecting a technical solution. Narrow consequential observations remain sourced leads, not approvals.
  Design/QA/planning verify relevant originals; absence of a broad technical context summary is not itself a
  blocker. Reuse one record, not a mandatory second handoff, and check superseded decisions stay superseded.
- QA scenarios precede dependent planning. Verify that the root session authored the plan, then dispatched a
  separate configured plan reviewer; the root author dispositions findings and revises the plan, with affected
  material revisions rechecked before implementation. An explicit user-assigned external author is an exception
  to record, not an automatic-routing pass for the default. Read question-tool answers as well as user messages.
  Do not infer authorship, review or chronology from file existence or later narration: inspect actual root tool
  events and reviewer invocation/results, preserving reviewed plan versions or hashes where available. Self-critique
  is not separate review. Additional review/debate is conditional; missing reviewer routes must not become silent
  self-acceptance. Implementation and substantive separate code review have real dispatch evidence. Verify
  missing-output recovery from result/artifact evidence, including session continuity when claimed.
- Final artifacts and retained completion state accurately distinguish revised, checked unchanged and independently verified.
  Inspect paired design reconciliation rather than accepting a summary that says both were updated. Correct
  material inaccuracies; operational hiccups belong in working evidence, not automatically in customer/PR prose.
- Fixed acceptance tests cover R1–R4; relevant authored checks, review/correction and PR preparation are evidenced.
  API regressions and as-built Technical Design are inapplicable to this pure library. No unapproved publication,
  settings changes, fabricated results or silent omission of required outcomes. Read-only flags do not alone prove
  OS-level containment. Separate session/assignment authorship determines review independence, not model names.
- Inspect fixed-input integrity, actual worktree diff against the recorded preparation baseline, and allowed scope.
  The commit-only describe-pr helper may omit these uncommitted changes; a local draft grounded in actual worktree
  evidence is acceptable here. Do not invent a develop branch or make feature commits to satisfy that helper.
- Report code, routing, lifecycle and prose/evidence quality separately as passed/failed/blocked/unavailable/skipped.
  Test/artifact checks remain separate from the manual semantic assessment. Preserve failed originals.

## Operator and recovery boundary probes

After setup, use `operator-scenarios.md` from the same source revision for explanation-only checks of plan-only
requests, unattended material blockers, retained artifacts, verification cadence and approved recovery. These
probes authorize no provider calls, deployment, configuration changes or cleanup. Inspect actual instruction
application; a correct explanation is not native execution proof. Batch them with the main trial where useful,
not as another required installation. Preserve contradictions and unavailable capability as such.
