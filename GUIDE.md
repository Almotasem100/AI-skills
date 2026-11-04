# Guide: install and use my skills with any AI agent

A plain-language guide to every skill in this setup: what it is for, how to install it on a machine, and what
to say to your agent to use it. For *why* each skill is here, see `docs/decisions.md`; for the exact versions,
see `manifest.md`.

---

## Quick start: which skill, when

Skills are helpers for relevant tasks, not a mandatory sequence. Supporting hosts may select them from their
descriptions; installation or matching wording does not guarantee loading. Explicit invocation syntax depends
on the host. Examples marked **(by name)** are intended for explicit use.

**Shared workflow:** follow `docs/orchestration-contract.md` and the active project's canonical rules.
Choose the smallest sufficient workflow, preserve required outcomes and checkpoints, and use appropriate skills.
The optional **AI Skills delegation mode** has separate installation and activation instructions below.

### 🟢 Starting a ticket
**`grill-me` (by name): clarify when a small ticket actually needs clarification.** It asks focused questions in rounds. Skip it when the bug/task is already clear enough to inspect, fix and verify directly.
> `/grill-me ticket APP-123: add the shared header to every page`

Answer "agree" or "agree except Q3: …". Save its final summary: that's your spec.

**`grill-with-docs` (by name): the same, for big tickets.** Use it when the ticket brings new business terms;
it also builds a glossary as you answer. Choose the project-approved working location: this skill writes glossary and ADR working files where it runs.
> `/grill-with-docs new approval workflow for checklists`

**`create-lld`: feature-level design artifacts.** After requirements are settled, it drafts a concise architect-facing LLD before the plan/implementation and can prepare a customer-facing Functional Design when required. A project may name the forward LLD Technical Design; a separate as-built record requires an explicit project need. Design coordinates such as proposed files/methods are useful to the architect; investigative source inventories stay internal.
> "Write the LLD for APP-123, 'Navbar', from these requirements."

### 🧭 Planning before implementation
**`plan-review`:** a one-shot, read-only critique of a plan, dedicated planning record, or existing handoff.
It returns prioritized findings with source evidence, assumptions, missing decisions, risks, and questions; it
does not edit the input.
> "Review this plan for contradictions, unsupported claims, missing decisions, and risks"

**`plan-debate` (material technical disagreement or explicit request):** a structured challenge/response workflow around a proposed plan. The caller coordinates the
exchange in a temporary debate record; the project scratchpad stays compact. The plan-author and reviewer roles own their substantive outputs.
The calling workflow supplies participants and execution; the skill does not bind providers or models. Give each role only the context and
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
only when the current authorization covers publication.
> "Write the PR description. Ticket APP-123 'Navbar'. Tested: ng build, 108/108 specs."

**`babysit-pr`: handles review comments.** Copilot or bot comments on your PR: it fixes the real problems
locally, then asks before pushing or replying.
> "Babysit PR 123"

**`debate-review` (optional; requires the delegation tooling stack): two AIs review and argue.** Use `--dry-run` first, so nothing gets
posted.
> "debate-review PR 123 --dry-run"

### ✅ Completing bounded work
`work-closeout` reconciles a genuinely completed feature or other bounded work item. It reuses the project's working record, checks relevant citations, and updates/proposes only durable state that actually changed according to project policy. Invoke it only for an explicit closeout/reconciliation request; implementation completion retains working files for owner inspection.
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
- **Feature-scale work:** requirements/context → applicable Functional Design/LLD/QA scenarios → feature plan + delivery slices → slice implementation/verification/review and authorized publication → retained delivery state; closeout only when explicitly selected.
- **Completed feature/bounded work:** preserve artifacts and working state; run work-closeout only when explicitly requested. Cleanup/archival needs explicit inventory authorization.

`task-context` is adaptive, not mandatory: skip it when the task is already clear enough that another artifact would add no value.

The sections below have the details: install (§3), full usage and real-use notes (§4), what never happens
without your yes (§5).

---

## 1. The idea in one minute

