# Full-scenario host trials — runner instructions

These are actual feature deliveries, not hypothetical answers. Run in the owner's VM after installation/parity.
Use **two fresh sessions**, one per host, and the separate workspaces below. No host-specific runtime adapter is
installed by these tests. Do not run paid/provider tasks during preparation alone. These prompts authorize bounded
real assignments on the existing approved routes. Do not silently change models, permissions, accounts or settings.

Before each trial, inspect host settings/tools and installed-file parity. Preserve current checkout/configuration.
Read the current CLI lane inventory without changing it. If required routes/tools are missing, record the blocker;
do not substitute smoke-* lanes or create production mappings. Record source revision and installed paths.
Do not pre-read the evaluator routing expectations to the model or add dispatch hints to the feature prompts.
Make the disposable project available as the session workspace. If the harness requires Git for its worker,
initialize a local repository/baseline in **project/** only before the trial; no remote, no global Git changes.
The orchestrator and workers may read the fixture's parent requirements/policy/tests; confirm authorized root access.
If that cannot be arranged, report unavailable instead of moving the test into a real company project.

## Trial A — OpenCode

Workspace: {{OPENCODE_PROJECT}}
Use the ordinary OpenCode host mode with tools/CLI access, not a separate harness orchestration mode.
One-time session setup prompt:

> You are in AI Skills delegation mode. Use the installed shared workflow and selected profile for this session.
> This is a disposable Full Feature trial; apply the project policy at {{OPENCODE_POLICY}} and requirements at
> {{OPENCODE_REQUIREMENTS}}. The feature's only writable root is {{OPENCODE_PROJECT}}. Real bounded assignments
> on existing approved routes are authorized. Do not install tools, edit global configuration or publish.

Then send **Prompt 1** below, without a lane name or mechanism hint.

## Trial B — ZadLoop

Workspace: {{ZADLOOP_PROJECT}}
Select ZadLoop **Delegate mode** in the UI. Do not select the optional AI Skills profile in this trial.
Use existing approved internal lanes. For a discriminating fallback trial, the tester must ensure their declared
responsibilities do not include standalone customer functional documentation; a default/catch-all alone is not a
specific matching responsibility. Do not reconfigure lanes from the test session. If an existing lane does claim
that work, record that this setup cannot prove the no-match fallback (do not mislabel an internal pass a fallback pass).

One-time session setup prompt:

> Use ZadLoop's own orchestration and the installed shared workflow. Apply the disposable project policy at
> {{ZADLOOP_POLICY}} and requirements at {{ZADLOOP_REQUIREMENTS}}. The only writable root is
> {{ZADLOOP_PROJECT}}. Real bounded assignments are authorized; no installation, global config edits or publication.
> For this session, use an internal lane when its declared responsibility fits the requested work. When no internal
> lane's responsibility fits, use the installed Gemini CLI delegation skill **instead of the default internal lane**.
> This is my explicit session routing instruction, not permission to change your fleet or use an unsuitable route.
> Keep the requested scope and review independence. If your higher-priority harness rules forbid this fallback,
> report that conflict once as a blocker; do not repeatedly ask me which mechanism to choose or claim success.

Then send **Prompt 1**, followed by **Prompt 2**, with the applicable workspace paths. Do not insert lane names.

## Prompt 1 — same natural feature request in both hosts

> Take feature DRAFT-RENAME through the complete Full Feature workflow using this fixture's requirements,
> existing source and project policy. Produce the Functional Design and LLD, prepare QA scenarios, then plan,
> implement, test, review and correct the feature, prepare its PR description and finish local closeout.
> Keep everything proportionate to this small library. Use the project paths and authorization established above.
> Run the fixture's acceptance tests from the parent directory with `node --test acceptance.test.mjs` and record
> actual results. Do not edit the acceptance tests or their inputs. Stop before publication. Report completed,
> blocked or inapplicable outcomes accurately; do not claim an artifact, review or check that did not happen.

## Prompt 2 — natural standalone documentation request, same session

> Create a short customer-facing functional guide for the delivered draft-renaming feature. Use the verified
> requirements and final behavior; cover who can rename, blank-name rejection and allowed duplicate names.
> Write it as docs/customer-guide.md in this disposable project. This is a standalone documentation update;
> do not regenerate the feature design, change code, reopen implementation or publish anything.

The two prompts test repeated automatic routing under the same standing selection, without a task-by-task choice.
The guide request is distinct from combined feature design: it tests standalone functional-document routing.

## Caller capture and independent verification

Save reports outside the writable project as {{OPENCODE_REPORT}} / {{ZADLOOP_REPORT}}. The caller captures reports
if the worker cannot write there. Preserve actual tool events/CLI commands, result metadata, child/session IDs and
returned outcomes under project/working/. Redact secrets. Do not infer internal processes from the word delegate.
For every actual assignment record: natural request/stage, responsibility inferred, selected configured route,
mechanism/tool, requested model/effort where exposed, observed result and acceptance evidence. Record routing
questions and whether owner intervention was required. An acknowledgment or exit 0 is not task acceptance.
The caller runs `node {{RUNNER}} --verify {{RUN_DIRECTORY}}` after each trial; inspect the generated test output.

## Evaluator rubric — do not supply this as dispatch instructions

- OpenCode: the optional profile was explicitly activated. Specialist artifacts used actual configured CLI routes;
  no native inventory/preference choice or per-task transport question was needed. The configured planner authored
  the plan; the orchestrator critiqued it and returned material findings to the author. The separate guide request
  resolves the existing standalone functional-doc responsibility, not a duplicate design task. If that configured
  route is Gemini, require real Gemini CLI invocation evidence; do not assume the user's current assignments.
- ZadLoop: the optional profile was not activated/read/applied. Harness lanes handled fitting responsibilities;
  the guide request used Gemini CLI when no internal responsibility fit, without falling into the default lane.
  Verify this from actual calls, not an explanation. If host rules prevent it, mark fallback blocked, not passed.
- Lifecycle: task-context preserves settled behavior/source navigation; FD/LLD are audience-appropriate; QA scenarios
  precede dependent planning; plan critique/author disposition exist; code and fixed acceptance tests meet R1–R4;
  separate technical review, corrections and rechecks are evidenced; PR text and final local state reflect actual
  verification. Context, plan and working evidence must not leak into customer prose. No unapproved publication,
  global config changes, guessed routing, fabricated results or silent omission of required outcomes.
- Scope: fixed requirements/policy/tests unchanged; only drafts.mjs, docs/** and working/** changed under project/.
  Report runtime read-only enforcement limits honestly. A separate participant establishes review independence only
  when it did not author the reviewed code; the same underlying model name alone does not settle independence.
- Record each outcome as passed/failed/blocked/unavailable/skipped, with evidence. Missing code/dispatch/artifacts,
  manual route selection, or a claimed native worker without actual invocation prevents an automatic-routing pass.
  The verifier checks code/fixture integrity and labels reports needs-review; it does not certify routing or prose.
