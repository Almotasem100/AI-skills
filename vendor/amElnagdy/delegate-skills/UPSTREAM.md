# Upstream: delegate-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/delegate-skills |
| Full vendored baseline | `48b53d33b53ef260de76c3d2c1313e2c62a24820` (upstream master dated 2026-11-14, synced 2026-11-19) |
| Original copy | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local changes | Repository links, OpenCode guidance, and delegation authority; recorded in `local-changes.patch`. The Gemini delegate contribution remains separate in `overlays/gemini-delegate/`. |
| Installed subset | `delegate-setup`, `codex-delegate`, `agy-delegate`, `opencode-delegate`; plus `gemini-delegate` via `overlays/gemini-delegate/` |

## Full upstream snapshot — 2026-11-19

Synced the complete upstream tree from `3aa72d68` to `48b53d33` (64 files). Reviewed the executable changes in the
installed skills before copying: the OpenCode relay now token-validates `--agent` and `--session` (they reach
`cmd.exe` on Windows), `delegate-setup` recognizes OpenCode credential rows ending in `stored` and registers the new
`mcode` implementer, and the Codex relay gains an opt-in `--no-project-doc`. No new network, credential or telemetry
behavior. Upstream removed `codex-background` (and its instructions in the implementer skills) and added
`mcode-delegate`; neither is installed here. `local-changes.patch` content is unchanged (line numbers only) and
applies to the new base with `--unidiff-zero`. Upstream's relay parity and the opencode, codex, agy, delegate-setup, package-shape
and syntax smoke suites pass on Windows 11 / Node 22.19 for both this tree and the Gemini overlay build (plus the
gemini suite on the overlay build); the delegate-setup suite takes about six minutes there.

## Full upstream snapshot — 2026-10-14

Synced the complete upstream tree from `8ef02103ad99b53801f2b13d04755313fbbfafb2` to `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7`. The full snapshot includes Muse delegation, Codex background support, Codex network/web-search/subagent controls, Antigravity and Cursor stall handling, other relay updates, documentation and tests. The previously refreshed `delegate-setup` matches upstream; OpenCode model tokens including `@` and `~` remain accepted.

The vendored source does **not** contain the Gemini relay or Gemini-specific lane validation/normalization. Those stay in the separate, already rebased overlay pinned to the same upstream commit. Preserve the overlay's `permissionMode` to `approvalMode` mapping when preparing installed Gemini-enabled `delegate-setup`; copying only the vendor folder is insufficient.

The complete file transfer was checked against upstream blob SHAs (except the two intentionally patched documentation-link files), but full relay runtime/regression tests **have not been rerun against this new snapshot**. Prior focused Windows 11 / Node 22.19 fake-CLI tests of the earlier narrow reconciliation passed for delegate-setup, Gemini and OpenCode, with event scanner 26/26. A separate broad relay test run had seven Windows orphan-near-timeout failures whose causes remain unresolved. Node 24 compatibility is unverified. These statements are not claims that the new full snapshot passes all tests.

## LOCAL CHANGE — repository-link corrections

The vendored README and CONTRIBUTING guide use absolute upstream GitHub issues/PR links rather than relative links which resolve into the parent repo. On a clean checkout of the pinned upstream base, use the LF copy of `local-changes.patch`: run `git apply --check --unidiff-zero <patch>` before `git apply --unidiff-zero <patch>`, then compare the reconstructed files to the vendor snapshot. Do not add Gemini changes to this patch.

## LOCAL CHANGE — delegation authority

Delegation guidance distinguishes commit and destructive-discard authority from routine in-scope corrections.
Existing authorization still applies. The cumulative patch includes these edits separately from the Gemini overlay.

## LOCAL CHANGE — OpenCode continuation and effective permissions

The OpenCode skill, its brief/dispatch references and the relay's comment-derived `--help` distinguish requested plan-agent behavior from enforced
containment: the relay omits `--auto` for plan runs but does not revoke host-configured tool permissions.
The brief/dispatch references also match the existing relay's model/variant handling: resume can inherit a model,
but an explicit variant on OpenCode 2.x needs an explicit or lane-resolved model. No relay execution logic or host settings
are changed; the relay script changes only comments and the help text derived from them. Inline `LOCAL CHANGE`
markers identify the corrected guidance; the patch preserves all six changed upstream files (the two link files,
three OpenCode documents and the relay's comment/help correction).

## Updating again

1. Review commits and executable-script changes after the pinned upstream base before copying new files.
2. Preserve the repository-link, OpenCode and delegation authority corrections. Regenerate `local-changes.patch`
   as one LF diff from the pinned upstream tree, retaining upstream file modes.
3. Rebase `overlays/gemini-delegate/changes.patch` separately onto the new upstream base, update its base metadata, and validate config/lane behavior plus relay tests.
4. Update the baseline in this file and `manifest.md` only after confirming the copied snapshot and intentional differences.
5. Installing skills, changing lane configurations, and applying Gemini overlay are separate, explicitly reviewed actions.