A **skill** is a folder with a `SKILL.md` file: instructions (and sometimes small Node scripts) that a compatible
agent can load when a task matches. The same skill content is model-agnostic, but discovery depends on the host:
the AI model does not search your disk itself, and not every agent supports this convention. After you copy a
skill to a host's skills folder, confirm that host lists it; start a new session or reload skills if needed.

This guide's copy procedure targets these user-level locations. Confirm the selected host actually discovers
and loads the installed copy; a folder path alone is not proof of compatibility.

| Host | Installation target used here |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| Codex, Gemini CLI, OpenCode and compatible hosts | `~/.agents/skills/` |

Skill folders and global instruction files are separate. For the tested ZadLoop desktop setup, the shared
template at `~/.agents/AGENTS.md` was included in the retained instruction baseline after installation; the copy
in OpenCode’s configuration directory alone was not sufficient. ZadLoop supports a `DSH_AGENTS_HOME` override,
so verify the effective desktop launch configuration instead of assuming a path. Preserve existing personal
instructions and check the retained baseline in a fresh session; file parity alone does not establish loading.

If a host does not discover that location, follow its current documented configuration; do not duplicate or
rewrite global settings blindly. Source checks, installed-file parity and observed host behavior are different
claims. Use the [test pack](test/native-smoke/README.md) for verification and evidence limits, and the
[roadmap](docs/roadmap.md) for pending work. Prior trials apply only to the revisions and environments recorded.

Both folders start with a dot, so Windows Explorer may hide them: type the path in the address bar.

**This repo is the source; those folders are the installed copies.** Copies don't update themselves: after
you change a skill here, copy it again. When upgrading from obsolete installed names (`session-closeout` or
`scenario-test-cases`), verify the `work-closeout` / `qa-scenarios` replacements before any authorized removal of
the old directories.

---

## 2. What's in the box

| When | Skill | What it does | Where it comes from |
|---|---|---|---|
| Start of a small ticket | `grill-me` | Interviews you about the plan until nothing is left assumed | Pocock (pinned) |
| Start of a big ticket | `grill-with-docs` | Same interview, and maintains working `GLOSSARY.md` / `GLOSSARY-MAP.md` plus ADR drafts as domain terms and decisions emerge | Pocock (pinned) |
| (used by the two above) | `grilling`, `domain-modeling` | The engines behind the grills. Install them; you don't call them yourself | Pocock (pinned) |
| Intake record, when useful | `task-context` | Preserves original-source pointers, approved scope, consequential grilling Q&A/decisions and open questions; narrow sourced concerns remain leads, not approved solutions | Mine |
| Design | `create-lld` | Writes concise feature-level Functional Design / forward LLD artifacts; project naming may call the forward LLD Technical Design; separate as-built record only when required | Mine |
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
| Evaluating lint/format tools | `docs/linters.md` | Portable examples and tool-download caveats | Follow the project’s configured commands and quality gates |

---

## 3. Install on a new machine (e.g. the workstation)

### What you need first
- **git** and **Node 18+** (`git --version`, `node --version`).
- A checkout of **`AI-skills`** at the intended revision. Clone `https://github.com/Almotasem100/AI-skills.git`
  using your existing repository access, or use an authorized source copy. Confirm its revision before installation.
- Optional, only for the skills that use them:
  - `gh` for `describe-pr` (create the PR) and `babysit-pr`/`debate-review`; set `GH_HOST` for GitHub
    Enterprise.
  - `jq` and Git Bash for `babysit-pr`.
  - The implementer CLIs you want to delegate to (`codex`, `agy`, `opencode`…), installed and signed in.

