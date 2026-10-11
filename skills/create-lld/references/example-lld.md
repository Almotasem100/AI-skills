# Example — concise LLD

Synthetic style example only.

# LLD — APP-104: Notification Preferences

## Context
Users need to control which account notifications they receive.

## Objectives & constraints
- Let users view and update notification preferences.
- Preserve current defaults for categories the user does not change.

## Design

### API & data
Read and update preferences through the account settings API; the API owns persistence.

### Frontend
Show current preferences, keep edits locally until save succeeds, and surface save failure without discarding edits.

## Material decisions
| Decision | Chosen approach | Important boundary / rationale |
|---|---|---|
| Preference persistence | Use the existing account settings API | UI owns input state; API owns persistence |

## Verification intent
- Verify saved preferences are shown on the next visit.
- Verify a failed save is reported without discarding edits.
