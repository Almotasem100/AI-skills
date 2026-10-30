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

## Prepare Gemini-enabled installation from this repository

The ordinary vendor copy of `delegate-setup` has no Gemini support. Install **both** the overlay-applied
`delegate-setup` and `gemini-delegate` together. Copying only the relay, or replacing enhanced setup with the plain
vendor setup later, loses Gemini validation/normalization. Do not modify the vendor snapshot or apply its
`local-changes.patch` a second time: the checked-in vendor tree already includes those documented link corrections.

The following creates a disposable source copy, checks the declared base, applies the overlay and runs offline gates.
Set `$setup` to the AI-skills checkout. No CLI authentication, model calls or host installation happens in this block.

```powershell
$setup = 'C:\path\to\AI-skills'
$vendor = Join-Path $setup 'vendor/amElnagdy/delegate-skills'
$overlay = Join-Path $setup 'overlays/gemini-delegate'
$base = (Get-Content (Join-Path $overlay 'base-commit.txt') -Raw).Trim()
if (-not (Get-Content (Join-Path $vendor 'UPSTREAM.md') -Raw).Contains($base)) {
  throw 'Overlay/vendor base mismatch; reconcile the source before installation.'
}
$geminiSource = Join-Path ([IO.Path]::GetTempPath()) ('ai-skills-gemini-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory $geminiSource | Out-Null
Get-ChildItem $vendor -Force | Copy-Item -Destination $geminiSource -Recurse -Force
Push-Location $geminiSource
try {
  git apply --check (Join-Path $overlay 'changes.patch')
  if ($LASTEXITCODE -ne 0) { throw 'Overlay applicability check failed.' }
  git apply (Join-Path $overlay 'changes.patch')
  if ($LASTEXITCODE -ne 0) { throw 'Overlay application failed.' }
  node --check test/relay-parity.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Applied parity script has invalid syntax.' }
  node test/relay-parity.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Relay parity failed.' }
  node test/relay-smoke.mjs --only gemini,package-shape,syntax
  if ($LASTEXITCODE -ne 0) { throw 'Focused Gemini offline gates failed.' }
} finally {
  Pop-Location
}
# Only a successful block above establishes a verified installation source.
$geminiSource
```

Retain the resulting `$geminiSource` variable and use the GUIDE copy block with delegation components selected.
Its copy loop takes `delegate-setup` from this enhanced source and installs the matching `gemini-delegate` into the
same selected skill roots. Preserve/compare existing customizations and keep recoverable copies before replacement.
For a separately scoped Gemini-only refresh, copy the complete `skills/delegate-setup` and `skills/gemini-delegate`
directories from this staged source into each selected installed skill root, then verify every source file against
its installed counterpart. Recheck host discovery and run the native smoke pack afterward.

These gates test local source and fake CLIs; they do not establish native Windows/Gemini behavior. The 2026-10-30
syntax correction removes accidental BOM-before-shebang and literal-backslash-newline edits from the parity-test
patch. No relay runtime behavior or pinned upstream base was changed.
