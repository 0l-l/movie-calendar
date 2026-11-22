import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarTheme, useCalendarColors } from '@/constants/calendar-theme';
import {
  buildMonthGrid,
  currentMonth,
  formatMonthTitle,
  MONTH_NAMES,
  parseMonthKey,
  shiftMonth,
  toDateKey,
  todayKey,
  WEEKDAY_SHORT,
  type YearMonth,
} from '@/lib/calendar';
import { loadRecords } from '@/lib/movie-store';
import type { MovieRecords } from '@/lib/records';

const { size, space, font } = CalendarTheme;

// Calendar screen (route "/").
// Optional ?month=YYYY-MM opens a specific month; otherwise the current local month.
export default function CalendarScreen() {
  const colors = useCalendarColors();
  const { month: monthParam } = useLocalSearchParams<{ month?: string }>();

  const [visibleMonth, setVisibleMonth] = useState<YearMonth>(
    () => parseMonthKey(monthParam) ?? currentMonth()
  );
  const [records, setRecords] = useState<MovieRecords>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [today, setToday] = useState(() => todayKey());

  // Reload records every time this screen comes back into focus,
  // so a date saved on the day screen shows its dot right away.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setToday(todayKey());
      loadRecords()
        .then((saved) => {
          if (!active) return;
          setRecords(saved);
          setLoadError(null);
        })
        .catch(() => {
          if (active) setLoadError('Could not load saved movies. Try reopening the app.');
        });
      return () => {
        active = false;
      };
    }, [])
  );

  const weeks = buildMonthGrid(visibleMonth);
  const prev = shiftMonth(visibleMonth, -1);
  const next = shiftMonth(visibleMonth, 1);

  function openDay(day: number) {
    const date = toDateKey(visibleMonth.year, visibleMonth.month, day);
    router.push({ pathname: '/day/[date]', params: { date } });
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={styles.page}>
      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => setVisibleMonth(prev)}
          accessibilityRole="button"
          accessibilityLabel={`Previous month, ${MONTH_NAMES[prev.month]} ${prev.year}`}
          hitSlop={8}
          style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
          <Text style={[styles.navText, { color: colors.ink }]}>‹</Text>
        </Pressable>

        <Text
          style={[styles.monthTitle, { color: colors.ink }]}
          accessibilityRole="header">
          {formatMonthTitle(visibleMonth)}
        </Text>

        <Pressable
          onPress={() => setVisibleMonth(next)}
          accessibilityRole="button"
          accessibilityLabel={`Next month, ${MONTH_NAMES[next.month]} ${next.year}`}
          hitSlop={8}
          style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
          <Text style={[styles.navText, { color: colors.ink }]}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.weekRow, styles.weekdayRow, { borderColor: colors.hairline }]}>
        {WEEKDAY_SHORT.map((label) => (
          <Text key={label} style={[styles.weekday, { color: colors.muted }]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, w) => (
        <View key={w} style={styles.weekRow}>
          {week.map((day, d) => {
            if (day === null) return <View key={d} style={styles.cell} />;

            const key = toDateKey(visibleMonth.year, visibleMonth.month, day);
            const hasMovie = records[key] !== undefined;
            const isToday = key === today;

            return (
              <Pressable
                key={d}
                onPress={() => openDay(day)}
                accessibilityRole="button"
                accessibilityLabel={`${MONTH_NAMES[visibleMonth.month]} ${day}${
                  hasMovie ? `, watched ${records[key]}` : ''
                }`}
                style={({ pressed }) => [styles.cell, pressed && styles.pressed]}>
                <View
                  style={[styles.dayCircle, isToday && { backgroundColor: colors.todayFill }]}>
                  <Text
                    style={[
                      styles.dayText,
                      { color: colors.ink },
                      isToday && styles.todayText,
                    ]}>
                    {day}
                  </Text>
                </View>
                <View
                  style={[styles.dot, hasMovie && { backgroundColor: colors.accent }]}
                />
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={[styles.footer, { borderColor: colors.hairline }]}>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.hint, { color: colors.muted }]}>A movie is saved on this date</Text>
        </View>
        <Text style={[styles.hint, { color: colors.muted }]}>
          Tap any date to add or change its movie.
        </Text>
        {loadError && (
          <Text style={[styles.hint, { color: colors.danger }]} accessibilityRole="alert">
            {loadError}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: space.page,
    paddingTop: space.section / 2,
    paddingBottom: space.section * 2,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.section,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 32,
    lineHeight: 36,
  },
  monthTitle: {
    fontFamily: font.display,
    fontSize: size.monthTitle,
    textAlign: 'center',
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekdayRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: size.weekday,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cell: {
    flex: 1,
    height: space.cellHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dayCircle: {
    width: space.todayCircle,
    height: space.todayCircle,
    borderRadius: space.todayCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: size.day,
  },
  todayText: {
    fontWeight: '700',
  },
  dot: {
    width: space.dot,
    height: space.dot,
    borderRadius: space.dot / 2,
  },
  pressed: {
    opacity: 0.5,
  },
  footer: {
    marginTop: space.section,
    paddingTop: space.section,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hint: {
    fontSize: size.hint,
    lineHeight: 22,
  },
});
