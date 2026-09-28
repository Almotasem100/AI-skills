# url-map

Maps every URL of a Java web app to the code that handles it and to what calls, schedules or routes to it,
and reports the gaps (targets nothing serves, handlers excluded from the build, filter substring rules…).
Replaces Graphify for this job (`docs/decisions.md`). Spec: `SPEC.md`. Node 18+, no dependencies, read-only.

```
node url-map.mjs --config <project>.config.json
```

The config holds every project-specific value (repo paths, the package of new code, frontend constants file,
output paths); see the header of `url-map.mjs`. Paths in the config are relative to the config file.

**Reads:** `@WebServlet`, `@WebFilter`, `web.xml`, JAX-RS `@Path` + HTTP annotations, Cloud Endpoints
`@Api`/`@ApiMethod`, `withUrl(...)` + `getQueue(...)`, `cron.yaml`, `queue.yaml`, `dispatch.yaml`, `pom.xml`
compiler excludes, a frontend URL-constants file. Commented-out code is ignored and counted separately.

**Writes:** one TSV (one row per handler URL, plus one per target nothing serves; header = source commit and
date) and one Markdown summary (counts, problems by type, anything it couldn't resolve).

**Regenerate** after each ported slice. The `handler_at` / `called_by` references can be proven with
`skills/session-closeout/scripts/check-citations.mjs <tsv> --root <backend repo> --root <frontend repo>`.

## Tested (2026-09-26, HDC)
- 272 rows; counts reconcile with a plain grep (e.g. 237 `@ApiMethod` + 1 in a comment = 238).
- Known facts reproduced: `HDCEndpoint.java:4786` → `/taskqueues/exportHDCRules` → `exportHDCRules`
  (excluded from the build); `/kpischeduler` → no handler on the current build (on `develop`, `web.xml` mapped
  it to `KPIDailyScheduler`); `/api/users/me` → `UserResource#me` (new).
- All 591 file:line references in the TSV pass `check-citations.mjs`. Both repos untouched (`git status` equal
  before and after).
- Reviewed with `two-axis-review` against `SPEC.md`: accepted fixes (count gaps explained in the output, no
  status outside the spec, shared regex escaping, clearer names); rejected "dispatch should flag AMBIGUOUS" (a
  dispatch rule is meant to route many handlers).

## Known limits
- Text parsing, not a Java parser: unusual formatting can be missed. The counts table is the check.
- Endpoints methods without an explicit `path` get their name as the URL, flagged `DEFAULT_PATH_GUESSED`.
- `NO_HANDLER` means "no mapping on this build". The class may still exist but be unmapped (HDC: the servlets
  that only `develop`'s `web.xml` mapped).
