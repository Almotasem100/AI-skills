# AI-skills

My personal, model-agnostic setup for AI-assisted development: the workflow contract my agents follow, the skills I
wrote, the third-party skills I use, and how to install them. Everything is plain Markdown `SKILL.md` skills,
`AGENTS.md` instructions and dependency-free Node scripts, so it works with any agent that supports skills
(Claude Code, Codex, Gemini CLI / Antigravity, OpenCode, …).

- **Install and use:** [GUIDE.md](GUIDE.md)
- **Current status and next steps:** [docs/roadmap.md](docs/roadmap.md)
- **Working on this repo with an agent:** [AGENTS.md](AGENTS.md)

## Layout

| Path | What it holds |
| --- | --- |
| `instructions/` | **What agents load.** Installed to `~/.config/ai-skills/` and host instruction files (see GUIDE §3) |
| `instructions/global-instructions.md` | Personal collaboration rules, copied to each host's global instruction file |
| `instructions/orchestration-contract.md` | Shared workflow contract: outcomes, review, verification, authority |
| `instructions/ai-skills-delegation.md` | Optional **AI Skills delegation mode** profile; active only when explicitly selected |
| `instructions/delegation-lanes.md`, `cli-dispatch.md` | Companions of the profile: responsibility catalog and CLI dispatch reference |
| `skills/` | My own skills, one folder each (`SKILL.md` plus optional `references/`, `templates/`, `scripts/`) |
| `vendor/<owner>/<repo>/` | Copied third-party skills I may modify; each has `UPSTREAM.md` and, if changed, `local-changes.patch` |
| `overlays/gemini-delegate/` | Unpublished Gemini relay contribution, kept as a base-pinned patch on the vendored delegate skills |
| [`manifest.md`](manifest.md) | Third-party sources: pinned commits, status, what is installed |
| `tools/` | Scripts, not skills: `refresh` (update this machine's installed copies; see GUIDE §6), `json-compare` (diff two API responses), `url-map` (URL → handler → caller map for Java web apps) |
| `templates/` | Per-project starters: pre-commit hook, linter config, project deliverable naming |
| `test/` | Offline tests (`node --test`) and the [native-smoke pack](test/native-smoke/README.md) for installed-host checks |
| `docs/` | [Roadmap](docs/roadmap.md), [friction log](docs/friction-log.md), and [records](docs/records/README.md) (history, not policy) |

## How the workflow fits together

1. Each host's global instructions ([global-instructions.md](instructions/global-instructions.md)) tell the agent to
   read the [workflow contract](instructions/orchestration-contract.md) for development work.
2. The contract defines **Full Feature** and **Change/Bug** work: intake, design, early QA scenarios, plan review,
   implementation, independent code review and PR preparation, plus the rules for evidence, review and authorization.
3. Skills perform individual outcomes (design, QA scenarios, plan review, PR description, …). Projects own tracker
   mappings, architecture, environments and approval gates in their own `AGENTS.md`.
4. Optionally, the user says **"Use AI Skills delegation mode"**. The [profile](instructions/ai-skills-delegation.md)
   assigns participants to roles; its **Ownership and activation** section is the participant-allocation authority.
   External work runs through configured CLI relays (`*-delegate` skills).

Feature-level work (requirements, design, QA) sits at the parent **Feature**. Branches, diffs and PRs sit at
**Delivery Slices**. The repo never hardcodes a tracker.

## Skills

| Skill | Use it for | Source |
| --- | --- | --- |
| `task-context` | One intake record of scattered inputs: sources, approved scope, Q&A, decisions, open questions | Mine |
| `create-lld` | Forward LLD / Technical Design and customer-facing Functional Design | Mine |
| `qa-scenarios` | Tester-facing observable scenarios, before implementation planning | Mine |
| `plan-review` | Read-only critique of a plan or technical design | Mine |
| `plan-debate` | Author/reviewer resolution of a disputed technical finding | Mine |
| `document-drift-review` | Report-only check of docs against source | Mine |
| `security-audit` | Read-only, evidence-citing security review of a change | Mine |
| `work-closeout` | Explicit reconciliation of completed work into durable records | Mine |
| `describe-pr` | PR title and description from the diff, approved rationale and real test evidence | Mine |
| `clean-code-guard`, `test-guard`, `docs-guard` | Second-pass review of code, tests, docs | Tech lead (vendor) |
| `babysit-pr` | Work through bot/Copilot review comments; asks before pushing or posting | Tech lead (vendor, changed) |
| `delegate-setup` + `*-delegate`, `debate-review` | Delegate to another CLI; two-model PR review (optional delegation stack) | Tech lead (vendor) |
| `two-axis-review` | Review a diff against coding standards and against the spec | Pocock (vendor, renamed) |
| `grill-me`, `grill-with-docs`, `grilling`, `domain-modeling`, `handoff` | Clarification interviews, glossary/ADRs, transfer briefs | Pocock (pinned) |

How to call each one, with examples: [GUIDE.md §4](GUIDE.md#4-use-them).

## Rules for this repo

- **Three kinds of third-party handling:**
  - `skills/` are mine.
  - `vendor/` copies may be modified. Mark every change `LOCAL CHANGE`, describe it in `UPSTREAM.md` and save the
    diff as `local-changes.patch`. To update, diff upstream from the recorded base, merge, keep my changes, and
    record the new base.
  - [`manifest.md`](manifest.md) pins skills I use unchanged. Never edit them in place; copy into `vendor/` first.
- **Nothing vendor-specific as a foundation.** Use `SKILL.md`, `AGENTS.md`, MCP servers, plain scripts and git hooks.
  No Claude-only hooks, subagents or model pinning.
- **Read before installing.** Read a third-party repo's scripts before its first install and before every pin bump.

### Authoring rules for my skills

Every skill in `skills/` must drop as-is into a team repo's `skills/` folder and work with any agent that reads `SKILL.md`.

1. Shape: `skills/<kebab-name>/SKILL.md`, longer material in `references/`.
2. Frontmatter: only `name` (equal to the folder name) and `description`. The description says *when* to use the skill.
3. No agent-specific tool names: write "read the diff", not "use the Read tool".
4. No personal or project specifics: templates, repo names, ticket IDs and paths come in as inputs or from the
   project's `AGENTS.md`.
5. Plain commands only: `git`, optionally `gh` (with a plain-git fallback that also works with `GH_HOST`). Helper
   scripts are Node, not PowerShell or bash.
6. No secrets, tokens, internal URLs or customer data, including in examples.
7. State the workflow policy once, in the contract. A skill does its own job and refers to the contract instead of
   restating it.
8. Try a new skill on at least two agents before proposing it to the team repo.

## Tests

```text
npm test
```

(Node 21+; equivalent to `node --test "test/*.test.mjs" "test/native-smoke/*.test.mjs"`. A bare `node --test`
would also pick up the vendored repos' own suites.) This runs the offline suites: skill scripts, the Gemini overlay patch, the native-smoke harness, and repository
invariants (links resolve, frontmatter is valid, every install path exists, the shared instructions stay independent
of the optional profile). These are source checks. Installed-host behavior is checked separately with the
[native-smoke pack](test/native-smoke/README.md).
