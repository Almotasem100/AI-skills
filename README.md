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
    keep my additions, then record the new base commit. Once this folder is a git repo, `git subtree` does this
    merge for me.
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
   `disable-model-invocation`, …). The description says *when* to use the skill, since that is what triggers it
   automatically.
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
| `delegates/` | Delegate lane configs: which CLI and model does which job |
| `tools/` | Standalone scripts that aren't skills. `json-compare/`: diff two recorded API responses (used by HDC's B9). `url-map/`: URL → handler → caller map for Java web apps, with gaps (replaces Graphify) |
| `templates/` | Per-project starters and personal instruction profiles. Built: `pre-commit-hook/` (warns about new files; install in its README), `global-user-instructions/AGENTS.md` (canonical personal collaboration rules). Keep identical copies at `~/.config/opencode/AGENTS.md`, `~/.claude/CLAUDE.md` and `~/.gemini/GEMINI.md`; update them explicitly together, verify hashes and confirm loading in each host. These files do not configure arbitrary other apps or guarantee model compliance. To come: general project `AGENTS.md` starter |
| `docs/decisions.md` | Why each skill was kept or dropped |
| `docs/roadmap.md` | **Status, next steps, open decisions: start here** |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI agents working on this repo. `CLAUDE.md` only imports `AGENTS.md`. For Gemini CLI, point its context file setting at `AGENTS.md` (check the setting name in the current Gemini CLI docs) |

## Installing on a new machine
See [`GUIDE.md`](GUIDE.md): a tested PowerShell block that copies every skill (mine, the copied ones, and the
pinned Pocock ones at their commit) into `~/.claude/skills` and `~/.agents/skills`, plus how to use each skill.
`install.ps1` will later turn that block into one command.

## The workflow

The active model is the **orchestrator by default**. It coordinates the requested outcome, chooses the smallest
sufficient workflow, resolves semantic roles through configured lanes, tracks state and exceptions, and stops only
at completion, an explicit checkpoint, or a genuine material gate.

The durable semantics live in [`docs/orchestration-contract.md`](docs/orchestration-contract.md). Highlights:

- workflows are adaptive; simple bugs remain simple;
- projects may map a parent **Feature** to one or more **Delivery Slices**;
- stage commands such as `plan`, `implement`, `review`, `continue` and `finish` have predictable bounded
  meanings;
- models are interchangeable resources beneath semantic roles; provider/model/effort are configuration, not normal
  user syntax;
- deterministic guards/build/tests/regression are workflow actions rather than separate agents;
- `task-context` is rich temporary understanding, the scratchpad is compact execution state, handoff is exceptional,
  and `work-closeout` is about completed work rather than ending a chat;
- evidence carries provenance/revision where consequential, while reviewers verify claims independently;
- repeated failures trigger diagnosis changes or escalation rather than infinite retries;
- fixed context-utilization thresholds do not trigger compaction.

Plans should be implementation-ready without freezing routine technical judgment. Material planning gaps return to targeted clarification; reviewers' findings go to the plan author for reasoned disposition. Resolve the active configured lane and host before dispatch rather than guessing.

A delegated role owns its assigned artifact or bounded mutation. The orchestrator does not duplicate specialist work
as verification; use independent review and deterministic checks. Give each role the minimum useful context and
canonical source access required for its responsibility.

Routine workflow progression inside an authorized scope does not need per-stage approval. The owner may always
override routing, participants, checkpoints or boundaries. Persistent/outward effects remain subject to the active
project's authorization policy.

### Generic project hierarchy

When a project has a parent feature and internal delivery tickets:

```text
Feature
  -> feature context / Functional Design / LLD / implementation plan / QA scenarios
  -> Delivery Slice 1 -> branch / implementation / verification / review / PR
  -> Delivery Slice 2 -> branch / implementation / verification / review / PR
  -> ...
  -> feature acceptance / work-closeout
```

The generic repo never hardcodes a tracker. A project may map Feature to Jira, Delivery Slice to CodeBeamer, or use
different systems entirely.

### Delegation lane catalog

[Delegation lane roles and workflow routing](docs/delegation-lanes.md) records the stable semantic meaning of the current seven lanes and the proposed feature-design addition, without pinning providers, models or effort variants. These descriptions do **not** install or modify workstation lane configuration; local routing must be synchronized and smoke-tested separately. The eventual goal remains a secret-free, reproducible lane profile and bootstrap path for a fresh clone.

## Skills
Each skill gets an entry here once it exists: what it does, when to call it, its inputs and outputs, and an
example call.

