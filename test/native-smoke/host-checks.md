# Fresh-session host checks — Gemini CLI and OpenCode

These are two small probes per installed host, not a matrix across all models and skills. Claude CLI is **not
applicable** to this setup: do not probe, install or authenticate it. A Claude model accessed through OpenCode is
still an OpenCode-hosted model and does not require Claude CLI.

## Execution

The driving session launches the probes using the installed relays. Do not ask the user to copy each probe manually.
Use the installed CLI/relay's supported fresh-session invocation; do not resume an existing child session. Inspect
local `--help` if flags differ. Use these owner-selected test routes from the pack's test map:

- Gemini: `smoke-gemini`.
- OpenCode: `smoke-opencode-luna` (regular Luna, not Fast).

Installed skill root: {{SKILLS_ROOT}}
Installed companion root: {{INSTRUCTIONS_ROOT}}
Test map: {{LANES_FILE}}
Disposable run directory: {{RUN_DIRECTORY}}

For each host/probe, create a separate disposable Git workspace under this run directory. Use the installed
`delegate-setup/scripts/config.mjs write --scope project --cwd <workspace> <selected-test-lane.json>` mechanism to
write/trust only that probe's selected lane. Never write global config. Dispatch through the matching installed
relay with `--lane`, a brief file, `--cd`, `--out-dir` outside the workspace and the supported watchdog (120 seconds
by default). OpenCode uses `--read-only`; Gemini uses `--approval-mode plan` without claiming enforced read-only.
The existing run guide documents these arguments. No permission, authentication or persistent host settings change.
If the required relay, model or fresh-session capability is unavailable, record that rather than substituting a
source skill or different model. Do not automatically retry. Retain the exact prompt, process result and relevant
loading/tool events; do not dump credentials or unrelated global configuration.

**Do not add file paths, instruction excerpts, expected answers or an instruction to manually read a file to the
probe prompts below.** The surrounding driver knows the paths for evaluation; the fresh child must exercise its
normal host discovery/loading. Do not pass it this checklist or prior probe answers as context.

## Probe A — explicit native skill activation

Send this exact prompt in a fresh session:

> Use task-context. Requirement R1: owners may rename their own draft. Settled decision D1: whitespace-only names
> are invalid. Duplicate-name behavior is undecided. Return the task context here. Do not edit files, execute tests
> or delegate work.

Inspect the native tool/loading trace and the actual context output. Record observed native skill-tool activation
and its resolved skill path when exposed. A skill listing or the model saying "I used the skill" is not activation
evidence. Direct SKILL.md reading/application is useful but must be labelled as such; it is not native activation.
Accept behavior when R1/D1 remain distinct from undecided duplicate-name behavior and no execution is invented.
Write the verdict/evidence pointer to:
- Gemini: {{GEMINI_SKILL_OUTPUT}}
- OpenCode: {{OPENCODE_SKILL_OUTPUT}}

## Probe B — ordinary global-instruction behavior/loading

Send this exact prompt in another fresh session, without invoking a skill or supplying instruction paths:

> Before we begin actual work, explain the workflow you would follow for a clear Full Feature request versus a
> tiny local bug. Where do tester-facing QA scenarios fit relative to implementation planning, and are those
> scenarios executed tests? Does ending this chat alone require work-closeout? Explain only; do not implement,
> delegate or change files.

Compare the answer with the installed shared contract: adaptive paths; QA scenarios before dependent implementation
planning; scenarios distinct from execution; closeout tied to completed bounded work rather than chat termination.
Inspect host startup/context-loading evidence for the actual user-level shared instruction file. Do not manually
read the mirror into the child and then call that automatic loading. If the host does not expose reliable loading
evidence, report the answer's behavioral result while leaving automatic loading **unverified**. A correct answer
alone cannot prove where it obtained the rules; a generic answer can coincide with them.
Write the verdict/evidence pointer to:
- Gemini: {{GEMINI_GLOBAL_OUTPUT}}
- OpenCode: {{OPENCODE_GLOBAL_OUTPUT}}

## Reporting

For each probe report separately:
1. Process/response result and behavior against the stated acceptance criteria.
2. Native skill activation, direct resource access, automatic global loading, or unverified attribution—whichever
   the observed trace actually establishes. Do not collapse these into one pass label.
3. CLI version, requested route/model, brief/result path and minimal relevant event pointers.

Missing native activation or loading evidence is not automatically a failed task. Explain whether behavior passed
and which loading mechanism was observed or remains unknown. The pack's verifier marks these report files
`needs-review`; the driving session reads them and includes its honest verdict in results.md. This does not require
running the other skills on both hosts or proving broad host/model compliance.
