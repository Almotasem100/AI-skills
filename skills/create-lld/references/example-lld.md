# Example — concise LLD

This is a synthetic example of the deliverable style. The endpoint and behaviors below are illustrative only.

# LLD — APP-104: Notification Preferences

**Release / Sprint:** R4 / Sprint 2 · **Tech designer:** Example Owner · **Status:** Draft

## 1. Context
Users need to control which account notifications they receive.

## 2. Objectives & constraints
- Let users view and update notification preferences.
- Preserve current defaults for preference categories not changed by the user.

**Out of scope:** changing delivery providers or notification content.

## 3. Key decisions
| Area | Planned design | Alternative or deferred option | Key boundary |
|---|---|---|---|
| Preference storage | Read and update preferences through the account settings API. | Keep preferences fixed at account creation. | The API owns persistence; the page owns input state. |

## 4. Backend design
Expose an account-scoped read/update contract for notification preferences.

## 5. Frontend design
Show the current preferences and save changes with a clear success or error outcome.

## 6. Impact & risks
A failed save must not be shown as successful; retain the user's edits so they can retry.

## 7. Verification plan
Verify that saved preferences are shown on the next visit and that a failed save is reported without discarding edits.
