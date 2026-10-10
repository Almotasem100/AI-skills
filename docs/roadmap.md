# Roadmap — status, next steps, open decisions

The living to-do list for this setup. Update it at the end of every session that changes the setup. The full
history and reasoning (written while building it for the HDC project) is in the sibling HDC workspace at
`HDC-documents/automation/Automation_Planning_Handoff.md`; the portable decisions are in
`decisions.md`.

_Last updated: 2026-10-10 — audited the stable HDC documents snapshot, aligned HDC's active orchestration rules on a dedicated branch, rebased the Gemini delegate overlay, and completed the current vendor refresh. The AI-skills PR remains intentionally unopened._

## Checkpoint — v1 freeze narrowly reopened (owner, 2026-09-30)
The setup was installed and used in an HDC workflow. The owner has now approved a narrow follow-up plan based on that use. **Do not resume unrelated parked builds or trials.**

## Vendor refresh — 2026-10-09

On `refactor/orchestration-contract`, refreshed `vendor/amElnagdy/delegate-skills` from base
`6826b363085dcc80875372315fe7d208c4bf733f` to upstream `8ef02103ad99b53801f2b13d04755313fbbfafb2`, and
`vendor/amElnagdy/review-skills` from base `5b748c654bb060ef6bf86d0e7ae123979082a88a` to upstream
`3cfce3963b4d4d99a8b9059f1ece6726405b7bd3`. Delegate changes include Windows/Node 24 launch fixes and
OpenCode 2.x/catalog compatibility; review-skills adds `debate-review --check`. The delegate documentation-link
patch and review-skills `babysit-pr` ask-before-publish patch remain intact. Upstream push CI is green for both
selected heads. No PR was opened; the orchestration branch remains the integration point until the stable HDC
snapshot is audited.

## Matt Pocock selective refresh — 2026-10-10

Reviewed upstream `mattpocock/skills` from `c55ee460` to `49dd158d` (73 commits). Updated the vendored
`two-axis-review` while preserving the local rename and advanced `grill-me`, `grilling`, and `handoff`.
After the stable HDC audit, also advanced `grill-with-docs` and `domain-modeling` to `49dd158d`. Their new
`GLOSSARY.md` / `GLOSSARY-MAP.md` + ADR working-file contract fits HDC only when run from
`HDC-documents/current-session/`; accepted durable decisions still reconcile into
`HDC_Architecture_Decisions.md`. Source/install guidance is updated; user-level installed Pocock copies have not
been re-copied or natively tested after this pin bump.


## HDC orchestration alignment — 2026-10-10

Audited authoritative `Almotasem100/HDC-documents@d6e2164`. The technical hard gates are legitimate and remain:
exact prior approval for new backend file paths; verbatim-port behavior except named deviations; no move+fix in
one step; evidence/citation requirements; explicit deployment/publication/cleanup boundaries; and the current
dev/ACP/prod acceptance policy. The stale parts were orchestration assumptions: explicit per-dispatch delegation,
manual model/effort naming, “high-effort decides / cheaper executes,” blanket snapshot bias, and orchestrator
re-authoring of delegate output. Those are aligned on HDC branch `refactor/orchestration-alignment` in
`README.md`, `HDC_Architecture_Decisions.md` Decision 14, and
`automation/Automation_Planning_Handoff.md`. No HDC PR or merge was opened.

Regression expectation after alignment: an authorized CADE-style task may progress through the smallest sufficient
requirements/design → plan → specialist implementation → review/guards → build/tests → routine fixes/reverification
without per-stage approval, while exact new backend paths, material port deviations, fixture/data mutations,
deployment, commit/push/PR, and closeout cleanup still respect their project-specific gates.

## Active owner-approved plan
1. **Gemini CLI implementer (local upstream contribution; rebased 2026-10-10):** the contribution is preserved as
   `overlays/gemini-delegate/changes.patch`, now a 25-file delta based on Ahmed's current vendored upstream
   `8ef02103`. The rebase reconciles shared delegate-setup changes, adopts the upstream Node 24-safe Windows
   serialized-shell launch pattern, and adds Gemini to the upstream Node 24 preflight matrix. The overlay remains
   unpublished and separate from the vendored snapshot. Earlier live Gemini CLI 0.62.0 Auto/auto_edit use in a
   disposable repo succeeded; the rebased overlay still needs a native-Windows focused relay/preflight run before
   any upstream proposal. Do not publish it without owner direction.
