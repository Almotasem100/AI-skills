# Context recovery and limited local drafts

Use this reference when the Git context helper fails or its committed comparison cannot represent the requested
change. Keep the actual error and evidence limits visible; a failed helper does not prove a missing shell or
unavailable repository access.

## Recover the normal comparison when possible

- Check the actual repository root and applicable project/branch/PR evidence. If the intended base is established
  and available, rerun `context.mjs --base <verified-base> --out <temp>/describe-pr-context.json`, then resume the
  normal skill steps. A configured default such as `develop` is not proof of the intended target.
- Do not pick another branch merely because it exists, create commits to satisfy the helper, initialize a nested
  repository, change persistent configuration, or fetch/publish beyond existing authorization.
- If the cause is unavailable access, invalid configuration or a safety/redaction boundary, report it. Do not
  bypass it with a raw file dump. Ask only for consequential missing information not available from current sources.

## Limited local draft

When a full comparison remains unavailable, use accessible, authorized implementation evidence and approved task
sources to prepare useful local text. This can cover an uncommitted worktree, an empty-history fixture or explicitly
supplied changes. Current source alone does not establish what changed: without a trustworthy baseline or supplied
change record, leave that comparison unknown.

- Label the result **Local PR draft — comparison incomplete**. Identify the evidence used and what remains unknown
  (for example, target base, complete delta, commit history or review coverage). Do not claim a verified branch diff.
- Preserve the main skill's source hierarchy, test-result qualifiers, secret handling and missing-input rules.
  Do not read known sensitive/redacted files or include credentials; helper failure is not permission to bypass
  its redactions. Inspect only relevant authorized non-sensitive evidence.
- Use the project's PR layout when available, otherwise the relevant bundled Markdown template. Keep unsupported
  claims marked `[NEEDS INPUT]`; ask only the remaining consequential questions. Do not fabricate a context JSON,
  commit list, diff statistics or successful helper/renderer output to force this path through the normal pipeline.
- Return or save the draft at the authorized destination. Preparing it does not authorize commits, push, PR opening
  or updating an existing remote PR. Do not publish through this limited path; first establish the actual base and
  change scope and complete the normal context/render checks and applicable publication authorization.

A local draft can satisfy a requested PR-text deliverable with its limitations disclosed. Any separately required
branch comparison, review or publication remains pending until actually completed.
