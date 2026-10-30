# Guide: install and use my skills with any AI agent

> **Compatibility rename — 2026-10-11:** `session-closeout` is now `work-closeout`; `scenario-test-cases`
> is now `qa-scenarios`. Reinstall the renamed directories and remove obsolete installed names only after
> verifying the new copies. HDC's working folder is now `active-work/` in canonical project guidance.


A plain-language guide to every skill in this setup: what it is for, how to install it on a machine, and what
to say to your agent to use it. For *why* each skill is here, see `docs/decisions.md`; for the exact versions,
see `manifest.md`.

_Written 2026-09-25. What has and hasn't been tested is marked; don't assume more than that._

---

## Quick start: which skill, when (added 2026-09-26)

Think of the skills as helpers you call at each stage of a ticket. Most start on their own when you describe
what you want; the ones marked **(by name)** only start when you type their command.

**Shared workflow:** follow `docs/orchestration-contract.md` and the active project's canonical rules.
Choose the smallest sufficient workflow, preserve required outcomes and checkpoints, and use appropriate skills.
The optional **AI Skills delegation mode** has separate installation and activation instructions below.

### 🟢 Starting a ticket
**`grill-me` (by name): clarify when a small ticket actually needs clarification.** It asks focused questions in rounds. Skip it when the bug/task is already clear enough to inspect, fix and verify directly.
> `/grill-me ticket APP-123: add the shared header to every page`

Answer "agree" or "agree except Q3: …". Save its final summary: that's your spec.

**`grill-with-docs` (by name): the same, for big tickets.** Use it when the ticket brings new business terms;
it also builds a glossary as you answer. Run it from the docs folder, never a code repo.
> `/grill-with-docs new approval workflow for checklists`

**`create-lld`: feature-level design artifacts.** After requirements are settled, it drafts a concise architect-facing LLD before the plan/implementation and can prepare a customer-facing Functional Design when required. A separate as-built Technical Design is optional only when the active project/team explicitly requires one. Source materials and code are inspected internally; deliverables omit evidence inventories and source-code paths/lines.
> "Write the LLD for APP-123, 'Navbar', from these requirements."

### 🧭 Planning before implementation
**`plan-review`:** a one-shot, read-only critique of a plan, dedicated planning record, or existing handoff.
It returns prioritized findings with source evidence, assumptions, missing decisions, risks, and questions; it
does not edit the input.
> "Review this plan for contradictions, unsupported claims, missing decisions, and risks"

**`plan-debate` (separately selected; existing requirements unchanged):** a structured challenge/response workflow around a proposed plan. The orchestrator chairs the
exchange in a temporary debate record; the project scratchpad stays compact. The plan-author and reviewer roles own their substantive outputs.
Configured lanes select the actual providers/models unless you override them. Give each role only the context and
source access it needs; use immutable snapshots only when a real read-only/containment boundary requires them.
> "Stress-test this implementation plan before coding and resolve the findings"

**`security-audit`:** a read-only review of a scoped change against approved security requirements when supplied.
It cites evidence, distinguishes risks from missing evidence, reports coverage limits, and does not claim compliance
or perform active testing.
> "Audit this change for relevant security risks and evidence gaps"

### 🔨 Building
**Implementation:** implement the authorized scope and run applicable project checks.
> "Implement the approved plan and run the targeted tests"

**Guards: a second look** after the code is written, at the code, the tests or the docs.
> "Run clean-code-guard on this change"

### ✅ Before you push
**`two-axis-review`: check your work two ways.** Against your coding standards *and* against the spec (LLD or
grill summary), as two separate reports. Don't apply findings blindly; some will be wrong.
> "Review since develop, the spec is C:\...\LLD_CADE-1234.md"

### 📬 The pull request
**`describe-pr`: writes the PR for you.** It reads your changes, asks at most 4 questions, and opens the PR
only after you say yes.
> "Write the PR description. Ticket APP-123 'Navbar'. Tested: ng build, 108/108 specs."

**`babysit-pr`: handles review comments.** Copilot or bot comments on your PR: it fixes the real problems
locally, then asks before pushing or replying.
> "Babysit PR 123"

**`debate-review` (optional; requires the delegation tooling stack): two AIs review and argue.** Use `--dry-run` first, so nothing gets
posted.
> "debate-review PR 123 --dry-run"

### ✅ Completing bounded work
`work-closeout` reconciles a genuinely completed feature or other bounded work item. It reuses the project's working record, checks relevant citations, and updates/proposes only durable state that actually changed according to project policy. Ending a chat alone does not trigger it.
> "Close out this feature"