2. **PR and closeout workflow (owner preference recorded 2026-10-01):** use Gemini rather than free models for PR work and session closeout. Before relying on `babysit-pr` or `debate-review`, install and verify `gh`, `jq`, Git Bash, and authenticated repository access. Native `session-closeout` behavior also remains untested.
3. **HDC closeout (completed; native test pending):** updated the portable `session-closeout` skill to honor project profiles and reuse an existing scratchpad; added the reusable HDC profile under `templates/hdc-session-closeout-profile/`. With approval for these exact files, updated `HDC-documents/README.md` and `HDC-documents/automation/Automation_Planning_Handoff.md`; the temporary session scratchpad was removed after checks. Citation checker: 7 OK, 0 warnings, 0 stale; `git diff --check` passed in both repos. Native closeout behavior remains untested.
   **2026-10-02, owner-approved HDC-only amendment:** the profile and canonical HDC README now forbid invoking or offering `handoff` at the end of closeout. Handoff is reserved for an owner-requested pause/transfer of unfinished work and preserves the existing scratchpad/inputs. The portable source skill and both installed user-level copies remain unchanged; no installation or actual closeout/handoff was performed. Native enforcement of the revised HDC rule remains untested. Fixed current-session directory paths and the rest of the folder/testing policy are still being settled in HDC; this narrow amendment does not implement or authorize folder cleanup.
   **2026-10-02, owner-approved fixed HDC work context:** HDC uses `HDC-documents/current-session/scratchpad.md` and adjacent inputs, not new per-session scratchpad folders. Chat/model handoffs preserve that work context; completed-feature/agreed-bounded-task closeout clears the approved folder contents after approved write-backs and verification. The HDC profile location/cleanup rules and canonical guidance are aligned. Generic/source-installed skills remain unchanged; native enforcement is untested. Historical HDC session records are retained; testing-directory design remains a separate pending discussion.
   **2026-10-03, owner-approved HDC-only closeout clarification:** the HDC profile, canonical README and workspace instructions prohibit invoking/offering handoff at completed-task closeout. Separate future audit/acceptance/retirement/cleanup work belongs in the Plan with explicit gates, not as an automatic reason to retain an owner-completed task's scratchpad. Clear only approved current-session contents after write-backs and verification; external temp/worktree cleanup stays separately scoped. Git publication needs separate authorization and actual outcomes must be reported, including blocked pushes. The original portable skill and installed copies remain unchanged. Text alignment is verified; this is not a new native-agent enforcement test.
4. **Scenario test cases (initial implementation complete; installed; validation pending):** built `skills/scenario-test-cases/` with a reusable Given/When/Then browser-scenario template based on the owner's style example. It derives scenarios from approved requirements and LLDs, consults a matching implementation-task handoff when available, and flags conflicts/gaps rather than inventing expected behavior. Browser-followable and automation-friendly, but emits no automation code. On 2026-10-01, copied it into both user-level skill roots and verified source-file hashes. **Next:** review the skill/template and test it on a real or representative approved requirements + LLD + task handoff set while working; native agent testing remains pending. This owner-directed format replaces the earlier open question about locating a team template.
5. **Delegation lanes (configured; automatic role routing is now the intended contract):** the initial routes include
   `implement-code` → OpenCode Luna/high, `write-test-cases` → Gemini Auto, and `challenge-plan` → Gemini Auto.
   Workflow semantics choose the role; lane configuration chooses provider/model/effort. The owner may override a
   route, but routine authorized delegation should not require naming a lane/model/effort again. Saved-lane dispatch
   and fallback/error behavior still need real-use verification; do not claim availability from configuration alone.
6. **Plan review and debate (implemented and orchestration contract updated):** `plan-review` remains a bounded
   one-shot critique. `plan-debate` now treats the orchestrator as chair/control-plane rather than default author:
   the workflow selects plan-author/challenge/reviewer roles through configured lanes, specialists own their
   substantive outputs, and the orchestrator records attributed state without recreating the work. A clean
   review/debate does not create a new approval gate inside an already authorized parent workflow. Minimum useful
   context is preferred; immutable snapshots/worktrees are conditional containment tools, not a default delegation
   ritual. The 2026-10-01 synthetic smoke evidence still applies only to the versions/hosts actually tested.
