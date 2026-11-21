# Baseline and invariants

## Revision and safety baseline

- Repository: `Almotasem100/AI-skills`
- Research branch: `research/v4-composability-batch-01`
- Starting research tip: `d16fa040591daee78238f888f93133f4d5297135`
- `master` baseline fetched before edits: `2af86ec293c85c29a56c7f8a7d753f84bd38f374`
- Their merge base was the `master` SHA above. The research tip was not identical to `master`; its only initial delta was this batch's `research/v4-batch-01/EXECUTION.md`.
- Initial working tree: clean on `master`. Work ran on the research branch only.
- No canonical instructions, installed files, vendor files, CI, host configuration, or delegation-mode files were changed. `instructions/ai-skills-delegation.md` was not loaded.

## Authority read

The experiment was interpreted against the V3 portable contract at the baseline revision, especially:

- Full Feature default outcomes and legitimate omissions: `instructions/orchestration-contract.md` §Full Feature delivery contract (lines 14–33).
- Project-specific work hierarchy and bounded work: §Work hierarchy (35–43).
- Working context and scratchpads: §Context and continuity (68–86).
- Evidence/source authority and distinction between facts, assumptions, and runtime results: §Evidence and authority (128–138).
- Independent review and one mutation owner: §Review and ownership (140–165).
- Approval boundaries: §Authorization and checkpoints (235–249).
- Completion and blocked verification: §Outcome completion (309–317).
- Capability substitution at the calling boundary: §Replacing a capability (319–327).
- Portable contract versus project mapping: §Generic versus project-specific policy (329–334).

`AGENTS.md` §Start here and `README.md` §How the workflow fits together confirm that the contract is canonical, skills supply individual outcomes, and projects own their tracker, environment, and approval mapping. `docs/roadmap.md` identifies general native-worker routing as deferred, not an approved architecture change.

## Invariants retained

1. A default outcome can be omitted only when inapplicable or explicitly omitted by the owner; an omission does not waive separate approvals or necessary verification.
2. Task notes and capability substitutions do not outrank approved requirements or project policy.
3. Independent review remains independent; a replacement must preserve the required input/output, evidence, authority, and ownership boundary.
4. A project or ticket can add applicable requirements without making them global.
5. A local check, a remote CI result, prepared PR text, and opened PR are distinct evidence and states.
6. Synthetic test results validate only the encoded deterministic fixture rules. They do not demonstrate visual/browser behavior, a live security scanner, a corporate CI system, or installed-host behavior.

## Starting overlap

The V3 contract already provides the seams exercised here: project-specific mapping, useful scratchpads, bounded omissions, replaceable skills, approval boundaries, and acceptance-state reporting. No second global rule or new composition framework was needed for these cases.
