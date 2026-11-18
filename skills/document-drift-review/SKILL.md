---
name: document-drift-review
description: Review a bounded set of design or current-behavior documents against selected source revisions. Use for document/code drift, stale design or API documentation, and checking whether an approved change was reflected in maintained records. Report discrepancies and coverage limits without changing code, documents or project state.
---

# Scoped document/code drift review

Keep this a read-only comparison, not an automatic delivery stage, scheduled scan, closeout or cleanup.
Use the caller's named documents, sections or bounded directory and relevant source roots/revisions. Ask only
when missing scope or authority prevents a meaningful comparison. Do not turn a feature check into a whole-repo survey.

## Establish the baseline

Read applicable project authority and the target documents. Identify each document's purpose and status:
current implemented behavior, approved future intent, proposal, historical record or explicitly deferred work.
Locate the authoritative approved decision for a consequential mismatch; a newer scratchpad is not automatically
more authoritative. Record the inspected document/source revisions or current state and exclusions in the result.

Inspect the mapped current source, including actual registration/callers when reachability matters. Search for
renamed or moved implementations before reporting an absent symbol. Distinguish an intended new component from
a claim that it already exists. Do not assume a forward design is an as-built promise or that undocumented code
is automatically a defect.

## Compare the selected claims

- Check relevant behavior, contracts, defaults, permissions, data/side effects and affected examples.
- Separate changed documentation from unimplemented approved behavior, authorized deviations, stale references
  and intentionally future/deferred work. If authority is unclear, report the question instead of choosing whether
  the code or the document must change.
- Use a documentation-accuracy guard such as docs-guard, if one is available, within this read-only boundary for
  detailed checks of current API and examples. Do not duplicate its checklist or make it an installation dependency.
- Carry precise claim/source locators and observed differences. Code inspection is source evidence, not a live
  acceptance test. Never claim runtime behavior, fixture creation or production verification that was not observed.

## Return a bounded result

Give a short scope/coverage statement, then actionable discrepancies rather than a transcript of matching files.
For each material item, include the document claim, source observation, relevant decision/status, impact and
smallest next action. Suggest the likely owner (document, implementation or decision) without assigning new authority.
A compact table is optional; do not create another permanent report by default.

State one of: discrepancies found; no discrepancy found in the inspected scope; or incomplete comparison.
A material missing/unreadable source makes the affected scope incomplete even if useful findings are returned.
List uninspected areas and unresolved authority. An explicitly deferred difference is not missing required delivery;
identify it as deferred if needed to explain the comparison.

Return findings in chat or an existing approved review record; write a separate file only when requested or required.
Do not edit either side, execute tests or mutations, make owner decisions, promote proposals into policy, trigger
closeout, or authorize publication. The caller decides and routes any correction under existing project policy.
