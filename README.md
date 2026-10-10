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
| `templates/` | Per-project starters and personal instruction profiles. Built: `pre-commit-hook/` (warns about new files; install in its README), `hdc-session-closeout-profile/` (tracked HDC-specific closeout profile; not installed automatically), and `global-user-instructions/AGENTS.md` (canonical personal collaboration rules). Keep identical copies at `~/.config/opencode/AGENTS.md`, `~/.claude/CLAUDE.md` and `~/.gemini/GEMINI.md`; update them explicitly together, verify hashes and confirm loading in each host. These files do not configure arbitrary other apps or guarantee model compliance. To come: general project `AGENTS.md` starter |
| `docs/decisions.md` | Why each skill was kept or dropped |
| `docs/roadmap.md` | **Status, next steps, open decisions: start here** |
| `AGENTS.md` / `CLAUDE.md` | Instructions for AI agents working on this repo. `CLAUDE.md` only imports `AGENTS.md`. For Gemini CLI, point its context file setting at `AGENTS.md` (check the setting name in the current Gemini CLI docs) |

## Installing on a new machine
See [`GUIDE.md`](GUIDE.md): a tested PowerShell block that copies every skill (mine, the copied ones, and the
pinned Pocock ones at their commit) into `~/.claude/skills` and `~/.agents/skills`, plus how to use each skill.
`install.ps1` will later turn that block into one command.

## The workflow

The active model is the **orchestrator by default**. It coordinates work rather than owning every specialist
artifact itself: understand the objective, choose the smallest sufficient workflow, resolve required roles to
configured delegation lanes, track progress and exceptions, and move the authorized work forward.

Delegation is role-based. Skills and workflow descriptions refer to roles such as planner, implementer,
reviewer or tester; the lane configuration decides which CLI, provider, model and supported effort currently
fills that role. Changing the model behind a lane must not require rewriting the workflow or skill.

A request authorizes the normal internal progression needed to achieve its stated outcome and scope unless the
owner gives an explicit checkpoint. Do not stop merely because one routine stage completed. Stop when the
requested outcome is complete, at an owner-requested checkpoint, or when a genuine exception requires a
decision or new authorization.

The workflow is composed from reusable stages rather than one mandatory pipeline. Choose the **smallest
sufficient workflow** for the task and adapt it when investigation changes the apparent complexity.

Examples:

- **Small bug:** reproduce/diagnose → implement → focused test → verify.
- **Bounded enhancement:** clarify intent as needed → lightweight plan → implement → review/test → verify.
- **Large feature or ticket:** requirements/grilling → task-context synthesis when the evidence is fragmented or
  several downstream roles need the same understanding → Functional Design/LLD where required → plan →
  plan review/debate where justified → implementation slices → guards/review → build/tests → routine fixes and
  re-verification → required documentation/closeout.

Stages that add no value for the current task may be skipped. A task that grows in risk or scope may escalate
to a stronger workflow; a task that proves simpler may shrink. Completion is defined by the requested outcome
and appropriate verification, not by traversing every available stage.

A delegated role owns its assigned artifact or bounded change. The orchestrator does not recreate a planner's
plan or an implementer's code as a verification technique; use independent review, guards and deterministic
checks for that purpose. Give workers the minimum useful context and canonical source access their role needs.
Use frozen snapshots or isolated worktrees only when an actual access or concurrency boundary requires them.

Routine lanes are selected automatically from configuration. The owner may always override the inferred route,
participants, workflow boundary or checkpoint. The URL map (`tools/url-map`) can run underneath as the code map.
The LLD skill remains available in forward mode before implementation or retro mode for documenting completed
work.

## Skills
Each skill gets an entry here once it exists: what it does, when to call it, its inputs and outputs, and an
example call.

