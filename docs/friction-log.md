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

2026-11-12 | grilling (Full Feature, HDC CADE-1814) | Worked well: numbered grilling rounds with a recommendation per question settled every owner decision before design; no rework from ambiguity | keep as the default intake pattern
2026-11-12 | delegation / implement-code | Worked well: backend and frontend implemented in parallel against a wire contract pinned in the LLD (separate repos, one writer each) saved a full cycle with zero contract drift | make parallel implementation the default when the LLD pins the contract
2026-11-12 | delegation / review-code, challenge-plan | Worked well: reusing one reviewer session across rounds gave cheap, consistent rechecks; adding the docs review to the code-review lane caught two real doc errors | keep reviewer-session reuse and docs-in-code-review
2026-11-12 | implement-code (emulator tests) | Implementer reported 9/0 for emulator persistence tests that were flaky (1 of 4 orchestrator runs failed) | briefs for emulator/persistence tests require an N-run loop (≥5) in the report; orchestrator still re-runs
2026-11-12 | gemini-delegate (write-api-regression-tests) | Gemini `auto_edit` cannot run shell, so the test author never ran its own tests and a broken skip name reached the orchestrator | route executable test-writing to an OpenCode lane, or approve a Gemini mode that allows the test command; until then briefs say "orchestrator runs the gates" and expect one extra round
2026-11-12 | gemini-delegate | Gemini cannot read files outside its `--cd` workspace (failed to open review findings in the temp folder) | put briefs/findings it must read inside the workspace or inline them in the brief
2026-11-12 | gemini-delegate | Transport flakiness: ECONNRESET and one 30-minute timeout with no edits; a single bounded retry worked | keep timeouts ≤30m for small deltas; inspect the tree before retrying
2026-11-12 | write-qa-scenarios (opencode glm-5.3-flash-free) | QA author made factual slips: invented a tool name, a non-existent page size, features the shared table lacks; later wrote "title" where the first column is the document number | give QA briefs a short facts block (tools, page sizes, controls, column order) or use a stronger model
2026-11-12 | draft-functional-docs | First docs draft invented an example API field | keep docs review mandatory; brief says example JSON must use real serialized fields/getters
2026-11-12 | implementation-plan template | Plan review caught missing documentation/generated-inventory maintenance and the exact read-only post-deploy check command (the wrapper default ran a mutating runner) | add both to the default plan skeleton
2026-11-12 | opencode-delegate (Windows) | OpenCode introduced CRLF churn in a backend repo | every brief: preserve line endings; `git diff --stat` must equal `git diff --stat --ignore-cr-at-eol`
2026-11-12 | authenticated environment checks | Saved sign-in for the DEV regression runner expired (~1 day), blocking unattended authenticated verification after deploy | owner refreshes the sign-in at the deploy checkpoint so the run can complete unattended
2026-11-12 | reviewer isolation | Read-only reviewer lane (OpenCode plan agent) still exposes write tools; isolation is instruction-only (no writes observed) | acceptable unless a project requires enforced containment; keep disclosing effective permissions
2026-11-12 | draft-feature-design | LLD drafts drifted toward larger options (client copy of server role sets, broad interactive selector) that plan/code review then trimmed | design briefs state "the server is the only authorization gate; no client duplicates of server role sets"
2026-11-12 | opencode-delegate relay (OpenCode 2.x) | `--variant` without `--model` is rejected before the run on a resumed session | always pass `--model provider/model --variant X` together, also when resuming
2026-11-12 | work-closeout | Clearing the working folder deleted the only copy of the workflow-improvement notes (they lived only in the scratchpad); recovered from chat context | before clearing, inventory content with no durable home and move it (e.g. here) first