7. **Briefs:**** no separate implementation-brief skill is planned. Plan review/debate uses the scratchpad or an existing handoff directly; a delegate's brief remains the task instructions sent to the coding implementer, not a project artifact.
8. **Security audit skill (initial implementation complete; one native smoke test):** added `skills/security-audit/SKILL.md` as a read-only, evidence-citing audit that uses approved project security requirements when supplied, flags missing requirements/uncertainty, protects secret values, and makes no compliance claim. Its scope covers relevant trust boundaries, authentication/authorization, input handling, sensitive data/secrets, dependencies/configuration, abuse controls, and security tests without treating every category as mandatory. On 2026-10-01, Gemini CLI 0.62.0 audited a synthetic endpoint excerpt, identified a conditional authorization risk, and called out missing DAO evidence; OpenCode loaded the skill in this session but did not audit the fixture. The test establishes neither real vulnerability detection nor general host/model support. **Next:** review the skill and run another synthetic smoke test in a distinct agent when available; no target-system audit was performed.
9. **`create-lld` concise design-artifact workflow (owner-approved 2026-10-05; updated and synchronized):** one Jira ticket is the unit of design. The forward LLD is concise and architect-facing before the plan/implementation; Functional Design is customer-facing with no duplicate Purpose/Scope, Status, or LLD link; the separate Technical Design is produced after implementing the plan for Architect review. Deliverables do not cite input attachment names or source-code paths/lines; internal source inspection remains part of accuracy checks. Canonical `skills/create-lld/` and all eight files in both `.agents` and `.claude` host copies match; `docs-guard` is unchanged. The updated checker passes on the approved HDC LLD with no warnings or missing inputs. Native agent selection/use remains untested.

10. **Orchestrator and model-call policy (superseded by role-based orchestration, 2026-10-10):** the selected model
    is the control plane: understand the objective, choose the smallest sufficient workflow, resolve roles to
    configured lanes, track state/exceptions, and continue routine authorized stages automatically. It is not the
    default planner/implementer/reviewer merely because it is active. Model/provider/effort live in lane
    configuration. Explicit owner route/checkpoint instructions override inference. Ask only for a genuine
    consequential decision, material scope expansion, destructive/external effect outside authorization, or a
    project hard gate.

The setup freeze remains in place for work outside this approved list. HDC's canonical plan now follows approved task-driven UI/API slices (Decision 14); remaining ACP/B9 acceptance stays explicit and is not waived. Read the HDC Plan §0a for the next gate; no first slice or new implementation is selected here.

## Future upgrade review queue — ideas only, not approved work

When the owner next reopens setup upgrades, evaluate these options for actual workflow friction; do not install,
configure, or trial them before then:

- **Figma MCP:** read-only access to selected frames, components, variables, and screenshots to support slide/mockup
  review and Functional Design/LLD work.
- **SonarQube MCP:** read-only issues, hotspots, rule details, and quality-gate status, always tied to the exact
  project/branch/commit. Treat findings as evidence to assess, not automatic truth or a replacement for code review.
- **Ticket-tracker MCP:** read approved ticket details, acceptance criteria, and attachments. Select a server only
  after confirming which tracker is in use and the required access scope.
- **Git-host/PR MCP:** bring diffs, checks, and review threads into context after Copilot and PR prerequisites are
  ready; begin read-only and keep posting/replies explicitly approval-gated.
- **Documentation lookup MCP:** retrieve authoritative framework/library documentation when API verification is
  useful (for example, Context7 or an equivalent verified source).
- **OpenCode plugin concepts:** stage commands that preserve workflow authorization and external-action gates; optionally investigate route observability or guards against unconfigured/materially different substitutions. Do not add a per-dispatch delegation-consent gate that would reintroduce manual orchestration.

