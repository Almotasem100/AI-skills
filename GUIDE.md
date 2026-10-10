# Guide: install and use my skills with any AI agent

A plain-language guide to every skill in this setup: what it is for, how to install it on a machine, and what
to say to your agent to use it. For *why* each skill is here, see `docs/decisions.md`; for the exact versions,
see `manifest.md`.

_Written 2026-09-25. What has and hasn't been tested is marked; don't assume more than that._

---

## Quick start: which skill, when (added 2026-09-26)

Think of the skills as helpers you call at each stage of a ticket. Most start on their own when you describe
what you want; the ones marked **(by name)** only start when you type their command.

**Orchestration rule:** the model you opened is the workflow orchestrator/control plane by default. It understands
the objective, chooses the smallest sufficient workflow, resolves needed roles (planner, implementer, reviewer,
tester, docs) through configured lanes, tracks state/exceptions, and moves authorized work forward. You normally
describe the outcome and any checkpoint; you do **not** need to name a model, lane or effort for routine delegation.
Explicit route/checkpoint instructions still override the inferred workflow.

### 🟢 Starting a ticket
**`grill-me` (by name): think it through first.** Small ticket, before any code. It asks you questions in
rounds, each with a suggested answer, until nothing is unclear.
> `/grill-me ticket 38939409: add the shared header to every page`

Answer "agree" or "agree except Q3: …". Save its final summary: that's your spec.

**`grill-with-docs` (by name): the same, for big tickets.** Use it when the ticket brings new business terms;
it also builds a glossary as you answer. Run it from the docs folder, never a code repo.
> `/grill-with-docs new approval workflow for checklists`

**`create-lld`: forward LLD and later as-built Technical Design.** After requirements are settled, it drafts a
concise architect-facing LLD before the plan/implementation. It can also prepare a customer-facing Functional
Design when the project workflow requires one. After the approved plan is implemented, invoke its Technical
Design mode to summarize the built solution for Architect review. Source materials and code are inspected
internally; deliverables omit attachment citations and source-code paths/lines.
> "Write the LLD for CADE-1234, 'Navbar', from these requirements. Release R4, Sprint 1."

### 🧭 Planning before implementation
**`plan-review`:** a one-shot, read-only critique of a plan, working session scratchpad, or existing handoff.
It returns prioritized findings with source evidence, assumptions, missing decisions, risks, and questions; it
does not edit the input.
> "Review this plan for contradictions, unsupported claims, missing decisions, and risks"

**`plan-debate`:** a structured challenge/response workflow around a proposed plan. The orchestrator chairs the
exchange and owns the shared coordination state; the plan-author and reviewer roles own their substantive outputs.
Configured lanes select the actual providers/models unless you override them. Give each role only the context and
source access it needs; use immutable snapshots only when a real read-only/containment boundary requires them.
> "Stress-test this implementation plan before coding and resolve the findings"

**`security-audit`:** a read-only review of a scoped change against approved security requirements when supplied.
It cites evidence, distinguishes risks from missing evidence, reports coverage limits, and does not claim compliance
or perform active testing.
> "Audit this change for relevant security risks and evidence gaps"

### 🔨 Building
**Implementation roles:** once implementation is inside the authorized workflow, the orchestrator routes it through
the configured implementer lane when delegation is useful. You normally state the task, not the transport details.
The delegate relay itself never commits.
> "Implement the approved plan and run the targeted tests"

You can still override the route when you care which provider/model should do a specific task, but that is an
exception rather than the normal interface. The same role routing can run another installed skill when appropriate
(see §4, "Have another agent run one of your skills").

**Guards: a second look** after the code is written, at the code, the tests or the docs.
> "Run clean-code-guard on this change"

### ✅ Before you push
**`two-axis-review`: check your work two ways.** Against your coding standards *and* against the spec (LLD or
grill summary), as two separate reports. Don't apply findings blindly; some will be wrong.
> "Review since develop, the spec is C:\...\LLD_CADE-1234.md"

