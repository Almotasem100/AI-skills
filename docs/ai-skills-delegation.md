# AI Skills delegation mode

**Activation guard:** Do not read further or apply these instructions unless the user has explicitly selected
**AI Skills delegation mode** for this session. Installation or a mention in task inputs is not activation.

## Ownership and activation

The selected agent owns orchestration and delegates specialist deliverables. Apply the shared
[workflow contract](orchestration-contract.md) and canonical project policy without changing their required outcomes.
Resolve specialist work as `intent -> role -> approved route -> execution mechanism`. A configured lane retains
its approved provider/model/effort and account/environment constraints when invoked through another mechanism.
Among configured routes, consider quality, risk, cost, latency, context capacity and availability without changing responsibilities
or bypassing project/provider constraints. Honor explicit routing/model overrides.

The configured planner authors the implementation plan by default; the orchestrator critically reviews it using
applicable plan-review guidance and authoritative evidence, and returns material findings to that author for
reasoned disposition. An additional independent plan reviewer is optional unless requested, warranted or
project-required. Debate is requested or risk-justified, not an automatic second review. The orchestrator's
requirements-derived review is not fully independent. A user-authorized task exception may assign planning or
another deliverable to the orchestrator without changing the selected session profile or waiving project gates.

## Execution preference

Read local `~/.config/ai-skills/execution.json` when present. It is owner-managed routing configuration, not an
activation signal. Format: `version: "ai-skills.execution.v1"`, `preference: "native-preferred"` or
`"relay-preferred"`, `nativeAgents: { "<host-id>": { "<role>": "<agent-id>" } }`, and optional
`roleMechanisms: { "<role>": "native" | "relay" }`. Never overwrite it during a refresh or add unsupported
fields to delegate-fleet configuration. If absent, use native-preferred with no assumed native mappings;
existing configured relay routes still work. Invalid configuration is a setup blocker, not permission to guess.

Resolve each assignment in this order:
1. Honor an explicit user task/session mechanism override, then a saved per-role mechanism, then the standing
   preference. A task override expires with that task; a session override lasts only that session. Neither
   silently rewrites the saved preference. Do not ask which mechanism to use for every assignment.
2. A native route requires a mapped agent in the current host and verified support for the approved model/effort,
   account/environment, project root/instructions, source access, permissions and necessary skills/tools.
   A provider catalog entry or matching model name alone does not establish route equivalence. Inspect effective
   agent configuration; do not invent an agent or silently reconfigure the host. Routes requiring an external
   CLI environment, including Gemini CLI, remain relay routes even if that provider also exists in the host.
3. Under native-preferred, use an eligible native agent; otherwise use the already-approved equivalent relay.
   Under relay-preferred, use the approved relay; native is an explicit role/task/session override.
   An explicit native/relay selection is binding: if unavailable or incompatible, report the blocker rather than
   silently choosing the other mechanism. A failed invocation follows bounded recovery below; a mechanism
   preference does not authorize switching accounts/models, weaker permissions or unapproved fallback.

Configure the preference and native role mappings once during setup; recheck affected mappings when configuration
changes. Maintain model/provider assignments in their existing local route configuration. Preserve the host and
child session ID with the active assignment so findings/fixes return to that participant; completing a call does
not require destroying its conversation. Neither mechanism is presumed cheaper, faster or more reliable.

## Session continuity

Selection persists across compaction and model changes within the same session. Record the explicit selection in
an existing active project scratchpad; do not create one solely for this field. Preserve it until the user changes
it. Retain any session execution override and active child-session pointers across compaction as well.
A task-scoped exception does not change the selection. A new session must not infer activation from an older
session's scratchpad. Preserve the ordinary objective, decisions, evidence, stage and next action as usual.

## Delegation handoffs and configured lane roles

