# AI-skills

My personal, model-agnostic setup for AI-assisted development: the skills I wrote, the pinned third-party
skills I use, and how to install and use each one on a new machine. The instructions are portable across agents
that support `SKILL.md` skills (Claude Code, Codex, Gemini CLI / Antigravity, OpenCode, …); discovery depends on
each host's skill-loading behavior, so no install guarantees availability in every agent or model.

## Rules for this repo
- **Three kinds of skills, three places:**
  - `skills/`: my own skills.
  - `vendor/<owner>/<repo>/`: skills I copy in *and may modify* (my tech lead's delegate, review and guard
    skills). Each has an `UPSTREAM.md` recording the source repo and the exact commit it was copied from, plus a
    list of my local changes. To update: compare upstream from that commit to its latest, merge the changes in,
    keep my additions, then record the new base commit. Preserve the vendor provenance and local patch when
    integrating updates.
  - [`manifest.md`](manifest.md): skills I use unchanged (Pocock, …; Graphify was trialled and not adopted). Pinned to a commit and installed
    from source; to update, review the change and bump the pin. Never edit these in place: to change one, copy
    it into `vendor/` first.
- **Nothing vendor-specific as a foundation.** Allowed: `SKILL.md` skills, `AGENTS.md`, MCP servers, plain
  scripts, git hooks. No Claude-only hooks, subagents or model pinning.
- **Read before installing.** Read a third-party repo's scripts before its first install and before every pin bump.

## Authoring rules for my skills (so the team can use them with any agent)
Every skill in `skills/` must be droppable as-is into the team repo's `skills/` folder and work with Gemini CLI,
Claude Code, Codex or any other agent that reads `SKILL.md`.

1. **Same shape as the team repo:** `skills/<kebab-name>/SKILL.md`, plus `references/` for longer material.
2. **Frontmatter: only `name` and `description`.** No agent-specific fields (`allowed-tools`, `model`,
   `disable-model-invocation`, …). The description says *when* to use the skill; supporting hosts use it for automatic
   selection. Actual discovery/loading depends on the host and is not guaranteed by matching text alone.
3. **No agent-specific tool names in the instructions.** Write "read the diff", "ask the user", not "use the
   Read tool" or "call AskUserQuestion".
4. **No personal or project specifics inside the skill.** Team template, repo names, ticket IDs and paths come
   in as inputs or from a project's `AGENTS.md`. A project-specific rule belongs in that project, not the skill.
5. **Plain commands only: `git`, and optionally `gh`.** `gh` must be optional, with a fallback to plain git, and
   work against the internal GitHub Enterprise too (`GH_HOST`). Any helper script is Node (cross-platform), not
   PowerShell or bash.
6. **No secrets, tokens, internal URLs or customer data** in the skill or its examples.
7. **Document both ways to run it** in the skill's README entry: automatic (the agent picks it from the
   description) and explicit (e.g. Gemini's `activate_skill`, `/skills reload`).
8. **Test on at least two agents** (e.g. Claude Code and Gemini CLI) before proposing it to the team repo.

## Layout
| Path | What it holds |
|---|---|
| `README.md` | This file: what each item is, how to install and use it |
| `GUIDE.md` | **Friendly guide:** install every skill on a new machine and use it, with any agent |
| `manifest.md` | Third-party skills: source, pinned commit, status |
| `skills/` | My own skills, one folder each with a `SKILL.md` |
| `vendor/` | Copied third-party skills I may modify, each with an `UPSTREAM.md` (source, base commit, my changes) and, when changed, a `local-changes.patch` |
| `overlays/` | Local contributions/patches kept separate from upstream/vendor snapshots; each overlay documents its base and application procedure |
| `docs/delegation-lanes.md` | Optional profile’s lane responsibilities; live model/provider configuration stays local |
| `tools/` | Standalone scripts that aren't skills. `json-compare/`: diff two recorded API responses (used by HDC's B9). `url-map/`: URL → handler → caller map for Java web apps, with gaps (replaces Graphify) |
| `templates/` | Per-project starters and personal instruction profiles. Built: `pre-commit-hook/` (warns about new files; install in its README), `global-user-instructions/AGENTS.md` (canonical personal collaboration rules). Copy the shared template to the instruction paths of selected hosts; install the shared contract and optional companion instructions using `GUIDE.md`, verify parity and confirm loading in each host. These files do not configure arbitrary other apps or guarantee model compliance. To come: general project `AGENTS.md` starter |
| `docs/decisions.md` | Why each skill was kept or dropped |
| `docs/roadmap.md` | **Status, next steps, open decisions: start here** |
| `docs/future-ideas.md` | Candidate enhancements and source references; read only for future-option review, not normal task startup |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI agents working on this repo. `CLAUDE.md` only imports `AGENTS.md`. For Gemini CLI, point its context file setting at `AGENTS.md` (check the setting name in the current Gemini CLI docs) |

