# url-map — spec (agreed with the owner through `grill-me`, 2026-09-26)

Replaces Graphify for HDC (see `docs/decisions.md`, "Graphify trial"). Every item below was put to the owner as
a question with a recommendation; the owner accepted all recommendations (rounds 1 and 2).

1. **Purpose:** (a) porting: "if I port or remove X, what calls, schedules or routes to it?"; (b) C7: "which
   cron / queue / dispatch targets are dead or 404 today?". (c) agent context comes free.
2. **Sources:** backend servlets (`@WebServlet`, `web.xml`), filter (`@WebFilter`), JAX-RS `@Path`, legacy
   Cloud Endpoints `@ApiMethod` (a second API class such as a developer endpoint is kind `endpoints-dev`),
   task-queue `withUrl(...)`, `cron.yaml`, `queue.yaml`, `dispatch.yaml`; plus the new Angular frontend's URL
   constants (`api-urls.const.ts`). Not the deleted legacy AngularJS callers.
3. **Output:** a generated TSV (HDC: `documents\HDC_URL_Map.tsv`) with a header naming the source commit and
   date, plus a Markdown summary (`HDC_URL_Map.md`) with a "problems found" section. The hand-classified triage
   TSV is never touched; the two join on the Java method name.
4. **Code:** `AI-skills/tools/url-map/`, Node 18+, no dependencies, generic for Java web apps (servlets,
   JAX-RS, App Engine yaml, Cloud Endpoints); repo paths are arguments; no project names inside.
5. **Parsing:** text/regex over the sources. Anything it can't resolve (URLs built at runtime, etc.) is listed as
   unresolved, never guessed.
6. **Problems reported:** `NO_HANDLER` (a cron/dispatch/withUrl/frontend target no handler serves), `NO_CALLER`
   (a servlet/task handler nothing calls or schedules), `QUEUE_NOT_DECLARED` (a queue used in code but missing
   from `queue.yaml`), `EXCLUDED_FROM_BUILD` (handler class excluded from compilation → 404 today),
   `DEFAULT_PATH_GUESSED`, `AMBIGUOUS`, `AUTH_BYPASS_SUBSTRING`.
7. **Status per handler:** `new` / `legacy` / `excluded`, from the compiler excludes in `pom.xml` and the
   package of the new code (a CLI option).
8. **Freshness:** run by hand; the project's `AGENTS.md` says to regenerate after each ported slice. No hook.
9. **Columns:** `url`, `kind` (servlet / jaxrs / endpoints / endpoints-dev / filter-rule / cron / task /
   dispatch / frontend), `http`, `handler` (`Class#method`), `handler_at` (`path:line`, checkable by
   `check-citations.mjs`), `status`, `called_by` (`path:line` of `withUrl` sites and frontend constants),
   `scheduled_by` (cron schedule), `routed_to` (dispatch service), `auth_note`, `problems`.
10. **Rows:** one per URL a handler serves; callers/schedules/routing joined with `;`. A target that matches no
    handler gets its own row with an empty handler and `NO_HANDLER`.
11. **Endpoints URLs:** `/_ah/api/<api>/<version>/<path>`; with no `path`, `<name>` + `DEFAULT_PATH_GUESSED`.
12. **Matching:** servlet rules (exact, `/prefix/*`, `*.ext`); App Engine dispatch globs; frontend constants as
    prefix + path. Several matching handlers → list all + `AMBIGUOUS`.
13. **Done means:** counts match the survey (HDC 2026-09-26: 17 `@WebServlet` files, 1 `@WebFilter`, 5 `@Path`,
    238 `@ApiMethod`, 31 `withUrl` lines, 8 cron, 4 queues, 13 dispatch) or every gap is explained; known facts
    reproduced (`HDCEndpoint.java:4786` → `/taskqueues/exportHDCRules` → `exportHDCRules`, excluded;
    `/kpischeduler` → `NO_HANDLER` or its real handler; `/api/users/me` → `UserResource`, new); `handler_at`
    citations pass `check-citations.mjs`.
14. **Filter URL rules** (e.g. `getRequestURI().contains("/backup")`) go into `auth_note` for every URL they
    match, flagged `AUTH_BYPASS_SUBSTRING` because a substring can match more than intended. Recorded, not fixed.

**Constraints:** reads the repos only (HDC cleanup rule R1); writes only to the output folder given.
