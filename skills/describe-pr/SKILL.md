---
name: describe-pr
description: Write a pull request title and description for the current branch from its git changes plus approved task requirements, sourced intake decisions and optional design artifacts. Use when the user asks to write, draft, create, open or update a pull request or its description, or to describe their changes for review.
---

# describe-pr

Writes the PR title and body for the current branch/delivery slice. The *what* comes primarily from current git/implementation evidence. The *why* comes from explicit rationale or approved task sources, which task-context may preserve or locate. Task-context itself does not grant authority to its author's inferences. Testing comes only from verification that actually ran or an explicit developer report; never infer it from code or requirements.
Normally rebuild context from git on every run, whether or not an AI wrote the code. When that context cannot
be established, a limited local draft is a separate outcome, not a validated branch comparison.

`<skill-dir>` below means the folder that contains this file. Write every temporary file to the system temp
folder, **never inside the repository**.

## Inputs
All optional. Use whatever the user gives; ask only for what's missing after checking available task evidence (step 5).
- A task-context artifact for this task (navigation to sourced rationale and approved decisions when available).
- The internal ticket: ID, title, description / acceptance criteria.
- Approved requirements or other authoritative task inputs already available to the session.
- A one-line note: why the change was made and how it was tested.
- Parent-feature Functional Design / LLD and, only when the project has one, an optional Technical Design.
- "Update": refresh the description of the branch's existing PR after more commits.

## Steps

1. **Build the context.** From inside the repository run:
   `node <skill-dir>/scripts/context.mjs --out <temp>/describe-pr-context.json`
   Options: `--base <branch>` for a verified intended base, `--budget <chars>`. The helper compares committed
   changes against that base; it does not include uncommitted work. If it fails or cannot represent the requested
   change, report the limitation and follow [context-recovery.md](references/context-recovery.md). Do not silently
   substitute a base or manufacture history. A limited local draft follows that reference instead of steps 2–7.

2. **Read the context.** It holds the branch (type, ticket ID, naming problems), base, commits, stats, sizing,
   template, signals, `requiredSections`, and per-file diffs (`included: "full"`) or stats only (`"stat"`, with a
   reason). Tell the user in one or two lines about any `redactions` and `warnings`.
   - **Never open a file whose `included` is `"redacted"`.** It may hold secrets.
   - You may open other changed files when a stats-only file matters to the description.
   - If the project has an `AGENTS.md`, use its glossary and conventions.
   - Before asking for the Why, inspect the task-context artifact if one is available. If no task context exists,
     inspect the relevant approved ticket/requirements/design material already supplied or referenced for this task.
     Do **not** read every unrelated PDF/source file by default; use the minimum evidence needed to establish the
     rationale and verify consequential claims. Follow intake pointers to authoritative sources as needed; do not
     promote an observation, cross-source concern or later working synthesis into approved rationale.
   - Read relevant Functional Design / LLD / Technical Design when supplied: they ground terminology, intended
     behavior and design, but concise design documents are not expected to preserve every business rationale detail.

3. **Write for the PR reviewer**, using `references/writing-guide.md` for headings, title and optional evidence.
   Link the actual forward Technical Design/LLD title when available; omit routine dates and duplicated ticket
   metadata. Keep impact/risk as readable bullets and review considerations only when useful. UI changes alone
   do not require screenshots or another question. **Write the draft** as JSON, following `references/draft-contract.md` and `references/writing-guide.md`,
   and save it to `<temp>/describe-pr-draft.json`. Look at `references/exemplars/` for the house style.
   - Fill only the sections for the context's `template`. Required sections must appear; leave optional ones
     empty when they don't apply.
   - **Never invent** reasons, test results, measurements, severity, business impact or rollback steps. Use
     `[NEEDS INPUT]` and add a question.
   - Preserve evidence qualifiers exactly: `estimated`, `expected`, `target`, `projected`, `reported`,
     and `observed` are not interchangeable. Never turn a target/estimate into a measured result.
   - For Why/Problem, use explicit user rationale, then approved ticket/requirements, then relevant approved design,
     then ask the developer. Task-context may preserve those statements and their provenance; it is not a separate
     higher authority. Never derive business rationale from the diff alone.
   - List the distinct concerns in `detected.unrelatedConcerns`, and any difference between the code and the
     LLD in `detected.designDocDivergence` (also mention it in reviewer notes).

4. **Render:**
   `node <skill-dir>/scripts/render.mjs --context <temp>/describe-pr-context.json --draft <temp>/describe-pr-draft.json --body-out <temp>/describe-pr-body.md`
   It prints `{ title, body, needsInput, warnings }`.

5. **Show the result and ask — in one message.** Show the title, the full body and the renderer's warnings.
   Show the body **exactly as `render.mjs` produced it**, inside a fenced `markdown` block, with every heading:
   don't reformat, shorten or summarise it (that is what gets pasted into the PR).
   Then ask **at most 4 questions**, only for what's still missing after checking available task evidence
   (ticket ID if the branch has none, unresolved why, testing, rollback when there's a migration or it's a hotfix,
   reviewer focus). Do not ask the developer for rationale already established by sourced approved decisions or
   requirements. Make questions confirmation-shaped only when the guess is grounded in those sources.

6. **Apply the answers.** Update the draft, render again and show the new result. Repeat only for the parts
   the user changes.

7. **Publish only when the current authorization explicitly covers PR publication.** If the user already asked to take the work through PR/open the PR, do not ask again merely because this stage was reached. Otherwise ask before the outward action.
   - If `needsInput` is above 0, say which parts are still missing and get explicit confirmation first.
   - The branch must be on the remote. Push it only when the current authorization covers the push needed for the requested PR; otherwise ask before pushing.
   - With `gh` installed and authenticated (for GitHub Enterprise, `GH_HOST` set):
     - new PR: `gh pr create --base <base> --head <branch> --title "<title>" --body-file <temp>/describe-pr-body.md`
     - existing PR: `gh pr edit <number> --title "<title>" --body-file <temp>/describe-pr-body.md`
   - Without `gh`: give the user the title and body to paste.
   - Never merge, enable auto-merge, or add reviewers/labels unless the current request/project authorization explicitly covers those separate effects.

## Updating an existing PR
Run the same steps. First read the PR's current body (`gh pr view --json title,body`) and keep what the
developer wrote (why, testing, rollback, reviewer notes) unless the new changes make it wrong; refresh the
rest from the new context and ask only about what changed.

## Files
- `scripts/context.mjs`: deterministic git context — branch parsing, base branch, commits, stats, per-file
  diffs within a size budget, secret redaction, file-path signals, required sections.
- `scripts/render.mjs`: draft + template → title and body; validates the title.
- `templates/`: `story.md`, `bugfix.md`, `hotfix.md`. A repo can supply its own through `templatesDir` in its
  `.describe-pr.json`.
- `references/`: the draft contract, the writing guide, the exemplars, an example `.describe-pr.json`.
