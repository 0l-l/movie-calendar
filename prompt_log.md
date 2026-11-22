# Prompt Log: Movie Calendar

Project: Movie Calendar, a personal movie watch diary (Expo SDK 58, React Native, Expo Router, tested in Expo Go).
Tool: Claude (Claude Opus 5.5), working on the local repo `C:\Users\olivi\movie-calendar`.
Date: 2026-11-22

Below are the key prompts (originally written in Chinese, translated to English here), with a short note on what came back.

---

## 1. Understand the project before changing anything

> This is my first time using React Native and Expo. First, read this project's package.json and the Expo Router entry files, and use the actual files in the project to explain:
>
> 1. When Expo Go opens the project, which file decides which page I see first?
> 2. What are index.tsx and _layout.tsx each responsible for?
> 3. If I want to tap into a specific day from the month calendar, how can Expo Router pass the selected date to the second page?
>
> Please explain in Chinese and give one short example. Don't modify any files in this step.

**Result:** Explanation only, no files changed.
- `package.json` has `"main": "expo-router/entry"`, so Expo Router scans `src/app/`, and `src/app/index.tsx` (route `/`) is the first screen.
- `_layout.tsx` is the frame (theme, splash screen, the starter's tab bar). `index.tsx` is the content of one page.
- To pass the date: a dynamic route `src/app/day/[date].tsx`, `router.push({ pathname: '/day/[date]', params: { date: '2026-11-22' } })`, read with `useLocalSearchParams`. Params are strings, so pass `YYYY-MM-DD`, not a `Date`.
- Also noted: going to a day page and back needs a `Stack` in the layout instead of tabs.

## 2. Implement the app from SPEC.md

> Read SPEC.md in the project root and implement Movie Calendar according to its screen requirements and all of its numbered acceptance criteria.
>
> First check the actual Expo SDK version in package.json and the project's routing structure. Keep using Expo Router, and all dependencies must be compatible with this project's SDK and with Expo Go.
>
> Implement two screens: the month calendar and the day detail. The user can switch months, tap a date, enter or change that day's movie title, and the record is saved on the device. Dates with a record show a dot. Follow SPEC.md for blank input, going back without saving, save failures, and returning to the month that was being viewed after saving.
>
> Edit the code in the project directly and run whatever checks are available. When you're done, list the files you changed, the checks you actually ran, and the steps I need to verify on a real phone in Expo Go. Keep SPEC.md exactly as written; I will test and commit the first version myself.

**Result:**
- Checked the SDK first: `expo ~58.0.26`. Looked up the AsyncStorage version that matches SDK 58 in `node_modules/expo/bundledNativeModules.json` (`2.2.0`, included in Expo Go).
- Root layout changed from tabs to a `Stack`. The calendar stays mounted under the day screen, so going back returns to the same month.
- New files: `src/app/day/[date].tsx`, `src/lib/calendar.ts` (date logic), `src/lib/records.ts` (data shape), `src/lib/movie-store.ts` (AsyncStorage), `src/constants/calendar-theme.ts` (all colors and sizes in an `EDIT ME` block).
- Checks run by Claude: strict `tsc` on the pure logic files, 8 Node test groups (current month, December to January, leap years, exact date text, whitespace-only rejected, one movie per date, damaged data not overwritten), and a syntax check of every changed file. Full-project `tsc`, `expo lint` and the phone test were mine to run.
- I ran `npx expo install @react-native-async-storage/async-storage`, tested in Expo Go and committed: "Implement movie calendar and day screens". SPEC.md unchanged.

---

## What I learned

- Expo Router picks the first page from the file structure (`src/app/index.tsx`). `_layout.tsx` decides how pages are arranged (tabs vs. stack).
- Data passed between pages travels as URL params, so it has to be a string.
- Use `npx expo install` instead of `npm install`, so versions match the SDK and Expo Go.
- Ask the AI to explain the project before it changes anything, and to report which checks it actually ran versus which ones I still need to run on my own machine and phone.
