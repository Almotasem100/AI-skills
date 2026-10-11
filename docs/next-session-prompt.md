# Prompt to continue AI-skills work in a new chat or host

Start from the `AI-skills` repository.

1. Read `AGENTS.md`, `docs/orchestration-contract.md`, `docs/roadmap.md`, `README.md`, and only the task-specific
   skill/vendor files needed for the current request.
2. Inspect the current branch/status and available host capabilities before relying on a skill, lane or provider.
   Installation/catalog presence is not proof that a host actually loads or follows a skill.
3. Resume from repository state and the current task evidence. Do not demand a handoff or rebuild old chat history
   merely because this is a new conversation.
4. Use the smallest sufficient workflow. Simple local bugs may be analyzed/fixed directly; substantive work resolves
   the needed semantic roles through configured lanes.
5. Provider/model/effort are configuration. Do not ask the user to name them for routine work. Honor explicit
   routing/checkpoint overrides.
6. Distinguish structural checks from native host behavior and record only what was actually verified.
7. Do not commit, push, publish, deploy, install or change user-level configuration unless the current request or
   applicable project policy authorizes that effect.

For HDC work, do not copy HDC policy from this repository. Read the canonical HDC `README.md` and Development Plan
§0a; those documents map the portable workflow onto Jira/CodeBeamer, DEV/ACP/PROD, architecture and migration gates.
