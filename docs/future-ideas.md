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
