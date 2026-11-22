# V4 Independent Technical Review & Implementation Challenge — AI-skills (Cross-Repo Summary)

**Status:** Independent review and scope consolidation complete; **stopped before implementation** per owner checkpoint. No canonical V3 instructions, skills, vendor files, `master`, or installed configurations were modified.

## 1. Refreshed baselines (fetched from `origin`)

| Repo | Branch | Head SHA | `origin/master` SHA | Working tree before review |
| --- | --- | --- | --- | --- |
| `Almotasem100/AI-skills` | `research/v4-composability-batch-01` | `8d17440` | `2af86ec` | Clean |
| `Almotasem100/HDC-documents` | `research/v4-composability-batch-01` | `cdb107f` | `011c07f` | Clean |
| `Almotasem100/AI-plugins` | `research/v4-composability-batch-01` | `288acb1` | `b39cf68` | Clean |
| `Almotasem100/AI-plugins` (legacy) | `feat/plugin-upgrades` | `3403595` (2 ahead of `b39cf68`) | `b39cf68` | Inspected via `git show`/`git diff`; untouched |

**Reconciled outdated research notes (research branch only, zero canonical edits):**
- `AI-skills/research/v4-batch-01/planning/FIVE-ARTICLE-AUDIT.md`: marked Q-01 (advisory-first review checks), Q-02 (read-only zero-model-call Workflow Dashboard), and Q-03 (session-based) as **SETTLED**.
- `HARNESS-RESEARCH-FOLLOWUP.md` across all three repos and `AI-skills/research/v4-batch-01/planning/IMPROVEMENT-REGISTER.md`: aligned superseded "small Test Evidence Viewer only" wording with the approved `WORKFLOW-DASHBOARD-DESIGN.md`.

## 2. Per-ID V4 challenge — `AI-skills`

| ID | Candidate | Disposition | Current V3 evidence & challenge | Smallest delta (files / est. lines) |
| --- | --- | --- | --- | --- |
| **Closeout A** | Capture meaningful friction + positive observations at explicit closeout | **Useful minimal compatible** | `skills/work-closeout/SKILL.md:59-63` only checks for workflow feedback *before approved cleanup*, not on every explicitly requested closeout. | `skills/work-closeout/SKILL.md` (+8–12 lines) + 1 test in `test/` (+10–15 lines). No new skill/file. |
| **I-06** | Structured blocked owner question in existing working state | **Useful minimal compatible** | `instructions/orchestration-contract.md:57` requires question/options/recommendation, but `skills/work-closeout/templates/scratchpad.md:17-18` only has `- <only consequential unresolved items>`. | `skills/work-closeout/templates/scratchpad.md` (+2–3 lines: decision, affected dependency, recommendation, resume pointer). |
| **I-02 / HR-E** | Selective property/invariant & differential test lens | **Useful minimal compatible** | `vendor/amElnagdy/guard-skills/skills/test-guard/SKILL.md:118` explicitly disclaims deciding *what* to test; `instructions/orchestration-contract.md:263-283` covers risk selection and regression proof but omits property/differential checks. Don't patch vendored `test-guard`. | `instructions/orchestration-contract.md` §Verification (+3–5 lines). Zero new dependencies or skills. |
| **I-07 / W-06** | Multi-request Change/Bug outcome reconciliation | **Already implemented (tiny optional clarification)** | `instructions/orchestration-contract.md:32-33` already requires tracking outcomes/omissions in existing working state. | Optional 1-line note in `skills/work-closeout/templates/scratchpad.md` or `orchestration-contract.md` (+1–2 lines). Reject any new `outcome-coverage` skill. |
| **I-08 / HR-D** | Paired positive/negative regression controls for changed skills | **Useful minimal compatible** | `test/` has 51 invariant/smoke tests, but no explicit authoring note requiring positive + non-trigger controls for substantive skill edits. | Add positive/non-trigger tests in `test/` for V4 edits (+20–30 lines) + 3-line note in `README.md`. Defer `promptfoo`. |
| **I-01 / HR-04 / HR-B** | Advisory incident-derived review lenses | **Defer until grounded incidents exist (challenge)** | `vendor/mattpocock/skills/skills/two-axis-review/SKILL.md` and `clean-code-guard/SKILL.md` (imperatives 15–21) already cover common LLM smells; `docs/friction-log.md` currently has only 1 doc-drift entry, not 1–3 portable code-review incidents. Patching vendored `two-axis-review` adds upstream merge friction for synthetic lenses. | **0 lines now.** Reopen only when 1–3 real sanitized portable code-review incidents exist; place as ~5 advisory lines in `orchestration-contract.md`, not vendored skill. |
| **I-03** | Independent acceptance baseline / oracle protection | **Already implemented — No-op** | `instructions/orchestration-contract.md:284-291` ("Acceptance baseline") and `clean-code-guard/SKILL.md:113` (Rule 18) already enforce this. | 0 files / 0 lines. |
| **I-04** | Challenge unjustified components/indirection in plan-review | **Already implemented — No-op** | `skills/plan-review/SKILL.md:51-54`, `skills/plan-review/references/review-lenses.md:14-19`, `orchestration-contract.md:209-212`, and `docs/records/egm-mechanics-audit.md` already cover this. | 0 files / 0 lines. |
| **I-05 / HR-C** | Artifact-first concise specialist completion / log filtering | **Already implemented — No-op** | `orchestration-contract.md:79-81` and `skills/plan-review/SKILL.md:71-73` already require compact resume state with pointers. | 0 files / 0 lines unless a concrete noisy script is demonstrated. |
| **I-09 / HR-A** | Runtime/browser verification evidence recipe | **Already implemented — No-op** | `orchestration-contract.md:289-300` already separates local/browser/API/QA results, commit/build, and missing-login limits. | 0 files / 0 lines. Browser MCP comparison remains a separate later tooling check. |
| **I-11** | Ambiguous invocation / error wording | **Investigate / Defer** | No concrete misrouting case cited. | 0 files / 0 lines. |
| **W-13 / R-05 / Tools** | Daemon, auto-merge, Playwright/ast-grep/fast-check/Schemathesis/promptfoo installs | **Reject / Defer** | Outside owner scope; no tool installations authorized. | 0 files / 0 lines. |

