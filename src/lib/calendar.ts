// Pure date helpers for the calendar. No React Native imports, so this file
// can be tested with plain Node.
//
// Months are 0-based (0 = January) to match JavaScript's Date.
// A "date key" is a local calendar date written as YYYY-MM-DD.
// A "month key" is a local month written as YYYY-MM.

export type YearMonth = { year: number; month: number };
export type DateParts = { year: number; month: number; day: number };

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

export function toMonthKey({ year, month }: YearMonth): string {
  return `${year}-${pad2(month + 1)}`;
}

/** Today's date key, using the phone's local time zone. */
export function todayKey(now: Date = new Date()): string {
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

/** The month that contains `now`, in local time. */
export function currentMonth(now: Date = new Date()): YearMonth {
  return { year: now.getFullYear(), month: now.getMonth() };
}

/** Parses YYYY-MM-DD. Returns null for anything that isn't a real date (e.g. 2026-02-30). */
export function parseDateKey(key: unknown): DateParts | null {
  if (typeof key !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const check = new Date(year, month, day);
  if (check.getFullYear() !== year || check.getMonth() !== month || check.getDate() !== day) {
    return null;
  }
  return { year, month, day };
}

/** Parses YYYY-MM. Returns null if missing or invalid. */
export function parseMonthKey(key: unknown): YearMonth | null {
  if (typeof key !== 'string') return null;
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year, month };
}

/** Moves forward (+1) or back (-1) by whole months, crossing years correctly. */
export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export function daysInMonth({ year, month }: YearMonth): number {
  // Day 0 of the next month is the last day of this month.
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Weeks of the month, Sunday first. Each week has 7 slots;
 * a slot is the day number, or null for padding before day 1 / after the last day.
 */
export function buildMonthGrid(ym: YearMonth): (number | null)[][] {
  const leading = new Date(ym.year, ym.month, 1).getDay();
  const total = daysInMonth(ym);
  const slots: (number | null)[] = [];
  for (let i = 0; i < leading; i++) slots.push(null);
  for (let d = 1; d <= total; d++) slots.push(d);
  while (slots.length % 7 !== 0) slots.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < slots.length; i += 7) weeks.push(slots.slice(i, i + 7));
  return weeks;
}

export function formatMonthTitle({ year, month }: YearMonth): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/** e.g. "Sunday, November 22, 2026" */
export function formatLongDate({ year, month, day }: DateParts): string {
  const weekday = WEEKDAY_NAMES[new Date(year, month, day).getDay()];
  return `${weekday}, ${MONTH_NAMES[month]} ${day}, ${year}`;
}

/** Trims the title. Returns null when nothing is left (empty or only spaces). */
export function normalizeTitle(input: string): string | null {
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}