### My skills
| Skill | Status | Use |
|---|---|---|
| `task-context` | **Added 2026-10-10; structural review only, native testing pending.** | Fragmented Jira/requirements/grilling/UX/project evidence → one rich temporary working synthesis for downstream design, planning, implementation, tests, review and PR work. Adaptive, not mandatory; not a project-of-record document. |
| `create-lld` | **Updated 2026-10-10:** concise Jira-only LLD, customer-facing Functional Design, and separate as-built Technical Design after implementation; can consume task context without making the deliverables verbose. | Forward: task context/approved requirements → concise LLD before plan/implementation, plus Functional Design when required. After implementation → concise as-built Technical Design for Architect review. |
| `scenario-test-cases` | **Installed in both user-level skill roots 2026-10-01; native agent testing pending.** | Approved requirements + approved LLD, with a matching implementation-task handoff when available → traceable browser test scenarios in numbered Given/When/Then style. Gaps and conflicts are questions, never invented expected behavior. Produces scenarios, not automation code |
| `plan-review` | **Smoke-tested 2026-10-01** in the OpenCode session and Gemini CLI 0.62.0 (Auto), using a synthetic plan | One-shot, read-only critique of a plan, working session scratchpad, or handoff → prioritized, evidence-linked findings, assumptions, risks, and questions; does not edit the input |
| `plan-debate` | **Smoke-tested 2026-10-01** in the OpenCode session with a Gemini CLI 0.62.0 (Auto) evidence challenge, using a synthetic plan | Structured pre-implementation challenge/response → review exchanges, author responses, owner decisions, and unresolved items retained in one working scratchpad; does not apply the plan to project documents |
| `security-audit` | **Smoke-tested 2026-10-01** in Gemini CLI 0.62.0 on a synthetic endpoint excerpt; installed in the user-level `.agents/skills` and `.claude/skills` folders. Broader native testing pending. | Read-only, evidence-citing security review of a scoped change → severity-ranked findings, requirement/evidence gaps, coverage and limits; not certification or penetration testing |
| `session-closeout` | **Updated 2026-09-30; profile-aware behavior not yet tested natively.** Citation checker tested on crafted cases and HDC docs | End of a session → reuse a designated scratchpad or create one, capture verified/unverified work and decisions, queue relevant write-backs, and re-check citations; **stale ones block**. Applies nothing without a yes. The tracked HDC profile is reconciled with the approved closeout guidance in `HDC-documents/README.md` and the setup note in its automation handoff |
| `describe-pr` | **Evidence contract updated 2026-10-10; new task-context behavior not yet natively tested.** Earlier scripts/full-flow evidence remains from 2026-09-25/26. | Git/implementation → What changed; task context/approved requirements → Why; verified execution/user report → Testing. Asks only for missing evidence and preserves estimate/target qualifiers. |

### `task-context`
Use it when the task understanding is scattered across several inputs or will be reused by several downstream
roles. Ask naturally, e.g. *"synthesize the task context from this ticket, requirements, grilling decisions and
screenshots."* If the task is already simple and clear, skip it.

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
them as measured results; it never opens files flagged as sensitive; it never pushes, creates or edits a PR
without your explicit yes; and it writes nothing inside the repo.

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
  > write the LLD for CADE-1234, "Navbar", from the approved requirements. Release R4, Sprint 1. Save it in my docs folder.
- **Technical Design**, after implementing the approved plan:
  > write the as-built Technical Design for CADE-1234 from the approved LLD/plan and implemented change; prepare it for Architect review.

The LLD is drafted before the plan/implementation. When a task-context synthesis exists, `create-lld` uses it as
a navigation map while keeping authoritative requirements available for verification; the design deliverables
remain deliberately concise. A Functional Design is prepared when the project workflow requires it or you ask; it
is customer-facing and does not duplicate Purpose/Scope already in the requirements document. After implementation of the approved plan, ask for an as-built Technical Design for Architect review.
The skill inspects supporting materials and code internally, but deliverables use the Jira ID only and do not
cite attachment names or source-code files/lines. The LLD checker runs before presentation; drafts remain
unapproved until you approve them.

**What it guarantees:**
- The LLD contains the essential component/API boundaries, without file paths or line citations.
- Functional Design describes observable customer behavior, not technical implementation.
- Technical Design documents the implemented result, and reports only verified checks.
- Supporting artifacts and source code are used as internal evidence, not cited in the deliverables.
- No invented requirements, decisions, measurements, deviations or test results; unresolved items remain explicit.
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
- **`plan-debate`:** structured multi-role challenge/response around a proposed plan. The orchestrator coordinates
  the exchange and is the sole writer of the shared coordination scratchpad; that does **not** make it the plan
  author. The workflow selects a plan-author role and the required challenge/independent-review roles from
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
