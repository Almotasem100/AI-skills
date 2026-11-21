# V4 Research Batch 01 — consolidated results

**Status:** research-only; no V3 policy or production behavior changed. The four research branches were fetched and their `research/v4-batch-01/EXECUTION.md` files read before work. Results and fixtures are linked below. This is not a proposal to activate AI Skills delegation mode.

## Executive result

The synthetic cases show that current V3 composition surfaces can represent optional/ticket-scoped work, project-specific gates, and a compatible capability replacement without weakening required outcomes, evidence, independent review, authority, or acceptance. HDC's one-active-feature working record remains a deliberate project boundary. No second global rule or new framework was needed.

The strongest limitation is real runtime evidence: no visual browser, corporate CI, PR service, security scanner, live Gemini host/provider, or GUI harness was used. Synthetic checks prove only their encoded predicates. The benchmark's WMIC-dependent existing tests are blocked on this machine because `wmic.exe` is absent.

## Repository baselines and branch links

| Repository | Research branch starting SHA | Integration baseline / merge base | Results |
|---|---|---|---|
| [AI-skills](https://github.com/Almotasem100/AI-skills/tree/research/v4-composability-batch-01) | `d16fa040591daee78238f888f93133f4d5297135` | `master` `2af86ec293c85c29a56c7f8a7d753f84bd38f374` | [Baseline](baseline.md), [composition](composition-results.md), [cost/risk](cost-and-risk.md), [handoff](handoff.md) |
| [HDC-documents](https://github.com/Almotasem100/HDC-documents/tree/research/v4-composability-batch-01) | `c375c0bd8b38f26d1315b43ef8b2193b984c4f00` | `master` `011c07fbf7808cf6e7e5ceb44ae1fa3f423e87c4` | [HDC scenarios](https://github.com/Almotasem100/HDC-documents/blob/research/v4-composability-batch-01/research/v4-batch-01/results/hdc-scenarios.md), [boundary report](https://github.com/Almotasem100/HDC-documents/blob/research/v4-composability-batch-01/research/v4-batch-01/results/hdc-boundary-report.md) |
| [AI-plugins](https://github.com/Almotasem100/AI-plugins/tree/research/v4-composability-batch-01) | `8ecc9127b613117e1a5150a19a56131ee5939981` | `master` `b39cf68e7d902b5aebcf72b11c61affeb2ab4c76` | [Provider capabilities](https://github.com/Almotasem100/AI-plugins/blob/research/v4-composability-batch-01/research/v4-batch-01/results/provider-capabilities.md), [routes](https://github.com/Almotasem100/AI-plugins/blob/research/v4-composability-batch-01/research/v4-batch-01/results/synthetic-route-fixtures.md), [verification](https://github.com/Almotasem100/AI-plugins/blob/research/v4-composability-batch-01/research/v4-batch-01/results/verification.md), [cost/security](https://github.com/Almotasem100/AI-plugins/blob/research/v4-composability-batch-01/research/v4-batch-01/results/cost-security-findings.md) |
| [ai-harness-benchmarks](https://github.com/Almotasem100/ai-harness-benchmarks/tree/research/v4-composability-batch-01) | `a893441967943de4e62ab9e0b09527ec77990b48` | `main` `56fa5c39afd7041f036da6313a213802c14b801d` | [Benchmark report](https://github.com/Almotasem100/ai-harness-benchmarks/blob/research/v4-composability-batch-01/research/v4-batch-01/results/benchmark-report.md), [fixture guide](https://github.com/Almotasem100/ai-harness-benchmarks/blob/research/v4-composability-batch-01/research/v4-batch-01/fixtures/README.md) |

Each starting research tip was based directly on its integration baseline; its only initial delta was the experiment instruction file. All edits were confined to `research/v4-batch-01/` on the research branches.

## Actual checks

| Repository | Command | Observed result |
|---|---|---|
| AI-skills | `npm test` | Exit 0; **51 passed, 0 failed**. This runs the documented offline/source/native-smoke suites; it did not make a live provider call. |
| AI-skills | `node --test research/v4-batch-01/fixtures/composition.test.mjs` | Final **4/4 passed**. An initial run 3/4 failed because a fixture labeled an unspecified approval omission “not applicable”; the fixture was corrected and the focused suite rerun. |
| HDC-documents | `node --test test/workflow-policy.test.mjs` | Exit 0; **6/6 passed**. |
| HDC-documents | `node --test research/v4-batch-01/fixtures/scoped-capabilities.test.mjs` | Final **5/5 passed**. Earlier authoring runs exposed a property-access typo (3/4) and an optional-visual expected-state mismatch (4/5); both were corrected and the final test rerun. |
| AI-plugins | `npm test` | Exit 0; all six package checks passed. OpenCode Gemini provider reported **46 passed**; ZadLoop Gemini provider reported **44 passed**. These use offline fake-process/protocol tests. |
| AI-plugins | `node --test research/v4-batch-01/fixtures/route-cases.test.mjs` | Exit 0; **4/4 passed**. |
| ai-harness-benchmarks | `node --test benchmark/tests/*.test.cjs` | Exit 1; **11 passed, 2 failed**. Process detection and synthetic process sampling failed with `wmic.exe` unavailable / `spawnSync wmic.exe ENOENT`. This matches the documented WMIC prerequisite; no environment change or retry was made. |
| ai-harness-benchmarks | `node --test research/v4-batch-01/fixtures/v4-reproducibility.test.cjs` | Final **6/6 passed**. Actual reset → acceptance → new reset → acceptance verified identical fixture hash/source bytes and no implementation carryover. Temporary IDs `run-0fe4c1f1-3e30-45db-908d-874e1e915218` and `run-2b367726-94e4-4847-8157-fbb8384a276d` were cleaned with the existing owner-checked cleanup command. |

The two initial focused-fixture failures were corrected and the final focused tests passed. No existing full suite was rerun beyond the single requested run.

## Cross-repository findings

1. **Scope is composable with existing records.** Exact ticket scope and expiry fit ticket acceptance/task context; project gates fit project-owned policy. Global requirements remain global.
2. **Substitution is outcome-based.** A compatible read-only independent reviewer can preserve the security-audit contract; a summary without scope/revision/evidence/limitations, or with auto-fix authority, is rejected. This was structural fixture evaluation, not a real scan.
3. **Evidence states remain separate.** Local check, remote CI, prepared PR text, and published PR are not interchangeable. Missing mandatory verification leaves acceptance blocked/incomplete.
4. **HDC boundaries are preserved.** One active HDC feature record is intentional; other projects keep independent records. The hypothetical project CI case is not current HDC policy: Plan §3b F2 says Jenkins remains a follow-up and no on-push CI exists.
5. **Provider capability is not permission enforcement.** Both Gemini CLI provider integrations document YOLO native tool loops outside host approval UI. Neither implements a production host-controlled tool bridge; a host transcript or synthetic route assertion is not proof of one.
6. **Quota-aware routing remains qualitative.** Deterministic tooling handled exact predicates. One bounded native Gemini subagent call handled synthetic classification. Token count, price, remaining quota, and latency were not available; no cost or quality superiority is claimed.
7. **Benchmark reproducibility works at the existing fixture boundary.** Existing reset creates new owned runs and preserves the template; WMIC/process-tree sampling remains unavailable here. No live harness comparisons were attempted.

## Gemini native reasoning smoke test

One Gemini native subagent call classified only synthetic cases without being given the expected answers. It agreed on ticket isolation, rejection of the unsafe security substitute, and blocked CI/publication. Its output overread ticket completion/expiry and described synthetic candidate fields as observed capability; those two claims were corrected against the input and are not treated as runtime evidence. The prompt requested no external calls or file inspection, but that instruction is not OS-enforced isolation.

## Limitations and recommendation

- No live visual/browser, HDC runtime, scanner/reviewer, corporate CI, PR publication, Gemini CLI/provider host, GUI benchmark, or actual permission containment test was performed.
- No corporate data, credentials, production configuration, installed plugin, `master`/`main` content, or corporate infrastructure was modified or accessed.
- Existing ignored benchmark reports/runs and AI-plugins' original untracked `.opencode/`, `active-work/`, and `docs/future-work.md` were preserved.
- **Recommendation:** retain V3 unchanged. Use current project/ticket policy and working records for scoped cases. Do not add a global composition framework or implement a tool bridge from synthetic evidence. Simplest alternative: zero production files/lines; if repeated real ambiguity arises, add one local example at the owning project boundary.

No merge was performed. Branch commit IDs will be recorded after publication.
