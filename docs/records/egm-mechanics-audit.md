# EGM review mechanics and workflow modularity audit

## Scope, authority and evidence

The owner authorized a new branch from current master, the proposed comprehension/scoped-drift additions, and a
mechanism-level audit of overlapping behavior. The owner also authorized a four-reviewer debate, compatible
corrections and merge once ready. Installation, provider changes and a wholesale EGM migration remain outside
this task. Branch: `improve/egm-review-mechanics`.

Inspected baselines:
- AI-skills: `a2d11db98cb0df40809ba7ac3c1b55413143a092`.
- Google EGM: `72d06f52a2482885d9a64bd24b291c6e8628942c`.
- Pinned Pocock interview: `49dd158d1076134a641b33efb035946536778336`, actual paths
  `skills/productivity/grilling/SKILL.md` and `skills/engineering/grill-with-docs/SKILL.md`.

This is source inspection, not a controlled comparison of delivered code quality. Descriptions, prompts, adapter
configuration, verifiers, recorded trials and current execution are different evidence levels. Google hosting
does not establish that every mechanism is better or that a claimed host behavior applies to this workstation.
No third-party code, plugin or persona was installed or copied into vendor. The additions are first-party
instructions informed by the compared mechanisms, not an EGM runtime port.

The execution host is available for final validation. The repository Node suites passed 47/47 on this branch;
that is separate from hosted instruction exercises, installed-file checks, native OpenCode trials and
company-project acceptance. Those evidence classes and remaining limits are recorded below.

## Sources inspected

AI-skills owns workflow policy in [the contract](../../instructions/orchestration-contract.md), participant/transport selection in
the optional profile, semantic responsibilities in its catalog, and process in individual skills. Relevant sources:
- `skills/plan-review/SKILL.md`, `skills/plan-debate/SKILL.md`, `skills/create-lld/SKILL.md`,
  `skills/task-context/SKILL.md`, `skills/work-closeout/SKILL.md`.
- `docs/ai-skills-delegation.md`, `docs/delegation-lanes.md`, `docs/cli-dispatch.md`.
- `vendor/amElnagdy/guard-skills/skills/docs-guard/SKILL.md`,
  `vendor/mattpocock/skills/skills/two-axis-review/SKILL.md`.
- `test/workflow-separation.test.mjs`, `test/native-smoke/full-scenario.mjs`,
  `test/native-smoke/selection-continuity.md`, `test/native-smoke/operator-scenarios.md`, README/GUIDE/manifest.

EGM source links below are pinned to the inspected revision, not moving main:
- [Review driver](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/skills/egm-review/SKILL.md),
  [loop](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/skills/egm-review-loop/SKILL.md),
  [resolver](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/skills/egm-resolve/SKILL.md).
- [Comprehension persona](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/agents/comprehension.md),
  `agents/design_critic.md`, `agents/codebase_details.md`, `agents/implementation_readiness.md`,
  `resources/document_standards/zoom-out-standard.md` and `implementation-readiness-standard.md`.
- `skills/egm-draft/SKILL.md`, `skills/egm-drift-report/SKILL.md`, `resources/execution_instructions.md`,
  `docs/codex.md`, `docs/harnesses.md`, `TESTING.md`.
