# json-compare

Diff two recorded JSON API responses (a reference and a candidate), e.g. an old endpoint vs its ported
version. Node 18+, no dependencies. Full usage in the header of `compare.mjs`.

```
node compare.mjs <reference.json> <candidate.json> [--config rules.json] [--json]
```

- A recording is raw JSON, or `{"meta": {...}, "response": ...}` (meta is printed, not compared).
- Rules (optional): `ignore` paths, `rename` reference→candidate paths, `unordered` arrays. Paths use `a.b`,
  `[n]`/`[*]`, `*` (one key), `**` (any depth).
- Nothing is ignored silently: ignored paths are listed; string-vs-number differences with the same value are
  reported as **TYPE-ONLY**.
- Exit 0 = identical after the rules, 1 = differences, 2 = bad input.

Validated on sample data covering each rule above; project-specific recording runbooks live in the project.
