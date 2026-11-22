# Prompt Log: Movie Calendar

Project: Movie Calendar, a personal movie watch diary (Expo SDK 58, React Native, Expo Router, tested in Expo Go).
Tool: Claude (Claude Opus 5.5), working on the local repo `C:\Users\olivi\movie-calendar`.
Date: 2026-11-22

Below are the key prompts, quoted as I wrote them, with a short note on what came back and what I decided.

---

## 1. Understand the project before changing anything

> 我是第一次用 React Native 和 Expo。请先阅读这个项目的 package.json 和 Expo Router 入口文件，用项目里的实际文件解释：
>
> 1. Expo Go 打开项目时，哪个文件决定我先看到哪个页面？
> 2. index.tsx 和 _layout.tsx 分别负责什么？
> 3. 如果我要从月历点进某一天，Expo Router 可以怎么把选中的日期传给第二个页面？
>
> 请用中文解释，给一个短示例即可。这一步先不要修改文件。

**Result:** Explanation only, no files changed.
- `package.json` has `"main": "expo-router/entry"`, so Expo Router scans `src/app/`, and `src/app/index.tsx` (route `/`) is the first screen.
- `_layout.tsx` is the frame (theme, splash screen, the starter's tab bar). `index.tsx` is the content of one page.
- To pass the date: a dynamic route `src/app/day/[date].tsx`, `router.push({ pathname: '/day/[date]', params: { date: '2026-11-22' } })`, read with `useLocalSearchParams`. Params are strings, so pass `YYYY-MM-DD`, not a `Date`.
- Also noted: going to a day page and back needs a `Stack` in the layout instead of tabs.

## 2. Implement the app from SPEC.md

> 请阅读项目根目录的 SPEC.md，并按其中的页面要求和全部编号验收标准实现 Movie Calendar。
>
> 先检查 package.json 中的实际 Expo SDK 版本和项目的路由结构。沿用 Expo Router，依赖必须与这个项目的 SDK 和 Expo Go 兼容。
>
> 请实现月历和日期详情两个页面。用户可以切换月份、点击日期、输入或修改当天的电影名，并将记录保存在设备上。有记录的日期显示圆点。按 SPEC.md 处理空白输入、未保存就返回、保存失败，以及保存后回到原来浏览的月份。
>
> 直接在项目中修改代码并运行可用的检查。完成后列出修改的文件、实际运行过的检查，以及我需要在 Expo Go 真机上验证的步骤。保留 SPEC.md 原文，由我测试并提交初版。

**Result:**
- Checked the SDK first: `expo ~58.0.26`. Looked up the AsyncStorage version that matches SDK 58 in `node_modules/expo/bundledNativeModules.json` (`2.2.0`, included in Expo Go).
- Root layout changed from tabs to a `Stack`. The calendar stays mounted under the day screen, so going back returns to the same month.
- New files: `src/app/day/[date].tsx`, `src/lib/calendar.ts` (date logic), `src/lib/records.ts` (data shape), `src/lib/movie-store.ts` (AsyncStorage), `src/constants/calendar-theme.ts` (all colors and sizes in an `EDIT ME` block).
- Checks run by Claude: strict `tsc` on the pure logic files, 8 Node test groups (current month, December to January, leap years, exact date text, whitespace-only rejected, one movie per date, damaged data not overwritten), and a syntax check of every changed file. Full-project `tsc`, `expo lint` and the phone test were mine to run.
- I ran `npx expo install @react-native-async-storage/async-storage`, tested in Expo Go and committed: "Implement movie calendar and day screens". SPEC.md unchanged.

## 3. Try a movie-cover search (later removed)

> 我希望有一个搜索栏，在输入电影名字的同时，可以检索到电影的封面。这样就可以展现在日历上

**Result:** Before writing code, Claude asked two things:
- My first version wasn't committed yet. I chose to commit first, so the new feature would be a separate diff.
- Where covers come from. I chose the iTunes Search API (no API key) over TMDB (needs a key).

It then built a search bar on the day screen and small covers in the calendar cells, plus 7 more tests with a mocked network.

## 4. Remove the cover search

> 这个好像不行，我没有能搜到任何的电影封面，那就算了，把这个功能删掉吧

**Result:** On my phone the search never showed any covers, so I dropped the feature. Claude restored the five changed files to my committed version, and I deleted the new `src/lib/movie-search.ts`. The app is back to the version that passes SPEC.md.

---

## What I learned

- Expo Router picks the first page from the file structure (`src/app/index.tsx`). `_layout.tsx` decides how pages are arranged (tabs vs. stack).
- Data passed between pages travels as URL params, so it has to be a string.
- Use `npx expo install` instead of `npm install`, so versions match the SDK and Expo Go.
- Commit a working version before trying a risky feature. Removing the cover search was easy because the first version was already committed.
