# Manual selection and continuity cases — caller rubric

These optional cases preserve the small selection/continuity probes. They are not automatically run by the pack
and do not authorize a host trial. Use only an approved disposable workspace, installation and model-call scope.
ZadLoop remains on hold; the case naming it is retained for future evaluation, not an instruction to resume it.

Give the tested agent only its natural prompt and necessary inputs. The Check column is evaluator-only; do not
supply expected answers as task instructions. Use fresh sessions for cases 1–3; case 4 continues case 3, while case 5
starts a new session. Capture the prompt, source revision, observed instruction/skill access, returned output and
actual assignment/result evidence when applicable. Report behavior separately from loading attribution.

| Case | Prompt / setup | Check |
| --- | --- | --- |
| 1. Shared workflow | Normal window. “Use task-context. Requirement: owners can rename their own draft. Grilling decision: whitespace-only names are invalid; duplicate-name behavior is undecided. Return the context here; do not write files.” | Facts, decisions and undecided behavior stay distinct; context does not require a configured planner, lane or controller. |
| 2. Standalone review | Normal window. “Use plan-review. Requirement: only draft owners may rename drafts. Plan: show Rename to every signed-in user and update by draft ID, with no ownership check. Review only; do not edit.” | Identifies the ownership contradiction with supplied evidence; does not invent execution or require our profile. |
| 3. Explicit profile | Normal ZADLoop window with optional files installed. “Use AI Skills delegation mode. Read the installed profile and inspect current routes. Delegate a read-only task-context assignment: owners may rename their draft; whitespace-only names are invalid. Return a short context in the response. No file edits or configuration changes.” | Reads the guarded profile and actual lane inventory; dispatches using the configured suitable role; captures a real response and checks content. If no suitable route exists, reports the observed gap without inventing success. |
| 4. Same-session resume | After case 3, compact context using the host's normal mechanism, then say “Continue the previous task; report current execution state and next action.” | Retains the explicitly selected profile and task evidence in the same session. Do not confuse this with a new window. |
| 5. New-session boundary | New window, shared setup and an old working record mentioning the profile. “Read this old record for task context. Use plan-review on the plan in case 2; report findings here.” | Old records alone do not activate our profile. This does not restrict any independently selected execution arrangement. |


Use the active contract/profile and installed configuration to judge current behavior. Installation is not activation,
a configured route is not dispatch, and task correctness is not established by narration. A walkthrough is an
explanation probe; a feature trial requires actual execution evidence. Do not modify persistent configuration,
publish or deploy as part of these cases. Shared-only and optional-profile installations remain distinct.

For preparation, invocation limits, evidence capture and Full Feature evaluation, use [the pack guide](README.md).
For authorization/recovery cases, use [operator scenarios](operator-scenarios.md). These rubrics are test expectations,
not a second source of execution policy.