## Installing on a new machine
See [`GUIDE.md`](GUIDE.md): PowerShell setup choices that copy selected skills (mine, the copied ones, and the
pinned Pocock ones at their commit) into `~/.claude/skills` and `~/.agents/skills`, plus how to use each skill.
The updated setup choices require native verification; no standalone installer is implemented.

## The workflow

The shared [workflow contract](docs/orchestration-contract.md) defines Full Feature and Change/Bug entry paths,
applicable design, QA scenarios before implementation planning, plan critique, implementation/checks, code review
and authorized publication/closeout. Skills are replaceable capabilities; project instructions own tracker mappings,
architecture, environment gates and approvals. Intake-first task context is optional; the scratchpad is compact execution
state. Preserve source evidence, proportionate verification, findings disposition and explicit omissions.

The shared collaboration template is `templates/global-user-instructions/AGENTS.md`. It contains one activation
pointer for the optional **AI Skills delegation mode**. That separately guarded profile is
[`docs/ai-skills-delegation.md`](docs/ai-skills-delegation.md); install its companion files only when wanted.
The profile's **Ownership and activation** section is the participant-allocation authority. The semantic catalog
and reusable skills do not hardcode who holds the planning/review roles. Its **Execution mechanism** section selects
configured CLI relays; the on-demand [dispatch reference](docs/cli-dispatch.md) covers discovery/troubleshooting.
The shared workflow does not select a transport. Native routing remains parked except for the profile's bounded
recovery authorization. See `GUIDE.md` for installation choices; availability is not demonstrated execution.

### Generic project hierarchy

When a project has a parent feature and internal delivery tickets:

| Scope | Typical artifacts / work |
| --- | --- |
| Feature | Shared requirements/intake, applicable design and QA, implementation plan and acceptance |
| Delivery slice | Bounded changes, branch/diff, verification/review and applicable PR preparation |

This is a hierarchy, not a fixed execution sequence. Use the shared contract for prerequisites and completion;
closeout is an explicitly requested reconciliation action, not an automatic feature endpoint.

The generic repo never hardcodes a tracker. A project may map Feature to Jira, Delivery Slice to CodeBeamer, or use
different systems entirely.

### Optional delegation setup

The guarded [AI Skills delegation mode profile](docs/ai-skills-delegation.md) uses the
[lane catalog](docs/delegation-lanes.md). These files describe responsibilities, not live model/provider settings.
They do not install or change workstation configuration. Secret-free lane export/bootstrap remains future work.

## Small setup smoke tests

After installing a changed branch, use [`test/native-smoke/README.md`](test/native-smoke/README.md). It provides
separate test-only lanes, installed-file/config checks, small real relay tasks and session-run skill/workflow cases.
No host-specific integration or global lane rewrite is required. The runner's relay calls require `--live`; full-scenario calls require the separate session prompts and authorization described in the run guide.

## Skills
Each skill gets an entry here once it exists: what it does, when to call it, its inputs and outputs, and an
example call.

### My skills
| Skill | Capability |
| --- | --- |
| `task-context` | Optional intake-first record of original inputs, consequential Q&A/decisions, open questions and sourced concerns; not a prescribed technical solution |
| `create-lld` | Concise forward LLD and required Functional Design from approved inputs; a separate as-built record only when explicitly required |
| `qa-scenarios` | Observable tester-facing scenarios, not executable tests or QA execution |
| `plan-review` | Read-only source-grounded plan critique; attributable findings, assumptions and verification limits |
| `plan-debate` | Focused author/reviewer resolution of consequential technical disagreement; supports explicitly selected multiple reviewers |
| `security-audit` | Read-only scoped security findings and evidence/requirement gaps; not certification or active penetration testing |
| `work-closeout` | Explicit reconciliation of completed bounded work and changed durable facts; archival/removal needs its applicable authorization |
| `describe-pr` | Evidence-grounded PR description separating actual changes, approved rationale and verification; publication follows its own authorization |

Use the [roadmap](docs/roadmap.md) for current pending work and the [test pack](test/native-smoke/README.md) for
verification methods/limits. Historical smokes apply only to their tested revisions and environments; the current
sources are not claimed installed or behaviorally verified on every host. Git preserves prior execution history.

### `task-context`
**Install:** copy `skills/task-context/` into the same skills folder as the other first-party skills.

Use it when the task understanding is scattered across several inputs or will be reused by several downstream
roles. For automatic selection, ask naturally, e.g. *"synthesize the task context from this ticket, requirements,
grilling decisions and screenshots."* If the agent does not select it, invoke it explicitly: *"Use
`task-context` for this task."* If the task is already simple and clear, skip it.

