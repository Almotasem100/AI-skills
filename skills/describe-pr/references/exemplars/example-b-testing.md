<!-- The testing section of the team's Example B, verbatim. Teach from it: one concrete verified behaviour per
     line, phrased as an observable outcome rather than "tested the filters". Never generate this without the
     developer's input. -->

Testing

* Verified KPI Elements page loads with Active Project filter by default.
* Verified removing the Active Project filter displays elements from all Projects.
* Verified Project Status filter works for Active and Inactive values.
* Verified multiple Project Code filtering works in KPI Elements.
* Verified multiple Project Code filtering works in Project view.
* Verified Element Status filter correctly returns Opened or Closed Elements based
  on the Element's own status.
* Verified Element Status and Project Status filters can be combined independently.
* Verified Include PG Rules is mandatory for HDC Projects.
* Verified Include PG Rules remains optional for PDC/TDC.
* Verified normal user can request N/A applicability and status becomes Pending.
* Verified authorized user can approve N/A applicability request.
* Verified requester and approver are stored separately.
* Verified Validate Checklist modal displays N/A status and audit information.
* Verified tree view displays N/A status as Pending or Approved.
