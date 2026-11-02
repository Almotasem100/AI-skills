# Configured responsibility catalog

**Activation guard:** Read/apply this catalog only after explicit **AI Skills delegation mode** selection through
[the profile](ai-skills-delegation.md). This is a semantic catalog, not the live workstation fleet.

Responsibilities describe outcomes, not a fixed participant, provider, model or transport. The profile's ownership
section assigns participants; local fleet configuration binds external routes. Reassigning an existing role does not
change its meaning or the project's engineering instructions. Do not dispatch a route merely because it exists.

| Configured responsibility | Outcome and boundary |
| --- | --- |
| `draft-feature-design` | Feature LLD and required Functional Design together using the applicable design capability; no duplicate functional-design assignment |
| `draft-functional-docs` | Standalone/maintenance business-facing documentation, distinct from combined feature design |
| `write-plan` | Author an actionable implementation plan from original requirements, applicable design, QA and conventions; includes revisions and findings disposition |
| `challenge-plan` | Separate source-grounded plan critique and rechecks of material revisions; does not mutate the plan |
| `challenge-complex-plan` | Alternative or supplementary high-stakes plan review when risk, uncertainty or an explicit request justifies it; not a mandatory extra reviewer |
| `write-qa-scenarios` | Tester-facing observable feature scenarios; does not author or execute automated tests |
| `write-api-regression-tests` | Executable endpoint-level regression checks; execution is a verification action |
| `implement-code` | Bounded implementation, relevant tests/checks and author corrections |
| `review-code` | Separate technical review of actual changes against requirements, design and verification evidence; attributable findings and rechecks |

Use the shared contract for prerequisite order, meaningful review/debate, evidence, outcome acceptance and working
records. Discover appropriate installed skills for the responsibility instead of treating skill names as fixed phases.
Provider/model rotation does not redefine a role. New local names/aliases require checking their consumers and
installed relay support; availability and permissions must be established before depending on a route.
