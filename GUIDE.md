# Guide: install and use my skills with any AI agent

What each skill is for, how to install it, and what to say to your agent. For versions see `manifest.md`; for the
reasons behind past choices see `docs/records/decisions.md`.

---

## 1. The idea in one minute

A **skill** is a folder with a `SKILL.md` file: instructions (sometimes with small Node scripts) that an agent loads
when a task matches its description. Discovery depends on the host, so after copying a skill, confirm the host lists
it (start a new session or reload skills).

| Host | Skills folder used here |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| Codex, Gemini CLI, OpenCode and compatible hosts | `~/.agents/skills/` |

Global instruction files are separate from skill folders. The install block copies the shared instructions to the
host files you select. For the ZadLoop desktop app, the effective file is `~/.agents/AGENTS.md` unless
`DSH_AGENTS_HOME` overrides it; the copy in OpenCode's config directory alone was not picked up there. Check in a
fresh session that the host actually loaded the instructions.

**This repo is the source; the folders above are installed copies.** They do not update themselves: after changing
something here, re-run the relevant copy lines. Both folders start with a dot, so Windows Explorer may hide them.
If you are upgrading from the old names `session-closeout` or `scenario-test-cases`, confirm `work-closeout` and
`qa-scenarios` work before removing the old folders.

---

## 2. What's in the box

Skills are helpers, not a mandatory sequence. The shared workflow is `instructions/orchestration-contract.md`
plus the active project's rules: choose the smallest sufficient process. Examples marked **(by name)** are meant to be
invoked explicitly.

| When | Skill | What it does | Source |
| --- | --- | --- | --- |
| Start of a small ticket | `grill-me` (by name) | Interviews you until nothing is left assumed; skip it when the task is already clear | Pocock (pinned) |
| Start of a big ticket | `grill-with-docs` (by name) | Same interview, plus working `GLOSSARY.md` / `GLOSSARY-MAP.md` and ADR drafts. **Writes files where it runs**, so run it from the project's approved working location | Pocock (pinned) |
| (engines of the two above) | `grilling`, `domain-modeling` | Install them; you don't call them yourself | Pocock (pinned) |
| Scattered inputs | `task-context` | One intake record: source pointers, approved scope, Q&A/decisions, open questions. Skip for clear tasks | Mine |
| Design | `create-lld` | Forward LLD (a project may call it Technical Design) and customer-facing Functional Design | Mine |
| QA preparation | `qa-scenarios` | Tester-facing scenarios from approved behavior, before implementation planning; does not run tests | Mine |
| Before implementation | `plan-review` | Read-only critique of a plan or technical design | Mine |
| Disputed plan finding | `plan-debate` | Focused author/reviewer exchange until the finding is resolved or escalated | Mine |
| Security-relevant change | `security-audit` | Read-only, evidence-citing security review; not certification or penetration testing | Mine |
| Docs may be stale | `document-drift-review` | Report-only comparison of selected docs with source | Mine |
| Implement via another CLI | `delegate-setup` + `*-delegate` | Hands a task to Codex, Antigravity, OpenCode, Gemini…; never commits | Tech lead (vendor) |
| After implementing | `clean-code-guard`, `test-guard`, `docs-guard` | Second-pass checks on code, tests and docs | Tech lead (vendor) |
| Before pushing | `two-axis-review` | Reviews your diff against the repo's standards **and** the spec | Pocock (vendor, renamed) |
| PR | `describe-pr` | Writes the PR: What from git, Why from approved sources, Testing from real evidence | Mine |
| PR comments | `babysit-pr` | Works through bot/Copilot comments; **asks before pushing or posting** | Tech lead (vendor, changed) |
| Big PRs, optional | `debate-review` | Two models review a PR and argue before posting | Tech lead (vendor) |
| Explicit closeout | `work-closeout` | Reconciles completed work into durable records; only on request | Mine |
| Real transfer or pause | `handoff` (by name) | Brief for another agent/environment when project records are not enough | Pocock (pinned) |

