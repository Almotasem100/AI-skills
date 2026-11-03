# Draft contract

The agent writes exactly one JSON object in this shape. `scripts/render.mjs` turns it into the final title and
body, so the agent never formats markdown headings itself.

```jsonc
{
  "title": {
    "type": "feat",            // feat | fix | hotfix | refactor | perf | chore | test | docs | release
    "scope": "kpi",            // optional area name for a project using the conventional title format; ignored in ticket-first titles
    "summary": "add project status and multi-code filtering",  // imperative, lowercase start, no period
    "ticketId": "14972296"     // internal ticket ID; omit to use the one parsed from the branch
  },
  "fields": {                  // values for {{placeholders}} in the template
    "designDoc": "[Notification preferences — Technical Design](<accessible-design-link>)", // actual document title; omit when unavailable
    "severity": "high",        // bugfix/hotfix only: low | medium | high
    "foundIn": "R2.21 / prod"  // bugfix/hotfix only
  },
  "sections": {                // keys depend on the template (see below)
    "why":         { "text": "...", "confidence": "high", "source": "taskContext" },
    "whatChanged": { "text": "...", "confidence": "high", "source": "diff" },
    "testing":     { "text": "[NEEDS INPUT]", "confidence": "low", "source": "none" }
  },
  "detected": {
    "unrelatedConcerns": ["kpi filters", "PG rules validation"],   // distinct concerns in this PR
    "designDocDivergence": ["Guard placed in the component; the LLD specifies a route guard"]
  },
  "questions": [               // at most 4, confirmation-shaped where possible
    { "id": "testing", "prompt": "How did you verify this?", "guess": null },
    { "id": "why", "prompt": "Was this to stop users overwriting active checklist answers?", "guess": "yes" }
  ]
}
```

## Section keys per template
| Template | Keys |
|---|---|
| `story` | `why`, `whatChanged`, `impactAndRisk`, `testing`, `reviewerNotes`, `screenshots` |
| `bugfix` | `problem`, `rootCause`, `fix`, `regressionAndTesting`, `rollback` |
| `hotfix` | `problem`, `rootCause`, `fix`, `regressionAndTesting`, `rollback`, `mergeBack` |

The context's `requiredSections` says which keys must appear. A required key left empty renders as
`[NEEDS INPUT]`. An optional key left empty is dropped with its heading — never write "N/A".

## `source` and `confidence`
- `source`: where the text came from — `diff`, `commits`, `taskContext`, `ticket`, `requirements`,
  `functionalDesign`, `lld`, `technicalDesign`, `userNote`, `inferred`, or `none`.
- `confidence`: `high` when the source states it directly, `low` when it is an inference.
- Low-confidence fields are what the questions are for.

## Hard rules
- **Never invent** test results, measurements, business impact, reasons, severity or rollback steps. Write
  `[NEEDS INPUT]` and ask.
- `why` / `problem` use this evidence order: explicit user rationale -> approved ticket/requirements -> relevant
  approved design artifact -> ask. Task-context may preserve or locate that evidence; its observations or later
  synthesis are not a higher authority. `taskContext` records the carrier, not approval. Never derive business rationale from the diff.
- Do not infer causal links between separately stated objectives, rationale, estimates, benefits, or outcomes unless
  authoritative evidence explicitly connects them.
- Preserve qualifiers on value/measurement claims. `estimated 20%` cannot become `improved by 20%`.
- `testing` / `regressionAndTesting` come from verified execution evidence or the user; never infer them from
  requirements or implementation alone.
- `rollback` is asked for when the context has a `migration` signal, and always for a hotfix.

Presentation keys remain stable for existing drafts: `why` renders under **Purpose**, `testing` under
**Verification**, and optional `reviewerNotes` under **Review considerations** in the bundled story template.
Screenshots are optional; absence is not a missing input just because UI files changed. `fields.designDoc` contains
the actual Technical Design/LLD title/link without routine dates; omitted design evidence creates no “none” label.
The context's `titleFormat` selects `ticket-first` (default) or the repository's explicit `conventional` format.