### Copy the skills (PowerShell)
Set `$setup` to this checkout, then choose **shared skills only** or **shared skills plus delegation**
when prompted. The block installs the shared contract and shared global instructions for the hosts you select.
Installing optional instructions does not activate them. Include `plan-debate` with the optional delegation
components so its conditional disagreement trigger is available; shared-only installations may opt into it for
explicit standalone use. Availability is not proof of native loading or execution.

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
$withPlanDebate = $withDelegation -or ((Read-Host "Also install standalone plan-debate? [y/N]") -match '^(?i:y|yes)$')

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
  Copy-Item -Force "$setup/docs/cli-dispatch.md" $instructionRoot
}
# Select the hosts you use; copying replaces those selected host instruction files.
# Preserve/merge any existing personal instructions before running these lines.
# ZadLoop: use its effective DSH_AGENTS_HOME/AGENTS.md if overridden; the tested default is ~/.agents/AGENTS.md.
$instructionTargets = "$HOME/.config/opencode/AGENTS.md", "$HOME/.agents/AGENTS.md", "$HOME/.claude/CLAUDE.md", "$HOME/.gemini/GEMINI.md"
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
optional stack only when the project selects its `debate-review` path. `plan-debate` is included with the profile
for consequential technical disagreement, not invoked after every review.

### One-time lane setup (optional components only)
Say: *"set up my delegation lanes"*. `delegate-setup` finds your installed CLIs, proposes lanes (e.g.
`feature` → codex) and writes them only after your yes. **Choose "global"**: "project" creates
`.delegate/config.json` inside the repository. For `debate-review`, add two lanes named `review-main` and
`review-debate`, using two different CLIs.

### Execution mechanism

AI Skills delegation mode uses the configured CLI delegation skills. Set up lanes once; ordinary requests select
responsibilities and their configured routes automatically. Native-agent preference setup is parked; a verified equivalent native child is permitted only for bounded relay/tooling recovery under the optional profile. Do not create,
validate, migrate or delete existing local execution.json files or host agents during this refresh; they are unused
by this profile. No standalone installer is implemented. Confirm copied-file parity and loading in selected hosts.

For another harness's own orchestration, install/use the shared instructions without selecting our optional profile.
Any external fallback rule for that harness is an explicit user/session instruction, subject to its permissions and
higher-priority rules; it is not part of shared workflow policy. ZadLoop trials are currently on hold. Use the
generated OPENCODE-PROMPT.md and exact fixture root in FULL-SCENARIO.md for the current OpenCode retest.

---

## 4. Use them

### AI Skills delegation mode: roles and routes

The following routing instructions apply only after explicit activation of **AI Skills delegation mode**;
read `docs/ai-skills-delegation.md` first. They are not the shared workflow defaults.
The normal interface is intent, not transport configuration. Configure CLI lanes once, then let the orchestrator resolve
the needed role automatically. This preserves the original cost-control lesson—never fall into an expensive unknown
default—without making you repeat model and effort on every run.

Example lane ideas:

| Role | Example route |
|---|---|
| Routine implementation | OpenCode / Luna, configured effort/variant |
| Hard implementation, or explicitly assigned external planning | a stronger configured lane |
| Test-scenario author | Gemini Auto |
| Plan challenger | Gemini Auto |

You can override a route explicitly for a particular task. To inspect the configured/available implementers, use
`delegate-setup` discovery. A configured lane is not proof the CLI is installed/authenticated; verify real dispatch
before depending on it.


### Have another agent run a skill

After explicitly selecting AI Skills delegation mode, ask for the outcome naturally:

> "Create the feature LLD and required Functional Design from these requirements and slides. Save them in the
> project's approved design location and report unresolved material questions."

The optional profile assigns participants and resolves the feature-design responsibility. Its
[dispatch reference](docs/cli-dispatch.md) and the selected installed relay own invocation, working-directory/access
requirements and continuation options. Use that relay's actual documented flags; do not copy another CLI's flags.

Provide objective, approved source/artifact paths, change/output boundaries and acceptance criteria. When accessible,
files carry the inputs; do not paste entire documents into the brief. The receiving environment needs appropriate
skills and authorized source access. Preserve actual returned session IDs and resume only when supported/current;
a fresh continuation from artifacts must not be presented as the same session.

A provider/model request is an explicit task override, not a persistent configuration change. Normal feature requests
do not require per-assignment model or transport choices. Requested artifacts and real invocation/results must be
checked; successful relay completion alone is not task acceptance. Follow the contract/profile rather than treating
this example as another execution policy.

For Gemini, use the repository's current [overlay procedure](overlays/gemini-delegate/README.md), not historical
local-branch or installed-version notes. Setup/parity and live host acceptance remain distinct; see the test pack.