**Tools (scripts, not skills)**: Node 18+, no dependencies, run from this checkout.

| When | Tool | How |
| --- | --- | --- |
| Before each commit | `templates/pre-commit-hook/`: **warns** (never blocks) when a commit adds files | See its README; once per clone |
| After porting an endpoint | `tools/json-compare/`: diffs legacy vs new response | `node tools\json-compare\compare.mjs <legacy.json> <new.json> [--config rules.json]` |
| After each ported slice | `tools/url-map/`: URL → handler → callers, with gaps | `node tools\url-map\url-map.mjs --config <project>.config.json` |
| Choosing lint tools | `templates/linters/` | See its README |

### The flow in one line

- **Tiny task:** inspect → implement → targeted check → PR only when asked.
- **Small/medium with scattered inputs:** grill-me if needed → task-context if useful → light plan → implement →
  verify/review → PR when asked.
- **Feature:** requirements/context → Functional Design + LLD + QA scenarios → plan + reviewed slices → implement,
  verify, review each slice → PR when authorized. Closeout only when you ask for it.

---

## 3. Install on a new machine

### Prerequisites

- **git**, **tar** (built into Windows 10+) and **Node 18+** (`npm test` in this repo needs Node 21+).
- A checkout of this repo at the intended revision (`https://github.com/Almotasem100/AI-skills.git`).
- Optional, per skill:
  - `describe-pr` (publishing), `babysit-pr`, `debate-review`: `gh` signed in; set `GH_HOST` for GitHub Enterprise.
  - `babysit-pr`: also `jq` and bash (Git Bash on Windows).
  - Delegate relays: Node 18+, git, and each implementer CLI (`codex`, `agy`, `opencode`, `gemini`…) installed and
    signed in. `debate-review` also needs two lanes, `review-main` and `review-debate`.

### Gemini relay (only if you want Gemini delegation)

Prepare `$geminiSource` first with
[`overlays/gemini-delegate/README.md`](overlays/gemini-delegate/README.md#prepare-gemini-enabled-installation-from-this-repository),
in the same PowerShell session. It supplies the matching `delegate-setup` and the `gemini-delegate` relay.

### Copy block (PowerShell)

Set `$setup`, then answer the prompts. Choosing delegation also installs `plan-debate` and the optional profile
files; installing them does not activate them. Before overwriting a host instruction file, the block saves a
timestamped `.bak` copy next to it.

```powershell
$setup   = "C:\path\to\AI-skills"
$targets = "$HOME\.claude\skills", "$HOME\.agents\skills"
$withDelegation = (Read-Host "Install delegation components too? [y/N]") -match '^(?i:y|yes)$'
$withPlanDebate = $withDelegation -or ((Read-Host "Also install standalone plan-debate? [y/N]") -match '^(?i:y|yes)$')
if (-not (Get-Variable geminiSource -ErrorAction SilentlyContinue)) { $geminiSource = $null }

# Check the Gemini source before copying anything, so a bad source cannot leave a half-installed setup.
if ($withDelegation -and $geminiSource) {
  foreach ($name in 'delegate-setup', 'gemini-delegate') {
    if (-not (Test-Path (Join-Path $geminiSource "skills/$name/SKILL.md"))) { throw "Prepared Gemini source is missing $name." }
  }
}
if ($withDelegation -and -not $geminiSource) {
  foreach ($t in $targets) {
    if (Test-Path (Join-Path $t 'gemini-delegate')) { throw "Gemini relay is installed in $t; prepare `$geminiSource first so delegate-setup keeps Gemini support." }
  }
}