For every candidate, review maintainer/provenance, data handling, least-privilege scopes, credential storage,
project-vs-global exposure, context/token cost, and maintenance burden. Prefer read-only and project-scoped access;
consider one integration at a time and retain a clear disable/removal path. Figma is the likely first evaluation
when the next design slides arrive; SonarQube is worth evaluating if its findings are part of the actual workflow.

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
| Pocock skills | Source pins advanced to `49dd158d` on 2026-10-10 after HDC audit; `two-axis-review` remains vendored/renamed. Historical real-use evidence is from the older installed copies (`grill-me`/`two-axis-review` URL-map run, partial `grill-with-docs`, `handoff`). | Re-copy the five source-installed skills before claiming the installed hosts use `49dd158d`; then smoke-test the new `GLOSSARY.md` behavior in an HDC `current-session/` workspace. |
| `GUIDE.md` | Written (2026-09-25), updated 2026-10-01 | Install + use for every skill, any agent; §4 names model and effort where supported, with owner-approved Gemini Auto exception; real-use notes for `grill-me`, `two-axis-review`, `grill-with-docs`, `handoff`; quick start and tool instructions. Gemini relay trial is documented separately; the local contribution is not in the normal install list. |
| `AGENTS.md` | Revised 2026-09-28 | Clarifies the v1 freeze, repository rules, validation claims, authorization boundaries, and HDC safety gates; no workflow or design decisions changed |
| `tools/json-compare/`, `tools/url-map/` | Built (2026-09-26) | See item 3. HDC outputs live in `HDC\HDC\documents\` |
| Graphify | Trialled, **not adopted** (2026-09-25) | Ran code-only on a copy of the HDC backend: Java structure right, no config-driven links. Nothing installed outside the scratchpad. Details in `decisions.md` |
| `templates/pre-commit-hook/` | Built (2026-09-26) | Warn-only, never blocks; sh wrapper + Node script. Tested on a throwaway repo (6 cases incl. no Node on PATH, PowerShell). Installed nowhere yet |
| `templates/` AGENTS.md starter | Empty | Comes with item 6 |
| `delegates/` (lane configs) | Empty | Filled when `delegate-setup` first runs on the workstation |
| `install.ps1` | Not written | Waits for the workstation's agent list |
| AI-skills Git repo | Initialized | Destination repo has a starter commit; remote privacy is not verified. Migrated files await owner review and commit |
| Installed on this laptop | `~/.claude/skills` and `~/.agents/skills` were previously read by Codex; `create-lld`/`describe-pr` were seen in `~/.agents/skills` at 00:18 on 2026-09-26, with copies identical to `skills/`. On 2026-09-30, installed 17 curated skills into both roots; inventories and `SKILL.md` files match. Gemini CLI 0.61.0 listed all 17; current CLI reports 0.62.0. Explicit `clean-code-guard` invocation succeeded read-only with the approved persistent `context.includeDirectories` setting and model `auto`. Explicit `opencode-delegate` invocation from Gemini completed a read-only dispatch through OpenCode v2.0.20 using `openai/gpt-6-luna#medium`. Natural selection remains inconclusive; write-capable delegation and OpenCode discovery remain untested. Includes the available `agy` and OpenCode delegate skills; the installed Pocock copies were historically sourced from `c55ee460`, while the repository pins are now `49dd158d` and need re-copying before installed-version claims are updated. | **Copies**: re-copy after every change. Configured lanes should be verified by real dispatch before depending on them. |

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
- **Historical note, superseded 2026-10-10:** model/effort used to be named on each delegated run. Those dials now
  live in lane configuration; keep briefs small and let the workflow select the configured role route.
- **Spec Kit (item 4):** time-box to one real frontend feature, compared side by side with grill + LLD.
- **Native tests (item 5):** cheap and they de-risk everything built so far. If time allows, run the
  `describe-pr` / `create-lld` checks early rather than last.
- **HDC frontend `AGENTS.md` (item 6):** must carry the intake rule (Figma screenshots + CSS first, then the
  missing questions, then planning).

## Owner decisions, 2026-09-26 (closed)
- **Historical decision superseded 2026-10-10:** explicit per-run model/effort prevented accidental expensive
  defaults, but the durable solution is configured lanes. Keep the cost-control intent; do not require the owner to
  repeat model/effort on routine dispatch.
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
- Pocock `grill-with-docs` now writes `GLOSSARY.md`, `GLOSSARY-MAP.md` and ADR working files at its working root. For HDC, run it from `HDC-documents/current-session/`, never a code repo or the HDC docs root; reconcile accepted durable decisions into the canonical HDC decisions document.

## Global collaboration profile — owner-directed, 2026-10-02

The owner requested standing, model-independent reasoned pushback and recommendations drawn from real HDC work. The canonical profile is `templates/global-user-instructions/AGENTS.md`, with identical workstation copies at `~/.config/opencode/AGENTS.md`, `~/.claude/CLAUDE.md` and `~/.gemini/GEMINI.md`. It covers evidence/verification limits, minimal solutions, workflow-scoped authorization with role-based delegation, external-action boundaries, sensitive-data protection, prompt-versus-enforcement distinctions, compact shared-state continuity and evidence-led diagnostics. HDC paths, backend file permissions, deployment/environment policy and exact closeout rules remain project-specific. File/content verification is not proof of native loading or compliance: confirm in a new host session; no model smoke test, CLI configuration change or arbitrary-app installation is included. Keep all copies aligned from the source; a future installer is not implemented or authorized.

