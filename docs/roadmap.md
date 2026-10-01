# Roadmap — status, next steps, open decisions

The living to-do list for this setup. Update it at the end of every session that changes the setup. The full
history and reasoning (written while building it for the HDC project) is in the sibling HDC workspace at
`HDC-documents/automation/Automation_Planning_Handoff.md`; the portable decisions are in
`decisions.md`.

_Last updated: 2026-10-01 — documented HDC closeout in both canonical HDC docs and AI-skills, and drafted the scenario-test-cases skill from the owner's style guidance. The active plan below supersedes the parked v1 backlog for current priorities._

## Checkpoint — v1 freeze narrowly reopened (owner, 2026-09-30)
The setup was installed and used in an HDC workflow. The owner has now approved a narrow follow-up plan based on that use. **Do not resume unrelated parked builds or trials.**

## Active owner-approved plan
1. **Gemini compatibility (in progress):** Gemini CLI 0.61.0 discovered all 17 installed curated skills (`gemini skills list`, 2026-09-30); current `gemini --version` reports 0.62.0. After the owner approved adding `C:\Users\malmotas\.agents\skills` to `context.includeDirectories` in `C:\Users\malmotas\.gemini\settings.json`, explicit `clean-code-guard` invocation succeeded read-only with `--model auto` and no per-run include flag. A natural-language “safe to merge?” review identified five positional arguments and suggested a config object, but did not clearly apply the skill's mandatory four-argument ceiling; automatic selection remains **inconclusive**. The owner then explicitly invoked `opencode-delegate` in an interactive Gemini PowerShell session. Its relay completed the read-only task in the disposable repo: OpenCode v2.0.20, agent `plan`, model `openai/gpt-6-luna#medium`, exit code 0. `result.json` confirms the review; `sample.js` and `brief.txt` remained unchanged, with only the expected test inputs and relay artifacts untracked. This verifies explicit Gemini → OpenCode delegation using the existing skill; no Gemini-specific delegate skill is needed for this path. A separate `delegate-setup` request in plan mode could not run discovery and returned an unverified CLI report, so the implementer inventory remains unverified. Next: use explicit skill invocation for now; don't build a Gemini delegate skill unless real use exposes a gap. Natural selection and write-capable delegation were not verified.
2. **PR tooling:** install and verify `gh`, `jq`, Git Bash, and authenticated repository access before relying on `babysit-pr` or `debate-review` (owner plans this later).
3. **HDC closeout (completed; native test pending):** updated the portable `session-closeout` skill to honor project profiles and reuse an existing scratchpad; added the reusable HDC profile under `templates/hdc-session-closeout-profile/`. With approval for these exact files, updated `HDC-documents/README.md` and `HDC-documents/automation/Automation_Planning_Handoff.md`; the temporary session scratchpad was removed after checks. Citation checker: 7 OK, 0 warnings, 0 stale; `git diff --check` passed in both repos. Native closeout behavior remains untested.
4. **Scenario test cases (initial implementation complete; validation pending):** built `skills/scenario-test-cases/` with a reusable Given/When/Then browser-scenario template based on the owner's style example. It derives scenarios from approved requirements and LLDs, consults a matching implementation-task handoff when available, and flags conflicts/gaps rather than inventing expected behavior. Browser-followable and automation-friendly, but emits no automation code. **Next:** review the skill/template and test it on a real or representative approved requirements + LLD + task handoff set while working; native agent testing remains pending. This owner-directed format replaces the earlier open question about locating a team template.
5. **Delegation map:** test available implementers, decide who handles which task types and which model/settings are allowed, update HDC guidance, and only then configure approved lanes. Branch creation/naming remains owner-managed.
6. **Pre-implementation design review:** build a generic, read-only two-model review of a proposed change (requirements + LLD/plan), separate from PR-oriented `debate-review`.
7. **Implementation briefs:** first test the existing delegate skills' brief-writing flow with the approved plan/LLD context. Add a separate brief skill only if real use shows a gap.

The setup freeze remains in place for work outside this approved list. The HDC code plan still gates further endpoint ports on A5 live acceptance.

