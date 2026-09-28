# AI-skills

My personal, model-agnostic setup for AI-assisted development: the skills I wrote, the pinned third-party
skills I use, and how to install and use each one on a new machine. It works with any coding agent that reads
`SKILL.md` skills (Claude Code, Codex, Gemini CLI / Antigravity, OpenCode, …).

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
| `templates/` | Per-project starters. Built: `pre-commit-hook/` (warns about new files; install in its README). To come: `AGENTS.md` starter |
| `docs/decisions.md` | Why each skill was kept or dropped |
| `docs/roadmap.md` | **Status, next steps, open decisions: start here** |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI agents working on this repo. `CLAUDE.md` only imports `AGENTS.md`. For Gemini CLI, point its context file setting at `AGENTS.md` (check the setting name in the current Gemini CLI docs) |

## Installing on a new machine
See [`GUIDE.md`](GUIDE.md): a tested PowerShell block that copies every skill (mine, the copied ones, and the
pinned Pocock ones at their commit) into `~/.claude/skills` and `~/.agents/skills`, plus how to use each skill.
`install.ps1` will later turn that block into one command.

## The workflow
Two tracks that share the same tail:

- **Small ticket:** grill-me → implement → guards → review → PR.
- **Big ticket:** grill-with-docs → LLD → plan → slices → the same tail.

The tail: Delegate (any model, always with an explicit model + effort) → guards + linters + git pre-commit hook
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
| `create-lld` | **v1 written 2026-09-25.** Scripts tested; retro mode tested in Claude on a real branch; forward mode not yet run on real customer slides | Forward: pasted internal ticket (ID, title, description) + customer slides + code → one LLD section written for architect review. Retro: finished diff + ticket → LLD, with reasons and alternatives marked `[NEEDS INPUT]` |
| `session-closeout` | **v1 written 2026-09-26.** Citation checker tested on crafted cases and on the real HDC Plan | End of a session → dated scratchpad in the docs folder (verified vs unverified, decisions with who decided, deferred, open questions, repo changes) + queued write-backs; every `file:line` citation re-checked by script, **stale ones block**. Applies nothing without a yes |
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

The agent drafts the LLD, runs the checker, and asks at most 5 questions in one message: the decisions to
confirm and the most important `[NEEDS INPUT]` gaps. The status stays `Draft` until you approve it.

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
