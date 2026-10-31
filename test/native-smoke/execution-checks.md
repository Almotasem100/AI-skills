# Execution preference checks

Use installed shared/profile/catalog instructions under {{INSTRUCTIONS_ROOT}}. This case explicitly selects
AI Skills delegation mode. Read local execution.json if present without editing it. Do not assume a configured
native route exists. Tests are separate from the pure-relay provider fixtures; no benchmark claims are made.

## 1. Policy cases — explanation only

Read {{CASES_FILE}} as the caller. Give a fresh participant the installed profile/catalog and only the cases'
`id` and `input` fields, not `expected` or prior answers. Ask it to return a mechanism or blocker and concise
reason for each. No model/provider calls, configuration changes or implementation are authorized within its
hypothetical answers. The caller saves/reviews answers at {{POLICY_OUTPUT}} against the expected decisions.
Check V3 planner ownership, explicit overrides, role mappings, external CLI routing, unavailable mappings,
permission limits and assignment continuation. Correct explanation is not proof of actual routing.

## 2. Native execution and continuation — live host check

This is an explicitly authorized tiny test, not a production role reassignment. Use the existing test map at
{{LANES_FILE}} and its smoke-opencode-luna route. In a fresh disposable Git project under {{RUN_DIRECTORY}},
configure a test-only native agent through the installed host's supported mechanism, if available. Keep temporary
configuration in that disposable project; no global changes, CLI installation/upgrades or production lane edits.
Record the actual host, agent, model/effort, project root/instructions and effective edit AND shell permissions.
If the exposed native interface cannot select this route or suitable scope, mark unavailable rather than using a
relay and calling it native. A prompt to avoid writes is not filesystem containment.

Create input.json with a fresh random token and three integer amounts: approved 7, pending 90, approved 4.
Ask the native child to read that file and return only JSON: token, approved sum and approved count. The prompt
must not contain the expected answer. Verify token equality, sum 11, count 2 and unchanged input/workspace.
Retain the child session ID and run evidence. Resume that exact child and ask it to recall its earlier token,
sum and count without rereading files. Compare with the first verified answer and returned session identity;
if session identity/context reuse cannot be established, report continuation unverified. Do not retry blindly.
Save the reviewed native result at {{NATIVE_OUTPUT}}. No feature implementation or repo publication is authorized.

## 3. Retained relay path

Use an already captured successful Gemini smoke fixture from this installed revision, or run only the
smoke-gemini fixture with --live using the documented driver. It intentionally exercises the Gemini CLI relay,
not a native Gemini provider. Confirm the CLI/account environment and requested route without reading credentials,
the independently checked answer and workspace scope. Capture at {{RELAY_OUTPUT}}; reference earlier evidence
explicitly rather than implying an unrerun route was freshly tested. Do not run Claude CLI.

## Report

Do not overwrite local preferences or promote test agents into everyday mappings. The caller records each case
as passed/failed/unavailable/skipped/unverified with minimal evidence. Existing production native mappings need
one-time setup validation separately; an empty mapping means relay compatibility, not native readiness.
The automated verifier marks nonempty reports needs-review only. Whole-setup coverage combines these checks,
installed parity, provider smoke, task-context/plan-review/QA cases, the hypothetical walkthrough and the bounded
implementation task. No one fixture certifies a complete real-ticket lifecycle.