The original v1 backlog below is parked unless it appears in the active plan or the owner reopens it. Previously, work resumed when one of these happened:
1. **Finish repository setup:** AI-skills is initialized with a starter commit. Confirm the remote is private, review and commit the migrated files, then run GUIDE.md §3. This unblocks install.ps1 (needs its agent list), Gemini CLI tests and gh.
2. **A real ticket:** use the pipeline (`grill-me` → … → `describe-pr` → `session-closeout`), then fix what
   hurt. The first big ticket is the `create-lld` forward-mode test; the first frontend feature is the Spec Kit
   trial (item 4).
3. **The HDC `AGENTS.md` (item 6):** resume the parked `grill-with-docs` glossary there.
Not paused: the **B9 side-effect audit** is HDC migration work, not setup; it can start any time (brief in
item 3). While frozen, changes are fixes found in real use only, each noted here.
**Candidates after the freeze (not to-dos):** (a) `completeness-check`: a cheap, explicitly named model reads
the diff and *reports* new/changed public code with no test, no required doc comment, or no functional-doc
entry (HDC: `HDC_Backend_Functional_Documentation.md`), and drafts that functional-doc update for review.
It never writes tests: that stays with the implementing model plus `test-guard`. Build it if the friction log
shows gaps slipping through. (b) A Claude-only hook blocking writes inside the HDC repos (R1 safety net).
**HDC `documents\` under git (owner, 2026-09-26):** company policy rules out a docs-only repo; the owner plans to
keep them in the frontend repo until phase 1 runs well. Before the first commit there, keep out anything
personal or sensitive (B9 recordings, `_retired-docs\`, session scratchpads, the automation notes), and commit
docs separately from code.
**Delegating a skill run (added to `GUIDE.md` §4, 2026-09-26):** tested Claude → `codex-delegate` relay →
Codex (`gpt-6-luna`/low, read-only, throwaway repo): Codex loaded `create-lld` from `~/.agents/skills` and
described its inputs correctly. Not tested: a full LLD written that way, the questions round trip
(`--session`), and Gemini (`agy`/`opencode` not installed here).
**While using it:** add a line to `docs/friction-log.md` whenever something gets in the way; review it after
2–3 real tickets.

## Status
| Item | State | Evidence / notes |
|---|---|---|
| `skills/describe-pr` | v1.1 (2026-09-26) | Scripts tested on two real repos; full flow run by hand in Claude. **Tested natively in Codex** (picked without being named; fixed a paraphrasing bug, see item 2). Not yet in Gemini CLI. PR creation through `gh` not tested (no `gh` on the laptop) |
| `skills/create-lld` | v1 built | Checker, slide extraction and retro mode tested; DC-459 retro LLD passes. Forward mode on a new ticket not yet run. Not yet tested natively or in Gemini CLI |
| `vendor/amElnagdy/*` | Copied, reviewed | Base commits in each `UPSTREAM.md`. Local change: `babysit-pr` asks before pushing or posting |
| Pocock skills | Pinned `c55ee460`, installed (2026-09-25). **`grill-me`/`grilling` and `two-axis-review` used for real on 2026-09-26** (url-map); `grill-with-docs` trialled 2026-09-26 (round 1 only); `handoff` used 2026-09-26 (B9 audit brief) | Five pinned (`grill-me`, `grilling`, `grill-with-docs`, `domain-modeling`, `handoff`); `code-review` moved to `vendor/mattpocock/skills/` and **renamed `two-axis-review`** (clash with Claude's built-in; after the rename Claude lists both). Plain copies in `~/.claude/skills` and `~/.agents/skills`, `diff -r` identical to the source. **Not yet run** in any agent |
| `GUIDE.md` | Written (2026-09-25), updated 2026-09-26 | Install + use for every skill, any agent; **§4 "Always name the model and the effort"**; real-use notes for `grill-me`, `two-axis-review`, `grill-with-docs`, `handoff`; a friendly **"Quick start"** at the top (which skill when, one example each); §2 "Tools and templates" table + §4 usage for the pre-commit hook and `json-compare` (its command run on sample files). Its PowerShell copy block was run into a throwaway folder: 18 skills in both targets. Not yet run on the workstation |
| `AGENTS.md` | Revised 2026-09-28 | Clarifies the v1 freeze, repository rules, validation claims, authorization boundaries, and HDC safety gates; no workflow or design decisions changed |
| `tools/json-compare/`, `tools/url-map/` | Built (2026-09-26) | See item 3. HDC outputs live in `HDC\HDC\documents\` |
| Graphify | Trialled, **not adopted** (2026-09-25) | Ran code-only on a copy of the HDC backend: Java structure right, no config-driven links. Nothing installed outside the scratchpad. Details in `decisions.md` |
| `templates/pre-commit-hook/` | Built (2026-09-26) | Warn-only, never blocks; sh wrapper + Node script. Tested on a throwaway repo (6 cases incl. no Node on PATH, PowerShell). Installed nowhere yet |
| `templates/` AGENTS.md starter | Empty | Comes with item 6 |
| `delegates/` (lane configs) | Empty | Filled when `delegate-setup` first runs on the workstation |
| `install.ps1` | Not written | Waits for the workstation's agent list |
| AI-skills Git repo | Initialized | Destination repo has a starter commit; remote privacy is not verified. Migrated files await owner review and commit |
| Installed on this laptop | `~/.claude/skills` and `~/.agents/skills` were previously read by Codex; `create-lld`/`describe-pr` were seen in `~/.agents/skills` at 00:18 on 2026-09-26, with copies identical to `skills/`. On 2026-09-30, installed 17 curated skills into both roots; inventories and `SKILL.md` files match. Gemini CLI 0.61.0 listed all 17; current CLI reports 0.62.0. Explicit `clean-code-guard` invocation succeeded read-only with the approved persistent `context.includeDirectories` setting and model `auto`. Explicit `opencode-delegate` invocation from Gemini completed a read-only dispatch through OpenCode v2.0.20 using `openai/gpt-6-luna#medium`. Natural selection remains inconclusive; write-capable delegation and OpenCode discovery remain untested. Includes the available `agy` and OpenCode delegate skills; pinned Pocock skills copied from exact commit `c55ee46073ed923f86ce59a5eb3b6d895095d1b7` | **Copies**: re-copy after every change. Delegation lanes remain unconfigured; run `delegate-setup` after the implementer map is approved |

## Original v1 backlog (parked)
_Reordered by the owner on 2026-09-25: the builds (session-closeout, B9, install.ps1) come before the trials._
1. ~~**git pre-commit hook** that *warns* about new files.~~ **Done 2026-09-26:** `templates/pre-commit-hook/`
   (tests and install in its `README.md`). Remaining: installing it in the HDC repos needs the owner's approval.
2. ~~**Linter setup notes**~~ **Done 2026-09-26:** `docs/linters.md` + `templates/linters/checkstyle-essentials.xml`.
   Checkstyle tested without touching `pom.xml`; Prettier tested; ESLint (`ng add angular-eslint`) not run
   (changes the project; needs approval). Open: the Prettier `trailingComma` decision (see Open decisions).
   **Codex checks (2026-09-26, laptop, codex-cli 0.157.0, throwaway repos):**
   - **Codex reads `~/.agents/skills`** (asked it to list its skills: it named `two-axis-review`, `grilling`,
     `domain-modeling`, `create-lld`, `describe-pr` from there). It hides `grill-me`, `grill-with-docs`,
     `handoff` from its list, as their `agents/openai.yaml` says (`allow_implicit_invocation: false`): start
     them by name. No `~/.codex/skills` needed.
   - **`codex-delegate` works end to end:** brief (add `clamp` + tests) → relay → Codex, 1 min; reviewed diff
     matched the brief, 6/6 tests passed when re-run by Claude, no commit, no extra files. Harmless Node
     `DEP0190` warning from the relay on Windows.
   - **`describe-pr` tested natively in Codex:** asked naturally ("write the PR description for this branch…")
     without naming the skill → Codex picked `describe-pr`, ran `context.mjs` and `render.mjs`, title
     `feat(math): add clamp helper [#123]`, no PR created, repo untouched. **Bug found and fixed:** Codex
     paraphrased the rendered body and dropped its headings. `SKILL.md` step 5 now says to show the body exactly
     as rendered, in a markdown block; re-run → verbatim. Installed copies updated in both skills folders.
     Not tested: the question round (`codex exec` is non-interactive), `gh` PR creation.
3. **Builds:**
   - `session-closeout` (scratchpad + queued write-backs + `check-citations.mjs`). **Decided 2026-09-26 (owner
     took the recommendations):** scratchpads in the project's docs folder, named
     `YYYY-MM-DD_<Topic>_Scratchpad.md`; a stale citation **blocks** the closeout; no HDC-specific "§0a diff"
     (the skill stays generic). **Built 2026-09-26:** `skills/session-closeout/` (`SKILL.md`,
     `templates/scratchpad.md`, `scripts/check-citations.mjs`). Checker tested: 10 crafted cases (OK / ambiguous /
     missing file / line out of range / wrong token / comma list / URL, time and fenced code ignored); on the real
     HDC Plan against both repos: 95 citations → 80 OK, 7 ambiguous, **8 stale, all real** (legacy AngularJS
     files deleted on the branch, the moved-out `HDC-api` module); A3 scratchpad: 8/8 OK. Fixed on the way: a
     root-relative path into a skipped folder (`node_modules/...`) now resolves. `<branch>:path:line` citations
     are skipped (for code only on another branch). **End-to-end in Codex (project skill in a throwaway folder,
     asked "close out this session" without naming the skill):** picked the skill; wrote
     `docs/2026-09-26_Utils_Versioning_Scratchpad.md` in the docs folder, not the repo; **caught the planted
     wrong citation** (`math.mjs:40` → `repo/math.mjs:1-3`); also noticed a claim not true on the current branch
     (`clamp` lives on another branch) and filed it as unverified + open question; queued 2 write-backs and did
     **not** apply them (`Plan.md` unchanged); checker 6/6 OK, re-run by Claude with the same result. A first
     attempt, when Codex's shell tools failed, reported "closeout is blocked" instead of pretending: correct.
      Gotcha for scripted runs: `codex exec` waits on stdin unless it's closed (`< /dev/null`). **Installed**
      in `~/.claude/skills` and `~/.agents/skills` (owner approved, 2026-09-26). Not tested in Claude natively yet.
      **Updated 2026-09-30:** the portable skill now honors a project profile that designates an existing
      scratchpad; HDC's project-specific profile draft is tracked in `templates/hdc-session-closeout-profile/`.
      HDC canonical guidance changes await approval of the exact files listed in the active plan above.
   - the B9 legacy-vs-new comparison tool (HDC-specific: `record` / `compare`). **In progress (2026-09-26,
     Claude):** checked blocker 3: none of the 14 B9 endpoints is ported yet (`api/resource/` has only
     `UserResource`, `HealthResource`), so the window is open. HTTP methods read from `HDCEndpoint.java`: 5 GET,
     7 POST, 1 PUT, 1 DELETE. **Decided by the owner 2026-09-26 (all recommendations):** (1) responses are
     captured **in the owner's browser** (no credentials near an agent); the tool only normalises and diffs;
     (2) **split**: generic JSON compare in `AI-skills/tools/`, HDC config + recordings in the HDC docs folder
     `documents\b9-recordings\`; (3) legacy reference = the `develop` build deployed to dev as a **non-promoted** version,
     run by the owner from steps Claude writes. **Built 2026-09-26:**
     - `tools/json-compare/compare.mjs` (generic; tested on sample data, all rule types, exit codes).
     - HDC docs folder `documents\b9-recordings\`: `README.md` (runbook: 14 endpoints with checked citations, deploy
       steps, smoke test, record, compare, clean up) and `recorder.js` (DevTools console snippet; tested in
       the built-in browser against a local mock, incl. a stand-in `gapi`; real download and sign-in untested).
     - **Found:** legacy auth is Google OAuth via `gapi.client`, not the login cookie → legacy is recorded from
       inside the old AngularJS page. The `develop` profile has no `<service>`, so it would deploy to `default`
       (= the new frontend on dev): the runbook deploys it to its own service `legacyref` instead. Both
       profiles use the same Datastore.
     - **Next (owner, workstation):** runbook steps 1–2 (deploy + smoke test). Unproven: OAuth sign-in on the
       `legacyref` host, and whether `dispatch.yaml` reroutes its `/_ah/api/*`. Then (agent): the side-effect
       audit of the 14 endpoints, before any recording.
   - `install.ps1`: turn `GUIDE.md` §3's tested copy block into one command. Needs the workstation's agent
     list. (The friendly guide itself is done: `GUIDE.md`.)
   - **HDC URL-map script** (replaces Graphify; owner said go 2026-09-26). **In progress (Claude):** designing
     it with `grill-me` (also the first real run of a Pocock skill), then build in `tools/`, then review with
     `two-axis-review` against the grill's answers. Output goes to `documents\`, never a repo.
     **Grill done** (2 rounds, 15 questions, owner accepted every recommendation) → `tools/url-map/SPEC.md`.
     **Built and verified 2026-09-26:** `tools/url-map/url-map.mjs` (+ `README.md`). HDC output in `documents\`:
     `HDC_URL_Map.tsv` / `.md` / `.config.json`. 272 rows; counts reconcile with grep (237 `@ApiMethod` + 1 in
     a comment; 29 `withUrl` + 2 in comments); the spec's three known facts reproduced; 591 citations pass
     `check-citations.mjs`; both repos untouched. **Reviewed with `two-axis-review`** (2 Sonnet sub-agents):
     accepted 5 findings (count gaps now explained in the output; no status outside the spec; shared regex
     escape; `joinUrlPath` name), rejected 1 with reason (dispatch AMBIGUOUS), skipped 1 judgement call.
     **Findings for HDC:** 14 targets with no handler on the current build, incl. `/logout` (the new
     frontend's logout), `/kpischeduler` (weekly cron; `KPIDailyScheduler` on `develop`), the OAuth and
     backup routes; the servlet classes still exist but `web.xml` no longer maps them. 26 URLs skip login by a
     filter substring rule. 166 Endpoints URLs are guessed defaults. Relevant to C7.
   - **Next session (owner's choice, 2026-09-26):** try `handoff` and `grill-with-docs` (the latter in a scratch
     folder or `HDC\HDC\documents`, never a repo), then add their real-use notes to `GUIDE.md` like
     `grill-me`/`two-axis-review`.
     **`grill-with-docs` trialled 2026-09-26** (Claude, topic: HDC domain glossary; stopped by the owner after
     round 1, 7 questions, nothing written). Works as designed; notes in `GUIDE.md` §4 "Big ticket". Not seen:
     writing `CONTEXT.md`. Parked questions (resume with item 6): one context for all tools, glossary at
     `documents\CONTEXT.md`, decisions proposed into `HDC_Architecture_Decisions.md` (no `docs/adr/`), screen
     names win over code names; what P/T stand for; what an Element is (clone = copy?); DR stages fixed DR1–DR4
     (Charter) vs configurable per tool (`DrType` has `toolType`, `displayOrder`). Verdict: small tickets use
     `grill-me`; `grill-with-docs` only when domain terms change.
     **`handoff` used 2026-09-26:** brief for the B9 side-effect audit at
     `%TEMP%\handoff_2026-09-26_B9-side-effect-audit.md` (not durable; copy to `documents\sessions\` if kept).
     Verdict: keep, for one specific next task; complements `session-closeout`, doesn't replace it. It pointed
     out the **audit doesn't need the `legacyref` deploy** (pure code reading); only recording does.
     **Next (agent):** the B9 side-effect audit of the 14 endpoints: read-only code reading, results in a
     scratchpad in `documents\sessions\`, can start before the `legacyref` smoke test (owner to confirm). The
     brief: `%TEMP%\handoff_2026-09-26_B9-side-effect-audit.md`. Then item 5's cheap native tests, then item 4.
4. **Spec Kit trial** vs grill + LLD.
5. **Native skill tests:**
   - copy `describe-pr` and `create-lld` into `~/.agents/skills` too
   - in a **new** session, ask naturally without naming the skill
   - check: skill picked, scripts ran, questions limited to one message, nothing written in the repo
   - repeat in Gemini CLI
   - Pocock skills: `/grill-me` on a small ticket; `two-axis-review` with the LLD as spec
   - on the workstation: run `GUIDE.md` §3 for real
6. **Per-project `AGENTS.md`** (rules, glossary, PR scopes, where LLDs go). For HDC it needs the user's approval
   of the exact files first. **The HDC frontend one must carry the intake rule** (the owner's idea, recorded in
   the handoff but in no skill or agent file yet): on a new frontend task, wait for the Figma screenshots and
   copied CSS, ask the missing questions (grill), and only then plan. It is project-specific, so it belongs in
   that project's `AGENTS.md`, not in a generic skill.
7. Later, with the team: `pr-standard.md` (branch naming, title format, CI checks); propose the `babysit-pr`
   "ask before publish" option upstream.

## Recommendations for the next sessions (Claude, 2026-09-25, refreshed 2026-09-26)
The order above is the owner's. These are the recommendations behind it, so any agent continuing sees the
reasoning, not just the list. The owner decides.
- **Before item 1, on the workstation:** make `AI-skills` a private git repo and commit this state (owner
  creates it). Every later change, by any agent, is then a reviewable diff. Then run `GUIDE.md` §3 for real.
  (Codex reads `~/.agents/skills`: verified on the laptop 2026-09-26.)
- **Pre-commit hook (item 1): done.** Next for it: install in the HDC repos on the workstation, only after the
  owner's approval (it lives in untracked `.git/hooks/`, so no repo file, but it still changes the repo's
  behaviour).
- **Linter notes (item 2): done.** The HDC `AGENTS.md` files (item 6) should name the exact lint commands from
  `docs/linters.md`.
- **`session-closeout` (item 3): built.** Use it to end sessions; its checker also proves the URL map's
  references.
- **HDC URL map: built.** Regenerate after each ported slice. Its `NO_HANDLER` list (e.g. `/logout`,
  `/kpischeduler`, the OAuth routes) belongs in the HDC Plan's C7 discussion: those servlets exist but the EE10
  `web.xml` maps none of them.
- **Every delegated run names model + effort** (`GUIDE.md` §4). Keep test briefs tiny.
- **Spec Kit (item 4):** time-box to one real frontend feature, compared side by side with grill + LLD.
- **Native tests (item 5):** cheap and they de-risk everything built so far. If time allows, run the
  `describe-pr` / `create-lld` checks early rather than last.
- **HDC frontend `AGENTS.md` (item 6):** must carry the intake rule (Figma screenshots + CSS first, then the
  missing questions, then planning).

## Owner decisions, 2026-09-26 (closed)
- **Model + effort always explicit** for any delegated CLI run. Codex: `gpt-6-luna` for simple tasks,
  `gpt-6-sol` for hard ones (`GUIDE.md` §4). Reason: Claude's six Codex test runs (~175k tokens) used the
  default `gpt-6-astra` because no model was passed.
- **SonarQube credentials in `staticAnalysis.bat`:** the owner accepts the risk (the repo is private to the
  team). No action. (Residual risk, for the record: anyone who ever gets read access to the repo or its history
  gets the key.)
- **Prettier (HDC frontend):** one "format all" commit with Prettier's defaults, nothing else in it, on the
  workstation. (Corrected 2026-09-26: `"trailingComma": "none"` alone left 31 of 51 files different, since the
  code mixes quote styles and wrapping; ~740 lines change.)
- **Hook, linters, B9 compare for HDC: approved.** Per the HDC cleanup rule **R1** (no agent touches anything
  inside the two repos), the repo-side steps are the owner's own to-dos, below.
- **HDC URL-map script:** go (replaces Graphify). In progress, see "Next".

## Owner's own HDC repo to-dos (R1: agents don't do these)
1. Install the pre-commit hook in both repos (run inside each repo):
   `Copy-Item "C:\Users\Mohamed\Downloads\WorkSpace\AI-skills\templates\pre-commit-hook\pre-commit","C:\Users\Mohamed\Downloads\WorkSpace\AI-skills\templates\pre-commit-hook\warn-new-files.cjs" (git rev-parse --git-path hooks)`
   Do it on every machine/clone (the workstation too).
2. Frontend, on the workstation: the Prettier "format all" commit; later `ng add angular-eslint` as its own commit.
3. Linters and B9 need nothing installed in the repos (Checkstyle runs from outside; B9 lives in `documents\`).
4. B9 runbook steps 1–2 (`documents\b9-recordings\README.md`): deploy `legacyref`, smoke test.

## Open decisions
- None open from this session. (Closed 2026-09-26: HDC cleanup rule R2 means backups after **cleanup
  sessions** only; appending progress entries to the HDC docs needs no snapshot.)

## Known limits
- `describe-pr`: release mode and the CLI front end are deferred; redaction is best-effort when an agent can
  open files itself.
- `create-lld`: `.pptx` is read by script; PDFs and images depend on the agent (fallback: `pdftotext`, then
  screenshots).
- Pocock `grill-with-docs` writes `CONTEXT.md` and `docs/adr/` at the working root: run it from a docs folder,
  never a code repo that restricts new files.
