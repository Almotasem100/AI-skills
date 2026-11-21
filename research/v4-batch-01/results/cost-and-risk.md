# Cost, quota, and security findings

## Observed execution

- Deterministic work used Node's built-in test runner; no package installation, harness launch, corporate service call, or production operation was made.
- One Gemini native subagent dispatch was requested for bounded synthetic reasoning. The session completed with a classification report. Token count, price, remaining quota, model-side duration, and provider billing were not exposed, so they are **unknown**.
- No Gemini CLI, paid model fallback, repeated model call, scanner, visual browser, corporate CI, or PR publication call was made.
- The research fixture suite ran 4 deterministic test cases; it does not invoke any model.

## Quota-aware routing implication

1. Prefer deterministic checks for exact scope matching, required-field presence, state distinctions, hashes, and test outcomes.
2. Route one narrow interpretation/review question to an already-available lower-cost specialist when its capability and authority are suitable; do not ask multiple models to restate deterministic results.
3. Reserve a higher-cost/root-model judgment for unresolved consequential synthesis or decisions that cannot be reduced to a deterministic oracle.
4. Record actual invocation counts and available result metadata only. Do not infer token usage or price from model names, task length, or configured lane labels.
5. Model selection cannot override tool capability or permission constraints. A low-cost route is not acceptable for a task requiring enforced read-only access if the route cannot prove it.

This is a routing recommendation, not a measured cost or quality comparison. The only model invocation observed here was the single requested Gemini subagent dispatch; its token and price telemetry were unavailable.

## Permission and data boundaries

- All research inputs were synthetic. No company documents, private project payloads, credentials, installed plugin settings, or authenticated services were read or transmitted.
- The Gemini classification prompt explicitly prohibited external calls and file inspection. This is an instruction boundary, not proof of OS-enforced containment.
- No plugin was installed or modified. No runtime permissions, CI, branches outside the research branches, or corporate infrastructure were changed.
- Passing synthetic tests shows only that the implemented fixture assertions behave as encoded. It does not prove live harness behavior, model permissions, security, or end-to-end acceptance.
