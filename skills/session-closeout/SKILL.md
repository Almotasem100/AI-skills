---
name: session-closeout
description: Close out a work session using the project's designated scratchpad (reuse an existing one when project rules require it; otherwise create a dated one), recording verified and unverified work, decisions, deferred items, open questions, repo changes, and proposed write-backs. Re-check every file:line citation against the real files; stale citations block closeout. Apply document updates only after user approval. Use when the user says "close out", "wrap up", "end of session", "write the scratchpad", "session summary" or "what should go back into the docs".
---

# Session closeout

A session's knowledge is lost or goes stale in two ways: it never gets written down, or it gets written with
citations that are wrong for the real file. This skill writes it down in a fixed shape and proves the
citations before anyone relies on them. It **proposes** edits to the project's documents of record and applies
them only after explicit user approval.

## Inputs (find them before writing)
1. **Project instructions, scratchpad, repos, documents of record.** Read the project's `AGENTS.md` (or the
   agent instructions the project uses). Follow any project closeout profile for scratchpad location, reuse,
   retention, and conditional document updates. If a required detail is not defined there—where the scratchpad
   goes, which repos the session touched, or which documents are "of record" (plan, charter, roadmap…)—**ask the
   user once**, in one message. Never assume a project profile authorizes edits that the user or project rules
   reserve for approval.
2. **Topic:** a few words for the session's main subject. Propose one; the user can change it.

## Steps

### 1. Collect what changed
For each repo the session touched: current branch and short commit, `git status --short`, and
`git diff --stat` (plus `git diff --cached --stat` if anything is staged). List **new files** separately
(`git status --short` lines starting with `??` or `A`). Also list the documents edited during the session.
Report only what git and the session show; don't reconstruct from memory what you can read.

### 2. Use the project's scratchpad
If project instructions designate an existing scratchpad for this session, continue in that file; do not create a
second closeout report. Otherwise copy `templates/scratchpad.md` to the designated docs folder as
`YYYY-MM-DD_<Topic>_Scratchpad.md` (today's date, topic in `Title_Case_With_Underscores`). If a file with that
name exists, add to it instead of overwriting it.
For the default template, fill every section and write "none" rather than deleting one. When reusing a
project-defined scratchpad, preserve its format and complete the sections required by that project profile. Rules:
- **Verified means you saw it succeed in this session**: a command and its result, a file you read, a test run.
  Anything else goes under "Done but not verified", with what's missing.
- **Every decision says who made it**: the user; recommended by the agent and accepted by the user; or the
  agent alone (flag these; they may need the user's review).
- **Cite facts about code as `path:line`** (a range `path:10-20`, a list `path:35,52`), optionally with a
  quoted token that must be on that line: `Constants.java:82 "TOOL_TYPES"`. Use a path long enough to be
  unique. Code that exists only on another branch: `<branch>:path:line` (not checked by the script).
- Never write the scratchpad inside a code repository.

### 3. Queue the write-backs
Under "Queued write-backs", one block per edit to a document of record: the document, the section, why, and
the **exact** proposed text. Read the target section first so the text fits what is already there. Re-check
every fact in a write-back against the real file, even if it came from a careful earlier session. Use the project
profile to decide which durable docs are relevant and whether generated docs need refreshing; do not update
unrelated documents just because they exist.

### 4. Check every citation (blocking)
Run, from anywhere:

```
node <skill-dir>/scripts/check-citations.mjs <scratchpad.md> --root <repo1> [--root <repo2> ...]
```

(`<skill-dir>` is the folder containing this `SKILL.md`.) It checks that each cited file exists under the
roots, that the lines exist, and that any quoted token is on those lines. Exit code 1 means STALE citations.
- **STALE:** open the real file, find the right place, fix the citation (or remove the claim), and re-run.
  Repeat until there are none. If one can't be resolved, say so plainly: **the closeout is blocked** and is not
  finished; tell the user which citation and why.
- **WARN (ambiguous):** lengthen the path or add a token, then re-run.
- Paste the final summary line into the scratchpad's "Citation check" section.

### 5. Apply only with approval; then finish the scratchpad
Give the user: the scratchpad path; the checker's final line; the list of queued write-backs (document → section,
one line each); the open questions; and anything flagged as decided by the agent alone. Ask whether to apply the
write-backs. **Apply them only after an explicit yes**, as a separate step, and re-run the checker on every
document you changed. If project instructions require removing the scratchpad, do so only after all approved
write-backs, if any, are applied and citations pass. If approval or verification is still pending, retain the
scratchpad and report that closeout is not finished.

Offer `handoff` only when there is one specific next task; it briefs that task and does not replace the closeout.

## What this skill never does
- Edit a document of record without the user's yes.
- Write inside a code repository.
- Delete a scratchpad unless the project instructions or user explicitly require it; never delete one before
  approved write-backs, if any, and citation checks are complete.
- Call a closeout finished while the checker reports STALE citations.
- Invent verification: if a result isn't in the session, it's "not verified".