**`handoff` (by name): brief an actual transfer or deliberate pause** when normal project state is not enough for the next worker/environment. It is exceptional, not a chat-boundary ritual.
> `/handoff transfer this unfinished investigation to the next environment`

### 🧰 Tools (scripts, not skills)
- **Pre-commit hook:** warns you whenever a commit adds new files. It never blocks the commit.
- **`json-compare`:** compares the old endpoint's response with the new one; every difference gets flagged.
- **`url-map`:** maps every URL to the code that handles it. Regenerate it after each ported piece.

Commands for all three are in §2 and §4.

### The whole flow in one line
- **Tiny/simple task:** inspect/clarify only what is needed → implement → targeted verification → stop or prepare/publish a PR only when requested/authorized.
- **Small/medium work with fragmented inputs:** grill-me as needed → task-context if useful → lightweight plan/design as needed → implement → verification/review → PR stage when requested/authorized.
- **Feature-scale work:** requirements/context → applicable Functional Design/LLD/QA scenarios → feature plan + delivery slices → slice implementation/verification/review/PRs → feature work-closeout.
- **Completed feature/bounded work:** work-closeout when durable reconciliation or cleanup is useful. Ending a chat alone needs neither closeout nor handoff.

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
| Claude Code | `C:\Users\<you>\.claude\skills\` | User-level skill loading has been exercised with earlier skills; the renamed/refined Portable workflow v2 skills are not yet reinstalled or natively re-tested here |
| Codex | `C:\Users\<you>\.agents\skills\` | Earlier skills were tested with codex-cli 0.157.0; the renamed/refined Portable workflow v2 skills are not yet reinstalled or natively re-tested here |
| Gemini CLI | `C:\Users\<you>\.agents\skills\` | Gemini CLI 0.62.0 previously discovered/exercised task-context, create-lld and describe-pr on the pre-v2 source; current renamed/refined skills need reinstall + bounded re-test |
| OpenCode and other compatible agents | `C:\Users\<you>\.agents\skills\` | OpenCode previously exercised plan/create-lld behavior on predecessor source; current v2 behavior remains to be verified after reinstall |

**Historical plan-skill smoke (2026-10-01):** the predecessor `plan-review` / `plan-debate` versions were exercised
on a synthetic plan in read-only mode. The current 2026-10-11 refinements deliberately move full plan/review exchange
out of the compact project scratchpad into a dedicated planning/debate record, so that old smoke is evidence for the
earlier behavior only. No broad host/model compliance claim is made.

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
| Design | `create-lld` | Writes concise feature-level Functional Design / forward LLD artifacts; optional Technical Design only when the project explicitly requires one | Mine |
| QA scenario design | `qa-scenarios` | Turns approved feature behavior into traceable tester-facing scenarios before implementation; may map scenarios to delivery slices; does not execute tests | Mine |
| Before implementation | `plan-review` | One-shot, read-only critique of a proposed plan, planning record, or handoff | Mine |
| Before implementation | `plan-debate` | Evidence-backed challenge/response in one temporary debate record; compact project scratchpad records only resulting execution state | Mine |
| Before or during implementation | `security-audit` | Read-only, evidence-citing review of relevant security risks and gaps; not certification or penetration testing | Mine |
| Implement | `delegate-setup` + `*-delegate` relays | Hands a coding task to another CLI (Codex, Antigravity, OpenCode…) and reviews its diff; never commits | Tech lead (copied) |
| After implementing | `clean-code-guard`, `test-guard`, `docs-guard` | Second-pass checks on code, tests and docs | Tech lead (copied) |
| Before pushing | `two-axis-review` | Reviews your diff against the repo's standards **and** against the spec (your LLD) | Pocock, renamed (copied) |
| PR | `describe-pr` | Writes What from git/implementation, Why from task context/approved requirements, and Testing from verified evidence or your report | Mine |
| After the PR is open | `babysit-pr` | Works through bot and Copilot review comments; **asks before pushing or posting** | Tech lead (copied, changed) |
| Big tickets, optional | `debate-review` | Two models review a PR and argue before posting | Tech lead (copied) |
| Completed bounded work | `work-closeout` | Reconciles the project's existing working record, relevant durable write-backs and checked citations; not a chat-ending ritual | Mine |
| Transfer/pause only | `handoff` | Writes a brief when another agent/environment needs extra transfer context; not required for a new chat | Pocock (pinned) |

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
Set `$setup` to this checkout, then choose **shared skills only** or **shared skills plus delegation**
when prompted. The block installs the shared contract and shared global instructions for the hosts you select.
Installing optional instructions does not activate them. `plan-debate` is a separate opt-in because its existing
participant/lane contract is parked for discussion; neither setup choice changes that skill.

Earlier copy commands were exercised on Windows, but this revised choice/companion-file block has not yet been
run on the owner's hosts. Verify installed content and host loading after setup; source checks alone do not prove it.
The documented block is setup guidance, not a new standalone installer.

**For Gemini CLI delegation:** first follow
[`overlays/gemini-delegate/README.md`](overlays/gemini-delegate/README.md#prepare-gemini-enabled-installation-from-this-repository)
to prepare and verify `$geminiSource`, then run the copy block with delegation selected. That source supplies the
matching enhanced setup and Gemini relay. Keep the variable in this PowerShell session; do not reset it before copying.

```powershell
$setup   = "C:\path\to\AI-skills"
$targets = "$HOME\.claude\skills", "$HOME\.agents\skills"
$withDelegation = (Read-Host "Install delegation components too? [y/N]") -match '^(?i:y|yes)$'
if (-not (Get-Variable geminiSource -ErrorAction SilentlyContinue)) { $geminiSource = $null }
$withPlanDebate = (Read-Host "Also install plan-debate with its existing participant/lane requirements? [y/N]") -match '^(?i:y|yes)$'

