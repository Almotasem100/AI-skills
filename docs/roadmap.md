# Roadmap

Current state and next steps only. History lives in Git and [docs/records/](records/README.md).

## Current state

- **Workflow:** the shared [contract](../instructions/orchestration-contract.md) owns outcomes, review, verification
  and authority. The optional [delegation profile](../instructions/ai-skills-delegation.md) assigns participants and
  CLI transport. Skills are replaceable capabilities.
- **Skills:** nine first-party skills in `skills/`, with vendored and pinned third-party skills listed in
  [manifest.md](../manifest.md).
- **Repository layout** (2026-11 cleanup): installable instructions are in `instructions/`, historical audits and logs
  are in `docs/records/`, and the tests check behavior and structure, not exact wording.
- **Delegation reliability:** all 19 vendored relay skills now require explicit user authorization for commits or discards and preserve user/partial work in their skill and review guidance. Recovery also requires process/session evidence before another writer and limits fallback to existing approved policy. All 19 skill folders are refresh-supported; Gemini-enabled installations need the overlay-based refresh path.
- **Verification:** `npm test` passes locally. Behavior in installed hosts is checked with the
  [native-smoke pack](../test/native-smoke/README.md) and has not been rerun since the cleanup.

## Next

1. Refresh the selected installed copies from this revision with `node tools/refresh/refresh.mjs` (see
   [GUIDE.md §6](../GUIDE.md#6-keeping-them-up-to-date)); all 19 relay folders are refresh-supported, and Gemini-enabled
   installations need the overlay path. Then confirm in a fresh session that the skills load and that the contract is read. Decide whether the three extra rules in the OpenCode host `AGENTS.md` belong in
   `instructions/global-instructions.md`.
2. When ready, switch the local Gemini lane to run through OpenCode, keeping the selected model and permissions.
   Check the first real dispatch; the route decision itself is settled.
3. Collect new friction in [friction-log.md](friction-log.md) and review it after a few real tickets.

## Deferred

- General native-worker routing and new ZadLoop integration code. Current CLI routing and the profile's bounded
  recovery stay as they are.
- Publishing the Gemini overlay upstream (needs owner scope).
- A standalone installer and secret-free fleet/lane export examples.
- Candidate enhancements in [records/future-ideas.md](records/future-ideas.md) (team workspace, persistent
  coordination, watchdog, integrations). These are ideas, not planned work.
