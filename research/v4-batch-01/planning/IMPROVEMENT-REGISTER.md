# V4 improvement register — AI-skills (planning only)

See [harness-engineering and skills/testing follow-up](HARNESS-RESEARCH-FOLLOWUP.md) for researched incremental enhancements, source limits, and deferred MCP/plugin choices. No implementation or installations are authorized by that log.

See [five-article audit and executor queue](FIVE-ARTICLE-AUDIT.md) for source-based recommendations, concrete candidate deltas, non-duplicates, reviewer pushback rules, and new external discovery. This register preserves the broader V3 baseline; the linked audit is the actionable research handoff.

> **Authority / safety:** This is a research decision register, **not** a live workflow rule, approved implementation plan, or instruction to install/execute anything. The canonical source remains `instructions/orchestration-contract.md`; project-specific rules stay in their project. Keep V3 production files unchanged pending an explicit owner decision. Do not activate the optional AI Skills delegation profile by reading this record.
>
> This record preserves both historical V3 architecture feedback and external V4 opportunities. A candidate is **not** a defect or an approved change.

## How to use this register with a separate implementing/reviewing model

- Planner (ChatGPT/user) proposes and compares ideas. Owner approves, rejects, defers or approves only a **specific part** of each proposal. Only **Approved for implementation** entries authorize a subsequent implementation handoff, and still obey repository/project change permissions.
- Executor/reviewer (Luna or another model) **first audits canonical current code and external primary source**, evaluates benefits and contradictions, compares a simpler alternative and writes a **challenge**: agree, propose narrower change, propose larger change with rationale, reject as duplicate, or block for missing evidence. Return the challenge to the planner/owner **before any materially different design or authority boundary is implemented**.
- An executor must not implement unapproved candidate entries merely because they are in this file; nor blindly obey an approved sketch if new evidence contradicts it. Record finding, citations, impact, smallest alternative and unresolved decision. Routine details within an approved scope can be executed without another interview.
- Each source entry moves through `Not fully audited → Assessed → Proposed (whole/part/none) → Owner decision (approve part / approve whole / reject / defer) → Challenged by executor → Implemented and verified`. No implicit promotion or merging.
- Preserve primary-source versus hypothesis versus synthetic-test evidence. No duplicated instructions or recurring date/changelog section in production files.
- Feedback loop: a real defect or friction pattern may inform a candidate, but first reconcile against `docs/friction-log.md`, archived records, existing skills, and the current baseline to avoid duplicate fixes.
- **No harness bake-off.** The user has already tested OpenCode/ZadLoop and does not want another comparison absent a specific workflow benefit.

## A. V3 architecture assessment — preserve or investigate

| ID | Disposition | Current evidence / important distinction | Possible next research action |
| --- | --- | --- | --- |
| W-01 | **Preserve** | Full Feature / Change-Bug routes are outcome obligations, not rigid file/model/stage sequence (`instructions/orchestration-contract.md`, Core model / Full Feature). V3's successful real end-to-end execution is a user-observed baseline, not an instruction defect. | Keep current semantics; establish regression expectations before any future change. |
| W-02 | **Preserve** | Capability replacement checks inputs/outputs, authority, prerequisites, evidence and reviewer separation (`§Replacing a capability`). | Do not invent a replacement framework unless a real integration cannot satisfy these boundaries. |
| W-03 | **Preserve** | Source hierarchy, owner decisions, one mutation owner, independent reviewer and correction ownership (`§Evidence and authority`, `§Review and ownership`). | Protect these invariants across any new optional capability. |
| W-04 | **Preserve** | Evidence-based completion, risk-selected verification, differentiated local/deployed/API/PR evidence already exist (`§Verification`, `§Outcome completion`). | Assess effectiveness before adding more policy text. |
| W-05 | **Preserve** | Existing project artifacts, working-state continuity and delegated fallback rules. Optional AI Skills delegation mode requires explicit session selection. | Do not rebuild state machinery or auto-activate optional mode. |
| W-06 | **Candidate / evidence needed** | Multi-request Change/Bug work may have higher coordination cost than one Full Feature; one user-observed ticket had roughly ten requests and inconsistent follow-up. No causal diagnosis; no conclusion that V3 failed. Contract already requires tracking outcomes. | Explore adaptive decomposition/coverage reconciliation in an existing plan/scratchpad, **not** an automatic new mandatory file or `outcome-coverage` skill. Compare against existing behavior and friction fixes first. |
| W-07 | **Candidate / evidence needed** | Ticket/project-scoped optional capabilities can be represented with current work records. Batch 01 synthetic fixtures passed, but did not prove live selection or acceptance. | Look for concrete task where conversational, temporary override becomes ambiguous. Prefer a small existing-record example over a registry. |
| W-08 | **Candidate / evidence needed** | Model/delegation quota may constrain completion; deterministic actions do not need costly model judgment (`§Roles versus workflow actions`). Batch 01 did not measure tokens/cost or execution-quality difference. | Research least-cost-sufficient delegation: suitability, independent work, context-transfer cost, quota, fallback, verification ownership. Avoid a second routing system. |
| W-09 | **Candidate / evidence needed** | Correct verification *selection* and strength of runtime evidence are not established by policy. GUI/browser check can be high overhead. | Investigate a replaceable verification-strategy method that selects highest-value checks/authorized low-cost executors while preserving actual acceptance evidence; avoid duplicated Test Guard. |
| W-10 | **Candidate / evidence needed** | Native discovery and skill/route availability vary by environment. `instructions/cli-dispatch.md` already distinguishes fleet resolution from live capability. | Only add lightweight discovery/compatibility documentation if a real workflow misses or misroutes a capability. |
| W-11 | **Preserve / evaluate later** | Scratchpad/active-work locations belong to each project, not the universal workflow. No proof that a global multi-project state layer is needed. | Respect per-project concurrency/worktree practices; revisit only on a real cross-project coordination requirement. |
| W-12 | **Candidate / evidence needed** | Friction logs and synthetic benchmark fixtures exist; Batch 01 verified representability, not live orchestrator effectiveness. | Convert selected real workflow failures into replayable **workflow** acceptance cases; measure outcome completeness and corrections, not host winners. |
| W-13 | **Defer** | Dedicated autonomous daemon, fourth orchestration repo, mandatory machine-readable capability catalog and host-specific universal framework are not justified by current evidence, and corporate authority may block external actions. | Reopen only with a demonstrated unmet capability and a feasible permission model. |

