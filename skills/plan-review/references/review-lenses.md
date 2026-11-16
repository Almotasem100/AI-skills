# Focused review questions

Select the questions that fit the target and requested review. These are interchangeable focuses within one review,
not separate mandatory agents, documents or phases. Keep the skill's common evidence, ownership and output rules.

## Comprehension

- What behavior is proposed, what exists now, and what lies outside scope?
- Can a new reader explain the interaction from the artifact and its declared references, without private chat?
- Which consequential term, dependency or decision is missing, ambiguous or contradictory?
- Is the problem in the document, an inaccessible reference, or the reviewer's reading? Preserve the initial
  reconstruction before checking separate approved sources. Do not manufacture definitions for ordinary software terms.

## Simplicity and architectural fit

- Does the approach solve the stated problem using existing suitable capabilities and actual constraints?
- What concrete requirement justifies each added state owner, abstraction or cross-layer dependency?
- Would a smaller alternative preserve required security, integrity and behavior? Explain the tradeoff with evidence.
- Did the proposed correction add unnecessary scope or complexity? A valid finding does not make its broad remedy mandatory.

## Technical correctness and source fit

- Are existing paths, symbols, contracts and constraints verified against current sources?
- Are proposed components clearly distinguished from current implementation? An intended new file is not missing code.
- Are reachable operations, identity/tool boundaries, side effects and relevant failure paths consistent?
- Do the important assumptions have evidence? Keep unsupported premises separate from reproduced defects.

## Implementation readiness

- Are material behavior and architecture choices settled at the level needed to implement this scope?
- Are actual modification surfaces, dependencies and suitable reuse identified without fictitious signatures?
- Are verification commands, required fixtures/identity and expected observable outcomes actionable?
- What would force the implementer to invent a material requirement? Return that gap; leave routine internal
  coding choices to the implementer. Do not require zero judgment, every future filename, or a merged design/plan.
