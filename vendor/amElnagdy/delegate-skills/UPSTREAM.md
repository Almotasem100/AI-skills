# Upstream: delegate-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/delegate-skills |
| Full vendored baseline | `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7` (upstream master checked 2026-10-14) |
| Original copy | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local changes | Only repository-link corrections; recorded in `local-changes.patch`. The Gemini delegate contribution remains separate in `overlays/gemini-delegate/`. |

## Full upstream snapshot — 2026-10-14

Synced the complete upstream tree from `8ef02103ad99b53801f2b13d04755313fbbfafb2` to `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7`. The full snapshot includes Muse delegation, Codex background support, Codex network/web-search/subagent controls, Antigravity and Cursor stall handling, other relay updates, documentation and tests. The previously refreshed `delegate-setup` matches upstream; OpenCode model tokens including `@` and `~` remain accepted.

The vendored source does **not** contain the Gemini relay or Gemini-specific lane validation/normalization. Those stay in the separate, already rebased overlay pinned to the same upstream commit. Preserve the overlay's `permissionMode` to `approvalMode` mapping when preparing installed Gemini-enabled `delegate-setup`; copying only the vendor folder is insufficient.

The complete file transfer was checked against upstream blob SHAs (except the two intentionally patched documentation-link files), but full relay runtime/regression tests **have not been rerun against this new snapshot**. Prior focused Windows 11 / Node 22.19 fake-CLI tests of the earlier narrow reconciliation passed for delegate-setup, Gemini and OpenCode, with event scanner 26/26. A separate broad relay test run had seven Windows orphan-near-timeout failures whose causes remain unresolved. Node 24 compatibility is unverified. These statements are not claims that the new full snapshot passes all tests.

## LOCAL CHANGE — repository-link corrections

The vendored README and CONTRIBUTING guide use absolute upstream GitHub issues/PR links rather than relative links which resolve into the parent repo. `local-changes.patch` records only these changes. On a clean checkout of the pinned upstream base, run `git apply --check --unidiff-zero local-changes.patch` before applying the patch, then verify the two expected link edits. Do not add Gemini changes to this patch.

## Updating again

1. Review commits and executable-script changes after the pinned upstream base before copying new files.
2. Preserve the two repository-link corrections and regenerate `local-changes.patch` when necessary.
3. Rebase `overlays/gemini-delegate/changes.patch` separately onto the new upstream base, update its base metadata, and validate config/lane behavior plus relay tests.
4. Update the baseline in this file and `manifest.md` only after confirming the copied snapshot and intentional differences.
5. Installing skills, changing lane configurations, and applying Gemini overlay are separate, explicitly reviewed actions.
