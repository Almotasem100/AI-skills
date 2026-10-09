# Upstream: delegate-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/delegate-skills |
| Base commit | `8ef02103ad99b53801f2b13d04755313fbbfafb2` (upstream master dated 2026-10-07) |
| Copied | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local changes | One documentation-only link and repository-root update, described below and saved in local-changes.patch. |

## LOCAL CHANGE — repository links (2026-09-28)
The upstream README and contribution guide used relative issue/PR links. In this vendored copy those resolved into the parent repository, so they now link directly to the upstream GitHub project. The update procedure also names the AI-skills repository root.

## Reviewed before copying (2026-09-25)
- No network calls of their own, no `eval`, no downloads.
- Spawns only: the implementer CLI of each relay (`codex`, `opencode`, `agy`, `cursor-agent`, …), `git`, `node`,
  and `taskkill` (Windows: stops the process tree of a timed-out run).
- Writes outside the repo: `delegate-setup` writes lane config to `~/.config/delegate-skills/config.json`
  (global) or `<git-root>/.delegate/config.json` (project), and only after explicit approval.
- `.cursor/install.sh` is for the author's own cloud CI. It never runs for me; ignore it.

## What I use
- `delegate-setup`: configure lanes (which CLI and model does which kind of work).
- `codex-delegate`: verified on Windows 11 upstream.
- `agy-delegate` (Google Antigravity) and `opencode-delegate` (multi-provider: GLM, DeepSeek, Gemini…): to try
  for Gemini and other models before writing any relay of my own.
- The other relays stay in the copy (so upstream diffs apply cleanly) but are unused.

## Upstream update — 2026-10-09

Synced upstream `6826b363085dcc80875372315fe7d208c4bf733f..8ef02103ad99b53801f2b13d04755313fbbfafb2`.
Reviewed the changed relay/setup scripts before taking the update. The material changes are Windows/Node 24
shell-launch compatibility, OpenCode 2.x `--pure` handling, OpenCode catalog model IDs containing `@` / `~`,
and native-Windows Claude verification. The existing documentation-only local link changes were preserved.

## Taking an upstream update
1. Clone upstream to a temp folder and look at what changed:
   `git -C <clone> log --oneline 8ef02103..HEAD` and `git -C <clone> diff 8ef02103..HEAD --stat`
2. Read the changed scripts (same review as above).
3. Apply the changes on top of my copy, keeping my local changes:
   `git -C <clone> diff 8ef02103..HEAD | git apply --3way --directory=vendor/amElnagdy/delegate-skills`
   (run from the root of the AI-skills repo). If a file I changed locally was also
   changed upstream, `git apply` can reject it: merge that one file by hand.
4. Re-apply `local-changes.patch` if it exists and a file it touches changed.
5. Update the base commit above.
