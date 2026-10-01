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
| `delegates/` | Delegate lane configs: which CLI and model does which job |
| `tools/` | Standalone scripts that aren't skills. `json-compare/`: diff two recorded API responses (used by HDC's B9). `url-map/`: URL → handler → caller map for Java web apps, with gaps (replaces Graphify) |
| `templates/` | Per-project starters. Built: `pre-commit-hook/` (warns about new files; install in its README) and `hdc-session-closeout-profile/` (tracked HDC-specific closeout profile; not installed automatically). To come: general `AGENTS.md` starter |
| `docs/decisions.md` | Why each skill was kept or dropped |
| `docs/roadmap.md` | **Status, next steps, open decisions: start here** |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI agents working on this repo. `CLAUDE.md` only imports `AGENTS.md`. For Gemini CLI, point its context file setting at `AGENTS.md` (check the setting name in the current Gemini CLI docs) |

## Installing on a new machine
See [`GUIDE.md`](GUIDE.md): a tested PowerShell block that copies every skill (mine, the copied ones, and the
pinned Pocock ones at their commit) into `~/.claude/skills` and `~/.agents/skills`, plus how to use each skill.
`install.ps1` will later turn that block into one command.

## The workflow
The manually selected, active model is the **orchestrator by default**: it takes the owner's orders, discusses
tradeoffs, pushes back with reasons when warranted, and does intake, grilling, and planning itself. It delegates
only when the owner explicitly orders delegation. Never call Claude Opus or Sonnet unless the owner explicitly
names one for that specific task; availability is not permission. A request to debate or review does not itself
authorize those model calls.

Two tracks that share the same tail:

- **Small ticket:** grill-me → implement → guards → review → PR.
- **Big ticket:** grill-with-docs → LLD → plan → slices → the same tail.

The tail: when directed, delegate a bounded slice (name model + effort where supported; Gemini Auto is owner-approved) → guards + linters + git pre-commit hook
→ `two-axis-review` → describe PR → babysit PR, and `session-closeout` to end the session (plus `handoff`
when the next session has one specific task). The URL map
(`tools/url-map`) runs underneath as the code map. The LLD skill can be called on any ticket, in forward mode (before
the work) or retro mode (documenting finished work).

## Skills
Each skill gets an entry here once it exists: what it does, when to call it, its inputs and outputs, and an
example call.

### My skills
| Skill | Status | Use |
|---|---|---|
| `create-lld` | **Updated 2026-10-01:** when slides are supplied, drafts a companion Functional Design beside the LLD. Existing scripts tested; the new paired output has not yet been tested on a real ticket | Forward: pasted ticket + slides + code → a Functional Design of expected behavior plus an LLD of technical design. Retro: finished diff + ticket → LLD; with slides, also documents functional behavior and flags differences from implementation. Unknowns remain `[NEEDS INPUT]` |
| `scenario-test-cases` | **Installed in both user-level skill roots 2026-10-01; native agent testing pending.** | Approved requirements + approved LLD, with a matching implementation-task handoff when available → traceable browser test scenarios in numbered Given/When/Then style. Gaps and conflicts are questions, never invented expected behavior. Produces scenarios, not automation code |
| `plan-review` | **Smoke-tested 2026-10-01** in the OpenCode session and Gemini CLI 0.62.0 (Auto), using a synthetic plan | One-shot, read-only critique of a plan, working session scratchpad, or handoff → prioritized, evidence-linked findings, assumptions, risks, and questions; does not edit the input |
| `plan-debate` | **Smoke-tested 2026-10-01** in the OpenCode session with a Gemini CLI 0.62.0 (Auto) evidence challenge, using a synthetic plan | Structured pre-implementation challenge/response → review exchanges, author responses, owner decisions, and unresolved items retained in one working scratchpad; does not apply the plan to project documents |
| `security-audit` | **Smoke-tested 2026-10-01** in Gemini CLI 0.62.0 on a synthetic endpoint excerpt; installed in the user-level `.agents/skills` and `.claude/skills` folders. Broader native testing pending. | Read-only, evidence-citing security review of a scoped change → severity-ranked findings, requirement/evidence gaps, coverage and limits; not certification or penetration testing |
| `session-closeout` | **Updated 2026-09-30; profile-aware behavior not yet tested natively.** Citation checker tested on crafted cases and HDC docs | End of a session → reuse a designated scratchpad or create one, capture verified/unverified work and decisions, queue relevant write-backs, and re-check citations; **stale ones block**. Applies nothing without a yes. The tracked HDC profile is reconciled with the approved closeout guidance in `HDC-documents/README.md` and the setup note in its automation handoff |
| `describe-pr` | **v1 written 2026-09-25.** Scripts tested on two real repos; full skill tested in Claude, and natively in Codex on 2026-09-26 (picked without being named) | Git context (built by a script) + pasted ticket + optional LLD section → PR title and body. Asks at most 4 questions in one message; creates the PR only after approval |

### `describe-pr`
**Needs:** Node 18+ and git. Optional: `gh` (to create or update the PR; set `GH_HOST` for GitHub Enterprise).

**Install:** copy `skills/describe-pr/` into your agent's skills folder: `.agents/skills/` in a repo (read by
Gemini CLI, Claude Code, Codex and others), or your agent's user-level skills folder to have it everywhere.
Gemini CLI: run `/skills reload` afterwards.

