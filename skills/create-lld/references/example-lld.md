[CADE-1421][Story] Improve Projects List Page performance · Internal ticket: #[NEEDS INPUT]

**Release / Sprint:** R2.20 / [NEEDS INPUT] · **Tech designer:** [NEEDS INPUT] · **Status:** Draft

## 1. Context
The Projects list page is slow to load. Three causes in the current flow:
- `fetchProjectsBySearchCriteria` calls BigQuery synchronously to get each project's last DR modification date,
  so the whole page waits for an external call.
- It returns full `Project` entities, for every project at once (no server-side pagination).
- Projects are looked up one by one inside a loop (an N+1 query pattern).

Measured load time today: [NEEDS INPUT].

## 2. Objectives & constraints
- **Keep the page as it is:** same Projects route and UI.
- **Table first:** the Projects table renders without waiting for enrichment data.
- **Async enrichment:** the last DR modification date loads after the first render, with a loading indicator
  in its column.
- **Ready for pagination:** the table accepts page size and page token parameters.
- **Measurable:** timing logs around each slow step, to confirm the gain and catch regressions.

**Out of scope:**
- Server-side pagination itself (only the preparation is in this ticket).
- Any change to the Projects page layout.

## 3. Key decisions
| Decision | Chosen | Alternatives considered | Why |
|---|---|---|---|
| Where the last DR date is loaded | A new endpoint, called by the frontend after the first render, with BigQuery results cached in Memcache | Keep the synchronous BigQuery call inside `fetchProjectsBySearchCriteria` (current) | The synchronous BigQuery call is the main bottleneck of the initial load; moving it off the critical path lets the table render first, and the cache avoids repeated external calls |
| Shape of the list response | A lightweight `ProjectSummary` DTO: id, code, name, status, owner, lastDRDate placeholder | Return full `Project` entities (current) | Smaller payload and lower serialization cost; the page only shows these fields |
| How projects are loaded | Batch load with Objectify `ids()` | Individual lookups inside a loop (current) | Removes the N+1 query pattern |
| Pagination | Prepare the table for page size + token; don't implement server-side pagination yet | Implement server-side pagination now | [NEEDS INPUT] |

## 4. Backend design
### 4.2 API contract
- `fetchProjectsBySearchCriteria`: the response changes from a list of `Project` entities to a list of
  `ProjectSummary`. **Breaking** for any caller that reads other `Project` fields; callers: [NEEDS INPUT].
- New endpoint returning `lastDRModificationDate` per project: name, path and request shape [NEEDS INPUT].

### 4.3 Services & logic
- Remove the BigQuery call from `fetchProjectsBySearchCriteria`.
- Load projects in one batch with Objectify `ids()` instead of per-project lookups.
- Cache the BigQuery results behind the new endpoint in `Memcache`; TTL [NEEDS INPUT].
- Add timing logs around the Datastore retrieval, the category filtering, the `BigQuery` call and serialization.

## 5. Frontend design
### 5.1 State & services
- After the table renders, call the new endpoint and merge `lastDRModificationDate` into the rows.

### 5.2 Components & UI
- Show a loading indicator in the `Last DR Modification Date` column until its data arrives.
- Accept `pageSize` and `pageToken` parameters in the table, unused until pagination is built.

## 6. Impact & risks
| Area | Impact | Mitigation |
|---|---|---|
| Compatibility | `fetchProjectsBySearchCriteria` returns a different shape | Deploy backend and frontend together; check other callers before release |
| Performance | Two requests instead of one; the date column fills in after the table | Loading indicator on the column; Memcache on the BigQuery results |
| Data freshness | A cached last DR date can be out of date | Choose the cache TTL with the business owner |

## 7. Verification plan
- Verified the Projects table renders before the last DR dates arrive.
- Verified the `Last DR Modification Date` column shows a loading indicator, then the values.
- Verified the list response is smaller: [NEEDS INPUT] KB before, [NEEDS INPUT] KB after.
- Verified the timing logs show one batch Datastore read per page load instead of one read per project.
- Verified a second load within the cache TTL makes no BigQuery call (checked in the timing logs).

## 8. Rollout & rollback
- Rollout: deploy backend and frontend together, since the old frontend expects full `Project` entities.
- Rollback: redeploy the previous backend and frontend versions together; there is no data migration.

## 9. Open questions for the reviewer
- Which other clients call `fetchProjectsBySearchCriteria`?
- What cache TTL is acceptable for the last DR date?
- When is server-side pagination planned?
