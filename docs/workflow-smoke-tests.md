# Small workflow smoke tests

For the reusable general installed-setup/relay/skill pack, start with
[`test/native-smoke/README.md`](../test/native-smoke/README.md). The cases below remain focused selection/continuity
trials; they do not require an application-specific integration.

Run source checks with `node --test test/workflow-separation.test.mjs` (Node 18+).
They check instruction boundaries, preserved outcome structure, source dependencies and a temporary installed-file
layout. They do not run PowerShell setup, a model, a relay or ZADLoop, and do not prove behavioral compliance.

For native trials, use a disposable working area with the selected skills and shared instructions installed.
Use fresh sessions for cases 1–3; case 4 deliberately continues case 3. Keep the prompt, source revision, relevant
file/tool access, returned output and any actual dispatch result. A claimed invocation alone is not evidence.
Do not change persistent lane configuration, publish or deploy as part of these trials.

| Case | Prompt / setup | Check |
| --- | --- | --- |
| 1. Shared workflow | Normal window. “Use task-context. Requirement: owners can rename their own draft. Grilling decision: whitespace-only names are invalid; duplicate-name behavior is undecided. Return the context here; do not write files.” | Facts, decisions and undecided behavior stay distinct; context does not require a configured planner, lane or controller. |
| 2. Standalone review | Normal window. “Use plan-review. Requirement: only draft owners may rename drafts. Plan: show Rename to every signed-in user and update by draft ID, with no ownership check. Review only; do not edit.” | Identifies the ownership contradiction with supplied evidence; does not invent execution or require our profile. |
| 3. Explicit profile | Normal ZADLoop window with optional files installed. “Use AI Skills delegation mode. Read the installed profile and inspect current routes. Delegate a read-only task-context assignment: owners may rename their draft; whitespace-only names are invalid. Return a short context in the response. No file edits or configuration changes.” | Reads the guarded profile and actual lane inventory; dispatches using the configured suitable role; captures a real response and checks content. If no suitable route exists, reports the observed gap without inventing success. |
| 4. Same-session resume | After case 3, compact context using the host's normal mechanism, then say “Continue the previous task; report current execution state and next action.” | Retains the explicitly selected profile and task evidence in the same session. Do not confuse this with a new window. |
| 5. New-session boundary | New window, shared setup and an old working record mentioning the profile. “Read this old record for task context. Use plan-review on the plan in case 2; report findings here.” | Old records alone do not activate our profile. This does not restrict any independently selected execution arrangement. |

`plan-debate` is excluded from this change's behavioral trials while its existing participant/lane contract is
parked for separate discussion. Its skill source is unchanged. Other multi-participant review skills retain their
own requirements; `debate-review` needs the optional relays and its two configured review lanes.

Before native case 3, verify copied profile/catalog/contract content against this branch and confirm Gemini's
actual configured role if that is the intended route. This repository does not contain the owner's live lane map;
requesting Gemini must not silently rewrite it. A trial in normal ZADLoop does not establish behavior in ZADLoop's
own delegation mode. Record native results separately from the source checks above.
