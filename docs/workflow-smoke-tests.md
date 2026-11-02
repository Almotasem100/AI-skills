# Workflow verification — entry point

Use the maintained [native-smoke pack guide](../test/native-smoke/README.md) for preparation, options, evidence
capture and interpretation of results. This page is navigation, not a second workflow or evaluator rubric.

- [Selection and continuity cases](../test/native-smoke/selection-continuity.md): optional manual probes of shared
  skill use, explicit activation, same-session resume and new-session boundaries; no automatic model calls.
- [Operator scenarios](../test/native-smoke/operator-scenarios.md): explanation-only authorization, disagreement and
  recovery probes. Keep evaluator expectations out of prompts given to the tested agent.
- [Full-scenario guide source](../test/native-smoke/full-scenario.md): the pack generates exact fixture paths and a
  natural OpenCode task prompt. Run only under the separately approved trial scope; ZadLoop remains deferred.

Portable source checks can be run with:

```text
node --test test/workflow-separation.test.mjs
```

These checks do not establish installed-host loading or behavior. Preserve actual events/results and distinguish
source/copy parity, explanation probes, real assignments and feature acceptance as described in the pack guide.