# 1. Skills. Shared skills and independently usable review/guard tools:
$folders = @(
  "skills\describe-pr",
  "skills\task-context",
  "skills\create-lld",
  "skills\qa-scenarios",
  "skills\plan-review",
  "skills\document-drift-review",
  "skills\security-audit",
  "skills\work-closeout",
  "vendor\amElnagdy\review-skills\skills\babysit-pr",
  "vendor\amElnagdy\guard-skills\skills\clean-code-guard",
  "vendor\amElnagdy\guard-skills\skills\test-guard",
  "vendor\amElnagdy\guard-skills\skills\docs-guard",
  "vendor\mattpocock\skills\skills\two-axis-review"
)
# Optional delegation stack. Remove relays for CLIs you don't have; always keep delegate-setup.
$delegationFolders = @(
  "vendor\amElnagdy\delegate-skills\skills\delegate-setup",
  "vendor\amElnagdy\delegate-skills\skills\codex-delegate",
  "vendor\amElnagdy\delegate-skills\skills\agy-delegate",
  "vendor\amElnagdy\delegate-skills\skills\opencode-delegate",
  "vendor\amElnagdy\review-skills\skills\debate-review"
)
if ($withDelegation) { $folders += $delegationFolders }
if ($withPlanDebate) { $folders += "skills\plan-debate" }
foreach ($t in $targets) {
  New-Item -ItemType Directory -Force $t | Out-Null
  foreach ($f in $folders) {
    $from = "$setup\$f"
    if ($geminiSource -and $f -like "*\delegate-setup") { $from = Join-Path $geminiSource 'skills/delegate-setup' }
    Copy-Item -Recurse -Force $from $t
  }
  if ($withDelegation -and $geminiSource) { Copy-Item -Recurse -Force (Join-Path $geminiSource 'skills/gemini-delegate') $t }
}

# 2. Workflow instructions, at a fixed path independent of host and checkout.
$instructionRoot = "$HOME/.config/ai-skills"
New-Item -ItemType Directory -Force $instructionRoot | Out-Null
Copy-Item -Force "$setup/instructions/orchestration-contract.md" $instructionRoot
if ($withDelegation) {
  Copy-Item -Force "$setup/instructions/ai-skills-delegation.md" $instructionRoot
  Copy-Item -Force "$setup/instructions/delegation-lanes.md" $instructionRoot
  Copy-Item -Force "$setup/instructions/cli-dispatch.md" $instructionRoot
}

# 3. Global instructions for the hosts you use (answer y per host). Existing files are backed up first;
#    merge any personal additions back from the .bak file afterwards.
$instructionTargets = "$HOME/.config/opencode/AGENTS.md", "$HOME/.agents/AGENTS.md", "$HOME/.claude/CLAUDE.md", "$HOME/.gemini/GEMINI.md"
foreach ($destination in $instructionTargets) {
  if ((Read-Host "Install shared instructions at $destination ? [y/N]") -match '^(?i:y|yes)$') {
    New-Item -ItemType Directory -Force (Split-Path $destination) | Out-Null
    if (Test-Path $destination) { Copy-Item $destination "$destination.$(Get-Date -Format yyyyMMdd-HHmmss).bak" }
    Copy-Item -Force "$setup/instructions/global-instructions.md" $destination
  }
}

