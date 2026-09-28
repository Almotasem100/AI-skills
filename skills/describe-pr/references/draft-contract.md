# Draft contract

The agent writes exactly one JSON object in this shape. `scripts/render.mjs` turns it into the final title and
body, so the agent never formats markdown headings itself.

```jsonc
{
  "title": {
    "type": "feat",            // feat | fix | hotfix | refactor | perf | chore | test | docs | release
    "scope": "kpi",            // a short area name; from the repo's scope list when one exists; omit if none fits
    "summary": "add project status and multi-code filtering",  // imperative, lowercase start, no period
    "ticketId": "14972296"     // internal ticket ID; omit to use the one parsed from the branch
  },
  "fields": {                  // values for {{placeholders}} in the template
    "designDoc": "LLD section: [CADE-1421] Improve Projects List Page",  // or a link; omit for "none"
    "severity": "high",        // bugfix/hotfix only: low | medium | high
    "foundIn": "R2.21 / prod"  // bugfix/hotfix only
  },
  "sections": {                // keys depend on the template (see below)
    "why":         { "text": "...", "confidence": "high", "source": "userNote" },
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
- `source`: where the text came from — `diff`, `commits`, `ticket` (pasted by the user), `lld`, `userNote`,
  `inferred`, or `none`.
- `confidence`: `high` when the source states it directly, `low` when it is an inference.
- Low-confidence fields are what the questions are for.

## Hard rules
- **Never invent** test results, measurements, business impact, reasons, severity or rollback steps. Write
  `[NEEDS INPUT]` and ask.
- `why` / `problem` come from the user's note, the pasted ticket or the LLD — never from the diff alone.
- `testing` / `regressionAndTesting` come from the user only.
- `rollback` is asked for when the context has a `migration` signal, and always for a hotfix.
