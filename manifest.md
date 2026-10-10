# Manifest — third-party skills

A commit is recorded only after that repo's scripts have been read. The copied repos below were read on
2026-09-25; the Pocock skills were read and pinned on 2026-09-25; Graphify was trialled on 2026-09-25 and not
adopted.

## Copied into `vendor/` (may be modified; updates merged in)
The base commit is where the copy was taken from. To update: compare upstream from the base commit to its latest,
merge the changes in keeping my additions, then record the new base.

| Skill(s) | Source | Base commit | Status | Role |
|---|---|---|---|---|
| delegate-skills (relays + `delegate-setup`) | https://github.com/amElnagdy/delegate-skills | `8ef02103` (updated 2026-10-09) | Keep — core | Model-agnostic implement layer. The vendored snapshot has no Gemini relay and remains unchanged. A separate local, unpublished `feature/gemini-delegate` contribution branch has passed one live Gemini CLI 0.62.0 dispatch in a disposable repo; the owner is deciding whether to propose it upstream. |
| review-skills: `babysit-pr` | https://github.com/amElnagdy/review-skills | `3cfce396` (updated 2026-10-09) | Keep — core | Copilot/review-thread loop. **Local change: asks before pushing or posting** (upstream pushed on its own) |
| review-skills: `debate-review` | same repo | same | Optional | Big tickets only. Needs delegate lanes `review-main` and `review-debate` |
| mattpocock/skills: `code-review` → **`two-axis-review`** | https://github.com/mattpocock/skills (MIT) | `49dd158d` (updated 2026-10-10) | Keep — local pre-push review | Standards axis (repo docs + Fowler smell baseline) + Spec axis (spec = the LLD: pass its path). **Local change: renamed** (clash with Claude Code's built-in `code-review`). Ignore its prompt to run `setup-matt-pocock-skills` |
| guard-skills: `clean-code-guard`, `test-guard`, `docs-guard` | https://github.com/amElnagdy/guard-skills | `ffa26036` (copied 2026-09-25) | Keep | Skip `wp-guard`, `woo-guard`. On ported legacy code: record findings, don't fix. No local changes |

Each copy has an `UPSTREAM.md` (base commit, review notes, local changes, how to take an update).

## Used unchanged (pinned; installed from source)
| Skill(s) | Source | Pinned commit | Status | Role |
|---|---|---|---|---|
| mattpocock/skills: `grill-with-docs` | https://github.com/mattpocock/skills (MIT) | `c55ee460` (held pending HDC docs audit) | Keep — big-ticket intake | A 1-line wrapper: calls `grilling` + `domain-modeling`. User-invoked only. **Run it from the docs folder, not a code repo:** `domain-modeling` writes `CONTEXT.md` and `docs/adr/` at the working root, with no setting to move them |
| mattpocock/skills: `grill-me` | same repo | `49dd158d` (2026-10-09; reviewed 2026-10-10) | Keep — small-ticket intake | A 1-line wrapper: calls `grilling`. User-invoked only |
| mattpocock/skills: `grilling` | same repo | `49dd158d` (2026-10-09; reviewed 2026-10-10) | Required by both grills | The actual interview: rounds of numbered questions, each with a recommended answer. Model-invoked |
| mattpocock/skills: `domain-modeling` | same repo | `c55ee460` (held pending HDC docs audit) | Required by `grill-with-docs` | Glossary (`CONTEXT.md`) + ADRs, created lazily. Model-invoked |
| mattpocock/skills: `code-review` | same repo | same | **Moved to `vendor/mattpocock/skills/` as `two-axis-review`** (2026-09-25) | Renamed because it clashed with Claude Code's built-in `code-review`. See the "Copied into `vendor/`" table above |
| mattpocock/skills: `handoff` | same repo | `49dd158d` (2026-10-09; reviewed 2026-10-10) | Worth a look | Session → brief for another agent, saved to the OS temp folder. User-invoked only |

The currently used Pocock skills are intentionally split across two reviewed pins. `grill-me`, `grilling`,
`handoff`, and the vendored `two-axis-review` have been reviewed against `49dd158d`. `grill-with-docs` and
`domain-modeling` remain pinned at `c55ee460` until the stable HDC documents snapshot is audited because
upstream renamed the glossary contract from `CONTEXT.md` / `CONTEXT-MAP.md` to `GLOSSARY.md` /
`GLOSSARY-MAP.md`. At the original `c55ee460` review, the six folders above were checked as `SKILL.md` + `agents/openai.yaml`, plus `domain-modeling`'s two format files; also, the repo's `README.md`, `LICENSE`, `.claude-plugin/plugin.json` and `.agents/` notes. **No
scripts** in any of the six. Not used: the Claude plugin (installs all 25 skills, including the dropped
`implement`, and auto-updates, so it can't be pinned) and `npx skills` (runs an npm package at install time).
Install is a plain copy from the exact per-skill pins above; `GUIDE.md` checks out each pin before copying its group.
Claude-only frontmatter (`disable-model-invocation`) is left as-is: other agents ignore it, so there the
wrappers can also be picked automatically.
| Graphify | https://github.com/Graphify-Labs/graphify (Apache-2.0) | Trialled at `4000de15` (v0.9.68, 2026-09-25); **not installed** | Trialled — not adopted | Java structure is right; **config-driven edges are missing** (no `@WebServlet`/`@Path` URLs, `withUrl` task targets, `cron.yaml`/`queue.yaml`/`dispatch.yaml`). See `docs/decisions.md` |
| Spec Kit | https://github.com/github/spec-kit | — | Postponed | One side-by-side trial vs grill + LLD before deciding |

## Team skills (company-internal; project-dependent)
From the team repo `gisacc_ai_tools` (internal GitHub). Not part of the portable setup: install them only in
projects that use the library they document.

| Skill | Documents | Status | Notes |
|---|---|---|---|
| `backend-utils` | `com.valeo.common.utils`, the team's Spring backend-template library (GCP, Workspace, Cloud Tasks, SQL, …; 56 reference files) | Install per project | Only for projects built on the backend template. HDC is not (legacy GAE + Jersey, no dependency on it) |
| `str-ui` | `@gisacc/str-ui`, the team's Angular component library, built on PrimeNG (table, header, dialogs, not-authorized/not-found, user card, pipes, Firebase) | Reference only | Confirmed 2026-09-25: no Artifactory access and no Angular 20 build. The skill documents a library we can't install, so it can't be used as-is. Its component APIs (e.g. the table's `tableConfig`/`columns`/`rowsData`) are useful as design input when building our own components |

The delegate/review/guard skills belong to my tech lead, who approved my using, modifying and keeping them.
