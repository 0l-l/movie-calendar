import { Platform, useColorScheme } from 'react-native';

/* ============================================================
 * EDIT ME: theme
 * All colors, fonts and sizes for the calendar and day screens.
 * `accent` is the single accent color: it marks dates with a movie.
 * ============================================================ */
export const CalendarTheme = {
  accent: '#C2410C',
  light: {
    ink: '#1A1A1A', // main text
    muted: '#6B6B6B', // weekday labels, hints
    paper: '#FAF8F4', // page background
    field: '#FFFFFF', // text input background
    hairline: '#E4E0D8', // thin dividers and input border
    todayFill: '#ECE8E0', // circle behind today's number
    danger: '#B42318', // error and validation text
  },
  dark: {
    ink: '#F2F0EB',
    muted: '#A3A3A3',
    paper: '#121212',
    field: '#1C1C1C',
    hairline: '#2E2E2E',
    todayFill: '#262626',
    danger: '#F97066',
  },
  font: {
    // Display face for the month title and the date heading.
    display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
  size: {
    monthTitle: 26,
    dateTitle: 26,
    weekday: 12,
    day: 17,
    body: 16,
    hint: 14,
  },
  space: {
    page: 24, // left/right page padding
    section: 24, // gap between blocks
    cellHeight: 52, // height of one date cell
    dot: 6, // diameter of the "has a movie" dot
    todayCircle: 34,
    radius: 10,
  },
} as const;
/* ===================== end EDIT ME ===================== */

export type CalendarColors = { [K in keyof (typeof CalendarTheme)['light']]: string } & {
  accent: string;
};

export function useCalendarColors(): CalendarColors {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? CalendarTheme.dark : CalendarTheme.light;
  return { ...palette, accent: CalendarTheme.accent };
}
