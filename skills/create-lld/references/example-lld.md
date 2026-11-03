# Technical Design — APP-104: Notification preferences

Allow account owners to change notification preferences while preserving categories they do not edit.
Names below are proposed for this synthetic design; they are not claims about an existing repository.

## Design

### Frontend
`NotificationPreferencesComponent` displays categories and owns unsaved edits. Proposed
`NotificationPreferencesApi.load()` initializes the form; `save(changes)` sends only changed categories.
Keep edits visible and show a save error if the request fails; replace the saved baseline only after success.

### Backend
`NotificationPreferencesResource.get()` returns the signed-in account's preferences.
`update(changes)` validates category names and boolean values, then calls
`AccountPreferencesService.updateNotifications(accountId, changes)`. Derive `accountId` from authentication;
a client cannot choose another account. The service merges the validated fields into the stored preferences.

### API & data
- `GET /api/account/notification-preferences`: category-to-boolean map.
- `PATCH /api/account/notification-preferences`: changed category-to-boolean map; return the saved map.
- Unknown categories/non-boolean values: reject with 400 and preserve stored preferences.
- No new entity/table: extend the existing account-preferences storage contract.

### Interaction
Open settings → load saved values → edit locally → validate and persist submitted fields → show saved values.
On failure, retain local edits for correction/retry; do not imply that an unsuccessful response saved them.
