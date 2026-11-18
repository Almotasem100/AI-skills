# AI-skills — agent instructions

This repository contains the owner's model-agnostic setup for AI-assisted development: installable workflow
instructions in `instructions/`, original skills in `skills/`, reviewed third-party copies in `vendor/`, unchanged
pinned skills listed in `manifest.md`, tools, templates, and installation guidance.

## Start here

Before planning or changing this repository, read:

1. `docs/roadmap.md` for the current state, next steps and deferred work.
2. `instructions/orchestration-contract.md` for the portable workflow semantics.
3. `README.md` for the layout and the skill authoring rules.

Read `docs/records/` only when the history or reasoning is relevant; records are not current policy.
Explicitly requested changes may proceed; do not resume deferred work merely because a record once proposed it.

## Where things go

| Change | Put it in |
| --- | --- |
| Workflow rule that applies to every project | `instructions/orchestration-contract.md`, stated once |
| Rule for delegation mode only | `instructions/ai-skills-delegation.md` (roles: `delegation-lanes.md`; dispatch mechanics: `cli-dispatch.md`) |
| How one capability works | That skill's `SKILL.md` or its `references/` |
| Install or usage instructions | `GUIDE.md` |
| Status, next step, deferred item | `docs/roadmap.md`, rewritten in place |
| Feedback from real use | one line in `docs/friction-log.md` |
| Audit, evidence or decision history | a new file in `docs/records/` |
| Project-specific policy | that project's own instructions, never here |

Before finishing a change, run `npm test`. Files in `instructions/` and `skills/` are installed as copies, so tell
the owner which installed files need refreshing.

## Repository rules

- **Keep the setup portable.** Build on `SKILL.md`, `AGENTS.md`, MCP, dependency-free Node scripts, and Git
  hooks. Do not make a skill depend on one agent's tools or behavior. Follow the more detailed authoring rules
  in `README.md`.
- **Treat third-party content carefully.** Never change a skill listed as unchanged in `manifest.md` in place;
  copy it into `vendor/` first. For every vendor change, mark the change `LOCAL CHANGE`, describe it in that
  repo's `UPSTREAM.md`, and save the patch as `local-changes.patch`. Read the source repo's scripts before
  copying or updating it.
- **Validate claims with evidence.** Run relevant scripts or workflows on a real repository before claiming
  they work. State exactly what you ran and where. Distinguish a scripted check from a native test in a
  particular agent; do not generalize beyond the evidence. For work that cannot be tested, say what remains
  unverified.
- **Give a recommendation.** If an option is weak, over-engineered, or not worth the effort, say why and
  recommend a better one. The owner makes unresolved choices.
- **Protect secrets and customer data.** Never create, copy into documentation or logs, expose in responses,
  or transmit secrets, credentials, tokens, or customer data. Do not handle credentials on the owner's behalf.
- **Keep the owner in control of external effects.** Ask before an action that was not already authorized and
  would change user-level installations or agent configuration, push or post content, deploy software, or
  change a project repository. A direct request authorizes the action it clearly names; ask only about
  additional actions outside that scope. Project-specific structural and environment gates live in that project's
  canonical instructions; do not duplicate superseded project rules here.
- **Maintain current instructions.** Edit the authoritative rule in place, remove superseded or conflicting wording,
  and update other documents only where the change makes them inaccurate; do not append dated change notes,
  decision histories, or "previously X, now Y" explanations to instruction files. Keep change history in Git and
  necessary execution evidence or historical rationale in designated working records outside routinely loaded
  instructions; retain dates or provenance where they are part of an actual requirement or explicitly required record.
- **Close out setup changes.** When work changes this setup, update `docs/roadmap.md` in place with the relevant
  current status, next step, or open decision, not a chronological edit log. Do not change the roadmap just to record
  a read-only review.

## Working with the owner

Keep replies short and conversational: give the recommendation and its main tradeoff. Never invent facts about
the owner's projects, tools, or environment. If a needed fact cannot be established from the repository or
available evidence, say so or ask. Report what was tested in concrete terms; for example, running a script on a
sample repo does not establish that the skill was tested natively in Gemini CLI.

## HDC/PDC/TDC project work

Most of this repository is generic. For HDC/PDC/TDC, read the canonical sibling
`../HDC/HDC-documents/README.md` and then `HDC_Modernization_Development_Plan.md` §0a. Those project documents map
this repo's portable abstractions onto Jira/CodeBeamer, HDC architecture, DEV/ACP/PROD permissions and migration
gates. Do not duplicate project-specific policy here: if HDC guidance changes, update the canonical HDC documents
and keep this repository's generic contract portable.

When editing this repository for HDC-driven lessons, first ask whether the lesson would still make sense on another
software project. If yes, put the portable semantic here. If it depends on HDC ticket systems, Jersey/Angular,
Objectify/GAE, ABRT, project paths, environment permissions or HDC migration behavior, keep it in HDC.