## B. External-source review queue — no automatic implementation approvals

Each entry is a **source-derived theme or planning hypothesis**, not a commitment to adopt. When we discuss the source with the owner, append the **exact approved portion** and the rejected/deferred remainder to its decision field; do not translate an article's whole architecture into the repo.

| ID | Source | Research proposal (not decision) | V3 overlap / challenge | Decision |
| --- | --- | --- | --- | --- |
| R-01 | Anthropic, [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) | Evaluate routing, orchestrator-workers, evaluator-optimizer and **adaptive orchestration when complexity warrants**. | V3 already separates workflows, roles and outcome guards; avoid adding agents/loops for simple work. | **Owner decision: adopt owner-controlled workflow + flexible within-workflow execution; partial evidence-driven loops; research improvements inside existing skills. No new modes/skills. Executor challenge before edits.** |
| R-02 | Anthropic, [Multi-Agent Research System](https://www.anthropic.com/research/multi-agent-research-system) | Evaluate bounded specialist objectives, context-isolated delegation and resource-aware parallel work. | Research-agent gains do not automatically transfer to coupled coding; V3 already has role separation and fallback. | **Owner decision: artifact-first ADOPT, outcome contracts PARTIAL, quota economy ADOPT within selected mode, recovery PRESERVE. Challenge existing coverage; avoid new model routes.** |
| R-03 | Claude Code team, [How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/) | Evaluate end-to-end / differential / property-based proof and independently meaningful verification. | V3 has acceptance, regression proof, independent code review; find missing techniques, not duplicate policy. | **Audited; targeted existing-review/test improvements queued for independent challenge in linked audit; no new global gate approved.** |
| R-04 | Marmelab, [The State of AI Harness Engineering 2026](https://marmelab.com/blog/2026/09/24/the-state-of-ai-harness-engineering-2026.html) | Evaluate context/harness design, light observability, failure-based evals, tool selection and maintenance cost. | Most existing harness comparisons are not actionable for this user; focus on workflow quality, not choosing OpenCode vs ZadLoop. | **Audited; minimal skill-eval/control cases queued for executor challenge.** |
| R-05 | Calvin Grunewald, [A Look Inside the Factory](https://thebuildingmachine.com/p/a-look-inside-the-factory) | Inspect actual factory layering, long-running operation, environmental constraints, credentials/authority and what can be borrowed without daemon infrastructure. | Corporate restrictions and owner's trust threshold argue against an autonomous runtime as a default. Do not infer uninspected implementation internals. | **Indexed article analyzed; adopt compact blocked-decision handoff where genuinely missing, reject daemon/auto-merge for now.** |

## C. Challenge protocol / decision record

For each proposed item, the implementation reviewer must answer:
1. **Baseline:** Is the capability or rule already implemented? Cite the exact current instruction/skill/test and revision.
2. **Claim:** What does the primary article/repository actually show, and what is merely our inference? If inaccessible, mark unverified.
3. **Fit:** Does the proposal improve outcome quality, developer control, extensibility or resource use? What is the simplest alternative, and what would it cost/complicate?
4. **Contradiction:** Could it violate project authority, optional delegation-mode activation, source confidentiality, reviewer independence, or quality evidence?
5. **Decision request:** Accept, narrow, expand, reject as redundant, or defer, with evidence and a smallest viable implementation sketch (files and projected lines) **only for an item the owner has chosen to pursue**.
6. **After explicit approval:** implement in owning repo and run relevant checks. Report changed files/lines, results and remaining uncertainty; do not merge or publish externally without applicable authorization.

**Reserved owner decisions:** R-01 and R-02 architectural principles have been settled with the owner; implementation remains conditional on current-code audit and independent challenge. R-03 through R-05 contain research-branch candidate deltas in the linked audit, not permission for deployment, merge, extra mandatory gates, or installed configuration changes. Only consequential new gates / owner notifications require an explicit choice.

## Evidence and links
- Existing synthetic experiment: `research/v4-batch-01/results/CONSOLIDATED.md`, `composition-results.md`, `cost-and-risk.md`.
- Live V3 feedback and reconciled fixes: `docs/friction-log.md`, `docs/records/`.
- Related records in sibling research branches: `HDC-documents/research/v4-batch-01/planning/IMPROVEMENT-REGISTER.md` and `AI-plugins/research/v4-batch-01/planning/IMPROVEMENT-REGISTER.md`.
- Benchmark fixtures are evidence tooling, not a fourth workflow/policy owner.
