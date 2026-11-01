# Delegation lane roles (portable semantics)

**Activation guard:** Read/apply this catalog only after the user explicitly selects **AI Skills delegation mode**.
The entrypoint is [ai-skills-delegation.md](ai-skills-delegation.md).

This catalog documents the **intended semantic responsibilities**, not live workstation configuration. In explicitly activated AI Skills delegation mode, a lane is a configurable execution route for a specialist responsibility; the skill defines the process. Do not lock model, provider, effort, promotional availability or fallback to a stable role name. The orchestrator coordinates, authors the implementation plan and verifies outcomes; specialists own the other assigned deliverables, including separate plan review.

The lane names below describe semantic responsibilities, not a claim about any workstation's live configuration. Local lane additions and renames must be configured and verified separately. Not every task uses every lane. Verify the actual lane inventory before declaring a role missing. An explicit owner selection of a different available route is a task-scoped override, not a rename or redefinition of the lane's semantic role.

| Lane | Responsibility | Workflow use / boundary |
| --- | --- | --- |
| `draft-feature-design` | Draft feature-level LLD and, when required, Functional Design using `create-lld` | After optional `task-context` and before implementation planning; design specialist verifies consequential facts against authorized sources. Does not write the implementation plan. |
| `draft-functional-docs` | Draft or update business-facing functional documentation | Use for standalone or maintenance functional-document work; **do not automatically run alongside** `draft-feature-design` to produce a duplicate Functional Design. The design lane owns combined feature design when selected. |
| `write-plan` | Author an implementation plan when explicitly assigned by the user | Not dispatched for default plan authorship: the orchestrator writes it. Retained for explicit planning assignments; uses original requirements, applicable design and QA to define slices, dependencies and verification. |
| `challenge-plan` | Separate evidence-backed challenge of a draft plan | Default reviewer for substantive orchestrator-authored plans via `plan-review`, unless explicitly omitted or inapplicable. May instead be the challenger in a requested/warranted `plan-debate`; do not stack both automatically or use the author as reviewer. |
| `challenge-complex-plan` | Conditional additional high-stakes/complex-plan challenge | An alternative or supplementary independent reviewer only when justified by risk, material uncertainty or explicit request; not mandatory with `challenge-plan`. |
| `write-qa-scenarios` | Specify tester-facing feature behavior through `qa-scenarios` | Uses approved requirements and Functional Design where available; does **not** implement or execute automated tests. It is distinct from executable unit and API regression tests. |
| `write-api-regression-tests` | Author executable API regression tests | During relevant implementation/verification slices; tests must be checked/run through deterministic actions when authorized. Distinct from QA scenarios. |
| `implement-code` | Bounded code implementation | Uses approved plan and scoped source; one mutation owner per change, with deterministic checks and independent review when warranted. |
| `review-code` | Separate technical code review | Checks actual diff, requirements and verification evidence; returns attributable findings to the implementer for disposition, corrections and recheck. Must not be the author reviewing its own change. |

In this optional profile, configured lanes run through installed CLI delegation skills. Role ownership and
acceptance checks do not change with a model rotation. Approved accounts and effective permissions remain controlling.

## Role-to-capability mapping

A semantic lane identifies **who owns an outcome**, not an immutable skill name. At dispatch, discover the currently available appropriate skill(s) or equivalent approved capability for the role, communicate the expected output, applicable canonical project policy paths and evidence checks, and verify activation/execution rather than assuming installation. A replaced or renamed skill should not require a change to the Full Feature contract. Do not pretend a missing skill or guard ran; follow the approved routing/recovery boundaries.

## Typical adaptive feature path