### 📬 The pull request
**`describe-pr`: writes the PR for you.** It reads your changes, asks at most 4 questions, and opens the PR
only after you say yes.
> "Write the PR description. Ticket 38939409 'Navbar'. Tested: ng build, 108/108 specs."

**`babysit-pr`: handles review comments.** Copilot or bot comments on your PR: it fixes the real problems
locally, then asks before pushing or replying.
> "Babysit PR 123"

**`debate-review` (optional, big tickets): two AIs review and argue.** Use `--dry-run` first, so nothing gets
posted.
> "debate-review PR 123 --dry-run"

### 🌙 Ending a session
**`session-closeout`: wrap up properly.** It follows the project's closeout instructions: reuse an existing
scratchpad when required, or write a dated one; check citations; and suggest only relevant doc updates. It changes
main docs only if you say yes. The tracked HDC-specific profile is reconciled with the approved guidance in
`HDC-documents/README.md` and its automation handoff; native profile-aware behavior remains untested.
> "Close out this session"

**`handoff` (by name): brief the next session** when it has one clear task. It writes a short brief to your
temp folder; copy the brief somewhere safe if you want to keep it.
> `/handoff next session: port the fetchAnswerFilters endpoint`

### 🧰 Tools (scripts, not skills)
- **Pre-commit hook:** warns you whenever a commit adds new files. It never blocks the commit.
- **`json-compare`:** compares the old endpoint's response with the new one; every difference gets flagged.
- **`url-map`:** maps every URL to the code that handles it. Regenerate it after each ported piece.

Commands for all three are in §2 and §4.

### The whole flow in one line
- **Tiny/simple task:** clarify only what is needed → implement → targeted verification → describe-pr.
- **Small/medium ticket with fragmented inputs:** grill-me as needed → task-context → lightweight plan/design as needed → implement → guards/review → describe-pr.
- **Big ticket:** grill-with-docs → task-context → create-lld → plan/review → implementation → verification → describe-pr.
- **End of any session:** session-closeout (+ handoff only when unfinished work is being transferred).

`task-context` is adaptive, not mandatory: skip it when the task is already clear enough that another artifact would add no value.

The sections below have the details: install (§3), full usage and real-use notes (§4), what never happens
without your yes (§5).

---

## 1. The idea in one minute

A **skill** is a folder with a `SKILL.md` file: instructions (and sometimes small Node scripts) that a compatible
agent can load when a task matches. The same skill content is model-agnostic, but discovery depends on the host:
the AI model does not search your disk itself, and not every agent supports this convention. After you copy a
skill to a host's skills folder, confirm that host lists it; start a new session or reload skills if needed.

An agent only sees a skill if the folder sits in **its skills folder**:

