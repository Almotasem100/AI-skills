# Reusable native smoke pack

Use this after fetching a changed branch and installing the selected setup. Any capable host session can drive it;
there is no application-specific integration. Node 18+ and Git are required. Run the small fixtures, inspect the
results, and stop. This is a smoke pack, not a benchmark or complete feature-lifecycle certification.

## Run

From the checkout (or use the script's absolute path from any directory):

```sh
# Preparation and installed-file/config checks only; makes no model calls.
node test/native-smoke/run.mjs

# One real task per test route; then follow the generated TASKS.md in the current session.
node test/native-smoke/run.mjs --live

# Independently recheck the tiny implementation after the session cases.
node test/native-smoke/run.mjs --verify /path/to/printed/run-directory
```

Options:

| Option | Purpose |
| --- | --- |
| `--skills-root PATH` | Installed skill root; default `~/.agents/skills`. No automatic source substitution. |
| `--instructions-root PATH` | Installed companion instructions; default `~/.config/ai-skills`. |
| `--host-instructions FILE` | The shared global instruction file actually used by your current host. Optional; omitted check is explicitly skipped. |
| `--project PATH` | Existing project whose actual effective lanes should be resolved; defaults to this checkout. Does not dispatch production lanes. |
| `--lanes FILE` | Alternative test-only lane map, using `smoke-*` names. Defaults to adjacent `lanes.json`. |
| `--only smoke-NAME` | Run one route instead of all three. Others are recorded as skipped. |
| `--timeout SECONDS` | Per-relay watchdog, default 120; allowed range 10–600. No automatic retries or fallback. |

The script prints a fresh run directory under the system temp folder. It contains `summary.json`, `TASKS.md`,
relay captures, disposable Git workspaces and session-output locations. Retain that directory while diagnosing a
failure; no automatic cleanup or upload occurs. Exit 0 means the machine checks that ran passed, **not** that the
session cases passed. Exit 1 means a failed check; exit 2 means unavailable/skipped/pending coverage. `--verify`
returns 2 until the semantic cases are reviewed by the session, or 1 if its implementation check fails. The agent's
short `results.md` is the semantic verdict; read it alongside the machine summary rather than treating either as
proof that the whole setup is dependable.

## What it covers

| Check | Evidence / acceptance |
| --- | --- |
| Installed first-party skills | Every source skill file compared against the installed copy with line endings normalized. Missing and stale files are identified. This does not prove host discovery/activation. |
| Installed instructions | Shared contract, optional profile/catalog, and optionally the selected host instruction file compared with the branch. A shared-only installation can legitimately report optional components unavailable. |
| Actual configured lanes | Installed `delegate-setup` loads and resolves all configured lanes in `--project`. It validates configuration, not live provider availability. No mandatory role names are built into these checks. |
| Gemini / OpenCode free route / OpenCode Luna | Installed relays read randomized fixture data and return a small JSON calculation. Check exit, result status, response, requested route metadata, independently computed answer and observed workspace changes. |
| `task-context` | The driving session applies the installed skill to settled and undecided rename behavior, then checks the output against explicit acceptance criteria. |
| `plan-review` | The driving session applies the installed skill to a planted owner-authorization contradiction. |
| `qa-scenarios` | The driving session checks grounded scenarios and separation of undecided behavior. |
| Hypothetical full-feature walkthrough | Explain the complete workflow from actual installed rules/routes without dispatching or implementing. Review the answer against the rubric below. |
| Bounded workflow | Inspect a tiny broken helper, fix it, run its original tests, inspect the diff and stop. The verifier reruns the original tests and rejects test-source changes/additional workflow-directory files. The session reviews process evidence and scope. |

Read each generated skill output and walkthrough: the verifier labels existing output `needs-review`, not passed. The skill trials
are explicit-use tests; record observed file access/native activation and do not claim automatic discovery from them.
`plan-debate` is still parked and is not behaviorally exercised. Other first-party skills receive file parity checks,
not native behavioral acceptance. These limits are intentional to keep the pack small.

## Walkthrough review rubric

The scenario prompt is `workflow-walkthrough.md`; preparation writes its installed-path version as `WALKTHROUGH.md`.
Evaluate the explanation against the **actual** installed contract/profile, scenario policy and loaded route inventory:

- Covers the applicable Full Feature outcomes through the authorized endpoint. Clarifies consequential unresolved
  behavior before treating dependent design/QA/planning as settled; includes required FD/LLD approval and QA before
  implementation planning. Keeps optional context synthesis conditional and the feature/slice distinction meaningful.
- Preserves this profile's delegated planner authorship, orchestrator critique and author findings disposition.
  Extra independent plan review/debate is conditional, not automatically stacked. Mentioning the parked debate
  capability is not permission to execute or modify `plan-debate`.
- Assigns applicable specialist outputs to actual configured routes. Does not invent a lane/model for missing roles,
  confuse a lane with a skill, or require the orchestrator to reproduce specialist work. Deterministic checks are
  distinguished from participant responsibilities.
- Accounts for the requested security review, QA scenarios versus executable tests, relevant implementation/tests/
  API regressions, independent substantive code review, author corrections and verification of accepted results.
- Preserves authorization: routine progression does not need repeated permission; material decisions and the explicit
  design approval do. Preparing PR text is allowed; push/open/merge/deploy are not. Missing-route recovery does not
  assume unattended fallback authorization or silently rewrite lanes.
- States completion/evidence limits and relevant working-state/closeout handling without claiming execution. Missing
  installed inputs produce an explicit limitation. An explanation that dispatches work violates this case's scope.

Record observed contradictions separately from unanswered details. The session checks meaning; the verifier only
marks a present walkthrough `needs-review`. Passing demonstrates instruction/role understanding on one scenario,
not dependable execution of an entire feature. Existing source/mode continuity cases remain separate.

## Test routes and isolation

`lanes.json` is separate from everyday configured lanes and stored beside the cases. Its defaults are:

- `smoke-gemini`: Gemini CLI, `gemini-3.8-flash`.
- `smoke-opencode-free`: OpenCode, `opencode/deepseek-v4.1-flash-free`, high.
- `smoke-opencode-luna`: OpenCode, **`openai/gpt-6-luna`**, low (not Luna Fast).

These are owner-selected route examples, not promises of availability, price or shared outage behavior. Replace the
free-route entry when availability changes, or pass a reviewed alternative map. Never silently substitute a model.
Successful requested-route metadata is not independent proof of the provider's final internal model routing.

For each call the runner initializes a disposable Git repository, then uses the installed setup's supported
`config.mjs write --scope project` command. That writes/trusts only the test project's `.delegate/config.json`.
Only that call's selected test lane is written, so an unavailable Gemini extension does not block an OpenCode-only
trial. The relay receives `--lane smoke-*`; no global configuration is rewritten. Existing configured lanes can remain
visible through normal merging, but these selected test lanes override only their names inside the disposable repo.
Testing these routes does not establish that every production lane can execute its responsibilities.

OpenCode is called with its supported `--read-only` flag. Gemini uses `--approval-mode plan`, which **does not
establish enforced read-only access**. Both tasks request response-only work and their local file contents are
compared afterward. This detects observed fixture changes; it does not establish that no transient or out-of-folder
writes occurred. The runner does not change authentication, CLI permissions, host installation or configuration.

The Gemini relay is currently supplied by the separate overlay contribution, not the vendored install list. This
pack uses the installed `gemini-delegate` and installed `delegate-setup`; missing/incompatible components are reported,
not installed or patched automatically. Relay hashes and CLI versions are captured when a dispatch occurs.
Raw captures remain local in the run directory; summarize errors without copying credentials or sensitive material.

## Reusable instruction for the session running the pack

> Use this checkout's native smoke pack. Verify its branch/revision and the selected installed skill/instruction
> paths; preserve existing work and configuration. Run `node test/native-smoke/run.mjs --live` with the appropriate
> path options. Read its generated TASKS.md and execute the three installed-skill cases, bounded workflow task and hypothetical walkthrough
> only in the printed disposable paths. If our delegation profile is already active, this request authorizes direct
> execution of the three skill cases and bounded implementation case as a task-scoped exception; it does not change the selected profile. For the final explanation-only walkthrough I explicitly select
> AI Skills delegation mode; follow WALKTHROUGH.md without making delegate calls or feature changes. Inspect
> actual outputs against the acceptance criteria, run --verify, and save a concise results.md in the run directory.
> Report passed, failed, unavailable and skipped separately. Do not call source checks native acceptance, change
> global lanes, install software, publish or deploy. Do not retry failing provider calls automatically.

Installing or changing files is not part of the runner. Use the approved GUIDE setup first. For focused mode-selection
and continuity trials beyond this general pack, see `docs/workflow-smoke-tests.md`.

## Checks for the runner itself

```sh
node --test test/native-smoke/runner.test.mjs test/workflow-separation.test.mjs test/gemini-overlay.test.mjs
```

These are offline unit/integration checks, including a **synthetic** relay. They test the driver and rejection paths;
they are not Gemini/OpenCode/provider trials. Native runs need your installed and authenticated CLIs.