**Use:** on your branch, ask *"write the PR description"*. It works best with the ticket pasted and one line on
why and how you tested:
> write the PR description. Ticket 38939409 "Navbar": add the shared header with profile menu. Tested: ng build,
> 108/108 specs, header checked in the browser.

If the agent doesn't pick the skill up by itself, name it: *"use the describe-pr skill"* (Gemini:
`activate_skill` with `describe-pr`). Add a `.describe-pr.json` at the repo root to set scopes, base branches
or your own templates (example in `references/describe-pr.example.json`).

**What it guarantees:** it never invents reasons, test results or rollback steps (they show as
`[NEEDS INPUT]`); it never opens files flagged as sensitive; it never pushes, creates or edits a PR without
your explicit yes; and it writes nothing inside the repo.

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
  > write the LLD for CADE-1234, internal ticket 38939409 "Navbar": <paste the description>. Slides attached:
  > C:\path\customer.pptx. Release R2.23, designer Mohamed. Save it in my docs folder.
- **Retro**, for finished work:
  > write a retro LLD for this branch. CADE-1234, internal ticket 38939409 "Navbar".

When slides are supplied, the agent drafts both a Functional Design (expected behavior) and an LLD
(technical design); without slides it drafts only the LLD unless you ask otherwise. It runs the LLD checker
and asks at most 5 questions in one message: the decisions to confirm and the most important `[NEEDS INPUT]`
gaps. Both statuses stay `Draft` until you approve them.

**What it guarantees:**
- Every design statement names what it touches.
- Every decision has a real alternative and a reason.
- No invented numbers, reasons or test results; they show as `[NEEDS INPUT]`.
- No "N/A".
- Nothing written inside a code repository unless you say so.

**Paste into Google Docs:** enable markdown in the Docs preferences, then paste; otherwise paste as plain text.

**Scripts on their own:**
```
node skills/create-lld/scripts/slides.mjs customer.pptx --media-dir %TEMP%\slides
 node skills/create-lld/scripts/check-lld.mjs LLD_CADE-1234_navbar.md --size normal
```

### `scenario-test-cases`
**Needs:** approved requirements / acceptance criteria and the approved LLD. If either source is missing, the skill
asks for it rather than deriving expected behavior from the implementation. A matching implementation-task
handoff is used when available for scope and execution context; it does not override approved expected behavior.
No scripts or agent-specific tools.

**Use:** for automatic selection, ask naturally, e.g. *"Draft browser test scenarios from these approved
requirements and the LLD. Check for the implementation-task handoff too."* If the agent does not select it, invoke
explicitly: *"Use `scenario-test-cases` for this feature."*
The skill follows numbered `Scenario N` headings with Given / When / Then / And, and cites source references.
It returns Markdown in chat unless you request a file. Conflicts and missing expected behavior are called out
under `Clarifications needed`, not filled with guesses. It creates test cases, not Playwright/Cypress/Selenium
code; `test-guard` remains the review skill for automated test code.

### `plan-review` and `plan-debate`
Both accept a proposed plan directly, including as a working session scratchpad or existing handoff; no separate
implementation-brief artifact is needed. A scratchpad can hold task notes, necessary source references/excerpts,
grill answers, findings, the draft, review exchanges, decisions, and unresolved questions. Preserve source
locators and verify consequential claims against originals when available. Reuse a project's designated
scratchpad only if its profile permits; otherwise use a separate temporary working file. It is a working draft,
not a project document of record or a replacement for `handoff` or `session-closeout`.

- **`plan-review`:** one-shot, read-only critique. It returns prioritized findings with evidence, assumptions,
  missing decisions, risks, and questions, distinguishing observed contradictions from concerns and unsupported
  assertions. It does not edit the plan or scratchpad. Ask naturally, e.g. *"Review this plan for contradictions,
  unsupported claims, missing decisions, and risks."* Or invoke it explicitly: *"Use `plan-review` on this
  handoff."*
- **`plan-debate`:** the orchestrator alone writes the shared scratchpad. Owner-authorized delegates may read it
  read-only when the host can enforce that; otherwise they receive an immutable snapshot. They return separate
  Markdown findings or an authorized `minipad.md`; the orchestrator attributes and merges results. Delegates never
  edit the shared scratchpad.
  The owner chooses any delegated author/reviewers; the active orchestrator drafts by default. Dispatch only
  reviewers explicitly authorized for this task, and disclose unavailable reviewers without substitution. In
  particular, do not call Opus or Sonnet unless the owner names one for this specific task. Ask naturally, e.g.
  *"Have Gemini and Opus independently review this plan; return separate findings and don't give them scratchpad
  access."* It stops before applying anything to project documents. A clean debate is not proof of safety.

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

`gemini-delegate` is currently a local, unpublished contribution branch in the separate upstream clone, not
part of the vendored snapshot or this install list. Its live relay trial passed once in a disposable repo;
see `docs/roadmap.md` before treating it as a generally available relay.

**Use**
1. **Set up lanes once per machine:** *"set up my delegation lanes"* → `delegate-setup` finds the installed
   CLIs, proposes a lane map (e.g. `feature` → codex, `tests` → opencode + some model) and writes it only after
   your yes. **Choose "global" scope:** "project" scope creates `<repo>/.delegate/config.json`, a new file in
   the repository.
2. **Delegate a task:** *"delegate this to codex: <task>"* (or agy, opencode…). Your agent writes a
   self-contained brief, the relay runs the CLI, and your agent reviews the diff and re-runs the gates. **The
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
