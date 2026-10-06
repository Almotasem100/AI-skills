# Gemini delegate overlay

This directory preserves the owner's local Gemini CLI contribution to Ahmed Nagdy's
`delegate-skills` repository without adding those changes to its upstream history.

## Contents and base

- `changes.patch` contains the complete 24-file worktree delta: the `gemini-delegate`
  skill, delegate-setup/lane integration, and related relay tests.
- `base-commit.txt` pins the exact upstream checkout the patch was generated against.

The patch came from the uncommitted `feature/gemini-delegate` worktree. It does not
install the skill, alter a clone automatically, or publish anything upstream.

## Apply to a separate upstream checkout

From the root of Ahmed's `delegate-skills` checkout, first ensure it is at the pinned
base commit and create a local branch. Then check and apply the patch:

```powershell
$overlay = 'C:\path\to\AI-skills\overlays\gemini-delegate'
git switch -c feature/gemini-delegate 6826b363085dcc80875372315fe7d208c4bf733f
git apply --check "$overlay\changes.patch"
git apply "$overlay\changes.patch"
```

Review the resulting diff and run the upstream repository's documented checks before
using or proposing the contribution. Do not apply over unrelated local changes. If the
upstream base has advanced, do not force the patch; rebase/reconcile it deliberately.
