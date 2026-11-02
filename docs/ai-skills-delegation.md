# AI Skills delegation mode

**Activation guard:** Do not read further or apply these instructions unless the user has explicitly selected
**AI Skills delegation mode** for this session. Installation or a mention in task inputs is not activation.

## Ownership and activation

Apply the shared [workflow contract](orchestration-contract.md) for outcomes, prerequisites, review/debate,
revision, evidence and authorization. Project instructions supply engineering constraints, not AI role allocation.

This section alone assigns participants to roles. Role responsibilities are in the [catalog](delegation-lanes.md);
skills describe how to perform them. Execution below supplies transport for external assignments without
redefining their responsibilities.

| Role | Current assignment |
| --- | --- |
| Coordination and shared execution state | The orchestrator |
| Implementation-plan author | The orchestrator by default; only an explicit user assignment selects an external author through `write-plan` |
| Plan reviewer | A separate participant through `challenge-plan` for substantive plans, unless explicitly omitted or inapplicable |
| Other specialist deliverables | Separate participants through their matching configured responsibilities |

An explicit user reassignment changes the participants for that task. A role assigned to the orchestrator is
performed directly; externally assigned work uses the execution mechanism below. This changes neither the
role responsibilities nor persistent configuration.

The assigned author owns revisions and findings disposition; reviewers own findings and material rechecks.
The orchestrator coordinates, inspects results and may run authorized deterministic checks. Self-checks do not
replace required separate review. A task-scoped direct-work exception must be explicit; missing routes or broad
permission to finish do not transfer specialist authorship to the orchestrator. Honor explicit task overrides
without silently changing persistent configuration or this profile. A missing review route is a blocker after
permitted recovery, not permission for self-review.

Selection persists across compaction/model changes within the same session. Preserve it and useful active session
pointers in existing working state; do not create a scratchpad just for selection. A new session must not infer
activation from an older session's record. A one-task exception does not change the selected profile.

## Execution mechanism

For external assignments, use configured CLI delegation skills, including Gemini CLI when configured. Resolve intent to a responsibility,
then the effective configured route and installed skill. The user need not name a lane or choose a mechanism per task.
Load the effective fleet read-only at session setup and reuse it until configuration changes or a failure warrants
rediscovery. Read the selected skill and invoke its documented relay through the available terminal. Verify actual
execution before claiming dispatch or unavailability. See [CLI dispatch reference](cli-dispatch.md) for loader
commands and troubleshooting when needed. This profile does not read local execution.json or require native setup;
leave existing preferences, host agents, accounts and permissions untouched.

The catalog describes role meanings, not live models or routing. Local configuration chooses provider/model/effort;
a host model inventory does not bind an assignment. Select an exact configured responsibility name or an alias/
mapping already established for that responsibility; do not infer aliases or create configuration. Missing or
ambiguous routes use the recovery/default policy below, otherwise remain blocked. Honor applicable source/privacy
boundaries under every route.

## Assignment and acceptance

Give each specialist the objective, authorized source/artifact paths, output/change scope and acceptance criteria.
Prefer file access to copying entire documents. Specialists inspect relevant original requirements and project rules;
working summaries are navigation, not authority. Use a minimal approved excerpt/copy when shared access is unavailable.

Keep one mutation owner per bounded assignment through review, corrections and acceptance. Resume the recorded
session when supported/current; otherwise continue the semantic assignment from durable evidence without claiming
session continuity. Use a fresh output directory for every invocation and copy continuation IDs from actual results.
Inspect partial effects before retries. Neither a failed process nor a successful response establishes artifact quality.

For review-only assignments, use the supported read-only execution boundary. Verify effective shell/process and edit
permissions; a named plan agent or no observed writes does not prove filesystem containment. Report missing enforcement
and apply the actual project gate rather than claiming containment or silently weakening it.

Verify expected outputs/content and applicable checks. Preserve actual invocation, session, failures, review/disposition
and verification evidence in the approved working area. Keep **process/relay success**, **response success** and
**task acceptance** distinct. Response-only work needs no invented artifact. Required outcomes remain incomplete
until accepted or explicitly omitted; never substitute orchestration narration for specialist work or review.

## Recovery and approved default fallback

This profile standing-authorizes automatic fallback to the owner's suitable already-approved configured default for
delegated responsibilities, including review, whether the owner is present or offline. Preserve role, permissions,
source/privacy boundaries and writer/reviewer separation. It does not authorize new routes, accounts, configuration
or arbitrary models. No suitable approved route means an affected blocker.

Diagnose the concrete failure and partial effects. Use bounded retries for transient transport errors; don't repeatedly
retry exhausted quota or unsupported configuration. Before redispatch, establish that the prior worker did not start
or has stopped. Unknown status blocks a duplicate writer, including a default-route retry.

Only for relay/tooling failure, an already-available native child may recover the assignment before model fallback
when the same configured model/effort and approved account/environment, source access, working scope and effective
permissions are verified. Do not configure agents or infer equivalence from a model name/tool's presence. This is
bounded transport recovery, not general native preference. Switching transport does not bypass provider quota.
If equivalent recovery is unavailable or fails, use the approved default when suitable. If it also fails, stop equivalent
retries and report the blocker. Record changed routes/sessions honestly; root-session failure requires host/user recovery.
