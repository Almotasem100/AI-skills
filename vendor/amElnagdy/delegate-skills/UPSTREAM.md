# Upstream: delegate-skills

| | |
|---|---|
| Source | https://github.com/amElnagdy/delegate-skills |
| Full vendored baseline | `8ef02103ad99b53801f2b13d04755313fbbfafb2` |
| delegate-setup revision | `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7` (reviewed 2026-10-14) |
| Copied | 2026-09-25, whole repository via `git archive` (no `.git`) |
| Owner | My tech lead. Approved for my use, modification and keeping. |
| Local patch | Repository-link corrections only; recorded in `local-changes.patch`. Gemini support is kept separately in `overlays/gemini-delegate/`. |

## Scope of this refresh

Reviewed upstream `8ef02103..3aa72d68`. This narrowed refresh imports only the changed
`delegate-setup` source files. Other vendored relays and skills remain at the full-snapshot
baseline above; this is intentionally not a complete upstream sync.

Accepted in `delegate-setup`:
- Upstream's Muse registry/schema and discovery support. This does not copy/install a Muse relay or
  attempt a live Muse dispatch.
- OpenCode model-token support for `@` and `~` catalog identifiers, including the existing
  `provider/model` form.
- The updated source retains the Windows shell-probe implementation already present at the full-vendor
  baseline: it passes a quoted command string to `execSync` for shell probes rather than supplying an
  argument array to `execFile(..., {shell:true})`. The Windows `.cmd` fake probe passed under Node
  22.19.0; Node 24 runtime behavior remains unverified here.

Gemini registry/config/lane behavior is deliberately **not** duplicated in the vendor patch. The
separate overlay is rebased to `3aa72d681a79e2a9d09bd9a316353003ae1cb4a7` and retains approval-mode
validation, `permissionMode` â†’ `approvalMode` normalization, documentation, and fake-CLI tests.

Not integrated in this narrowed refresh: Muse's relay and skill, Codex background infrastructure,
Codex relay controls, and Agy/Cursor stall handling. No host Codex settings, lane configurations,
installed skills, or global instructions were changed.

## Verification

On Windows 11 with Node 22.19.0, against the rebased upstream tree and fake CLIs only:
- `node test/relay-smoke.mjs --only delegate-setup` â€” passed, including OpenCode `@`/`~`
  config validation and Windows `.cmd` discovery probe coverage.
- `node test/relay-smoke.mjs --only gemini` â€” passed, including approval-mode validation and
  lane normalization.
- `node test/relay-smoke.mjs --only opencode` â€” passed, including forwarding catalog model IDs.
- `node test/event-scanner.mjs` â€” 26 passed.

These tests did not start a real implementer session. A separate broad relay-smoke run completed with
seven Windows orphan-near-timeout failures in unrelated relay cases. Those failures remain unresolved and
are outside this narrowed refresh; they are not treated as evidence against the focused changes.

## LOCAL CHANGE â€” repository links

The upstream README and contribution guide used relative issue/PR links. In this vendored copy those
resolved into the parent repository, so they link directly to the upstream GitHub project. This
change is reproducible from the full vendored baseline using `git apply --unidiff-zero local-changes.patch`.

## Updating

1. Fetch upstream and review the range from the full-vendor baseline; do not infer that every newer
   upstream file has been imported by this partial refresh.
2. For another full update, reconcile the complete repository snapshot while preserving local work,
   then update the full vendored baseline in this file and `manifest.md`. To reproduce the current docs-only patch, use `git apply --check --unidiff-zero local-changes.patch` before applying it.
3. Keep the Gemini contribution in `overlays/gemini-delegate/`; update its patch and base metadata
   together. Do not copy its Gemini validation or lane conversion into `local-changes.patch`.
4. Keep repository-link corrections in `local-changes.patch` only while the vendored README and
   contribution guide need those changes.\n