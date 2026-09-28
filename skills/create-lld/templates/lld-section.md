<!--
LLD section template — approved 2026-09-25.
Written for an architect who reviews the design and gives an opinion. One section per ticket; it pastes into
the team's per-release technical design document.

Rules:
- Every design statement names the class, endpoint, table, component or file it touches.
- Scale to the ticket. Small ticket: sections 1, 2, 4 and/or 5, and 7; section 3 only if a real choice was made.
  Remove sections that don't apply — never write "N/A".
- Never invent what the code or the inputs can't show (reasons, rejected alternatives, measurements, test
  results). Write [NEEDS INPUT] instead. In retro mode this applies especially to section 3.
-->

[<JIRA-ID>][<Story|Bug|Enabler|Technical>] <Title> · Internal ticket: #<internal-id>

**Release / Sprint:** <release> / <sprint> · **Tech designer:** <name> · **Status:** Draft | In review | Approved

## 1. Context
<!-- The problem and the current state, with evidence: numbers, file:line, observed behaviour. 3–6 lines. -->

## 2. Objectives & constraints
<!-- One bullet each: **Objective or constraint:** one-line explanation. -->

**Out of scope:**
<!-- What this change deliberately does not do. -->

## 3. Key decisions
| Decision | Chosen | Alternatives considered | Why |
|---|---|---|---|
| <!-- e.g. Where the freshness check lives --> | | | |

## 4. Backend design
### 4.1 Data model & migrations
### 4.2 API contract
<!-- For each new or changed endpoint: method, path, request, response, status codes. Mark breaking changes. -->
### 4.3 Services & logic
### 4.4 Background jobs
<!-- Cron jobs, task queues, async workers. -->

## 5. Frontend design
### 5.1 State & services
### 5.2 Components & UI
### 5.3 Routing & guards

## 6. Impact & risks
| Area | Impact | Mitigation |
|---|---|---|
| <!-- Compatibility / Performance / Security & permissions / Data --> | | |

## 7. Verification plan
<!-- One observable check per line: "Verified <behaviour> <outcome>." This becomes the PR's "How it was tested". -->

## 8. Rollout & rollback

## 9. Open questions for the reviewer