## 3. Cross-repo prioritized V4 implementation proposal (awaiting owner authorization)

**Invariants preserved across all workstreams:** two owner-selected workflows (Full Feature / Change-Bug), explicit-only AI Skills delegation mode, existing repo ownership boundaries, independent review, and zero additional AI/model calls for the Workflow Dashboard.

| Priority | Repo | Workstream | Scope & simplest alternative | Est. files / lines |
| --- | --- | --- | --- | --- |
| **P1 (Core V4 workflow)** | `AI-skills` | Minimal V4 skill/template/contract polish (`Closeout A`, `I-06`, `I-02`, `I-08`) | Edit `skills/work-closeout/SKILL.md`, `skills/work-closeout/templates/scratchpad.md`, `instructions/orchestration-contract.md`, `README.md`, and add paired positive/negative tests in `test/`. | 5 files, ~45–65 lines |
| **P1 (Core V4 reliability)** | `AI-plugins` | `P-09 / I-10`: Fix verified `opencode-gemini-cli-provider` ACP & Windows `EPERM` bugs | Reject empty ACP `end_turn` text (parity with `zadloop-gemini-cli-provider/src/acp.js:148`), classify ACP JSON-RPC error payloads, and ignore `EPERM` during PATH walk (`src/gemini.js:266`) + fake-process regressions. | 2 files, ~35–55 lines |
| **P2 (Approved V4 plugin — Staged)** | `AI-plugins` | **Workflow Dashboard — Stage 1 (Feasibility + Headless Adapter)** | Verify installed pilot host (OpenCode vs ZadLoop) APIs for workspace path, session/subagent metadata, and UI slot; build deterministic zero-model-call read-only parser for `scratchpad.md` + test reports + optional assignment metadata, proving `Unknown`/`Stale`/`Blocked` handling. **Stop/push back if host APIs cannot expose workspace/session cleanly.** | 3–4 files, ~150–220 lines |
| **P3 (Approved V4 plugin — Conditional)** | `AI-plugins` | **Workflow Dashboard — Stage 2 (Minimal Pilot UI)** | Only after Stage 1 passes: smallest read-only panel in the single chosen pilot host (no controls, no polling, 0 additional model calls), covering source-backed planned-vs-actual model and one implementer→reviewer handoff. | 4–6 files, ~200–300 lines |
| **Optional (Independent slice)** | `AI-plugins` | **Legacy `feat/plugin-upgrades`: ZadLoop usage-panel refresh UX** | Selectively port `usage-panel/client.js` + `test/client.test.mjs` + `README.md` (and sync `locale/en.json` with `lastChecked`/`stale`). Independent of Dashboard; not a prerequisite. | 4 files, ~95 prod / ~230 test lines |
| **No-op / Deferred** | `HDC-documents` | `H-10`..`H-13`, `HD-HR-*` | Already covered by canonical HDC rules (`README.md` Rule 12, `b9-recordings/`, `active-work/README.md`) + `AI-skills` `I-06`. **Zero HDC production edits needed.** | 0 files / 0 lines |
| **Deferred / Rejected** | `AI-plugins` | Legacy `doctor.js` (1,472 lines duplicated), `/ticket-status`, old Live Workflow tab, `active-work/scratchpad.md`, tool bridge, steering, OpenCode refresh parity | Over-engineered/duplicated (`doctor.js` also has the Windows `EPERM` bug and hardcoded npm bundle path), token-costing, or superseded by V4 Dashboard. Keep `feat/plugin-upgrades` unmerged and undeleted until desired slices land and owner approves retirement. | 0 files / 0 lines |

**Simplest overall alternative (default if owner wants lowest risk/cost):** Execute **P1 only** (`AI-skills` ~55 lines + `AI-plugins` `P-09` bug fix ~45 lines = **7 files, ~100 lines total**), deferring Dashboard Stage 1 until the owner confirms which pilot host (OpenCode Desktop vs ZadLoop) is actively installed and ready for read-only API inspection.

## 4. Verification commands run & observed limits

- `npm --prefix AI-skills test`: **47 passed, 4 failed** (exit 1). All 4 failures were Windows sandbox `EPERM` on `symlinkSync` (`test/refresh.test.mjs:153,165` and symlink fixture inside `test/gemini-overlay.test.mjs`). Not a repository code regression; full non-sandboxed rerun needed before merging any implementation.
- `node --test HDC/HDC-documents/test/workflow-policy.test.mjs`: **6/6 passed** (exit 0).
- `npm --prefix AI-plugins test`: `donald-duck` passed, `usage-panel` 18/18 passed, `opencode-usage-panel` 21/21 passed, `opencode-gemini-cli-provider` 14 passed / 32 failed with `EPERM: operation not permitted, access 'C:\Users\malmotas\AppData\Roaming\Antigravity\bin\node.exe'` — directly exposing a real `EPERM` PATH-walk bug in `opencode-gemini-cli-provider/src/gemini.js:266` (and identical bug in legacy `doctor.js:55`).
- No live host, installed plugin, Gemini CLI, browser, or corporate environment was invoked.
