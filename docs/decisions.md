# Decisions (2026-09-25)

Reached in an open design discussion. Project-specific history stays in the project that produced it; this file
keeps only what applies everywhere.

## Principles
- **Model-agnostic.** No fixed roles or model pinning. Implementation must work with whichever CLI is available
  (Codex, Gemini/Antigravity, GLM, DeepSeek, Claude…).
- **Portable.** One personal repo, installed once per machine. Company and project specifics (LLD template,
  Sonar URL, hard rules) live in each project's config, not in skill text.
- **Portable building blocks only:** `SKILL.md`, `AGENTS.md`, MCP, plain scripts, git hooks.
- **Git is the failsafe.** A pre-commit hook warns about new files; the diff review is where they get approved.
- **Standards through linters** plus a short conventions file, not framework MCP servers.
- **Humans stay at the gates:** LLD approval, design decisions, push, merge. The implementer never commits.

## Two tracks
- **Small ticket:** grill-me → implement → guards → review → PR. No LLD by default.
- **Big ticket:** grill-with-docs → LLD → plan → slices → the same tail.
- **The LLD skill can be called on any ticket:** forward (description + customer slides + code → LLD) or retro
  (finished diff + ticket → LLD).
- **Ticket input:** a short tracker description plus a customer PPTX/PDF. Slides are converted to text (e.g.
  `markitdown`); slide screenshots are accepted too.
- **Designs:** screenshots plus CSS copied from the design tool. No design-tool connector assumed.

## describe-pr (design source: `PR-Description-Automation-Design.md`, 2026-09-25)
Adopted: D2 (AI writes the *what*, the developer the *why*), D3 (context rebuilt from git every run), D4
(templates own the format), D9 (`[NEEDS INPUT]`, never invented), D10 (nothing created without approval), D11
(Node); the story/bugfix/hotfix templates, sizing rule, file-path signals, JSON contract and the two verbatim
exemplars. Amended:
- **Skill first, CLI later.** The design's D6 (per-field loop in a CLI, headless model call) is deferred: in a
  skill the agent drafts everything once and asks at most 4 confirmation questions in one message. The CLI
  needs headless, per-vendor model access, which is the lock-in this setup avoids. Revisit only if the skill
  proves too slow.
- **The deterministic core comes first:** `context.mjs` (branch, base, log/stat/diff, exclusions, redaction,
  budget, signals) and `render.mjs`. The CLI would reuse them, so nothing is wasted.
- **Redaction is best-effort in agent mode** (the agent can open files itself); it is a guarantee only in
  headless mode.
- **Branch naming, CI checks, release mode and rollout are team policy**, proposed to the team as
  `pr-standard.md`, not built into the skill. The skill must handle branches without a ticket ID by asking.
- **Title format A:** `type(scope): imperative summary [#internalId]`.
- **Ticket input is pasted.** The internal ticket system and Jira are closed; no agent access.
- **Conventions go in `AGENTS.md`, not `GEMINI.md`.**
- **The design-doc input is the local LLD section** produced by `create-lld`, which removes the design's
  Google-Docs problem (its §8.4 v2 is not needed).

## create-lld (2026-09-25)
The team's existing LLDs follow four different styles, with no rationale, alternatives, risks, verification or
rollback. The approved template (`skills/create-lld/templates/lld-section.md`) keeps the team header and the DC
"objectives & constraints" style, uses the layered backend/frontend order, and adds context with evidence, a
key-decisions table (alternatives + why), impact & risks, a verification plan, rollout & rollback, and open
questions. Header: `[<JIRA-ID>][<Type>] <Title> · Internal ticket: #<id>`. Every statement names the class,
endpoint or table it touches. It scales with the ticket. Its verification plan feeds the PR's testing section,
and its decisions feed the PR's reviewer notes.

