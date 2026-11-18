# Upstream: review-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/review-skills |
| Base commit | `533c51506c033db5cd90c86ee7008d340ab7810c` (upstream master dated 2026-11-15) |
| Copied | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local changes | **1** - `babysit-pr` asks before publishing. Diff in `local-changes.patch`. |
| Installed subset | `babysit-pr`, `debate-review` |

## Local change: `babysit-pr` asks before publishing
Upstream tells the agent: "Don't stop to ask about blockers. Verify, fix, push, keep watching, report what
you did", and to reply to and resolve rejected findings immediately. My rule is: fix locally, **ask before
pushing or posting**, never auto-merge.

Changed in `skills/babysit-pr/SKILL.md` (every spot is marked `LOCAL CHANGE`):
- The section "Fix the blockers, autonomously" became "Fix the blockers, then ask before publishing". The
  agent still verifies and fixes on its own, but before pushing it shows in one message the commits and every
  reply it intends to post. **One approval covers the whole round.**
- "Reply with evidence and resolve immediately" and "these can close anytime" now wait for that same approval.

Worth proposing upstream as an option (e.g. an "ask before publish" mode), so the patch disappears.

## Reviewed before copying (2026-09-25)
- No network calls of their own. External traffic only through `gh` (GitHub), `glab` (GitLab), `az` (Azure
  DevOps), which talk to the Git host.
- `debate-review` needs `delegate-skills` installed (it looks in `~/.agents/skills`, `~/.claude/skills`,
  `~/.codex/skills`) and two lanes named `review-main` and `review-debate`. It writes run artifacts to
  `~/.cache/debate-review/`.
- `babysit-pr` needs `gh` (or `glab`), `jq` and bash (Git Bash on Windows) for `scripts/threads.sh`.

## What I use
- `babysit-pr` (core): the Copilot / review-thread loop.
- `debate-review` (optional): big tickets only; two models cost tokens.

## Upstream update — 2026-10-09

Synced upstream `5b748c654bb060ef6bf86d0e7ae123979082a88a..3cfce3963b4d4d99a8b9059f1ece6726405b7bd3`.
The upstream change adds `debate-review --check` so configured reviewer lanes can be started and validated
before a PR needs them. It does not touch `babysit-pr`, so the local ask-before-publish safety change remains intact.

## Upstream update — 2026-11-18

Synced upstream `3cfce396..533c5150` (applied as a diff; `babysit-pr` untouched, local patch re-checked on the new
base). `debate-review` now deletes project agent config (`.claude`, `.codex`, `.opencode`, `opencode.json`,
`.mcp.json`, `.cursor`, `.gemini`, …) from its disposable PR/`--local` checkout after computing the diff, so a PR
cannot run hooks or MCP servers on the reviewer machine. Reviewed `scripts/lib/agent-config.mjs`: local file
deletion only, no network; it refuses to run on the protected (real) tree and does not follow symlinks.
`--check` only warns when such config exists in the real tree.

## Taking an upstream update
As in `delegate-skills/UPSTREAM.md`, with base `533c5150`. After applying upstream changes, check whether
`skills/babysit-pr/SKILL.md` changed; if so, re-apply `local-changes.patch`
(`git apply --3way --directory=vendor/amElnagdy/review-skills local-changes.patch`) and re-read the result, since
upstream may have added new autonomous push or post steps.
