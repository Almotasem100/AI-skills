# Functional Design — APP-104: Notification preferences

## Proposed experience
- Account settings will include a notification-preferences panel showing the current setting for each category.
- Users can enable or disable individual categories and save their changes.
- Reopening the panel shows the saved selections; changing one category leaves the others unchanged.

## Important behavior and limits
- Preferences apply to the signed-in account.
- If saving fails, an error appears and the user's edits remain available to retry.
