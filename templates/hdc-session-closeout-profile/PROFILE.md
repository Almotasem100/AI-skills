# HDC session closeout

Use this profile with the portable `session-closeout` skill at the end of an HDC modernization work session.
HDC's canonical instructions are `HDC-documents/README.md`; its current state and next gate are
`HDC_Modernization_Development_Plan.md` §0a. Those documents win if this profile drifts.

## Scratchpad

- Follow HDC's scratchpad-first rule. During the work, record encounters, decisions and their owners, verified vs.
  unverified work, created or changed files, and open items in the current HDC session scratchpad.
- Use only `HDC-documents/current-session/scratchpad.md`, with session inputs adjacent in the fixed folder.
  Read/reuse unfinished work across chat/model handoffs; do not create another dated scratchpad or archive.
- Put session-created working documents and visual artifacts (plans, briefs, design drafts, review findings,
  reports, diagrams and charts), whether authored by the orchestrator or a delegate, in
  `HDC-documents/current-session/`, not an agent's temporary directory. Delegates may create supporting artifacts
  there but must not edit the live scratchpad; the orchestrator reviews and incorporates their findings. Code,
  tests, approved project-document deliverables, execution logs, compiled outputs and worktrees use their approved
  repository or tool locations; relay metadata may remain in tool-managed temporary storage.
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
- Distinguish unfinished work in the agreed task from separate future work. When the owner closes the bounded
  task, record remaining audit, acceptance, retirement or cleanup follow-ups in the Plan with their gates.
  Separate follow-ups do not by themselves keep the completed task open or require retaining its scratchpad.

## Approval, citation check, and removal

- Present exact proposed text and target sections. Apply document-of-record changes only after the owner approves
  the exact write-backs. Re-run `check-citations.mjs` against the scratchpad and every changed document, with roots
  for the HDC docs and code repositories containing cited files. Any STALE citation blocks completion.
- Clear only the approved contents of `HDC-documents/current-session/`, including the scratchpad and inputs,
  after the feature or agreed bounded non-feature task is complete, approved write-backs are reconciled and
  verification/citation checks pass. Then present the exact cleanup inventory and explicitly ask the owner
  whether they want those contents cleared. Clear only after an explicit yes; if declined, retain them. Follow
  the canonical README's cleanup approval/inventory rule. If work, write-back approval or verification is pending,
  retain everything and report that closeout is not finished.
- Keep external temporary directories and registered worktrees outside current-session cleanup. Inventory
  them separately and obtain exact cleanup approval; use Git's worktree operations for registered worktrees.
- Closeout alone does not authorize staging, committing, pushing, deploying, dispatching or changing GCP
  resources. Perform only separately authorized actions and report actual outcomes, including blocked pushes.
  Follow HDC's current commit/review instructions; the backend exact-file approval rule still applies.
- Do not invoke or offer `handoff` at the end of HDC closeout. Use it only at the owner's request to pause or
  transfer unfinished work, preserving the current scratchpad and inputs.