| Agent | User-level skills folder (all projects) | Evidence |
|---|---|---|
| Claude Code | `C:\Users\<you>\.claude\skills\` | Previously tested with other skills; these two new skills have not been tested in Claude Code |
| Codex | `C:\Users\<you>\.agents\skills\` | Previously tested (2026-09-26, codex-cli 0.157.0) with other skills; these two have not been tested in Codex |
| Gemini CLI | `C:\Users\<you>\.agents\skills\` | Gemini CLI 0.62.0 lists both new skills as enabled and passed read-only smoke tests using Auto |
| OpenCode and other compatible agents | `C:\Users\<you>\.agents\skills\` | OpenCode v2.0.20 exposed both skills in this session; other hosts/models are not verified, so check their current skill-loading documentation |

**Plan-skill smoke tests (2026-10-01):** both skills were exercised on a synthetic plan in read-only mode. Gemini
CLI 0.62.0 found the client-support contradiction, unsupported rollback estimate, monitoring concern, and missing
rollback ownership. OpenCode used `plan-review` in this session and coordinated a Gemini evidence challenge for
`plan-debate`; the exchange and author response stayed in a temporary scratchpad. No project file was changed by
the tests. Claude Code and Codex are not installed here, and no claim is made for every agent or model.

Both folders start with a dot, so Windows Explorer may hide them: type the path in the address bar.

**This repo is the source; those folders are the installed copies.** Copies don't update themselves: after
you change a skill here, copy it again.

---

## 2. What's in the box

| When | Skill | What it does | Where it comes from |
|---|---|---|---|
| Start of a small ticket | `grill-me` | Interviews you about the plan until nothing is left assumed | Pocock (pinned) |
| Start of a big ticket | `grill-with-docs` | Same interview, and maintains working `GLOSSARY.md` / `GLOSSARY-MAP.md` plus ADR drafts as domain terms and decisions emerge | Pocock (pinned) |
| (used by the two above) | `grilling`, `domain-modeling` | The engines behind the grills. Install them; you don't call them yourself | Pocock (pinned) |
| Context synthesis, when useful | `task-context` | Consolidates fragmented requirements, grilling decisions, business rationale, UX evidence and constraints into a temporary rich working map for downstream roles | Mine |
| Design | `create-lld` | Writes concise Functional Design / LLD / Technical Design artifacts; can consume task context without making human-facing documents verbose | Mine |
| Test design | `scenario-test-cases` | Turns approved requirements and an LLD into traceable browser scenarios; uses a matching implementation-task handoff when available, and flags gaps instead of guessing | Mine |
| Before implementation | `plan-review` | One-shot, read-only critique of a proposed plan, scratchpad, or handoff | Mine |
| Before implementation | `plan-debate` | Evidence-backed challenge/response in one working scratchpad, with owner arbitration | Mine |
| Before or during implementation | `security-audit` | Read-only, evidence-citing review of relevant security risks and gaps; not certification or penetration testing | Mine |
| Implement | `delegate-setup` + `*-delegate` relays | Hands a coding task to another CLI (Codex, Antigravity, OpenCode…) and reviews its diff; never commits | Tech lead (copied) |
| After implementing | `clean-code-guard`, `test-guard`, `docs-guard` | Second-pass checks on code, tests and docs | Tech lead (copied) |
| Before pushing | `two-axis-review` | Reviews your diff against the repo's standards **and** against the spec (your LLD) | Pocock, renamed (copied) |
| PR | `describe-pr` | Writes What from git/implementation, Why from task context/approved requirements, and Testing from verified evidence or your report | Mine |
| After the PR is open | `babysit-pr` | Works through bot and Copilot review comments; **asks before pushing or posting** | Tech lead (copied, changed) |
| Big tickets, optional | `debate-review` | Two models review a PR and argue before posting | Tech lead (copied) |
| End of a session | `session-closeout` | Writes a dated scratchpad in the docs folder + proposed doc updates, and checks every `file:line` citation against the real files | Mine |
| Any time | `handoff` | Writes a brief so another agent or session can continue | Pocock (pinned) |

**Tools and templates (not skills).** Plain Node scripts (18+, no dependencies) and a git hook in this folder.
Nothing to install into a skills folder; run them from here, or ask your agent to.

| When | Tool | What it does | How |
|---|---|---|---|
| Before each commit | `templates/pre-commit-hook/` | **Warns** (never blocks) when a commit adds new files, so you check each was approved | Copy its two files into the repo's `.git/hooks/`: see "Any time" below. Once per clone |
| After porting an endpoint | `tools/json-compare/` | Diffs a recorded legacy response against the new one; any difference is a finding | `node tools\json-compare\compare.mjs <legacy.json> <new.json> [--config rules.json]` |
| After each ported slice | `tools/url-map/` | Maps every URL to its handler and callers, and lists the gaps | `node tools\url-map\url-map.mjs --config <project>.config.json` |
| Setting up a repo | `docs/linters.md` | Checkstyle / ESLint / Prettier setup notes and the exact commands | Read it; the HDC commands are in its last sections |

---

## 3. Install on a new machine (e.g. the workstation)

### What you need first
- **git** and **Node 18+** (`git --version`, `node --version`).
- The **`AI-skills` folder** on that machine. Until it is a git repo, copy the whole folder across (USB,
  network share, zip). Once it is a private repo, clone it.
- Optional, only for the skills that use them:
  - `gh` for `describe-pr` (create the PR) and `babysit-pr`/`debate-review`; set `GH_HOST` for GitHub
    Enterprise.
  - `jq` and Git Bash for `babysit-pr`.
  - The implementer CLIs you want to delegate to (`codex`, `agy`, `opencode`…), installed and signed in.

### Copy the skills (PowerShell)
Change the first line to where `AI-skills` lives on that machine, then paste the whole block. It installs
into both skills folders, so compatible agents see the same set. **Tested 2026-09-25** on this laptop
against a throwaway folder: all 18 then-listed skills landed in both targets (re-run 2026-09-26 after adding
`session-closeout`), and the scripts ran from their new place. The newly added `scenario-test-cases` entry has
not yet been included in an install test or tested natively. On 2026-10-01, `plan-review` and `plan-debate` were
copied into both user-level roots on this workstation and their `SKILL.md` hashes matched the repository copies.
Gemini CLI 0.62.0 lists both as enabled; OpenCode v2.0.20 exposed both in this session. Gemini and OpenCode
smoke-tested the workflows on synthetic input. These checks establish availability in those hosts here, not
universal support by every model or agent. `security-audit` was copied to both user-level roots with matching
hashes on 2026-10-01. Gemini CLI 0.62.0 smoke-tested it on a synthetic endpoint excerpt; OpenCode loaded the skill
in this session, but did not run the same audit fixture. These checks do not validate real vulnerability detection
or establish support by every model or agent. On 2026-10-01, `scenario-test-cases` was installed in both roots;
`plan-debate`, `plan-review`, `create-lld`, and `session-closeout` were synchronized from the repository after
drift checks. The synchronized skill files match their repository copies; no user-only skill edits were found.

```powershell
$setup   = "C:\Users\Mohamed\Downloads\WorkSpace\AI-skills"
$targets = "$HOME\.claude\skills", "$HOME\.agents\skills"