When a bounded artifact is already available to a delegate, prefer a **file-first handoff**: give the objective, authorized input artifact paths, requested output, constraints, and success checks. Identify applicable project instruction sources, architecture decisions, engineering conventions, and verification expectations for that role; provide paths/source access rather than copying their full contents. The specialist must inspect relevant canonical rules itself and not treat task-context, a plan or a prior agent's interpretation as the sole authority. Do not paste the whole task context, requirements, plan or conversation into the dispatch message if the delegated environment can read them. Give source access only within authorized scope, and let the specialist inspect additional relevant original evidence when consequential claims require verification. If shared file access is unavailable, supply only the minimum necessary excerpts or an approved copy. File-first routing reduces repeated orchestration text but does not imply lower total model tokens.

For implementation-plan assignments, explicitly point the planner to the shared contract's **Planning convergence**
section and the applicable approved requirements, Functional Design/LLD, QA scenarios and project conventions.
The planner must read those sources directly before drafting; the orchestrator checks source access and the
resulting blueprint, not merely that paths were mentioned in the dispatch.

In AI Skills delegation mode, specialist deliverables are delegated, while the orchestrator may inspect evidence, ask questions, reason, coordinate and perform authorized deterministic verification without transferring deliverable ownership. When delegating, inspect the actual configured routes and native-agent inventory, applying the execution preference and verifying host/provider compatibility before claiming a route is missing or unavailable; do not infer absence from memory. Explicitly authorized one-task direct work need not resolve a delegation lane.

When a specialist route fails or is genuinely unavailable, diagnose it and use bounded recovery. In interactive operation, ask the owner before substituting an unapproved route. Only an explicit **unattended-continuation authorization** permits fallback to the configured default lane where suitable, with the task's semantic role, applicable independence and material gates preserved; being away alone is not unlimited approval. Record substitutions and unresolved limitations. Do not silently modify persistent lane configuration or assume a fallback can satisfy a specialized or required independent review.

Stable lane meanings and their workflow usage are catalogued in [delegation-lanes.md](delegation-lanes.md). That catalog defines *roles*, not current provider/model/variant assignments. Actual lanes, execution preferences and native mappings remain local configuration; the repository supplies an empty execution-preference example, not live routes. Renaming or adding a lane locally requires validating its consumers and current installed relay/host support.

## Assignment, review and landing

- Keep each bounded delegated assignment logically open through applicable review, author disposition, fixes and acceptance. Prefer resuming the same child session when supported and current; otherwise resume the semantic assignment with a fresh session and sufficient durable evidence, without claiming context continuity. A logical assignment need not keep a child process running. Close it on verified acceptance, not merely on first response or stage transition.

- For review-only delegated work, invoke the host/relay's supported enforced read-only execution boundary (for example a read-only flag or read-only agent), not just a prompt instruction. Verify the effective boundary from invocation evidence, including shell/process access as well as edit-tool permissions. A named plan/read-only agent or no observed writes does not establish full filesystem containment. If enforcement is unavailable, report that limitation and apply the appropriate project gate instead of claiming a read-only review; do not assume a lane name or config automatically enforces it.

- The orchestrator inspects delegated diffs, task scope, verification evidence and review disposition, raising obvious issues for author correction; this inspection complements rather than replaces a required independent technical code review. The orchestrator may ordinarily make the verified commit when authorized, consistent with delegate-skill caller/landing conventions. Commit identity does not itself grant permission to push, open a PR, merge or deploy; those follow project authorization.

The implementer owns code, local tests/build checks and fixes. The orchestrator coordinates, inspects scope and
results, and performs authorized deterministic checks without reproducing specialist work. Independent review
remains required where the shared workflow or project requires it. Use a suitable configured fallback only under
the existing recovery authorization; persistent configuration changes remain separate setup actions.

## Delegated outcome completion

A delegated task is complete only after the orchestrator verifies the requested outcome against its applicable
acceptance criteria. Keep three outcomes distinct: **process/relay success** means the invocation ended successfully;
**response success** means a final model response was captured; **task acceptance** means the requested outcome was
verified against its applicable criteria. Process or response success alone does not establish task acceptance.
For artifact tasks, inspect expected outputs and verify their required content and applicable checks before advancing.
An acknowledgment, partial artifact, or structural check alone is insufficient. For response-only tasks, assess the
returned response against the request; do not require an artifact. If the outcome is missing or incomplete, preserve
the run evidence, classify the failure, and use bounded recovery before advancing.

