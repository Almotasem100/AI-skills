<!-- Synthetic example of the default style: problem-then-fix per concern, the mechanism explained rather than the
     file list, specific identifiers named, written for someone who was not in the author's head.
     Deliberate gaps, not a template for them: no ticket reference, no testing evidence, no risk or rollback, and two
     unrelated concerns in one PR. -->

PR Title: Restrict Export Re-runs & Fix Order Totals in Export Preview

Overview
This PR addresses two issues: preventing duplicate order exports when a batch is re-run, and fixing inflated totals
in the export preview.

Restrict Re-run Export (Duplicate Prevention)
The Problem: Users could accidentally export the same orders twice by re-running an export on a batch that had
already been exported.
The Fix: The EXPORT button is now only available for batches that have not been exported.
Technical Changes:

* `exportModalController.js`: Introduced a `$scope.canExport` flag. It evaluates
  to true only if the batch has no exported records (verifying that the record list
  and exported count are empty).
* `exportModalView.html`: Bound the EXPORT button's disabled state and
  visibility to `$scope.canExport`.

Fix "Order Export Preview" Total Discrepancies
The Problem: The preview showed duplicated line items, highly inflated totals and stale payment statuses.
The Fix: The backend was pulling raw, unfiltered database rows instead of matching
what the user actually sees on the order screen.
Technical Changes:

* Updated the export preview endpoint to act as a true mirror of the order screen.
* Switched the data source to use `activeOrder.getLines()` to build preview rows.
* Switched to `line.getPaymentStatus()` to fetch current statuses instead of
  pulling stale `OrderPaymentSnapshot` data.
