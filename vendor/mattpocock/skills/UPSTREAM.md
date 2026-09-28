# Upstream: mattpocock/skills (only `code-review`, renamed `two-axis-review`)

| | |
|---|---|
| Source | https://github.com/mattpocock/skills (MIT, `LICENSE` copied alongside) |
| Base commit | `c55ee46073ed923f86ce59a5eb3b6d895095d1b7` (upstream commit dated 2026-09-18) |
| Copied | 2026-09-25: only `skills/engineering/code-review/` → `skills/two-axis-review/`, plus `LICENSE` |
| Local changes | **1**: renamed. Diff in `local-changes.patch` |

The other Pocock skills I use (`grill-me`, `grilling`, `grill-with-docs`, `domain-modeling`, `handoff`) are
unchanged, so they stay pinned in `manifest.md` and are not copied here.

## Local change: renamed `code-review` → `two-axis-review`
Claude Code ships a built-in skill called `code-review`. With both installed under one name, it is unclear
which one Claude picks (after installing Pocock's, Claude's live skill list showed no second `code-review`).
The two are not substitutes: Claude's built-in only hunts bugs and only runs in Claude; this one checks the
diff against the repo's standards **and** against the spec (the LLD), and works in any agent.

Changed (each spot marked `LOCAL CHANGE`):
- `SKILL.md`: `name: two-axis-review`, plus a comment saying why. The description and body are unchanged.
- `agents/openai.yaml`: display name "Two-Axis Review".

## Reviewed before copying (2026-09-25)
Instructions only, no scripts. It runs `git diff`, `git log`, `git rev-parse` and starts two sub-agents
(agents without sub-agents run the two reviews one after the other). If `docs/agents/issue-tracker.md` is
missing, it tells you to run `setup-matt-pocock-skills`: **ignore that** (it writes files into the repo) and
give it the LLD path as the spec instead.

## Taking an upstream update
1. Clone upstream outside this repo and read what changed in `skills/engineering/code-review/` since the base.
2. Replace `skills/two-axis-review/` with the new upstream folder, then from this folder run
   `git apply --3way local-changes.patch` (paths are relative to this folder) and re-read the result.
3. Record the new base commit here and in `manifest.md`.