# If Gemini delegation is wanted, prepare $geminiSource via the overlay README first.
# Otherwise leave it unset/null. Validate the prepared source before any copies.
if ($withDelegation -and $geminiSource) {
  foreach ($name in 'delegate-setup', 'gemini-delegate') {
    if (-not (Test-Path (Join-Path $geminiSource "skills/$name/SKILL.md"))) {
      throw "Prepared Gemini source is missing $name."
    }
  }
}

# Shared skills and independently usable review/guard tools.
$folders = @(
  "skills\describe-pr",
  "skills\task-context",
  "skills\create-lld",
  "skills\qa-scenarios",
  "skills\plan-review",
  "skills\security-audit",
  "skills\work-closeout",
  "vendor\amElnagdy\review-skills\skills\babysit-pr",
  "vendor\amElnagdy\guard-skills\skills\clean-code-guard",
  "vendor\amElnagdy\guard-skills\skills\test-guard",
  "vendor\amElnagdy\guard-skills\skills\docs-guard",
  "vendor\mattpocock\skills\skills\two-axis-review"
)
$delegationFolders = @(
  "vendor\amElnagdy\delegate-skills\skills\delegate-setup",
  "vendor\amElnagdy\delegate-skills\skills\codex-delegate",
  "vendor\amElnagdy\delegate-skills\skills\agy-delegate",
  "vendor\amElnagdy\delegate-skills\skills\opencode-delegate",
  "vendor\amElnagdy\review-skills\skills\debate-review"
)
# Trim delegationFolders to the CLIs you have; keep delegate-setup for all retained relays.
if ($withDelegation) { $folders += $delegationFolders }
if ($withPlanDebate) { $folders += "skills\plan-debate" }
foreach ($t in $targets) {
  New-Item -ItemType Directory -Force $t | Out-Null
  foreach ($f in $folders) {
    $from = "$setup\$f"
    if ($f -eq "vendor\amElnagdy\delegate-skills\skills\delegate-setup") {
      if ($geminiSource) {
        $from = Join-Path $geminiSource 'skills/delegate-setup'
      } elseif (Test-Path (Join-Path $t 'gemini-delegate')) {
        throw 'Preserve Gemini support: prepare the verified overlay source before replacing delegate-setup.'
      }
    }
    Copy-Item -Recurse -Force $from $t
  }
  if ($withDelegation -and $geminiSource) {
    Copy-Item -Recurse -Force (Join-Path $geminiSource 'skills/gemini-delegate') $t
  }
}