1. Orchestrator collects/clarifies evidence; when useful, preserves one feature `task-context` intake-first record of original sources, scope, consequential Q&A/decisions and open questions. Narrow sourced observations are leads to verify, not a preselected solution; no mandatory extra synthesis or project-of-record specification.
2. `draft-feature-design` invokes `create-lld` from task context and primary evidence; produces feature LLD and Functional Design when required. Existing `draft-functional-docs` handles separate functional-document updates rather than duplicate feature deliverables. Verify both requested feature designs before dependent planning; later revisions require checking affected companion artifacts, not automatically rewriting them.
3. `write-qa-scenarios` prepares feature-level QA scenarios once behavior is sufficiently settled, before implementation planning by default. Report unresolved behavior rather than invent it.
4. The orchestrator authors the implementation plan from original requirements, scenarios, applicable approved design and engineering conventions, applying the shared **Planning convergence** guidance. Optional task context supports navigation; it does not replace source inspection. Do not dispatch `write-plan` merely because the lane exists; it is for explicit user-assigned external authorship. In that exception, the external author owns plan revisions and findings disposition; the orchestrator coordinates acceptance.
5. For substantive plans, dispatch a separate `challenge-plan` reviewer using `plan-review` guidance, unless explicitly omitted or inapplicable under project policy. The plan author owns revisions and evidence-backed findings disposition; the reviewer checks affected material revisions before the plan is called ready. `plan-debate` structures requested or materially warranted exchanges with the same author/reviewer roles; `challenge-complex-plan` is additional escalation, not an automatic extra review. Self-review does not satisfy separate review, and a new session alone does not guarantee freedom from bias. A missing review route follows recovery below; it does not authorize self-acceptance.
If planning reveals a consequential unresolved owner decision or invalid approved premise, pause only the affected planning work, route the issue to targeted clarification, reconcile relevant context/design, and resume. A plan is ready for implementation when material requirements and design decisions are resolved and the work is authorized; a technically complete plan may still have an identified approval pending. New components or architecture may be planned when justified, while routine technical discretion remains with the implementer. Route review findings to the plan author for reasoned disposition rather than mechanically applying them.

6. `implement-code` owns bounded code changes; `write-api-regression-tests` authors executable regression checks as relevant. Production/test-code guards and relevant project conventions apply to the change and to review, independently of whether they were named in the plan. Deterministic verification is an action, not a separate agent role. Track required feature outcomes (including applicable design, QA and review) to verified acceptance or explicit omission, not merely relay completion.

## Routing fallback and assignment lifecycle

Resolve the configured specialist route first. A missing/failed route warrants diagnosis; in interactive work, request owner direction before unapproved substitution. Only explicit unattended-continuation authorization permits a suitable configured default route as fallback, preserving task scope, independent-review requirements and project gates. Do not automatically equate a default model with a qualified reviewer or silently reconfigure lanes.

Keep a specialist's bounded assignment open through its required review, findings disposition, corrections and acceptance. Reuse a valid child session when the selected CLI relay supports continuation, otherwise restart the same semantic role from authoritative artifacts. Do not require idle child processes to remain alive or generate a permanent session ledger.

## File-first handoff, review output and local lifecycle

When files are accessible, dispatch only objective, input paths, scope/source permissions, output location and acceptance checks; do not re-transmit a full blueprint or conversation. Delegates must verify important claims against relevant original sources. If the environment cannot read those paths, use a minimal approved excerpt or copy. Be explicit about the requested artifact and its mutation owner.

`plan-review` returns concise findings directly by default. For substantial reviews or multi-model comparisons it may produce **one designated temporary Markdown findings artifact** under the skill's output-only restrictions; in strict read-only mode, the orchestrator writes the artifact from the reviewer's returned findings. `plan-debate` uses one temporary debate record and attributed exchanges, not the normal compact scratchpad.

This catalog does not set any host/provider/model/variant. Update it when a lane's **role or lifecycle meaning** changes, not when a model rotates. Local lane additions/renames require checking installed relay support, aliases/consumers, host/model availability, privacy authorization, and bounded synthetic smoke behavior before promotion. A reproducible secret-free lane profile and fresh-clone installation remains a tracked future deliverable.
