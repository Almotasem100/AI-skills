# QA scenarios — APP-104: Notification preferences

## 1. View saved preferences
Starting condition: The signed-in account has known saved notification preferences.
Steps:
1. Open notification preferences in account settings.
Expected result: Each category displays its saved enabled/disabled value.

## 2. Save one changed preference
Starting condition: At least two categories are available with known saved values.
Steps:
1. Change one category and save.
2. Leave the page and reopen notification preferences.
Expected result: The changed category retains its new value; untouched categories retain their previous values.

## 3. Keep edits after an unsuccessful save
Starting condition: The save request cannot complete successfully in the team's controlled test setup.
Steps:
1. Change a preference and save.
Expected result: A save error is visible and the edited value remains available for correction or retry.
