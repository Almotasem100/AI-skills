<!-- The team's Example A, verbatim. Teach from it: problem-then-fix per concern; the mechanism explained rather
     than the file list; specific identifiers named; written for someone who wasn't in the author's head.
     Its gaps: no ticket reference, no testing evidence, no risk or rollback, no screenshots, two unrelated
     concerns in one PR. -->

PR Title: Restrict Checklist Imports & Fix Project Vs eBBs KPI Data

Overview
This PR addresses multiple issues: preventing accidental data loss when importing
checklists, and fixing massively inflated rule counts in the KPI dashboard.

Restrict Category/eBB Import (Data Loss Prevention)
The Problem: Users could accidentally overwrite active checklist answers and
assignments by importing a template over them.
The Fix: The IMPORT button is now only available for completely empty checklists.
Technical Changes:

* `categoryModalController.js`: Introduced a `$scope.canImport` flag. It evaluates
  to true only if the checklist is completely empty (verifying that the details
  array and rule count are empty).
* `categoriesTreeModal.html`: Bound the IMPORT button's disabled state and
  visibility to `$scope.canImport`.

Fix "Project Vs eBBs" KPI Data Discrepancies
The Problem: The Project Vs eBBs table was showing duplicated rules, highly
inflated counts, and stale auto-assessor answers.
The Fix: The backend was pulling raw, unfiltered database rows instead of matching
what the user actually sees on the checklist UI.
Technical Changes:

* Updated the Project Vs eBB endpoint to act as a true mirror of the UI.
* Switched the data source to use `activeChecklist.getRules()` to build project rows.
* Switched to `rule.getAnswer()` to fetch accurate, current answers instead of
  pulling stale `CheckListContent` data.