- [OpenCode V1 installer](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/adapters/opencode/install.py),
  [guide](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/docs/opencode.md),
  [trace verifier](https://github.com/google/elephant-goldfish-model/blob/72d06f52a2482885d9a64bd24b291c6e8628942c/tests/integration/opencode_trace_verifier.py)
  and `.claude-plugin/agents/comprehension.md`.

The optional profile/catalog were inspected as the subject of this audit; that does not activate their execution mode.

## Mechanism comparison and dispositions

### A1 — Clarification is an interview, not a comprehension test

The pinned grilling engine maintains a dependency frontier of design questions, asks numbered questions with
recommended answers, sends factual discovery to a worker, and waits for consequential owner decisions.
The wrapper adds domain-modeling. That is concrete process, not merely a slogan.

EGM authoring similarly explores and records intent, but its later Goldfish review tests what a new reader can
recover from the result. An effective interview can still leave a crucial answer only in conversation.
**Decision:** retain the pinned interview unchanged. Test transfer of the written result separately inside the
existing technical-design/plan review, not with a second grilling ritual.

### A2 — Fresh context has different specified guarantees

Our prior contract prohibited persuasive framing, and the profile favored source access/delta briefs, but the
initial independent review did not explicitly exclude the parent transcript or prior verdicts. A distinct
participant/session alone is not evidence of blind review.

EGM `docs/codex.md` explicitly requests fresh parent-turn context, selected source paths, no private reasoning,
and actual required reads/completion. The guide separately notes inherited instructions, filesystem and memory.
EGM requires a fresh subagent and stops when that capability is unavailable; our portable default uses supported
fresh context and discloses limits, with a specifically required blind check incomplete without established freshness.
**Decision:** make initial independent-review context selection explicit in the shared contract. Keep supported
same-reviewer correction rechecks; do not recreate all reviewers on every minor edit. Report freshness as
unverified when it cannot be established; a specifically required blind check remains incomplete.
This is an instruction improvement, not a new transport implementation or isolation proof.

### A3 — Reconstruction is an observable output, not a request to “understand”

Our plan-review identified scope and assumptions but did not require the reviewer to demonstrate its interpretation.
EGM's comprehension persona requires a paraphrase of the proposal and current system before findings. Stage 6
of the EGM driver uses the document alone, unlike other stages' additional reading lists; the persona also checks
definitions/links. This can expose coherent-looking text whose interactions are not understandable.

**Decision:** substantial plan/design reviews first reconstruct the target and declared references, record gaps,
then verify against separate authoritative sources. Preserve that initial reading instead of repairing it silently
from chat. A mistaken paraphrase is investigated, not automatically blamed on the author. Small reviews can show
understanding through the finding itself. The method deliberately permits declared references so recipient
documents need not repeat the entire project. No extra mandatory worker/report is added.

### A4 — Separate lenses are more operational than a generic “review thoroughly”

EGM supplies distinct reviewer personas and rubrics for comprehension, design criticism, codebase details, readiness
and simplicity. Our skill contained relevant questions together, without selectable focus definitions.
**Decision:** add a small on-demand review-lenses reference and selectable focus within plan-review. It supports
forward technical designs without requiring implementation-plan details in the wrong artifact. Questions can be
replaced independently; no fixed fan-out, model roster or extra stage is imposed.

### A5 — Readiness standards intentionally differ

EGM's readiness standard requires zero independent design choices and exact target-file boundaries, with phases
that remain buildable. Our contract requires material choices and modification surfaces to be sufficiently settled,
but retains implementer judgment for routine choices and evidence-backed plan revisions.

**Decision:** adopt precise actionability questions, existing/proposed distinction and observable verification.
Do not adopt a universal zero-decision rule, every-future-file inventory or a promise of correct first-pass code.
These are different operating choices, not equivalent readiness implementations.

### A6 — Rechecking a moving artifact needs current inputs

EGM's loop re-reads semantic target ranges each round; its second zoom-out stage examines complexity introduced
during earlier reviews. Our policy asked for material rechecks but left these mechanics implicit.
**Decision:** plan-review re-reads changed current sections, keeps finding identity across rounds, and checks new
scope/complexity/contradictions introduced by remedies. Stable section/symbol locators can replace fragile lines.
No mandatory extra zoom-out worker is needed.

### A7 — Resolution and stopping rules are not interchangeable

EGM's resolver uses CONTEST/ESCALATE/PROPOSE FIX/DECLINE with checkable evidence; its loop treats contested or
accepted-risk findings as settled and uses two consecutive clean rounds, a five-round cap and churn handling.
It has explicit human resolution/turn gates. Our author owns revisions, a first reasoned material disagreement
starts focused debate, and an unresolved consequential finding cannot be closed unilaterally or by vote.

**Decision:** preserve our authority/debate model and evidence-driven stopping. Carry stable issues/responses and
reopen a failed correction when necessary. Do not import a fixed round count or silently bypass EGM gates while
claiming its unmodified engine ran. Rejected findings reopen on new evidence, not reviewer churn alone.

### A8 — Completed/read review evidence is more specific in EGM

EGM's Codex guide distinguishes launched from completed reviewers and missing required reads from a clean review.
The experimental V1 trace verifier is executable: it checks parent/child identity, completed task state, time windows,
successful nonempty reads at caller-supplied paths and matching child-final/parent-result text. It explicitly does
not prove whole-file coverage, authenticity, isolation or runtime enforcement.

Our feature verifier pins fixture inputs and checks code acceptance, but explicitly leaves routing/artifacts/
lifecycle as `workflowAssessment: needs-review`; the profile asks for invocation/result evidence. These are useful
checks of different things, not a source-level equivalent of that trace verifier.
**Decision:** strengthen generic review acceptance with actual completion/material-input evidence and honest
observed-versus-reported status. Do not port a V1-specific parser to the owner's V2 host without a demonstrated need
and real schema. No missing result becomes “zero findings”; unavailable traces alone do not prove a failed review.

### A9 — Read-only instructions and enforced tool limits differ by host

EGM's generic personas say reviewers have no write/compile tools. That text cannot remove tools. The Claude adapter
actually declares a tool allowlist and `omitClaudeMd`; host enforcement still needs its own evidence. The experimental
OpenCode installer generates explicit deny/allow rules and an approved bundle-directory exception. It is more
concrete host configuration than a named plan agent; the guide still warns about configuration merges and isolation.

Our profile already discloses effective permissions and avoids equating a plan agent with containment.
**Decision:** retain that honest portable boundary. Do not install experimental permissions, weaken project
requirements, or claim equivalent enforcement. If the task requires containment, verified suitable support is
needed; that is separate from the document method.

### A10 — Scoped drift is partly covered, but authority triage is a distinct gap

Our docs-guard already verifies current symbols/examples/claims against implementation. Closeout reconciles changed
durable facts, and two-axis-review compares a code diff to spec/standards. None of those should be relabeled absent.

EGM drift walks supplied documents and code, looking for missing behavior/models, shortcuts and architectural
differences; it also treats undocumented logic as drift. That broader scan can confuse an approved future plan,
an obsolete name or a deferral with a current defect if used without document-status triage.
**Decision:** add optional `document-drift-review` for bounded baseline selection, approved-intent/current-source
comparison, difference classification, owner/next-action suggestions and incomplete coverage. Reuse any installed
documentation-accuracy guard for detailed current-contract checks; do not copy its entire checklist or require it.
No periodic scan, fixed report filename, automatic correction or whole-repo documentation mandate.

### A11 — Artifact structure is a boundary, not a quality ranking

EGM drafting builds a combined design and detailed implementation specification section by section with explicit
approval gates; review discovers feature/detail ranges. Our workflow separates customer FD, architect-facing forward
LLD and execution plan, with project-specific names. Our intake and scratchpad serve separate continuity needs.

**Decision:** preserve recipient-specific outputs. EGM's full draft/review engine is not a drop-in replacement:
caller mapping must handle its combined artifact, runtime resources and gates without erasing project obligations.
A focused review method can be substituted without replacing every artifact.

### A12 — OpenCode compatibility is narrower than “has an adapter”

Correction to the earlier high-level answer: the inspected EGM tree contains an experimental OpenCode adapter,
not an absence of OpenCode integration work. Its guide targets V1 `1.18.29`, Python/POSIX symlinks and V1
`task`/`permission` interfaces, explicitly excluding V2 `subagent`/`permissions`. Live workflows and isolation
support remain pending. A scripted local-model probe is not a live-model end-to-end trial.

**Decision:** do not install it on the owner's reported OpenCode V2 setup. Portable review-method improvements do
not require that adapter. Tool availability and fresh session creation must be established for the actual selected
route; no automatic native-route preference or Gemini configuration change is part of this branch.

### A13 — Bootstrap and drift are optional, not missing mandatory factory stages

EGM includes a recursive README bootstrap. Our project already has designated architecture, intent and code sources.
Documentation maps may help a new unfamiliar codebase, but a complete file-by-file narrative is not necessary to
perform this review task and may increase maintenance.
**Decision:** no bootstrap import, documentation-tree rewrite or automatic source-summary trust. Revisit only for
a concrete onboarding/navigation problem.

## Modularity audit — source-level substitution exercises

These are inspected call-boundary mappings, not executed host replacements.

| Replacement | Inputs/output and authority check | Result |
| --- | --- | --- |
| Change a plan-review focus/rubric | Same target, source constraints, read-only findings and author disposition; separate lens reference changes process, not workflow outcomes | Compatible at source level; no profile/model change required |
| Use EGM's comprehension method inside an existing review | Target plus declared references, short reconstruction, then original-source verification; no extra mandatory artifact | Compatible adapted method; do not claim the full EGM pipeline ran |
| Replace a configured reviewer implementation | Preserve required outcome, source/privacy restrictions, output findings and author/reviewer separation; route/config readiness belongs to selected execution policy | Caller mapping supported; actual dispatch parity remains unverified |
| Replace create-lld with unmodified egm-draft | Combined design/plan, referenced agents/resources, section approvals and files differ from recipient/project contracts | Not drop-in; needs explicit boundary adaptation or a separate adoption decision |
| Run scoped drift independently of delivery | Named docs/source baseline, report-only result, no automatic mutation or closeout | Compatible standalone capability; no new mandatory route |

**Layer conclusion:** no demonstrated need for a new orchestrator/runtime or wholesale layer redesign. The contract,
participant profile, responsibility catalog, process skills and transport already have separable source owners.
However, those boundaries had a weak *replacement acceptance* description: a matching capability name was not
enough to show preserved inputs/outputs/gates/evidence. A small contract section now makes that check explicit.

A native EGM V1 installation or a monolithic artifact cannot be assumed interchangeable with an existing role.
Treat any future inability to map a concrete replacement as a separate compatibility/layering finding, with actual
consumers and the smallest remedy. Do not infer runtime pluggability from the source separation alone.

## Smallest implementation and verification boundary

Changed source owners:
- Shared contract: initial review context, completion evidence and capability-replacement boundaries.
- Existing plan-review: brief reconstruction, optional focuses and revision-aware findings/rechecks.
- One optional document-drift skill: approved-baseline triage and bounded report-only comparison.
- README/GUIDE: discoverability and installation source list; roadmap: current status/remaining verification.
- Manual reviewer cases: natural tasks with a separate evaluator rubric, not a new application fixture.

No vendor/pinned skills, model settings, plugin code, project policy or default stage order changed.
No EGM library, scripts or native adapter became a dependency. Existing QA-before-planning and explicit closeout
rules remain intact. The smaller alternative of only adding a paraphrase sentence would miss the source-confirmed
completion/read, moving-artifact recheck and drift-baseline gaps; the chosen additions retain those without a new
multi-stage review engine.

## Validation and remaining limits

### Source-content checks actually performed

In hosted JavaScript orchestration, checked candidate skill frontmatter/name-to-folder consistency, local
Markdown link resolution against the candidate repository tree, the shared contract's execution-vocabulary
separation, new-skill installation-list presence, no new trailing whitespace, preservation of all nine default
outcomes and unchanged global/profile/catalog/vendor/overlay/pin surfaces. These are content checks, not Node
repository tests or native skill-loading checks.

### Hosted instruction exercises

Two fresh-context workers were given only the exact candidate skill URL and natural task/raw synthetic materials,
not this audit, evaluator rubric, intended findings or parent conversation. Candidate:
`ad722bae7ef6a421ad982873542ceb72f2bed058`. Their results were inspected against
[test/native-smoke/review-mechanics.md](../../test/native-smoke/review-mechanics.md).

- **Task A, plan/design review:** the worker reconstructed the proposed archive behavior, identified the unspecified
  reference policy and unverified archive/restore contract, did not infer hard deletion from DELETE, and did not
  demand an exhaustive implementation plan in a forward design. It distinguished concerns/unsupported assertions
  from observed contradictions and returned incomplete readiness with source limits.
- **Task B, document drift:** the worker identified stale pagination and client naming against the approved decision,
  respected proposed/deferred export, and left server authorization incomplete without inferring enforcement or a
  vulnerability from the client. It returned useful partial findings with overall incomplete comparison.
- Workers reported reading the exact skills (and the plan-review lens reference) through GitHub. Parent-visible
  results verify returned content, not a full independent trace of every child read. No child was asked to edit,
  execute application tests, install anything or create another worker.
- These are synthetic, hosted instruction applications, not two different harness installations or a comparative
  quality benchmark against EGM. Cases C/D are retained evaluator tasks; no native execution is claimed.
- Final wording corrects findings routing to the actual artifact author for designs and keeps any optional
  documentation-accuracy guard within the read-only boundary. No executable code changed.

### Final source validation and independent debate

Ran `node --test test/*.test.mjs test/native-smoke/*.test.mjs` in the branch checkout: **47 passed, 0 failed,
0 skipped**. `git diff --check` passed. These are current source-suite results, not inherited historical totals.

One SOL 6.1 and three Luna reviewers independently inspected the branch, repository rules, pinned EGM originals
and original article before exchanging dispositions. All four returned completed reviews with no substantive
source blocker. Their source access is supported by returned review evidence and reported reads, not a complete
independent trace of every tool action. The following optional suggestions were explicitly dispositioned:

| Question | Disposition and reason |
| --- | --- |
| Require finding IDs on every initial one-shot report? | Retain conditional stable labels and identity continuity across rounds; compulsory initial bookkeeping adds no demonstrated benefit for tiny reviews. Mechanics reviewer agreed. |
| Add another rejected-alternatives instruction? | Existing consequential rationale, author dispositions and working-evidence rules cover it; SOL confirmed against current sources. No extra recipient-document section. |
| Import combined FD/LLD/plan, zero-choice readiness, fixed clean rounds or section approval gates? | Preserve existing artifact audiences, routine coding discretion and evidence-backed convergence; reviewers confirmed these are intentional differences, not missing equivalent mechanics. |
| Install the experimental EGM adapter? | No; its pinned V1 host/configuration boundary is separate from these portable method improvements. |

Reviewers agreed the remaining correction was evidence/status wording; no additional process or runtime was
warranted. The audit now explicitly distinguishes EGM's strict fresh-subagent requirement from our portable default.

### Remaining limits and workstation refresh

Native host execution, installed-file parity, manual cases C/D and a controlled complete EGM-versus-current-workflow
feature comparison remain unrun. Source readiness does not establish installed behavior or comparative quality.

The owner's previous installation uses copied skills. After pulling merged master, refresh the entire
`skills/plan-review/` folder (including `references/`), add `skills/document-drift-review/` in the active skill
locations, and refresh the installed `orchestration-contract.md` companion. Preserve local customizations and
use normal skill reload/fresh-session mechanisms. No plugin, provider, permissions, fleet, relay, global template
or execution-profile setting changed; no EGM installation or new runtime dependency is required.