# Companion instructions have a stable path independent of the source checkout or host.
$instructionRoot = "$HOME/.config/ai-skills"
New-Item -ItemType Directory -Force $instructionRoot | Out-Null
Copy-Item -Force "$setup/docs/orchestration-contract.md" $instructionRoot
if ($withDelegation) {
  Copy-Item -Force "$setup/docs/ai-skills-delegation.md" $instructionRoot
  Copy-Item -Force "$setup/docs/delegation-lanes.md" $instructionRoot
}
# Select the hosts you use; copying replaces those selected host instruction files.
# Preserve/merge any existing personal instructions before running these lines.
$instructionTargets = "$HOME/.config/opencode/AGENTS.md", "$HOME/.claude/CLAUDE.md", "$HOME/.gemini/GEMINI.md"
foreach ($destination in $instructionTargets) {
  if ((Read-Host "Install shared instructions at $destination ? [y/N]") -match '^(?i:y|yes)$') {
    New-Item -ItemType Directory -Force (Split-Path $destination) | Out-Null
    Copy-Item -Force "$setup/templates/global-user-instructions/AGENTS.md" $destination
  }
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

### Check the installed setup

Use `test/native-smoke/README.md` after a branch update and setup. Run
`node test/native-smoke/run.mjs --live` with the installed path options appropriate to your host, then have the
session execute the generated `TASKS.md` and independently verify/report results. The pack uses separate test
lanes in disposable projects; it does not change your everyday lanes or install missing tools. Native execution
of this revised setup remains a separate check from the pack's offline tests.

### Optional delegation installation and activation

After choosing delegation components, explicitly say **"Use AI Skills delegation mode"** to activate
`~/.config/ai-skills/ai-skills-delegation.md`. The profile links to the adjacent lane catalog and shared contract.
Do not concatenate those optional instructions into the shared global template.

The shared-only choice does not remove previously installed files or disable other execution systems. For an
existing installation, inspect source/install parity and preserve existing user changes before replacing files.
`two-axis-review` uses native subagents by its own contract; `babysit-pr` handles external bots and requires the
optional stack only when the project selects its `debate-review` path. `plan-debate` remains separately selected.

### One-time lane setup (optional components only)
Say: *"set up my delegation lanes"*. `delegate-setup` finds your installed CLIs, proposes lanes (e.g.
`feature` → codex) and writes them only after your yes. **Choose "global"**: "project" creates
`.delegate/config.json` inside the repository. For `debate-review`, add two lanes named `review-main` and
`review-debate`, using two different CLIs.

No standalone installer is implemented. After setup, compare copied files and confirm discovery in each selected host.

---

## 4. Use them

### AI Skills delegation mode: roles and routes

The following routing instructions apply only after explicit activation of **AI Skills delegation mode**;
read `docs/ai-skills-delegation.md` first. They are not the shared workflow defaults.
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
2. **Implement** the approved scope using the smallest sufficient workflow and applicable project verification.
   For review-only or diagnosis-only requests, preserve the requested read-only boundary.
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
   start the agent in `HDC-documents/active-work/`; treat those files as working artifacts and reconcile any
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
  assumptions and unresolved questions distinct. Use the active project's approved working location; the generic skill does not choose a project-specific path.
- **`create-lld`**, optional Technical Design mode: invoke only when the active project/team explicitly requires a separate as-built design artifact after implementation.

- **`qa-scenarios`**, when QA needs behavior scenarios: *"Draft QA scenarios for this feature from the approved requirements and Functional Design, and map them to delivery slices where useful."* It specifies expected observable behavior; it does not run tests.

- **`work-closeout`**, when a feature or agreed bounded work item is actually complete: *"close out this feature."* It reuses the project's working record, reconciles relevant durable state, validates source citations where applicable, and follows project cleanup policy. A new chat or a completed delivery slice alone does not trigger it.

- **`handoff`** (by name): *"/handoff — next session continues the navbar tests"*. It writes the brief to your
  temp folder, not the project.
  **Used for real 2026-09-26** (brief for the B9 side-effect audit, in Claude): ~1 page, pointed at the
  runbook/Charter/rules by path instead of copying them, named the next skills, and flagged that the audit
  doesn't actually need the deploy it was waiting on. What to know:
  - **Different job from `work-closeout`:** closeout records what *happened* and queues doc updates;
    `handoff` briefs *one next task*. Use handoff only when an actual transfer needs extra briefing; ending a chat alone needs neither.
  - The temp folder isn't durable or discoverable: copy the file into the project's `sessions\` folder if it
    must survive, and paste its path into the next agent's first message.

---

## 5. External effects and authorization

- Publication, push/PR creation, deployment, configuration changes and destructive cleanup follow the current
  user/project authorization envelope. Do not ask again for an effect that the user already explicitly included
  (for example, "take this slice through PR"), but do not infer publication/deployment from "plan", "implement" or
  "review" alone.
- Within the optional profile, delegated CLIs do not silently commit or broaden scope, and persistent lane
  configuration is deliberate setup rather than an incidental task side effect.
- `describe-pr` and `create-lld` keep temporary drafts outside code repos unless a project-approved destination
  or the current request says otherwise.


The exception to watch: `grill-with-docs` writes its glossary and ADR working files where it runs. Run it only from the active project's approved working location, not an arbitrary code-repository root.

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
