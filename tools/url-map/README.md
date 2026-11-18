# url-map

Maps every URL of a Java web app to the code that handles it and to what calls, schedules or routes to it,
and reports the gaps (targets nothing serves, handlers excluded from the build, filter substring rules…).
Replaces Graphify for this job (`docs/records/decisions.md`, "URL map replaces Graphify"). Spec: `SPEC.md`. Node 18+, no dependencies, read-only.

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
`skills/work-closeout/scripts/check-citations.mjs <tsv> --root <backend repo> --root <frontend repo>`.

## Validation
Validated on a large Java web app; results are project-specific and not reproduced here. Check a new run with the
counts table in the Markdown summary and `check-citations.mjs`.

## Known limits
- Text parsing, not a Java parser: unusual formatting can be missed. The counts table is the check.
- Endpoints methods without an explicit `path` get their name as the URL, flagged `DEFAULT_PATH_GUESSED`.
- `NO_HANDLER` means "no mapping on this build". The class may still exist but be unmapped (for example, a servlet
  that only another branch's `web.xml` maps).