The initial result preserves original-source navigation, approved scope and rationale, consequential grilling Q&A,
decisions/corrections and open questions. Narrow consequential observations or cross-source concerns may remain
with precise sources, uncertainty and a verification question; they do not select architecture or imply approval.
Routine technical summaries and reuse recommendations are excluded from the initial handoff. This reduces inherited
interpretation without claiming to eliminate bias or save tokens. Facts, decisions, estimates and inferences remain
distinct; do not copy whole PDFs or chats. A genuine later continuity need may justify a labeled working synthesis
in the same artifact, not a second mandatory document. Older rich contexts remain usable with source verification.

For projects with an approved current-work folder, save it there. Otherwise present it in chat or write it only to
an approved working path. Downstream skills still verify consequential claims against authoritative sources when
needed.

### `describe-pr`
**Needs:** Node 18+ and git. Optional: `gh` (to create or update the PR; set `GH_HOST` for GitHub Enterprise).

**Install:** copy `skills/describe-pr/` into your agent's skills folder: `.agents/skills/` in a repo (read by
Gemini CLI, Claude Code, Codex and others), or your agent's user-level skills folder to have it everywhere.
Gemini CLI: run `/skills reload` afterwards.

**Use:** on your branch, ask *"write the PR description"*. When a task-context artifact exists, the skill uses it
for the business rationale before asking you. Without one, it checks the relevant approved ticket/requirements/design
evidence already available. It still needs actual verification evidence or your report for testing:
> write the PR description. Ticket 38939409 "Navbar": add the shared header with profile menu. Tested: ng build,
> 108/108 specs, header checked in the browser.

If the agent doesn't pick the skill up by itself, name it: *"use the describe-pr skill"* (Gemini:
`activate_skill` with `describe-pr`). Add a `.describe-pr.json` at the repo root to set scopes, base branches
or your own templates (example in `references/describe-pr.example.json`). The default title is
`feat[#<ticket>]: <summary>`; an explicit project convention can select `titleFormat: "conventional"`.
Screenshots and review considerations are included only when useful; missing screenshots do not trigger routine questions.

**Behavior rules:** it never invents reasons, test results or rollback steps; it never derives business
rationale from the diff alone; it preserves qualifiers such as estimated/expected/target rather than presenting
them as measured results; it never opens files flagged as sensitive; PR publication occurs only when the current
workflow/user authorization explicitly covers it (otherwise it asks); and temporary draft files stay outside the repo.

**Scripts on their own** (useful with any agent, or none):
```
node skills/describe-pr/scripts/context.mjs --out %TEMP%\ctx.json
node skills/describe-pr/scripts/render.mjs --context %TEMP%\ctx.json --draft %TEMP%\draft.json --body-out %TEMP%\body.md
```

### `create-lld`
**Needs:** Node 18+ and git. No other dependencies.

**Install:** copy `skills/create-lld/` into your agent's skills folder, the same way as `describe-pr`.

**Use:**
- **Forward**, before the work:
  > write the LLD for APP-123, "Navbar", from the approved requirements. Save it in the project-approved design location.
- **Technical Design naming:** a project may use this label for its forward LLD. A separate as-built record is optional and only created when explicitly required.

The design artifacts stay feature-level when a project uses parent features plus delivery slices. Functional Design
describes observable behavior; the LLD describes concrete proposed components, methods/contracts, data changes and interactions; implementation planning owns slice
decomposition and concrete verification sequencing.

Project-owned naming/recipient conventions can be supplied as inputs or adapted from
[`templates/project-deliverables.md`](templates/project-deliverables.md); they are not global workflow policy.

### `qa-scenarios`
**Needs:** approved feature behavior: requirements/acceptance criteria and, when available, Functional Design.
Task-context can be used as a navigation map; LLD is consulted only when a technical constraint changes observable
behavior. It does not require an implementation handoff.

**Use:** ask naturally, e.g. *"Draft QA scenarios for this feature from the approved requirements and Functional
Design, and map each scenario to the delivery slice that enables it where useful."* If the agent does not select it,
invoke explicitly: *"Use `qa-scenarios` for this feature."*

It produces concise starting-condition/action/expected-result cases for testers, with meaningful gaps/questions
reported separately to the caller. Source maps, workflow metadata and execution banners are not default handoff content. It does not generate browser automation
unless separately requested.


### `plan-review` and `plan-debate`

Use the shared contract's **Review and ownership** policy to decide when ordinary feedback becomes debate.
The calling workflow supplies the author/reviewer assignments; these skills do not select models or transport.

Both accept a proposed plan directly, including a dedicated temporary planning/debate record or an existing handoff;
no separate implementation-brief artifact is needed. Keep the project's normal scratchpad compact: it may point to
planning work and record resulting decisions/blockers/next action, but it should not become the store for full plans,
evidence excerpts or review transcripts. Preserve source locators and verify consequential claims against originals
when available.

