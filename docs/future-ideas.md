# Future ideas and enhancements

Candidates for discussion, not approved implementation, installed capabilities or execution policy. Read only when
reviewing future options; this document is not part of normal task startup. Current work belongs in the
[roadmap](roadmap.md), and current workflow rules remain in their canonical contract/profile/skills.

For each candidate, require a concrete source of friction and a bounded evaluation before adopting it. Compare
benefit with human attention, usage cost, maintenance, permissions and data exposure. Prefer a smaller existing
capability when sufficient. Adding an idea here does not authorize installation, model/provider changes, external
messages, publication, cloud access or changes to project policy.

## Shared team workspace — Hermes-inspired

**Sources:** Owner-supplied “Pipeline Observatory / ALOMAIR WORKS · HERMES” screenshot and team-chat description;
[Hermes Agent](https://github.com/NousResearch/hermes-agent) as a possible reference to evaluate. The screenshot's
relationship to that project is unverified, and the described video was not supplied. Do not assume their features,
subscription compatibility or implementation are the same.

**Potential benefit:** A shared task view with attributable assignments, actual worker responses, review findings,
diffs, verification evidence, and visible running/blocked/decision states. The owner could inspect or address a
specific worker while an orchestrator continues coordinating, or leave routine authorized work running unattended.
This could reduce manual session-export archaeology and dependence on coordinator summaries.

**Tradeoffs/prerequisites:** The useful part is evidence and intervention, not animated avatars. A UI must distinguish
real execution events from generated narration. Direct instructions that change scope must reach the coordinator
and affected participants; unrelated workers should not receive every message. Keep one mutation owner and current
decisions/artifacts authoritative. Runtime support for addressing, pause/resume, session continuity and permissions
must be demonstrated; Markdown alone cannot provide it. Validate allowed account/subscription integration before
assuming existing subscriptions can power the system.

**Revisit when:** Our workflow is reliable enough to evaluate whether retrieving evidence, monitoring unattended
work, or intervening in individual assignments remains a recurring cost. Start with a small evidence timeline/task
view if that solves the problem; do not build a full team platform merely for visual appeal.

### Shared discussion with targeted notifications

**Source:** Owner discussion following the Sol-plus-three-Luna branch review. That review used coordinator-relayed
exchanges; direct peer messaging and a shared discussion record were discussed, not exercised as a group-chat system.

**Candidate:** Keep one attributable discussion record with independent initial reviews, then targeted peer exchanges
on disputed findings. Notify one participant (`@Sol`), an explicit group (`@reviewers`), or all members of that
particular discussion (`@all`). Store the message once and point recipients to the relevant entry and evidence;
shared visibility need not broadcast every transcript to every context. These mentions are proposed interface
semantics, not currently implemented commands.

Distinguish **awareness-only** updates from **response-required** requests so an all-member notification does not
provoke redundant replies. Membership must be explicit and scoped; mentions do not grant source access, reassign
mutation ownership or authorize scope changes. Material owner changes must reach the coordinator and affected
participants, while unrelated/private task context remains isolated.

**Prerequisites/tradeoffs:** Demonstrate runtime delivery, waking/resuming idle recipients, attribution, artifact
revision identity and an unambiguous current decision. Avoid concurrent overwrites of the shared record, duplicate
requests and stale replies. Compare coordinator relay, direct exchange and a shared-record hybrid on finding quality,
misses, elapsed time and total usage including coordination. Direct messaging is not inherently cheaper or better.

**Revisit when:** Repeated paraphrasing loses nuance or coordination becomes a measurable burden. Start with a
small shared record plus targeted notifications; a new dashboard or always-on runtime is not required by this idea.

## Persistent event-driven coordination — DeepSeek Super-agent

**Sources:** [Exploring Super-agent Design: Towards a More Autonomous Agent System](https://x.com/DeepSeekHarness/status/2116857257245987236)
(full article supplied by the owner), and [official research prototype](https://github.com/deepseek-ai/dsh-superagent-prototype).
The article distinguishes proposed architecture from current product features. The public prototype is research
code, differs from the internal system, and does not implement every article idea. Claims below are the authors'
reported observations, not our benchmarks or verified behavior on our projects.

### Ideas worth evaluating

| Idea | Potential use for us | Tradeoff / prerequisite | Revisit trigger |
| --- | --- | --- | --- |
| Lightweight outer router and isolated task workers | Keep interaction responsive while several independent tasks run; each task worker could contain our existing planner/reviewer workflow | The router dispatches whole tasks and does not plan/implement them. It is not the same role as our current feature orchestrator. Needs real runtime scheduling and cross-task state | Several concurrent tasks become difficult to supervise through separate sessions |
| Event filtering and thread subscriptions | Filter known noise deterministically; deliver relevant follow-ups to the assignment that owns them without repeated model routing | Relevant context is not new authority. Handle cancellations, changed scope, ambiguous ownership and multiple subscribers without duplicate writers or uncontrolled broadcasts | Repeated manual routing of issue/PR/CI follow-ups is demonstrated |
| Inline/spill and linked recall | Keep concise current context with retrievable original evidence rather than loading histories wholesale | Summaries/IDs must retain material constraints and source authority. Retrieval must work; blind truncation can hide critical decisions. Our current source-first/file-first approach is a simpler starting point | Missing context or repetitive broad reads remain measurable problems after instruction trimming |
| Asynchronous execution and channel-appropriate communication | Accept steering while slow work runs; show concise results/decision requests with detailed artifacts accessible separately | Requires host support, cancellation/status handling and correct event delivery. A “started” notice is not completion. Do not impose the article's IM word cap on all outputs | Long operations or noisy progress make owner interaction difficult |
| Separate compute, persistent state and execution environments | A future cloud coordinator could retain task state while authorized work runs in the required local/toolchain environment | Remote endpoints expose private code and credentials; require scoped access, credential use without model visibility, reconnect/recovery behavior and explicit infrastructure authority. An online coordinator cannot use an offline device until it reconnects | Concrete cross-device or unavailable-workstation friction warrants the operational/security cost |
| External progress watchdog | Detect stalled work and repeated nonproductive attempts beyond simple process liveness | Must not create competing writers, retry indefinitely, broaden permissions or rewrite policy on its own. Model-based progress judgment has cost and false alarms | Long-running unattended tasks repeatedly stall in ways existing bounded recovery cannot handle |

### Important differences from the team-workspace idea

The article's workers report through the router and do not communicate directly with humans; workers may themselves
contain an agent team. That is a different interaction choice from the Hermes-inspired direct-worker workspace.
Evaluate those choices separately. Neither requires changing our current plan-author/reviewer allocation now.

### What the experiments do and do not show

The article reports synthetic scheduling tests: about 300 messages, about 20 work requests and five runs per design;
actual coding was replaced by a tool that consumes time. Reported completion p50/p95 was 12.4/15.7 minutes for
Super-agent, 20.4/29.5 for a neutral single-session prompt, and 13.8/29.0 for a delegation-first single-session prompt.
These are coordination/latency results, not evidence of better plans, code, reviews or model selection.

Reported cache-read usage was 23.2M tokens per Super-agent run versus 6.1M and 10.8M for the two single-session
variants. Disabling pass-through raised it to 31.8M without materially improving completion times. This illustrates a
latency/usage tradeoff; cache-read counts alone do not establish total tokens, monetary cost or subscription usage.
It does not answer whether three Luna reviewers outperform or cost less than one Sol reviewer.

**Recommendation:** Keep as an architectural reference. Adopt no always-on infrastructure, proactive external work,
remote daemons, automatic PR creation or watchdog policy mutation as a consequence of reading it. Revisit individual
mechanisms only when a real bottleneck justifies them; a single-session workflow may remain sufficient.

## Scoped reviewers versus one stronger reviewer

**Source:** Our instruction-trim review used three fresh-context Luna reviewers at requested extra-high effort,
a full-context reviewer and coordinator adjudication. It was not a controlled three-Luna-versus-Sol comparison.

**Potential benefit:** Distinct review scopes may improve coverage of omissions, contradictions, installation and
verification gaps while keeping each context bounded.

**Tradeoffs/prerequisites:** Same-model reviewers can share blind spots. Repeated input reading, reasoning, false
positives and adjudication add usage; lower per-token/model cost does not guarantee lower total usage or allowance.
Retain strong judgment for consequential architectural disputes until a comparable evaluation supports a change.

**Revisit when:** Enough representative tasks exist to compare valid findings, important misses, false positives,
wall time and measured total usage, including coordination, against one stronger reviewer. No default changed.

## Earlier integration candidates retained from the roadmap

Recovered from the former “Future upgrade review queue” at revision `8d5fe458ecd729a2ba3a16fedf1e647419b40af8`.
These remain unevaluated candidates, not current installations or an instruction to resume old setup work.

| Candidate | Potential benefit | Tradeoffs / prerequisites | Revisit trigger |
| --- | --- | --- | --- |
| Figma connector | Read selected designs, components and variables directly for design work | Approved frame scope, provenance and confidential design handling; verify actual connector capabilities | Design slides/manual extraction are a recurring bottleneck |
| SonarQube connector | Retrieve issues, hotspots and quality gates tied to the correct branch/revision | Findings require judgment; not automatic truth or a replacement for review. Use existing project access policy | Its findings are part of the actual development process |
| Ticket-tracker connector | Read approved requirements, acceptance criteria and attachments | Confirm which tracker is authoritative and restrict project/access scope; no implicit write permission | Manual ticket transfer loses important information or consumes material effort |
| Git-host/PR connector | Read diffs, checks and review threads with less copying | Verify repository/CLI/forge prerequisites and applicable authority before posting or changing anything | PR review handling remains a recurring source of friction |
| Official documentation lookup | Verify framework/library behavior against primary documentation | Source quality, version match and retrieval overhead; evaluate available tools before adding another | Current API uncertainty repeatedly blocks sound decisions |
| OpenCode plugin or command helpers | Improve route observability and guard material unintended substitutions | Preserve workflow authorization and approved automatic fallback; no new per-dispatch consent ceremony. No plugin build authorized | Concrete host integration failures recur after the current fixes |

Historical tool/model snapshots and expired priorities remain in Git rather than being promoted into this list.


## Future investment portfolio — new-project readiness and optional harness enjoyment

**Status:** Research backlog, not a committed roadmap, a skill trigger, or authorization to install/build anything. This section separates work needed by a genuinely new/complex project from lightweight personal enjoyment. It deliberately does not promote HDC migration-specific practices to portable policy.

**Decision rule:** Before a build, identify a concrete project/task and existing capability that does not already solve the problem. Prefer current skills, project-specific instructions, deterministic checks, and host features; only then evaluate a new skill/plugin. Treat model/harness capability claims as version-specific and unverified on the owner's machine until tried. For a corporate laptop, use local-only integrations and follow allowed software/data handling; remote/mobile and cloud-hosted coordination are not current selection criteria.

### A. Future projects: practical startup and engineering investments

These are **conditional modules in a new project's bootstrap**, not nine mandatory gates for every ticket. Existing \`task-context\`, feature design/LLD, QA scenarios, plan/review, security audit, API regression, test guard and closeout skills remain the starting point.

| Candidate skill/tool | New-project use case / failure it prevents | Smallest sensible first step | Revisit trigger |
| --- | --- | --- | --- |
| **Project inception / bootstrap checklist (skill candidate)** | A greenfield app begins coding before users, nonfunctional constraints, team access, deployment environment, data handling, and acceptance boundaries are decided | Reuse \`task-context\` and project policy to produce one lean scope/decision list; only package as a skill if repeated projects expose an actual gap | Next new app/repo starts |
| **Architecture and ADR starter** | Stack/database/auth hosting choices are made implicitly; later migration is expensive | Record consequential tradeoffs, trust boundaries and a few brief ADRs within existing design records; no mandatory architecture charter | New project has consequential technology or deployment choices |
| **Thin vertical slice / executable skeleton** | Frontend/backend/db/CI are scaffolded separately, then fail to integrate | Implement one representative user journey through real API/persistence with basic error handling before multiplying modules | Greenfield first delivery milestone |
| **API contract & compatibility checks** | UI and backend disagree about DTO shapes, error semantics, authorization or schema changes | Versioned OpenAPI or equivalent typed contract; targeted contract/smoke checks using existing frameworks | Multiple consumers or parallel FE/BE implementation |
| **Test strategy and fixtures by risk** | Missing role accounts, sample data, seed/reset flow, invalid-state and skipped-test handling leave false-green coverage | Make a slim per-project verification matrix: fast unit/in-process API, selected integration, authenticated browser/roles where appropriate; distinguish skipped from passed | Complex business behavior, authorization, or shared environment testing |
| **CI/CD and environment bootstrap** | Local checks pass but no reproducible build, secrets boundary, migration rehearsal or release path exists | Minimal CI for build/lint/unit plus project-approved deploy/release steps; keep real-environment acceptance separate | New repo is actively delivering, or PR traffic starts |
| **Security/privacy baseline** | Unclear roles, secrets storage, untrusted uploads, audit obligations, exposed endpoints, or vendor data routing | Targeted threat-model questions using existing security-audit skill and owner-approved controls; avoid adding a parallel compliance system | Personal data, external accounts, permissions or public deployment |
| **Observability and fault recovery baseline** | Debugging relies on screenshots and guesses when the first real user hits an error | Correlation IDs, safe structured errors, minimum health/diagnostic traces, rollback and backup responsibilities appropriate to stack | First production-like environment or complex async jobs |
| **UX state coverage / accessibility** | Designs omit empty/loading/error/disabled/focus/narrow-viewport states, leaving implementation guesses | Add a scoped design-state checklist to existing design work; visual/browser checks only for affected surfaces | New interactive UI or design-driven feature |
| **Dependency documentation lookup** | Framework versions or library APIs are guessed from stale training knowledge | Read version-matched official docs; evaluate Context7 only where retrieval is repeatedly useful and approved | New or frequently changing stack |

**What to borrow from the HDC lessons, without importing HDC policy:** preserve reachable UI/API behavior, use real role/identity and data-boundary tests when relevant, report skipped checks, distinguish local checks from live acceptance, avoid unnecessary abstractions, and discover missing UI states before coding. HDC already has substantial local frontend checks, backend/in-process API testing, DEV regression and synthetic browser coverage; do not build a replacement testing framework for it.

**External candidates to inspect, not install by default:**
- [Context7](https://github.com/upstash/context7): version-aware documentation lookup; check allowed network/data paths.
- [Agent Skills collection / project-scaffolding examples](https://github.com/arjunprabhulal/agent-skills): ideas for thin greenfield bootstrap, API design, test fixtures and deployment; do not wholesale import overlapping skills.
- [OpenCode GUI plugin API](https://opencode.ai/docs/build/plugins/gui/): possible local interactive project-onboarding or visual-plan helper. Compatibility depends on installed OpenCode version.
- [Plannotator](https://plannotator.ai/): interactive human review of substantial plans, only if markdown/chat review becomes an observed bottleneck.
- Figma, source-host, ticket-tracker and quality-gate connectors remain conditional on project authority and real integration need; see existing candidates below.

### B. Scoped workflow enhancements — defer until evidence warrants

| Investment | Actual benefit to demonstrate | Why not automatic now / next proof |
| --- | --- | --- |
| **Orchestration control center / external-delegation viewer** | In one ticket view, distinguish current stage, assigned worker, brief, actual result, evidence, blocked decision and correction trail, especially CLI workers not registered as native subagents | OpenCode already exposes native subagent sessions and many CLI sessions. Verify recurring navigation or missing-session friction first; don't build a chatroom showing models talking merely for appearance. A local API+relay-evidence view is feasible in concept, but GUI integration on the installed version is not yet built |
| **Focused multi-reviewer debate** | Resolve one consequential reviewer disagreement with attributed evidence and a final disposition without repeatedly paraphrasing to each reviewer | Existing \`plan-debate\` and review ownership semantics already support focused disagreement; same visible room does not mean shared model context or fewer tokens. Prototype only when actual back-and-forth consumes time or loses context |
| **PR/CI supervisor** | Detect new PR reviews, CI failures, stale checks, actionable changes and route to original owner; avoid manual PR polling | Current HDC PR/CI traffic is insufficient; GitHub \`gh\` CLI may be blocked on corporate host. Prefer approved forge API/connector or read-only script; no auto merge/deploy |
| **Acceptance evidence gap spotter** | Show one high-risk requirement with absent proof (e.g. server permission tested only by hidden UI button, or skipped role fixture mislabeled pass) | Existing unit/API/regression/browser checks are primary. Do not duplicate testing or impose universal additional gates. Revisit after a real missed requirement |
| **Capability-aware lane routing** | Avoid dispatching screenshot/browser/tool tasks to an integration that lacks those modalities despite model support | First finish improvement of Gemini provider plugin in the separate AI-plugins workstream, then assess actual remaining misroutes. Do not silently swap models |
| **Context/continuity diagnostics** | Expose stale references, missing approved decisions and repeated large event-log reads when it becomes a measurable issue | The portable contract already uses source-first, reference-oriented handoff and session continuation; no separate memory platform by default |
| **Flight recorder / blocker notifications** | Explain a failed workflow or bring a real human-required decision to attention without rereading dozens of threads | Existing relay evidence and OpenCode notices generally suffice. Remote/mobile is disallowed on the current managed laptop. Revisit only if real misses recur |
| **Creator Mode-style plugin developer experience** | Reduce time and effort from “I need a useful UI capability” to a supported, maintainable local plugin in OpenCode | ZadLoop creator experience is owner-proven; OpenCode GUI plugins exist but are experimental and version-dependent. Compare on a *needed* plugin, not a toy feature or speculative performance claim |

### C. Fun, personalization and personal organization — explicitly optional

Enjoyment and comfort are legitimate goals, even without measurable engineering throughput. Keep this lane separate from workflow correctness and from auto-loaded agent policy. Prefer low-risk, reversible visual changes. **OpenCode Desktop and TUI extension surfaces differ**; never label a terminal-only theme/HUD as Desktop-compatible without checking.

| Candidate | Experience / organization benefit | Example / important limitation |
| --- | --- | --- |
| **Color/theme packs and accent presets** | Make long sessions visually pleasant or easier on the eyes; perhaps separate visual identity for work versus experimentation | [Official OpenCode Desktop GUI themes](https://opencode.ai/docs/build/plugins/gui/) are documented; theme contribution appeared in v2.2.6, so verify an installed 2.2.5 host before expecting it. [Theme collections](https://github.com/awesome-opencode/awesome-opencode) include Ayu Dark, Lavi, Moonlight, Charcoal and light sets; many are **TUI** themes |
| **Small ambient sound packs** | Optional friendly tones on success, error, or waiting for user; different sounds per role if desired | [opencode-sfx](https://github.com/jimrubenstein/opencode-sfx) is an existing sound-pack concept, but its focus/OS/GUI behavior requires local verification. Keep muted by default, easy off, and compatible with office setting |
| **Tiny progress/status HUD** | At a glance: active role, elapsed task time, current tool, failure/idle, project/branch, token/context if trustworthy | [opencode-hud](https://github.com/ndom91/opencode-hud) and [opencode-activity](https://github.com/enzorenz/opencode-activity) demonstrate **TUI** functionality, not proof of a Desktop GUI widget; use GUI slots only when supported |
| **Session organizer / pinned workspaces** | Group sessions by current project/ticket, pin a few active sessions, quick-jump to worker and root; less scrolling and lost place | Prototype local-only when the built-in session list fails in daily use; preserve real project/session IDs, no automatic deletion of history |
| **Lightweight celebration or completion microinteraction** | Pleasant success animation, small confetti/character cameo on completing a truly finished task | ZadLoop's locally created floating character establishes feasibility there; an OpenCode desktop overlay with equivalent behavior is unverified. Do not interrupt editing or imply acceptance merely from model self-report |
| **Focus-friendly workspace preset** | Single-click compact layout: larger diff, hidden unused panels, calmer colors, less noise | Prefer native settings and saved workspace state first; custom plugin only if missing. No arbitrary split-screen feature race |
| **Personal project switchboard** | See only the few repos/work items the owner is currently using and jump to their workspaces | Avoid replicating a Jira tracker or pushing private project metadata to external services |

**Low-cost first experiments:** choose a theme/palette appropriate for the *actual installed Desktop version*, or a reversible sound/visual preset. For an organization feature, first check built-in pinned/session/project navigation. No installation is authorized by this backlog.

### D. Harness choice and portfolio checkpoints

- **OpenCode:** current practical baseline; the owner reports a satisfying real workflow and working AI Skills CLI relays, native subagent visibility, multiple model providers, free-model access and Claude login. A single-run Standard coding comparison showed a modest speed advantage over ZadLoop; not a universal causal result.
- **ZadLoop:** retains legitimate optional value in Creator Mode, easy plugin iteration, pleasant UX and native delegation lifecycle. Theoretical workflow routing and one real native delegation test were promising, but that run failed a final test with different worker models and an ignored-fixture visibility issue; no causal conclusion about transport quality. Current choice need not migrate.
- **T3 Code:** an interface/control layer over existing harnesses rather than a distinct model-execution harness. Revisit if local UX solves a concrete daily problem; unverified social-media claims of faster tokens/models do not justify a third benchmark. Remote/mobile value is blocked by present corporate-device restrictions.
- **Practical evaluation:** retain the existing workflow baseline; choose one real user pain or one fun customization to evaluate at a time. For new greenfield work, revisit A before scaffolding; for more active PR/CI, revisit B; for calmer/more enjoyable daily use, revisit C. Do not promote experimental ideas into defaults just by listing them here.

### Selected research pointers

- [Awesome OpenCode](https://github.com/awesome-opencode/awesome-opencode): curated plugins, themes and agent references; inspect maintenance and actual app compatibility.
- [OpenDock plugin index](https://www.opendock.net/): discovery directory, not a trust or compatibility certification.
- [OpenCode GUI extensions](https://opencode.ai/docs/build/plugins/gui/): experimental panels/commands/themes and version requirements.
- [OpenCode extensions changelog](https://opencode.ai/changelog?area=extensions%2Cdesktop): check whether a proposed Desktop feature exists in the installed version.
- [OpenCode SFX](https://github.com/jimrubenstein/opencode-sfx): optional sound effects.
- [OpenCode HUD](https://github.com/ndom91/opencode-hud) and [Activity](https://github.com/enzorenz/opencode-activity): reference TUI status interfaces, not automatic GUI compatibility.
- [Context7](https://github.com/upstash/context7), [Plannotator](https://plannotator.ai/) and [project-scaffolding skill examples](https://github.com/arjunprabhulal/agent-skills): inspect for a bounded greenfield use case, not wholesale installation.
