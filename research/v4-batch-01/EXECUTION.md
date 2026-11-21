# V4 Batch 01 — Portable capability composition experiment

**Status:** research-only experiment. This is NOT a change to canonical policy or an activation of AI Skills delegation mode. This document is an experiment instruction for Luna, not an AGENTS.md override. Base: master; execute on `research/v4-composability-batch-01`.

## Objective
Produce **new, demonstrated evidence**, not another prose-only architecture audit: Can the current V3 workflow represent optional/replaced engineering outcomes for one ticket, one project and globally without breaking guaranteed review, authority and completion semantics? Test portability, coverage and limitations before proposing V4 architecture.

## Existing authority and constraints
Read `AGENTS.md`, `docs/roadmap.md`, `instructions/orchestration-contract.md`, and relevant existing `test/` suites. The shared contract is canonical. Do NOT modify canonical instructions, skills, vendored skills, install paths, fleet configuration, CI, or `master`. Research work belongs under `research/v4-batch-01/` only. Do not load `instructions/ai-skills-delegation.md` unless the human explicitly selects AI Skills delegation mode in that session. Luna's use of an already-configured native Gemini subagent does **not** imply activating that mode.

## Work package (execute as one batch)
S1. **Baseline and invariant extraction.** Record master SHA, research-branch SHA and whether research branch initially matched master. Check working-tree status before changes. Identify source sections for required outcomes, legitimate omissions, source/authority precedence, independent review, approval, working-state continuity and acceptance. Do not reinterpret policy based on the test's desired result.

S2. **Three runnable composition fixtures** (synthetic, entirely under research directory):
- F1: ticket-scoped visual verification for a frontend task, with fixed accepted requirements, run conditions, evidence and explicit expiry at ticket completion. Verify a backend-only task does NOT trigger it.
- F2: replace a security-audit implementation with a hypothetical scanner+reviewer. Supply one **compatible** candidate (same input/output, read-only authority, traceable evidence, limitations) and one **incompatible** candidate (e.g. only a scan summary with missing scope/evidence or unsafe mutation). The replacement must be rejected or marked blocked without weakening the contract.
- F3: new project-scoped CI gate, independent of a particular tool and applied only where the project requires it; include a case with unavailable corporate PR publication, distinguishing prepared PR from opened PR.

Write deterministic fixture specifications and an executable **Node built-in `node:test`** checker for any objectively testable properties (scope inheritance and precedence, explicit omission boundaries, required evidence fields, refusal on incompatible security output, acceptance state). Test code must be dependency-free and not install software. DO NOT invent artificial pass criteria where a human/model judgement is required; record those as review-only.

S3. **Cross-implementation comparison.** Map each fixture onto existing V3 surfaces: contract, skill, project policy, task scratchpad and host capability. Identify the MINIMUM configuration required for each; show if a second authoritative rule or a new framework would actually be needed. If not needed, explicitly recommend no change.

S4. **One native-model reasoning smoke test where safely possible.** Ask the already-installed Gemini subagent to independently classify fixture applicability and compatibility from the fixture inputs, WITHOUT showing expected answers; compare with deterministic baseline and source. Mark unavailable / permissions / unverified honestly. One run only; no repetitive retries or paying for other models.

S5. **Cross-repo synthesis.** Read HDC and AI-plugins sibling branch instructions and their produced results if already available. Do not block local work waiting for other repositories. Record agreed invariants, differences, assumptions, limitations and implications for V4.

## Deliverables
Under `research/v4-batch-01/results/`:
- `baseline.md`: SHA, exact sources, relevant invariants and discovered overlap.
- `fixtures/` + executable tests and how to run.
- `composition-results.md`: scenario-by-scenario actual result versus expectation, pass/fail/blocked/unverified, evidence pointers, compatibility decision, minimal changes.
- `cost-and-risk.md`: observed model calls (not guessed tokens), deterministic execution cost and security boundaries.
- `handoff.md`: maximum 1 page for researcher: demonstrated capability, real gaps, decision options, no premature architecture proposal.

## Verification and limits
Run pre-existing `npm test` once (after reading what it executes), run fixture suite, and `git diff --check`. Use only locally accessible/synthetic sources; never transmit company data or credentials to personal GitHub or external services. Do not install, deploy, publish, merge or change host settings. Use one mutation owner per repo. Commit and push only research paths to the research branch if allowed. Report exact commands, exit codes, SHA, and any block. Explicitly distinguish *test assertions*, *model report*, and *runtime evidence*.

## Stop condition
All five work packages attempted and classified, relevant tests run or blocked with reasons, one cohesive report pushed. Don't loop indefinitely to chase green results; don't modify canonical V3 files to make research tests pass.