# 4. Pocock's pinned skills, at the reviewed commit in manifest.md.
#    Only the pinned folders are extracted from the exact commit, so a stale or modified cache cannot leak in.
$pin    = "5863806dd4e15c63174bee4e7515a4256792ecfa"
$pinned = "productivity\grill-me", "productivity\grilling", "productivity\handoff", "engineering\grill-with-docs", "engineering\domain-modeling"
$pocock = "$env:TEMP\ai-skills-mattpocock.git"
if (-not (Test-Path $pocock)) { git clone --quiet --bare https://github.com/mattpocock/skills $pocock }
git -C $pocock cat-file -e "$pin^{commit}" 2>$null; if ($LASTEXITCODE) { git -C $pocock fetch --quiet origin $pin }
$extract = Join-Path $env:TEMP "ai-skills-pinned-$(Get-Random)"; New-Item -ItemType Directory $extract | Out-Null
git -C $pocock archive --format=tar -o "$extract\pinned.tar" $pin ($pinned | ForEach-Object { "skills/" + ($_ -replace '\\', '/') })
if ($LASTEXITCODE) { Remove-Item -Recurse -Force $extract; throw "Could not extract pinned commit $pin; nothing copied." }
tar -xf "$extract\pinned.tar" -C $extract
if ($LASTEXITCODE) { Remove-Item -Recurse -Force $extract; throw "Could not unpack pinned skills; nothing copied." }
foreach ($t in $targets) { foreach ($p in $pinned) { Copy-Item -Recurse -Force "$extract\skills\$p" $t } }
Remove-Item -Recurse -Force $extract

# 5. Check.
foreach ($t in $targets) { "`n$t"; Get-ChildItem $t -Name }
```

Then **start a new agent session** (Gemini CLI: `/skills reload`).

- Keep the relays and `delegate-setup` in the same skills folder; `debate-review` looks for relays in
  `~/.agents/skills`, `~/.claude/skills` or `~/.codex/skills`.
- Choosing shared-only does not remove previously installed delegation files. To refresh an existing install, compare
  installed files with the source first and keep any local edits.

### Set up delegation lanes (optional, once per machine)

Say *"set up my delegation lanes"*. `delegate-setup` finds the installed CLIs, proposes lanes (e.g. `implement-code` →
opencode with a model) and writes them only after your yes. **Choose "global" scope**: "project" scope creates
`.delegate/config.json` inside the repository. Leave any existing local `execution.json` and host agents alone: the
profile does not use them, so do not create, validate, migrate or delete existing local execution.json files.

### Check the installed setup

Use the [native-smoke pack](test/native-smoke/README.md): `node test/native-smoke/run.mjs` checks source/install
parity offline; `--live` adds small real relay calls in disposable projects with separate test lanes. It never changes
your everyday lanes or installs tools.

---

## 4. Use them

### Small ticket

- **Clarify when needed:** `/grill-me ticket APP-123: add the shared header`. Answer "agree" or "agree except Q3: …";
  keep the final summary in the working record as the agreed requirements.
- **Implement and check:** "Implement this change and run the relevant project checks." Then, if useful, "run
  clean-code-guard on this change" (or `test-guard`, `docs-guard`). Guard findings still need your judgment.
- **Review two ways:** "Use two-axis-review since develop; the spec is <path to LLD or grill summary>." It compares
  `<base>...HEAD`, so it needs a resolvable base and committed changes; uncommitted work is not included.
- **PR text:** "Write the PR description. Ticket APP-123 'Navbar'. Tested: ng build, 108/108 specs." (see `describe-pr` below)
- **PR comments:** "Babysit PR 123." It verifies each bot finding, fixes real ones locally, and asks before pushing or replying.

### Big ticket (Full Feature)

- **Clarify domain:** `/grill-with-docs new approval workflow`, run from the project's approved working location. If the
  project already has a glossary or decision log, use it instead of creating competing files.
- **Intake record:** "Use task-context: record the source pointers, approved scope, Q&A/decisions and open questions."
- **Design:** "Write the feature LLD and the Functional Design for APP-123 from the approved requirements. Save them in
  the project's design location." A separate as-built record is created only when the project requires one.
- **QA:** "Draft QA scenarios from the approved requirements and Functional Design; map them to delivery slices
  where useful." Do this before implementation planning so testers can prepare in parallel.
- **Plan and review:** "Prepare the implementation plan and complete its independent review." `plan-review` returns
  findings; if the plan author disputes a significant finding, `plan-debate` resolves it.
- **Security, when relevant:** "Audit this change for relevant security risks and evidence gaps."
- **Optional PR debate:** `debate-review PR 123 --dry-run` prints the review instead of posting. Drop `--dry-run` only
  when posting is authorized; `--local` reviews the working tree before a PR exists.

### Any time

- **Docs drift:** "Use document-drift-review on these API docs and the approved design against this revision; review only."
- **Closeout:** "Close out this feature." Only on an explicit request; finishing implementation or a new chat does
  not trigger it. Cleanup/archival needs its own approval.
- **Transfer:** `/handoff transfer this unfinished investigation to the next environment`. It writes to a temp
  location; if the brief must survive, save it in the project's working location and pass its path on.

### `describe-pr` details

- Uses task-context or approved ticket/requirements/design evidence for the *why*; never derives business rationale
  from the diff alone, never invents reasons or test results. Publishing the PR happens only when authorized.
- Optional `.describe-pr.json` at the repo root sets scopes, base branches or your own templates (example:
  `skills/describe-pr/references/describe-pr.example.json`). Default title `feat[#<ticket>]: <summary>`; a project
  may select `titleFormat: "conventional"`.
- Scripts on their own (any agent, or none):

  ```text
  node skills/describe-pr/scripts/context.mjs --out %TEMP%\ctx.json
  node skills/describe-pr/scripts/render.mjs --context %TEMP%\ctx.json --draft %TEMP%\draft.json --body-out %TEMP%\body.md
  ```

### AI Skills delegation mode (optional)

Say **"Use AI Skills delegation mode"** to activate `~/.config/ai-skills/ai-skills-delegation.md`. Then ask for
outcomes naturally; the profile resolves each responsibility (design, QA, plan review, implementation, code review)
to your configured lanes. Example:

> "Create the feature LLD and Functional Design from these requirements and slides. Save them in the project's
> design location and report unresolved questions."

- You can override a route for one task, including a one-off external plan author: "have codex with <model> write
  the plan". Overrides do not change configuration.
- Give file paths rather than pasting documents; the receiving CLI needs access to them.
- Relay completion is not task acceptance: the orchestrator checks the actual outputs.
- Without the profile, another harness's own orchestration can use the shared instructions alone.

---

## 5. External effects and authorization

- Push, PR creation, deployment, configuration changes and destructive cleanup follow the current user/project
  authorization. Something you already included ("take this slice through PR") is not asked again; "plan",
  "implement" or "review" alone never implies publication or deployment.
- Delegated CLIs never commit or silently broaden scope; lane configuration changes only during deliberate setup.
- `describe-pr` and `create-lld` keep temporary drafts outside code repos unless a project-approved destination is given.

---

## 6. Keeping them up to date

- **Refresh this machine:** after pulling or editing, run `npm test`, then
  `node tools/refresh/refresh.mjs --dry-run` to see what is stale, and the same command without `--dry-run` to apply.
  It updates only skills and instruction files you already have installed and that differ from this checkout, backs
  each one up under `~/.config/ai-skills/refresh-backups/`, and verifies the copy. It never adds or removes skills.
  Host instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) are only reported unless you pass
  `--host-instructions`. An installed Gemini relay is kept unless you pass `--gemini`, which rebuilds it from the vendored delegate-skills plus\n  the overlay in this checkout.
  Use the §3 copy block only for a new machine or to add skills.
- **Vendor copies:** follow each `UPSTREAM.md` to take upstream updates without losing local changes.
- **Pinned skills:** read the upstream changes, update the commit in `manifest.md` and in the copy block, re-run it.
  To change a pinned skill, move it to `vendor/` first (as was done for `two-axis-review`).

---

## 7. If something doesn't work

| Problem | Try |
| --- | --- |
| The agent doesn't use the skill | Name it: *"use the <name> skill"*. Start a new session after installing. Gemini CLI: `/skills reload` |
| A `/name` command isn't found | The folder must sit directly in the skills folder (`...\skills\grill-me\SKILL.md`) |
| A relay says `--lane requires the delegate-setup skill` | Copy `delegate-setup` into the same skills folder as the relay |
| `debate-review` can't find a relay | Install that `*-delegate` relay in `~/.agents/skills` or `~/.claude/skills` |
| Two skills share a name | Rename one, as `code-review` became `two-axis-review` (see its `UPSTREAM.md`) |
| OpenCode shows `ECONNRESET … retrying` | That's the host retrying its model provider, not a project failure |
| Garbled characters in PowerShell 5 | Read files with `Get-Content -Encoding UTF8` |
