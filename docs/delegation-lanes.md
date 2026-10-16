# Delegation lane roles (portable semantics)

This catalog documents the **intended semantic responsibilities**, not live workstation configuration. A lane is a configurable execution route for a specialist responsibility; the skill defines the process. Do not lock model, provider, effort, promotional availability or fallback to a stable role name. The selected conversational model (Luna in the current user's preferred setup) coordinates the workflow; it need not perform every specialist task.

Seven lane names below were reported from the current workstation; `draft-feature-design` is a **proposed eighth lane** pending local configuration and verification. No repo edit here installs, renames or validates a local lane. Not every task uses every lane.

| Lane | Responsibility | Workflow use / boundary |
| --- | --- | --- |
| `draft-feature-design` *(proposed)* | Draft feature-level LLD and, when required, Functional Design using `create-lld` | After optional `task-context` and before implementation planning; design specialist verifies consequential facts against authorized sources. Does not write the implementation plan. |
| `draft-functional-docs` | Draft or update business-facing functional documentation | Use for standalone or maintenance functional-document work; **do not automatically run alongside** `draft-feature-design` to produce a duplicate Functional Design. The design lane owns combined feature design when selected. |
| `write-plan` | Author feature implementation plan | Uses task context plus approved design when present; defines delivery slices, dependencies, sequencing and verification. Separate planning stage; not a mandatory new context synthesis. |
| `challenge-plan` | Independent adversarial challenge of a draft plan | Reviewer for single-pass `plan-review` **or** challenger in `plan-debate`. Same lane may serve either skill. No automatic double review or self-review by plan author. |
| `challenge-complex-plan` | Conditional additional high-stakes/complex-plan challenge | An alternative or supplementary independent reviewer only when justified by risk, material uncertainty or explicit request; not mandatory with `challenge-plan`. |
| `write-qa-scenarios` *(proposed rename of `write-test-cases`)* | Specify tester-facing feature behavior through `qa-scenarios` | Uses approved requirements and Functional Design where available; does **not** implement or execute automated tests. Rename only after checking all local consumers. |
| `write-api-regression-tests` | Author executable API regression tests | During relevant implementation/verification slices; tests must be checked/run through deterministic actions when authorized. Distinct from QA scenarios. |
| `implement-code` | Bounded code implementation | Uses approved plan and scoped source; one mutation owner per change, with deterministic checks and independent review when warranted. |

## Typical adaptive feature path

1. Orchestrator collects/clarifies evidence; optionally creates one feature `task-context` working synthesis (not a project-of-record specification).
2. `draft-feature-design` invokes `create-lld` from task context and primary evidence; produces feature LLD and Functional Design when required. Existing `draft-functional-docs` handles separate functional-document updates rather than duplicate feature deliverables.
3. `write-plan` creates the implementation plan from task context plus design. A separate stage does not require a new lane or a replay of all source evidence.
4. `challenge-plan` invokes `plan-review` for one-shot independent findings **or** participates as challenger in `plan-debate` with the plan author. `challenge-complex-plan` is optional escalation. Simple tasks may skip debate, and both reviews are not mandatory in sequence.
5. `write-qa-scenarios` prepares feature QA behavior when useful; `implement-code` owns bounded code changes; `write-api-regression-tests` authors executable regression checks as relevant. Deterministic verification is an action, not a separate agent role.

## File-first handoff, review output and local lifecycle

When files are accessible, dispatch only objective, input paths, scope/source permissions, output location and acceptance checks; do not re-transmit a full blueprint or conversation. Delegates must verify important claims against relevant original sources. If the environment cannot read those paths, use a minimal approved excerpt or copy. Be explicit about the requested artifact and its mutation owner.

`plan-review` returns concise findings directly by default. For substantial reviews or multi-model comparisons it may produce **one designated temporary Markdown findings artifact** under the skill's output-only restrictions; in strict read-only mode, the orchestrator writes the artifact from the reviewer's returned findings. `plan-debate` uses one temporary debate record and attributed exchanges, not the normal compact scratchpad.

This catalog does not set any host/provider/model/variant. Update it when a lane's **role or lifecycle meaning** changes, not when a model rotates. Local lane additions/renames require checking relay support, aliases/consumers, host/model availability, privacy authorization, and bounded synthetic smoke behavior before promotion. A reproducible secret-free lane profile and fresh-clone installation remains a tracked future deliverable.