# 1. My skills and the copied (vendor) skills, straight from AI-skills.
#    Delegate relays: keep only the ones for CLIs you actually have.
$folders = @(
  "skills\describe-pr",
  "skills\task-context",
  "skills\create-lld",
  "skills\scenario-test-cases",
  "skills\plan-review",
  "skills\plan-debate",
  "skills\security-audit",
  "skills\session-closeout",
  "vendor\amElnagdy\delegate-skills\skills\delegate-setup",
  "vendor\amElnagdy\delegate-skills\skills\codex-delegate",
  "vendor\amElnagdy\delegate-skills\skills\agy-delegate",
  "vendor\amElnagdy\delegate-skills\skills\opencode-delegate",
  "vendor\amElnagdy\review-skills\skills\babysit-pr",
  "vendor\amElnagdy\review-skills\skills\debate-review",
  "vendor\amElnagdy\guard-skills\skills\clean-code-guard",
  "vendor\amElnagdy\guard-skills\skills\test-guard",
  "vendor\amElnagdy\guard-skills\skills\docs-guard",
  "vendor\mattpocock\skills\skills\two-axis-review"
)
foreach ($t in $targets) {
  New-Item -ItemType Directory -Force $t | Out-Null
  foreach ($f in $folders) { Copy-Item -Recurse -Force "$setup\$f" $t }
}

