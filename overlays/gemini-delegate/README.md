# Gemini delegate overlay

This directory preserves the owner's local Gemini CLI contribution to Ahmed Nagdy's
`delegate-skills` repository without adding those changes to its upstream history.

## Contents and base

- `changes.patch` contains the 25-file Gemini contribution: the `gemini-delegate` skill,
  delegate-setup/lane integration, shared fake-CLI support, and relay tests.
- `base-commit.txt` pins the exact upstream revision against which the patch was rebased.

The contribution was reconciled onto upstream `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7` on
2026-10-14. It preserves Gemini approval-mode validation and the `permissionMode` to
`approvalMode` lane conversion, alongside upstream's Muse and Codex-background additions. The
overlay is separate from the vendored `delegate-setup` patch: do not duplicate Gemini behavior in
`vendor/amElnagdy/delegate-skills/local-changes.patch`. It does not install skills, modify host
settings, launch a real Gemini session, or publish upstream.

## Apply to a separate upstream checkout

From the root of Ahmed's `delegate-skills` checkout, ensure it is at the pinned base commit and
create a local branch. Then check and apply the patch:

```powershell
$overlay = 'C:\path\to\AI-skills\overlays\gemini-delegate'
git switch -c feature/gemini-delegate 3aa72d681a79e2a9d09bd9a316353003ae1cb4a7
git apply --check "$overlay\changes.patch"
git apply "$overlay\changes.patch"
```

Review the resulting diff and run the focused fake-CLI checks before use or proposal. Do not apply
over unrelated local changes. If upstream advances, rebase/reconcile deliberately and update the
patch and base metadata together.
