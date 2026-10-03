# AI-skills — agent instructions

This repository contains the owner's model-agnostic setup for AI-assisted development: original skills in
`skills/`, reviewed third-party copies in `vendor/`, unchanged pinned skills listed in `manifest.md`, tools,
templates, and installation guidance.

## Start here

Before planning or changing this repository, read:

1. `docs/roadmap.md` for the current status, checkpoint, next steps, and open decisions.
2. `README.md` for the skill authoring rules and repository layout.
3. `docs/decisions.md` for the reasoning behind the setup.

The roadmap currently marks v1 as frozen until it is installed and used on real work. Respect that checkpoint:
do not resume parked builds or trials on your own. A change the owner explicitly requests, or a fix grounded in
real use, can proceed; record setup changes in the roadmap at the end of the session.

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
  additional actions outside that scope. For HDC backend work, also follow the exact-file approval rule below.
- **Close out setup changes.** When a session changes this setup, update `docs/roadmap.md` with the relevant
  status, next step, or open decision. Do not change the roadmap just to record a read-only review.

## Working with the owner

Keep replies short and conversational: give the recommendation and its main tradeoff. Never invent facts about
the owner's projects, tools, or environment. If a needed fact cannot be established from the repository or
available evidence, say so or ask. Report what was tested in concrete terms; for example, running a script on a
sample repo does not establish that the skill was tested natively in Gemini CLI.

## HDC/PDC/TDC project work

Most of this repository is generic. When a task concerns HDC/PDC/TDC modernization, first read the
canonical sibling workspace's `../HDC/HDC-documents/README.md`, then
`../HDC/HDC-documents/HDC_Modernization_Development_Plan.md` §0a. Locate the equivalent canonical
checkout on another machine; do not use the old laptop's legacy documents mirror or assume its paths exist.

Apply these project rules:

- Do not add a file to the `cb379_hdc_pdc` backend repository until the owner approves the exact file list.
- Port legacy logic verbatim except for the canonical project's explicitly approved exceptions; raise other design choices before implementation.
- Keep code movement and behavior fixes in separate changes.
- Do not deploy; the owner executes releases. Follow the canonical runbook's separate dev/ACP targets and current ACP timing. Prod remains out of scope until migration completion and its specific readiness checks.