### My skills
| Skill | Status | Use |
|---|---|---|
| `task-context` | **Added 2026-10-10; bounded Gemini CLI 0.62.0 native smoke passed 2026-10-11.** | Fragmented feature/task requirements, decisions, UX/project evidence and constraints → one rich temporary working synthesis for downstream design, planning, implementation, tests, review and PR work. Adaptive, not mandatory; not a project-of-record document. |
| `create-lld` | **Refined 2026-10-11; native re-test pending after reinstall.** Earlier bounded smokes proved discovery and showed Gemini/OpenCode adherence differences, but they predate the adaptive template/checker changes on this branch. | Forward: task context/approved requirements → concise feature-level LLD before plan/implementation, plus Functional Design when required. Technical Design is optional and only produced when the active project/team explicitly requires an as-built design artifact. |
| `qa-scenarios` | **Renamed/refined 2026-10-11; native verification pending after reinstall.** | Feature-level QA behavior specification from approved requirements/Functional Design, with optional mapping to delivery slices. Produces observable scenarios for tester preparation; it does not run tests or require an implementation handoff. |
| `plan-review` | **Refined 2026-10-11; native re-test pending.** The predecessor version passed a bounded 2026-10-01 synthetic smoke; the current version separates planning records from the compact project scratchpad. | One-shot, read-only critique of a plan, dedicated planning record, or handoff → prioritized, evidence-linked findings, assumptions, risks, and questions; does not edit the input |
| `plan-debate` | **Refined 2026-10-11; native re-test pending.** The predecessor version passed a bounded 2026-10-01 synthetic exchange; the current version uses a temporary debate record and keeps project scratchpad state compact. | Structured pre-implementation challenge/response in one temporary debate record; the normal project scratchpad remains compact execution state; does not apply the plan to project documents |
| `security-audit` | **Smoke-tested 2026-10-01** in Gemini CLI 0.62.0 on a synthetic endpoint excerpt; installed in the user-level `.agents/skills` and `.claude/skills` folders. Broader native testing pending. | Read-only, evidence-citing security review of a scoped change → severity-ranked findings, requirement/evidence gaps, coverage and limits; not certification or penetration testing |
| `work-closeout` | **Renamed/refined 2026-10-11; native verification pending after reinstall.** Citation checker retained. | Reconcile a genuinely completed feature/bounded work item using the project's working record. Not triggered by ending a chat or by completing one child delivery slice; durable write-backs/cleanup follow project policy. |
| `describe-pr` | **Evidence flow smoke-tested on a corrected synthetic fixture 2026-10-11.** A causal-inference rule was added after Gemini linked separately stated facts; one retry still produced the unsupported link. | Git/implementation → What changed; task context/approved requirements → Why; verified execution/user report → Testing. Asks only for missing evidence and preserves estimate/target qualifiers. |

### `task-context`
**Install:** copy `skills/task-context/` into the same skills folder as the other first-party skills.

Use it when the task understanding is scattered across several inputs or will be reused by several downstream
roles. For automatic selection, ask naturally, e.g. *"synthesize the task context from this ticket, requirements,
grilling decisions and screenshots."* If the agent does not select it, invoke it explicitly: *"Use
`task-context` for this task."* If the task is already simple and clear, skip it.

The result is a temporary working artifact: objective, business rationale, approved behavior, business/UX/technical
constraints, acceptance expectations, decisions, non-goals, estimates/targets, assumptions, open questions and a
compact source map. Facts, decisions, estimates and assumptions stay explicitly distinct. It summarizes evidence
rather than copying whole PDFs or chats, and it is not promoted into permanent project documentation by default.

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
or your own templates (example in `references/describe-pr.example.json`).

**What it guarantees:** it never invents reasons, test results or rollback steps; it never derives business
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
- **Technical Design (optional):** only when the active project/team explicitly requires a separate as-built design artifact. It is not part of the default lifecycle.

The design artifacts stay feature-level when a project uses parent features plus delivery slices. Functional Design
describes observable behavior; the LLD describes intended technical boundaries; implementation planning owns slice
decomposition and concrete verification sequencing.

### `qa-scenarios`
**Needs:** approved feature behavior: requirements/acceptance criteria and, when available, Functional Design.
Task-context can be used as a navigation map; LLD is consulted only when a technical constraint changes observable
behavior. It does not require an implementation handoff.

**Use:** ask naturally, e.g. *"Draft QA scenarios for this feature from the approved requirements and Functional
Design, and map each scenario to the delivery slice that enables it where useful."* If the agent does not select it,
invoke explicitly: *"Use `qa-scenarios` for this feature."*

It produces observable Given/When/Then-style behavior for tester preparation, keeps unresolved behavior under
`Clarifications needed`, and never claims the scenarios were executed. It does not generate browser automation
unless separately requested.


### `plan-review` and `plan-debate`
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
- **`plan-debate`:** structured multi-role challenge/response around a proposed plan. The orchestrator coordinates
  the exchange in one temporary debate record; the normal project scratchpad stays compact. Coordination ownership
  does **not** make the orchestrator the plan author. The workflow selects a plan-author role and the required challenge/independent-review roles from
  configured lanes unless the owner explicitly chooses participants. Reviewers return attributed findings and
  the plan author responds to them; the orchestrator routes the rounds, records state and escalates only material
  unresolved decisions. Give each participant only the context and source access needed for its role. Use an
  immutable scratchpad/plan snapshot when an enforced read-only boundary is required and unavailable on the live
  record. The skill itself stops before implementation, but a clean debate does not create a new approval gate:
  an already-authorized parent workflow may continue unless the owner requested a checkpoint or a genuine blocker
  remains. A clean debate is not proof of safety.

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
   self-contained brief, the relay runs the CLI, and the orchestrator verifies the delivered outcome and applicable deterministic checks; independent technical review remains a separate role when warranted. **The
   relay never commits; you do.** Add "read-only" for reviews or diagnosis without edits.
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