## Team repo (`gisacc_ai_tools`, reviewed 2026-09-25)
Two Gemini-oriented skills: `backend-utils` (the team's Spring backend-template library; not used by HDC) and
`str-ui` (the team's PrimeNG-based Angular library; no Artifactory access and no Angular 20 build, so reference
only, useful as design input for a shared table). Its `portal/config/tools.yaml` contains a hardcoded internal
GitHub token; the owner should revoke it. Never copy that file.

## Kept / dropped
| Skill | Verdict | Why |
|---|---|---|
| create-lld (mine) | Keep — core | Forward + retro |
| describe-pr (mine) | Keep — core | End of every ticket |
| delegate-skills | Keep — core (copied into `vendor/`, base commit recorded) | Model-agnostic implement layer; relay never commits |
| grill-with-docs | Keep | Big-ticket intake; forces decisions into the open, records ADRs + glossary |
| grill-me | Keep | Small-ticket intake |
| guard-skills (clean-code, test, docs) | Keep | Post-implementation checks |
| mattpocock code-review | Keep | Local review on two axes: standards, and spec (the LLD) |
| babysit-pr | Keep | Review-thread loop; ask before push |
| Graphify | Trialled 2026-09-25 — not adopted | Correct Java structure, but none of the config-driven links (see below) |
| debate-review | Optional | Big tickets only |
| security review | Optional | Occasional |
| handoff | Worth a look | Brief for another agent |
| Spec Kit | Postponed | Competes with grill + LLD + plan; decide by one trial. Borrow its task breakdown, converge step, constitution |
| Superpowers | Drop | Makes its workflows mandatory via a session-start hook; would take over the pipeline |
| mattpocock implement | Drop | Auto-commits, TDD-driven; delegate covers implementing |
| find-skills | Drop | Agent installs skills mid-task: supply-chain risk |
| teach | Drop | Personal learning tool, not workflow |

## Graphify trial (2026-09-25)
**Question:** can a generated code map replace re-reading a large legacy backend, including the links that live
in config rather than code (servlet URLs, cron jobs, task queues, dispatch routes)?

**How it was run:** Graphify `4000de15` (v0.9.68) installed from the reviewed source into a throwaway venv in the
session scratchpad; `graphify extract <copy> --code-only --out <scratchpad>` on a **copy** of the HDC backend's
`HDC/src` + `dispatch.yaml` (255 `.java` files). Offline, no LLM. Nothing written to the repo or any agent config.
Review before running was targeted (install path, extract path, network, subprocess, output location), not the
whole ~99k lines.

**Result:** 9 s, 2,934 nodes, 10,269 edges (imports, calls, inheritance, methods). Checked against the source:
- Right: `UserResource` imports `UserDirectoryImpl`; `UserResource` is the only subclass of `BaseResource`
  (`grep "extends BaseResource"` agrees); servlet classes show their methods and the DAOs/services they use.
- Missing, as the code predicted: no node for any URL. `HDCEndpoint` enqueues `/taskqueues/exportHDCRules`
  (`HDCEndpoint.java:4786`) and `exportHDCRules` serves it (`@WebServlet`, `exportHDCRules.java:32`): **no edge**.
  Same for `HDCDeveloperEndpoint` → `KPIDailyCalculation`. `@Path("/users")` on `UserResource`: not captured.
  `cron.yaml`, `queue.yaml`, `dispatch.yaml` are classed as docs and skipped in code-only mode; `.xml` other
  than `pom.xml` is not read at all.

**Verdict:** not adopted. The part it gets right, an IDE and `grep` already give; the part this project needs
(URL ↔ handler ↔ scheduler/queue) it doesn't do. **Recommended instead:** a small Node script, no dependencies,
that extracts `@WebServlet` `urlPatterns`, `@Path`, `TaskOptions...withUrl(...)`, `cron.yaml`, `queue.yaml` and
`dispatch.yaml` into one table, extending `HDC_Endpoint_Migration_Triage.tsv`. Generated from source, so it
can't go stale. Not built; needs the owner's go-ahead.

## URL map replaces Graphify (2026-09-26)
Designed with the owner through `grill-me` (spec: `tools/url-map/SPEC.md`), built as `tools/url-map/`
(Node, no dependencies, generic; project values in a config file next to the output). Key choices: a new
**generated** file instead of extending the hand-classified triage TSV (a generator would erase hand work);
text parsing with every unresolved item listed, never guessed; problems reported, not only mapped
(`NO_HANDLER`, `EXCLUDED_FROM_BUILD`, `AUTH_BYPASS_SUBSTRING`, …); refreshed by hand after each ported slice,
no hook. Verified against grep counts, known facts and `check-citations.mjs`; reviewed with `two-axis-review`.

## Every delegated run names its model and effort (2026-09-26)
After six Codex test runs silently used the expensive default (`gpt-6-astra`, ~175k tokens), the owner's rule
is: any run handed to another CLI names the model **and** effort (Codex: `gpt-6-luna` simple, `gpt-6-sol`
hard). Documented in `GUIDE.md` §4; lanes in `delegate-setup` should pin both.

## `grill-with-docs` and `handoff` after real use (2026-09-26)
- **`grill-with-docs` stays big-ticket only.** It's `grill-me` plus glossary/ADR upkeep, which pays off only
  when a ticket adds or changes domain terms. When a project already keeps a decision log (HDC:
  `HDC_Architecture_Decisions.md`), decisions go there, not into a second `docs/adr/`. Name the output folder
  in the command.
- **`handoff` kept, alongside `session-closeout`, not instead of it.** Closeout records what happened and
  queues doc updates; handoff briefs one specific next task. Its output lands in the OS temp folder, so copy it
  into the project's sessions folder when it must survive.
