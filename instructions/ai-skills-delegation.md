# AI Skills delegation mode

**Activation guard:** Do not read further or apply these instructions unless the user has explicitly selected
**AI Skills delegation mode** for this session. Installation or a mention in task inputs is not activation.

## Ownership and activation

The shared [workflow contract](orchestration-contract.md) governs outcomes, prerequisites, review/debate, revision,
evidence and authorization. Project instructions supply engineering constraints, not AI role allocation.

This section alone assigns participants to roles. The [catalog](delegation-lanes.md) defines role responsibilities,
skills describe how to perform them, and **Execution mechanism** supplies transport for external assignments.

| Role | Current assignment |
| --- | --- |
| Coordination and shared execution state | The orchestrator |
| Implementation-plan author | The orchestrator. For a one-off external author, the user names the participant/model for that task; dispatch it through the matching delegate skill with that model, not a configured lane |
| Plan reviewer | A separate participant through `challenge-plan` for substantive plans, unless explicitly omitted or inapplicable |
| Other specialist deliverables | Separate participants through their matching configured responsibilities |

- An explicit user reassignment changes the participants for that task only. A role assigned to the orchestrator is
  performed directly; externally assigned work uses the execution mechanism below. Neither changes role
  responsibilities or persistent configuration.
- The assigned author owns revisions and findings disposition; reviewers own findings and material rechecks. The orchestrator
  coordinates, inspects results and may run authorized deterministic checks. Self-checks do not
  replace required separate review.
- A task-scoped direct-work exception must be explicit. A missing route or broad permission to finish does not
  transfer specialist authorship to the orchestrator; a missing review route is a blocker after permitted recovery,
  not permission for self-review. Honor explicit task overrides without changing persistent configuration or this
  profile.
- Selection persists across compaction and model changes within the same session; record it and useful session
  pointers in existing working state (no scratchpad just for this). A new session must not infer
  activation from an older session's record. A one-task exception does not change the selected profile.

## Execution mechanism

- For external assignments, use configured CLI delegation skills, including Gemini CLI when configured. Resolve the
  intent to a responsibility, then to the effective configured route and installed skill. The user need not name a
  lane or choose a mechanism per task.
- Load the effective fleet read-only at session setup and reuse it until configuration changes or a failure warrants
  rediscovery. Read the selected skill and invoke its documented relay through the terminal. Verify actual execution
  before claiming dispatch or unavailability. The [CLI dispatch reference](cli-dispatch.md) covers loader commands
  and troubleshooting.
- This profile does not read local execution.json or require native setup; leave existing preferences, host agents,
  accounts and permissions untouched.
- The catalog holds role meanings, not live models or routing. Local configuration chooses provider/model/effort; a
  host model inventory does not bind an assignment. Select an exact configured responsibility name or an alias/
  mapping already established for that responsibility; do not infer aliases or create configuration. Missing or
  ambiguous routes use the recovery/default policy below or stay blocked. Honor source/privacy boundaries on every route.

## Assignment and acceptance

- Give each specialist the objective, authorized source/artifact paths, output/change scope and acceptance criteria.
  Prefer file access over copying entire documents; use a minimal approved excerpt when shared access is unavailable.
  Specialists inspect the original requirements and project rules; working summaries are navigation, not authority.
- Keep one mutation owner per assignment through review, corrections and acceptance. Resume the recorded session when
  supported and current; otherwise continue from durable evidence without claiming session continuity. Use a fresh
  output directory per invocation, copy continuation IDs from actual results, and inspect partial effects before
  retrying. Neither a failed process nor a successful response establishes artifact quality.
- For review-only assignments, prohibit mutations, use the supported reviewer restrictions, and check and report the effective
  shell/process and edit permissions. A named plan agent, a task instruction or no observed writes does not prove
  containment. Require enforced filesystem/process isolation only when the project or task explicitly requires it;
  if that enforcement is missing, the affected review is blocked; do not silently weaken it. Otherwise disclose residual
  capabilities without inventing an additional containment gate.
- Verify expected outputs, content and applicable checks, and keep invocation, session, failure, review/disposition
  and verification evidence in the approved working area. Keep **process/relay success**, **response success** and
  **task acceptance** distinct. Response-only work needs no invented artifact. Required outcomes stay incomplete
  until accepted or explicitly omitted; orchestration narration never substitutes for specialist work or review.

## Recovery and approved default fallback

- This profile standing-authorizes automatic fallback to the owner's suitable already-approved configured default for
  delegated responsibilities, including review, whether the owner is present or offline. Preserve role, permissions,
  source/privacy boundaries and writer/reviewer separation. No new routes, accounts, configuration or arbitrary
  models; with no suitable approved route, the affected work is blocked.
- Diagnose the concrete failure and partial effects. Retry transient transport errors a bounded number of times; do
  not retry exhausted quota or unsupported configuration. Before redispatch, establish that the prior worker did not start
  or has stopped. Unknown status blocks a duplicate writer, including a default-route retry.
- Only for relay/tooling failure, an already-available native child may recover the assignment before model fallback
  when the same configured model/effort and approved account/environment, source access, working scope and effective
  permissions are verified. Do not configure agents or infer equivalence from a model name or tool's presence. This
  is bounded transport recovery, not a native preference. Switching transport does not bypass provider quota.
- If equivalent recovery is unavailable or fails, use the approved default when suitable; if that also fails, stop
  equivalent retries and report the blocker. Record changed routes and sessions honestly; a root-session failure needs host/user recovery.