Bounded HDC alignment removes obsolete laptop startup paths/blanket ACP wording from this repo's agent instructions, corrects the workspace ACP timing summary and implementation-delegate shared-record restriction, and records future supporting Markdown beside HDC's single scratchpad. The website transfer is complete; detailed owner audit and the historical-retirement/reference transition remain separate project follow-ups. Owner directed clearing the completed task's current-session files on 2026-10-03. On 2026-10-03, the owner requested that future HDC closeout explicitly ask whether to clear the listed current-session contents after all checks pass; the profile now requires an explicit yes and retains contents on a no. On 2026-10-03, the owner approved placing orchestrator- or delegate-created session documents and visual artifacts in HDC `current-session/`, while excluding code, tests, approved deliverables, execution/build artifacts and tool relay metadata. No generic skill or installed delegation relay is changed.

## Gemini relocation incident — closed unless it recurs, 2026-10-03

Two owner-authorized Gemini CLI 0.62.0 Auto/auto_edit attempts on the HDC website relocation failed with HTTP 400 / INVALID_ARGUMENT: "Requests ending with a model turn are not supported." Inspection/tool activity occurred, but no implementation edits or final report resulted; staged/live baseline checks remained unchanged. The subsequent owner-authorized OpenCode v2.0.20 / Luna high run completed the same frozen relocation scope and was independently verified before application. This comparison establishes execution in a different stack, not Gemini's exact root cause or general model superiority. The earlier 2026-10-01 disposable-repo Gemini relay trial remains recorded as successful.

Evidence remains outside the repositories under `C:/Users/malmotas/AppData/Local/Temp/opencode/hdc-website-gemini-run-20261002/` and `C:/Users/malmotas/AppData/Local/Temp/opencode/hdc-website-gemini-retry-20261002/`, pending separately scoped temp cleanup; do not rely on the completed task's cleared HDC scratchpad. All six installed Gemini skill files matched the local `feature/gemini-delegate` contribution source during inspection; OpenCode's main instruction/relay files matched its vendored copies. Gemini's installed verification prose was historically stale; no source/install reconciliation or relay fix was made during this investigation.

Four owner-approved synthetic diagnostics passed with Gemini CLI 0.62.0 and unchanged Auto/default settings: direct and relay one-read trials, eight sequential relay reads, and native update_topic followed by the same eight reads. Independent checks verified required tool sequences, expected outputs and unchanged fixtures. The original HTTP 400 was not reproduced and its cause remains unknown; no fix or broader HDC-workflow acceptance is claimed. On 2026-10-03 the owner directed removing debugging from future steps and closing this incident unless it recurs. No further diagnostic work is queued. Retain existing evidence; this disposition does not authorize cleanup, configuration/authentication changes, publication or automatic retries. Unrelated skill-verification gaps remain separate.

## Gemini delegate rebase — 2026-10-10

Reconciled the local `gemini-delegate` contribution overlay from upstream base `6826b363` onto
`8ef02103`, the delegate-skills version now vendored on `refactor/orchestration-contract`. The rebase
preserves Gemini's lane/config integration, updates its Windows `.cmd` version/dispatch launch to the same
Node 24-safe serialized-shell pattern adopted upstream, and adds Gemini to the upstream Node 24 preflight matrix.
The refreshed overlay remains unpublished and does not alter the vendored delegate snapshot or installed
user-level skill copies. Verification in this repo is structural: the regenerated patch is based on the new
upstream files and the affected merge points were reconciled. A native Windows run of the Gemini-focused tests
and upstream preflight/relay suite is still required before any upstream proposal.

## Gemini local contribution refresh — 2026-10-03

Following review of the relay refactor, refreshed `overlays/gemini-delegate/changes.patch`; the 24-path patch applies to its pinned base `6826b363085dcc80875372315fe7d208c4bf733f`, and the applied relay blob matches the separate `feature/gemini-delegate` checkout. The owner also asked to update the user-level `.agents/skills/gemini-delegate` installation: only `scripts/relay.mjs` was stale, so that file was copied from the reviewed source. All six installed files now hash-match the contribution checkout. `node test/relay-smoke.mjs --only gemini,package-shape,syntax`, `node test/event-scanner.mjs` (26 passed), and `node test/relay-parity.mjs` all passed in the source checkout; installed relay `node --check` and `--help` also passed. This remains a local, unpublished contribution outside the vendored snapshot and curated install list. No commit or push was made; live Gemini behavior was not retested.
