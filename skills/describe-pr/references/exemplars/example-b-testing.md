<!-- Synthetic testing section in the default style: one concrete verified behaviour per line, phrased as an observable
     outcome rather than "tested the filters". Never generate this without the developer's input. -->

Testing

* Verified the Reports page loads with the Active Account filter selected by default.
* Verified removing the Active Account filter displays reports from all accounts.
* Verified the Account Status filter works for Active and Inactive values.
* Verified multiple Region filtering works on the Reports page.
* Verified multiple Region filtering works in the Summary view.
* Verified the Report Status filter correctly returns Published or Archived reports based
  on each report's own status.
* Verified Report Status and Account Status filters can be combined independently.
* Verified Include Archived Reports is mandatory for Enterprise accounts.
* Verified Include Archived Reports remains optional for Standard accounts.
* Verified a normal user can request a waiver and the status becomes Pending.
* Verified an authorized user can approve the waiver request.
* Verified requester and approver are stored separately.
* Verified the Review dialog displays waiver status and audit information.
* Verified the tree view displays waiver status as Pending or Approved.
