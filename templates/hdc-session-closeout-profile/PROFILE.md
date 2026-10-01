# HDC session closeout

Use this profile with the portable `session-closeout` skill at the end of an HDC modernization work session.
HDC's canonical instructions are `HDC-documents/README.md`; its current state and next gate are
`HDC_Modernization_Development_Plan.md` §0a. Those documents win if this profile drifts.

## Scratchpad

- Follow HDC's scratchpad-first rule. During the work, record encounters, decisions and their owners, verified vs.
  unverified work, created or changed files, and open items in the current HDC session scratchpad.
- If a session scratchpad must be created, use the `sessions/<Topic>_Session_Scratchpad.md` convention listed in
  `HDC-documents/README.md`.
- At closeout, use that scratchpad as the source record. Add/reconcile its closeout details in place; **do not
  create a second closeout report**. Preserve the scratchpad's existing structure; add a concise citation-check
  result if it has no place to record one.
- Collect current branch/commit, `git status --short`, and diff statistics for each repo touched. Separate new
  files from edits and deletions. Cite real-code claims as `path:line` and re-check citations against the current
  files, not from memory.

## Reconcile only relevant lasting documents

Read the target section before proposing a write-back. Do not refresh every project document on every closeout.

- Update Development Plan §0a only when the current state, next step, gate, or open decision changed.
- Update `HDC_Architecture_Decisions.md` only for decisions actually made by the user; record who decided and why.
- Update `HDC_Backend_Functional_Documentation.md` only when endpoint behavior changed and the corresponding
  build verification exists. Keep live verification distinct from build verification.
- Regenerate the URL map after each ported slice, as required by the AI-skills repo's `tools/url-map/README.md`;
  do not edit generated map output by hand. Do not rely on the historical HDC map snapshot as current without
  regeneration.
- Update triage, a runbook, or other documents of record only when the session produced evidence or an approved
  decision relevant to that document.

## Approval, citation check, and removal

- Present exact proposed text and target sections. Apply document-of-record changes only after the owner approves
  the exact write-backs. Re-run `check-citations.mjs` against the scratchpad and every changed document, with roots
  for the HDC docs and code repositories containing cited files. Any STALE citation blocks completion.
- Remove the session scratchpad only after approved write-backs are reconciled and the citation check has no
  STALE results. If approval or verification is pending, retain it and report that closeout is not finished.
- Do not push, deploy, run dispatch commands, or change GCP resources as part of closeout. Follow HDC's current
  commit/review instructions; do not infer authorization to commit from a request to close out. The backend
  exact-file approval rule still applies to any proposed code work.
- Offer `handoff` only when there is one specific next task. It is optional and does not replace the scratchpad
  closeout.