- **`plan-review`:** one-shot, read-only critique. It returns prioritized findings with evidence, assumptions,
  missing decisions, risks, and questions, distinguishing observed contradictions from concerns and unsupported
  assertions. It does not edit the plan or project scratchpad. Ask naturally, e.g. *"Review this plan for contradictions,
  unsupported claims, missing decisions, and risks."* Or invoke it explicitly: *"Use `plan-review` on this
  handoff."*
- **`plan-debate`:** focused evidence-backed author/reviewer exchanges, using participants supplied by the
  calling workflow. Reuse existing findings, record disposition and stop when no material progress is made.
  The skill does not choose role allocation, model or transport, implement code or create publication permission.

Neither skill reviews code or PRs; use `two-axis-review`, `debate-review`, or `babysit-pr` for those workflows.

### `security-audit`
**Use:** request a security audit of a ticket, plan, LLD, handoff, or scoped implementation. It uses approved project
security requirements when supplied; otherwise it identifies missing requirements and uncertainty. Ask naturally,
e.g. *"Audit this change for relevant security risks and evidence gaps."* Or invoke explicitly: *"Use
`security-audit` on this plan and the supplied security requirements."*

It returns evidence-linked findings with severity, conditions, impact, uncertainty, validation/fix suggestions,
coverage, and unreviewed areas. It considers only security areas relevant to the change. It is read-only: it does
not edit files, execute payloads, probe live systems, or transmit data; it never repeats secret values. It does not
certify compliance or prove a system secure. Gemini CLI's synthetic smoke test returned a conditional authorization
risk and explicitly identified the missing DAO evidence; it did not validate real vulnerability detection.

### Tech lead's skills (copied in `vendor/amElnagdy/`)
Details, review notes and local changes: each repo's `UPSTREAM.md`.

**Prerequisites**

| Skill | Needs |
|---|---|
| all delegate relays | Node 18+, git, and the implementer CLI installed and signed in (`codex`, `agy`, `opencode`, …) |
| `babysit-pr` | `gh` signed in (`GH_HOST` for GitHub Enterprise), **`jq`**, and bash (Git Bash on Windows) |
| `debate-review` | Node 18+, `gh`, delegate-skills installed, and two lanes: `review-main`, `review-debate` |
| guards | nothing (instructions only) |

**Install:** copy the skill folders you use into `~/.agents/skills/` (user-level, all projects). This is also
where `debate-review` looks for the delegate relays.
- From `delegate-skills/skills/`: `delegate-setup`, plus the relays for the CLIs you have (e.g.
  `codex-delegate`, `agy-delegate`, `opencode-delegate`).
- From `review-skills/skills/`: `babysit-pr`, and `debate-review` if you want it.
- From `guard-skills/skills/`: `clean-code-guard`, `test-guard`, `docs-guard`.

Gemini CLI: `/skills reload` afterwards.

`gemini-delegate` is currently a local, unpublished contribution in a separate upstream clone. Its complete
worktree delta is preserved as a base-pinned patch in [`overlays/gemini-delegate/`](overlays/gemini-delegate/);
it is not part of the vendored snapshot or this install list. Its live relay trial passed once in a disposable
repo; see `docs/roadmap.md` before treating it as a generally available relay.

**Use**
1. **Set up lanes once per machine:** *"set up my delegation lanes"* → `delegate-setup` finds the installed
   CLIs, proposes a lane map (e.g. `feature` → codex, `tests` → opencode + some model) and writes it only after
   your yes. **Choose "global" scope:** "project" scope creates `<repo>/.delegate/config.json`, a new file in
   the repository.
2. **Delegate a task:** *"delegate this to codex: <task>"* (or agy, opencode…). Your agent writes a
   self-contained brief and the relay runs the CLI. This relay does not create Git commits; publication and
   commit authorization follow the active project's rules. Add "read-only" for reviews or diagnosis without edits.
   For shared outcome verification and independent review requirements, see the workflow contract; our routing policy lives in the optional profile.
3. **Guards after implementing:** *"run clean-code-guard on this change"* (also `test-guard` for tests,
   `docs-guard` for docs).
4. **Review loop on a PR:** *"babysit PR 123"*. It verifies each bot or Copilot finding, fixes blockers
   locally, then shows you the commits and replies. **It pushes and posts only after your yes** (local change).
5. **Optional two-model review:** *"debate-review PR 123 --dry-run"* prints the review instead of posting it;
   drop `--dry-run` to post. `--local` reviews your working tree before any PR exists.

### Pocock's skills
`grill-me`, `grilling`, `grill-with-docs`, `domain-modeling` and `handoff` are pinned in
[`manifest.md`](manifest.md). His `code-review` is copied in `vendor/mattpocock/skills/` and renamed
`two-axis-review` (it clashed with Claude Code's built-in `code-review`). How to use each one: `GUIDE.md`.