### Small ticket

These are usage examples, not another execution policy. Use the shared contract and project rules for scope,
required review, verification and authorization.

- **Clarify when needed:** `/grill-me ticket APP-123: add the shared header`. Inspect accessible facts first;
  ask for consequential decisions and retain the agreed requirements in the approved working record.
- **Implement and check:** "Implement this bounded change and run the relevant project checks." Applicable
  code/test/doc guards can provide a focused second pass; findings still need judgment and disposition.
- **Review standards and behavior:** "Use two-axis-review since <verified-base>; the spec is <approved-path>."
  The current vendored skill compares `<fixed-point>...HEAD`, so it needs a resolvable base and committed changes.
  That comparison excludes uncommitted work. If the required history is missing, report that limitation and use an
  appropriate working-tree/source review when available; do not create commits or a throwaway repo just to make
  the tool run without authorization. Keep Standards and Spec findings distinct and assess them against sources.
- **Prepare PR text:** "Write a local PR description from this change and the approved requirements; report only
  recorded test results." `describe-pr` owns context recovery and drafting. Publication follows its authorization
  rules; preparing text does not open a PR or push a branch.
- **Handle PR feedback:** "Use babysit-pr on PR 123." Consult the selected skill for its actual capabilities
  and posting/push boundaries rather than treating this example as authority for external actions.

### Big ticket

For larger work, use the applicable Full Feature outcomes in the shared contract. Useful requests include:

- **Clarify domain concepts:** `/grill-with-docs new approval workflow`. Choose the active project's approved
  working location first: the pinned skill creates glossary, glossary-map and ADR working files there. If the
  project already has a glossary or decision log, use its canonical records rather than creating competing ones.
- **Preserve shared intake when useful:** "Record the original source pointers, approved scope, consequential
  Q&A/decisions and open questions." `task-context` is navigation to authoritative inputs, not a chosen solution.
- **Design:** "Write the feature LLD and required Functional Design from these approved requirements."
  `create-lld` owns the design process; project rules own artifact locations and applicable approval gates.
- **Prepare QA:** "Draft tester-facing scenarios from the settled requirements and Functional Design."
  Follow the shared contract's early QA timing; these scenarios do not execute tests.
- **Plan and review:** "Prepare the implementation plan and complete its applicable independent review."
  In AI Skills delegation mode, the profile assigns participants. `plan-review` and conditional `plan-debate`
  own their bounded processes; this walkthrough does not assign models or duplicate their convergence policy.
- **Optional PR debate:** `debate-review PR 123 --dry-run` prepares a review without posting it; consult the
  selected skill for prerequisites and actual publication behavior. Do not remove `--dry-run` unless posting is
  authorized.

### Any time
- **`task-context`**, when task understanding is fragmented or several later roles would otherwise reread the
  same inputs: preserve one intake-first record. Skip it for trivial work. Keep approved scope, original Q&A,
  decisions/supersession and open questions with source pointers. Retain consequential sourced concerns as leads,
  not solutions; add later synthesis only for a genuine continuity need in the same artifact. Use the active
  project's approved working location; the generic skill does not choose a project-specific path.
- **`create-lld`**, optional as-built record: invoke only when the active project/team explicitly requires it after implementation. A forward LLD may already be delivered under the name Technical Design.

- **`qa-scenarios`**, when QA needs behavior scenarios: *"Draft QA scenarios for this feature from the approved requirements and Functional Design, and map them to delivery slices where useful."* It specifies expected observable behavior; it does not run tests.

- **`work-closeout`**, when a feature or agreed bounded work item is actually complete: *"close out this feature."* It reuses the project's working record, reconciles relevant durable state, validates source citations where applicable, and follows project cleanup policy. A new chat or a completed delivery slice alone does not trigger it.

- **`handoff`** (by name), for an actual transfer that needs extra briefing:
  `/handoff transfer this unfinished investigation to the next environment`. The pinned skill writes to a temp
  location. If the brief must survive, preserve it in the project's approved working location and pass its path
  to the next participant. Ordinary continuation should use the existing current working state; a new chat alone
  does not require a handoff or closeout.

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
