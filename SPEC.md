# Movie Calendar

Movie Calendar is a personal watch diary. I want to open a calendar, see which days I watched a movie, and look up the title without scrolling through a long list.

## Calendar screen

- Open to the current month using the phone's local date. Show the month and year, weekday labels, and a grid of dates.
- Use previous and next buttons to move between months, including across years.
- Show a small dot on dates with a saved movie. Tap a date to open its day screen.

## Day screen

- Show the selected date, a movie title field, and a Save button. The field starts empty on a new date and shows the saved title on a date with a record.
- Allow one movie per date. Saving a new title on a date that already has a record replaces that title.
- Trim whitespace from the beginning and end of the title. Show an inline message if the result is empty and keep any existing record.
- After a successful save, return to the same month on the calendar. Going back without saving discards changes.
- If saving fails, show an error and keep the user on the day screen with their input intact.

## Data and design

Store the title by local calendar date on the device, using AsyncStorage or equivalent Expo Go-compatible storage. The app should work offline and restore records when reopened. Use a readable calendar grid, consistent spacing, and a single accent color for dates with records.

## Acceptance criteria

1. Launch the app. The calendar shows the current month. The previous and next buttons display the correct month and year, including when moving between December and January.
2. Tap a date without a record. The day screen displays that exact date and an empty title field.
3. Enter a title and tap Save. The app returns to the month you were viewing, and the selected date now has a dot. Tap it again and verify that the saved title appears.
4. Change the existing title and save. Reopen that date and verify that only the updated title appears. A different date's record stays the same.
5. Clear a saved title, enter only spaces, and tap Save. An inline message appears, and the original title is still there after leaving and reopening the day screen.
6. Type a change and go back without saving. Reopen the date and verify that the previously saved title is still there.
7. Save a movie, fully close Expo Go, and reopen the project. The date still has a dot, and tapping it shows the saved title.
