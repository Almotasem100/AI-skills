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

## Evaluator rubric — do not paste as task instructions

- Confirm observed reads of the current profile and actual loader/resolver use. The retired execution.json and
  semantic catalog are not the live fleet. A claimed absent route needs actual discovery/invocation evidence;
  general feature authorization does not permit direct specialist work in this profile.
- Feature-design responsibility covers requested FD and LLD together, before dependent planning/implementation.
  Check output content, assignment scope and chronology. A post-implementation design fix must remain identified
  as late; passing a structural checker or final behavioral consistency cannot establish earlier compliance.
- QA scenarios precede dependent planning; planner authors and orchestrator critiques, with author disposition.
  Additional plan challenge is conditional. Implementation and substantive separate code review have real dispatch
  evidence. Verify missing-output recovery from result/artifact evidence, including session continuity when claimed.
- Final artifacts and local closeout accurately distinguish revised, checked unchanged and independently verified.
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
