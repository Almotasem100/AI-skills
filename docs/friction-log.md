# Friction log

One line whenever something in the setup annoys you, fails, or makes you work around it. No fixing here, just
noting. After 2–3 real tickets, review the list with an agent and decide what to fix, drop or add.

Format: `YYYY-MM-DD | skill/tool | what happened | (optional) idea`

<!-- Example:
2026-10-01 | describe-pr | asked me for the ticket title although it was in the branch name | read it from the branch
-->

2026-09-30 | Gemini CLI skills | `gemini skills list` found 17 skills, but Gemini initially could not read skill files outside the workspace; adding the approved skills folder to user-level `context.includeDirectories` fixed explicit invocation. A natural “safe to merge?” review noticed five arguments but did not clearly apply the skill's mandatory four-argument ceiling | automatic skill selection remains inconclusive
2026-09-30 | Gemini CLI delegation | Plan mode denied `delegate-setup` discovery and returned an unverified inventory; Gemini's optional `--sandbox` also could not start without Docker/Podman. An explicitly invoked `opencode-delegate` completed a read-only dispatch from an interactive PowerShell session | keep discovery claims separate from dispatch evidence; use interactive invocation rather than YOLO when no command sandbox is available

2026-10-01 | delegate-skills smoke suite | Full run failed five non-Gemini `orphan-near-timeout` cases. The harness uses fake CLIs and a 1-second watchdog with an intentionally near-deadline exit; this is not caused by live Gemini approval prompts | investigate Windows launch/drain timing and rerun the full gate before proposing upstream