# 2. Pocock's pinned skills, from the reviewed commit in manifest.md.
$pocock = "$env:TEMP\mattpocock-skills"
if (-not (Test-Path $pocock)) { git clone --quiet https://github.com/mattpocock/skills $pocock }
git -C $pocock checkout --quiet 49dd158d1076134a641b33efb035946536778336
$pinned = "productivity\grill-me", "productivity\grilling", "productivity\handoff", "engineering\grill-with-docs", "engineering\domain-modeling"
foreach ($t in $targets) {
  foreach ($p in $pinned) { Copy-Item -Recurse -Force "$pocock\skills\$p" $t }
}

# 3. Check.
foreach ($t in $targets) { "`n$t"; Get-ChildItem $t -Name }
```

Then **start a new agent session** (skills are read at start-up). In Gemini CLI, run `/skills reload`.

Keep these together in the same folder: the `*-delegate` relays need `delegate-setup` beside them (for lanes),
and `debate-review` looks for the relays in `~/.agents/skills`, `~/.claude/skills` or `~/.codex/skills`.

### One-time setup for delegating
Say: *"set up my delegation lanes"*. `delegate-setup` finds your installed CLIs, proposes lanes (e.g.
`feature` → codex) and writes them only after your yes. **Choose "global"**: "project" creates
`.delegate/config.json` inside the repository. For `debate-review`, add two lanes named `review-main` and
`review-debate`, using two different CLIs.

`install.ps1` will later do all of this in one command; it waits for the workstation's agent list.

---

## 4. Use them

### Roles choose work; lanes choose provider/model/effort
The normal interface is intent, not transport configuration. Configure lanes once, then let the orchestrator resolve
the needed role automatically. This preserves the original cost-control lesson—never fall into an expensive unknown
default—without making you repeat model and effort on every run.

Example lane ideas:

| Role | Example route |
|---|---|
| Routine implementation | OpenCode / Luna, configured effort/variant |
| Hard implementation or planning | a stronger configured lane |
| Test-scenario author | Gemini Auto |
| Plan challenger | Gemini Auto |

You can override a route explicitly for a particular task. To inspect the configured/available implementers, use
`delegate-setup` discovery. A configured lane is not proof the CLI is installed/authenticated; verify real dispatch
before depending on it.


### Have another agent run one of your skills (e.g. Codex writes the LLD)
Your main agent (e.g. Claude) can hand a whole skill run to another CLI through its delegate relay. The other
CLI loads the skill from **its own** skills folder, so the skill must be installed there too (Codex:
`~/.agents/skills`; §3 does that).

**What to say** (to your main agent):
> *"Create the forward LLD for CADE-1234 from this ticket and these slides. Use the configured planning/document
> role, save it in C:\path\to\docs\folder, and list unresolved questions at the end."*

If you specifically want Codex/Gemini/etc. for that run, say so as an override.

**What happens:**
1. Your agent writes a **brief**. Codex sees only the brief, no chat history, so every input goes in it:
   ticket, description, slide path, designer, save folder, and *"use your create-lld skill"*.
2. It resolves the requested role to the configured lane and runs the relay with `--cd` set to the **folder the
   LLD goes in** (subject to the selected relay's actual access model).
3. Codex loads `create-lld`, drafts the LLD, runs its checker, and ends with its questions (up to five).
4. Your agent shows you the report and the questions. You answer; your agent sends the answers back to the
   **same Codex session** (`--session <id>` from the result), and Codex finishes the LLD.
5. Your agent reviews the LLD. Nothing is committed or published.

**Shared-state rule:** the orchestrator is the sole writer of the shared session scratchpad because it owns
coordination state. A delegated specialist owns its assigned artifact/change and returns or links that result
without the orchestrator recreating it. Give the role minimum useful context and canonical source access. Use an
immutable snapshot/worktree only when a real containment or concurrency boundary requires it.

The same pattern works for any skill that runs well on its own: *"delegate to codex with model gpt-6-luna,
effort low: use your **describe-pr** skill for this branch; don't create the PR"*, or *"…use your
**docs-guard** skill on these files, read-only"*. It doesn't fit the interview skills (`grill-me`,
`grill-with-docs`): they need you answering round by round, so run those in your own session.

**Tested 2026-09-26 (laptop, Claude → relay → Codex `gpt-6-luna`/low, read-only, throwaway repo):** Codex found
and loaded `create-lld` from `~/.agents/skills` and correctly reported its inputs, save location and that it
asks questions after drafting. **Not yet tested:** a full LLD written this way, and the answer-the-questions
round trip.

**Gemini delegation:** a `gemini-delegate` contribution is under owner review on the local, unpublished
`feature/gemini-delegate` branch in a separate upstream clone; it has not been merged into the vendored pack.
The relay was live-tested on 2026-10-01 with Gemini CLI 0.62.0 in a disposable Git repo, using the CLI's
default Auto model selection and `auto_edit`. It added a bounded helper and tests; the diff was reviewed and
the test command independently passed 5/5. This verifies one direct relay dispatch, not automatic skill
selection or saved-lane dispatch. The full upstream smoke suite still has five existing non-Gemini
`orphan-near-timeout` failures; their cause has not been investigated. `npx skills add . --list` has not been
run. Decide whether to propose the branch
upstream before adding it to the normal install instructions.

### Small ticket
1. **`grill-me`** (by name): *"/grill-me — ticket 38939409: add the shared header"*. It asks questions in
   rounds, each with its recommended answer. Answer, and it continues until nothing is open. It changes nothing
   until you confirm.
   **Used for real 2026-09-26** (designing `tools/url-map`, in Claude): 2 rounds, 15 numbered questions, each
   with a recommendation; the agent looked up the facts itself first (counts, file formats) and asked only for
   decisions. Tips from that run:
   - Answering *"agree"*, or *"agree except Q3: …"*, is enough.
   - At the end it restates everything as one list for you to confirm: **save that list as the spec** (that run:
     `tools/url-map/SPEC.md`). It's what `two-axis-review` checks the code against later.
   - It pushed back on an earlier idea of its own (extend the triage TSV → a new generated file) once it had
     read the file. Expect that; it's the point.
   - In Claude, `/grill-me` can only be typed by you. An agent that wants the interview itself uses `grilling`
     (the engine behind it).
2. **Implement** the approved scope. The orchestrator may handle a tiny change directly or route the implementation
   role through its configured lane; use the smallest sufficient workflow. The relay never commits. For a review or
   diagnosis, route a read-only/reviewer role rather than turning implementation into a write-capable run.
3. **Guards**: *"run clean-code-guard on this change"* (also `test-guard` for tests, `docs-guard` for docs). On
   ported legacy code (HDC): write the findings down; don't fix them in the same change.
4. **`two-axis-review`**: *"review since develop, the spec is C:\...\LLD_CADE-1234.md"*. You get a
   **Standards** report and a **Spec** report side by side. If it tells you to run `setup-matt-pocock-skills`,
   **ignore that** and give it the LLD path instead.
   **Used for real 2026-09-26** (reviewing `tools/url-map` against its grill spec, in Claude). What to know:
   - It needs a **git diff**: a fixed point (branch, tag or commit) and committed changes after it. Uncommitted
     work isn't reviewed. Without a repo, commit the spec, then the code, in a throwaway repo, and review from
     the spec commit.
   - It runs **two reviewers in parallel** (sub-agents). Their actual model/provider is a host/configuration detail;
     the 2026-09-26 historical run happened to use Sonnet and cost ~155k tokens for a ~400-line diff.
   - Read both reports, then **triage**: that run found 3 real spec gaps and 3 smells; one finding was wrong
     (it wanted `AMBIGUOUS` on dispatch rules, which route many handlers by design) and was rejected with a
     reason. Don't apply findings blindly.
   - It does **not** merge the two reports, on purpose: code can match the spec and still break the standards,
     or the other way round.
5. **`describe-pr`**: *"write the PR description. Use the task context for the rationale. Tested: ng build, 108/108 specs."*
   It asks at most 4 questions in one message and creates the PR only after your yes.
6. **`babysit-pr`**: *"babysit PR 123"*. It checks each bot comment against the code and fixes real problems
   locally, then shows you the commits and replies. **It pushes and posts only after your yes.**

### Big ticket
Same tail, with more up front:
1. **`grill-with-docs`** (by name), **run from an approved working-docs location, never from a code repo**:
   current upstream creates `GLOSSARY.md`, `GLOSSARY-MAP.md` and ADR working files wherever it runs. For HDC,
   start the agent in `HDC-documents/current-session/`; treat those files as working artifacts and reconcile any
   accepted durable decision into `HDC_Architecture_Decisions.md` during closeout. The historical trial started in
   `C:\Users\Mohamed\Downloads\HDC\HDC\documents`, not in `cb379_hdc_pdc`.
   **Trialled 2026-09-26** (HDC domain glossary, in Claude; stopped after round 1 on purpose). What to know:
   - It works: `/grill-with-docs` loaded `grilling` + `domain-modeling`, read the Charter and the entity classes
     itself (read-only), then asked 7 numbered questions with recommendations. It caught a real doc/code clash
     (the Charter says review stages are fixed DR1–DR4; the code makes them a configurable per-tool list).
   - **Where it writes:** the skill writes its glossary/ADR working files at its working root; choose that root deliberately.
     If the project already keeps a decision log (HDC: `HDC_Architecture_Decisions.md`), tell it to propose
     decisions there instead of starting a second one in `docs/adr/`.
   - **Glossary questions need your domain knowledge** (what an Element *is*, what P/T stand for). Budget a
     real session for it; it can't be answered from code.
   - **Historical trial limit:** the 2026-09-26 run stopped before any glossary term was settled; the current `GLOSSARY.md` behavior has not yet been exercised natively on HDC.
   - **Small tickets:** it runs on any size, but use `grill-me` there. `grill-with-docs` is the same interview
     plus glossary/ADR upkeep, which only pays off when the ticket introduces or changes domain terms.
2. **`task-context`**, when the ticket has several inputs/decisions or several downstream consumers:
   *"Synthesize the task context from the ticket, requirements, grilling answers, screenshots/CSS and current project decisions."*
   Save it in the project's approved working-artifact location. It is rich temporary context, not a team deliverable.
3. **`create-lld`**, forward mode: *"write the LLD for CADE-1234 from the task context and approved requirements."*
   The Functional Design/LLD remain concise and audience-specific; task context carries the detail they deliberately omit.
4. Use **`plan-review`** for a one-shot read-only critique, or **`plan-debate`** when several reviewers should
   challenge and respond in a shared scratchpad. Review the scratchpad and resolve open decisions before
   implementation; then continue through the appropriate implementation, verification and PR stages.
5. Optional: **`debate-review`**: *"debate-review PR 123 --dry-run"* prints the review (its two reviewers are
   the configured `review-main` and `review-debate` lanes); without
   `--dry-run` it posts it. *"debate-review --local"* reviews your working tree before a PR exists.

### Any time
- **`task-context`**, when task understanding is fragmented or several later roles would otherwise reread the
  same sources: synthesize one working context. Skip it for trivial work. Keep facts, decisions, estimates/targets,
  assumptions and unresolved questions distinct. In HDC, the intended working location is
  `HDC-documents/current-session/`, not the documentation root.
- **`create-lld`**, Technical Design mode after implementation: *"write the as-built Technical Design for
  CADE-1234 from the approved LLD/plan and implemented change; prepare it for Architect review."*
- **`scenario-test-cases`**, when test scenarios are needed: *"Draft browser test scenarios from these approved
  requirements and the LLD; check for the implementation-task handoff too."* Or call the skill by name. It uses
  numbered Scenario headings with Given / When / Then / And; each case traces to its sources. It writes no
  automation code and marks missing or conflicting expectations as questions rather than guessing.
- **`session-closeout`**, at the end of a session: *"close out this session"*. It follows the project's
  instructions for scratchpad location and reuse; otherwise it writes `YYYY-MM-DD_<Topic>_Scratchpad.md` in the
  docs folder. It lists relevant proposed document updates and checks every `file:line` citation. **If a citation
  is stale, the closeout isn't finished** until it's fixed. It changes the plan or other main documents only after
  your yes. To cite code that only exists on another branch, write `develop:path:line` (not checked). The HDC
  profile template is tracked at `templates/hdc-session-closeout-profile/`; HDC's canonical documents are not
  changed by this template.
  The checker also works on its own:
  `node <skills folder>\session-closeout\scripts\check-citations.mjs <file.md> --root <repo> --root <repo2>`.
- **Pre-commit hook** (warn about new files), once per clone. In PowerShell, inside the repo:
  ```powershell
  $hook = "C:\Users\Mohamed\Downloads\WorkSpace\AI-skills\templates\pre-commit-hook"
  Copy-Item "$hook\pre-commit", "$hook\warn-new-files.cjs" (git rev-parse --git-path hooks)
  ```
  A commit that adds files then prints `WARNING: this commit adds N new file(s)` with the list, and still goes
  ahead (undo with `git reset --soft HEAD~1`). No file is added to the repo (`.git/hooks/` isn't tracked).
  Without Node it stays silent. Remove: delete the two files from `.git/hooks/`. For HDC this is your own step
  (agents don't touch the repos). Details and tests: `templates/pre-commit-hook/README.md`.
- **`json-compare`** (B9: legacy vs ported endpoint):
  `node C:\Users\Mohamed\Downloads\WorkSpace\AI-skills\tools\json-compare\compare.mjs <endpoint>__<set>__legacy.json <endpoint>__<set>__new.json --config rules.json`.
  Exit 0 = identical, 1 = differences, 2 = bad input. `rules.json` (optional) can `ignore` paths, `rename` a
  field, or treat an array as `unordered`; ignored paths are always listed, never hidden. For HDC, record the
  responses in your browser first (runbook: `HDC\HDC\documents\b9-recordings\README.md`); the tool never
  calls an API. Details: `tools/json-compare/README.md`.
- **`handoff`** (by name): *"/handoff — next session continues the navbar tests"*. It writes the brief to your
  temp folder, not the project.
  **Used for real 2026-09-26** (brief for the B9 side-effect audit, in Claude): ~1 page, pointed at the
  runbook/Charter/rules by path instead of copying them, named the next skills, and flagged that the audit
  doesn't actually need the deploy it was waiting on. What to know:
  - **Different job from `session-closeout`:** closeout records what *happened* and queues doc updates;
    `handoff` briefs *one next task*. Use both at the end of a session only when the next task is specific.
  - The temp folder isn't durable or discoverable: copy the file into the project's `sessions\` folder if it
    must survive, and paste its path into the next agent's first message.

---

## 5. What never happens without your yes
- Nothing is pushed, posted, merged or created on GitHub (`describe-pr`, `babysit-pr`; `debate-review` posts
  unless you pass `--dry-run`).
- No commit by a delegated CLI; you commit after reviewing.
- No lane config written (`delegate-setup`).
- No file written in a code repo by `describe-pr` or `create-lld` unless you say where.

The exception to watch: `grill-with-docs` writes its glossary and ADR working files where it runs. On HDC, run it from `HDC-documents/current-session/`, not a code repository or the HDC docs root.

---

## 6. Keeping them up to date
- **My skills** (`skills/`): edit here, then re-run the copy block (or just the lines for that skill).
- **Copied skills** (`vendor/`): each folder's `UPSTREAM.md` says how to take an upstream update without losing
  my changes.
- **Pinned skills** (`manifest.md`): read what changed upstream, then change the commit in `manifest.md` and in
  the copy block above, and re-run it. Never edit them in place; to change one, move it to `vendor/` first
  (as was done for `two-axis-review`).

---

## 7. If something doesn't work
| Problem | Try |
|---|---|
| The agent doesn't use the skill | Name it: *"use the <name> skill"*. Start a new session after installing. Gemini CLI: `/skills reload` |
| A `/name` command isn't found | Check the folder is directly inside the skills folder (`...\skills\grill-me\SKILL.md`, not one level deeper) |
| A relay says `--lane requires the delegate-setup skill` | Copy `delegate-setup` into the same skills folder as the relay |
| `debate-review` can't find a relay | Install that `*-delegate` relay in `~/.agents/skills` or `~/.claude/skills` |
| Two skills with the same name | Rename one, the way `code-review` became `two-axis-review` (see its `UPSTREAM.md`) |
