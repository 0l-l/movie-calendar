# Movie Calendar

Movie Calendar is a personal diary for the movies I watch. I chose a calendar because I wanted to find a movie by the day I watched it and see my viewing history at a glance.

## Screens

- **Calendar:** Browse months and tap a date to open its entry. A red dot marks each date with a saved movie.
- **Movie:** View, add, or change the movie title for the selected date. Saving takes you back to the calendar. Each date holds one title, stored locally on the device.

## Setup and running

This project uses Expo SDK 58 and was tested on an iPhone with Expo Go. Use Node.js 22.13 or newer.

1. Clone this repository and open the project folder in a terminal.
2. Run:

   ```bash
   npm install
   npx expo start
   ```

3. Connect your computer and iPhone to the same Wi-Fi network. Sign in to the same Expo account in Expo Go and in the terminal with `npx expo login`.
4. Scan the QR code with the iPhone Camera app to open the project in Expo Go.

## What I learned

One thing that surprised me was that seeing a red dot immediately after saving only checks part of the app. Opening the date again after a reload checks that the app can read the saved title from the phone's storage.
