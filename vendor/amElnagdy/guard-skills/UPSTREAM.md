# Upstream: guard-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/guard-skills |
| Base commit | `ffa26036b7b5e77b20b5d679304a703b6fd1a43d` (upstream commit dated 2026-07-04) |
| Copied | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local changes | **None.** |

## Reviewed before copying (2026-09-25)
Instructions only: no scripts, no hooks, nothing executed. The `agents/openai.yaml` files are metadata for
Codex.

## What I use
- `clean-code-guard`, `test-guard`, `docs-guard`: second-pass reviews after implementation.
- Not used: `wp-guard`, `woo-guard` (WordPress / WooCommerce). They stay in the copy so upstream diffs apply
  cleanly, but are not installed.
- **On ported legacy code** (e.g. the HDC migration): record the guard's findings, don't fix them in the same
  change. Moving code and fixing it are kept apart.

## Taking an upstream update
As in `delegate-skills/UPSTREAM.md`, with base `ffa26036`.
