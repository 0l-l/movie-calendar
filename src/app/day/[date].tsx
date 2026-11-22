import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CalendarTheme, useCalendarColors } from '@/constants/calendar-theme';
import { formatLongDate, normalizeTitle, parseDateKey } from '@/lib/calendar';
import { getMovie, saveMovie } from '@/lib/movie-store';

const { size, space, font } = CalendarTheme;

type Status = 'loading' | 'ready' | 'saving';
type Message = { kind: 'validation' | 'error'; text: string } | null;

// Day screen (route "/day/2026-11-22").
// The date comes from the file name [date] via useLocalSearchParams.
export default function DayScreen() {
  const colors = useCalendarColors();
  const { date } = useLocalSearchParams<{ date: string }>();
  const dateKey = typeof date === 'string' ? date : '';
  const parts = parseDateKey(dateKey);

  // Unsaved edits live only in this state. Leaving the screen throws them away.
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    if (parseDateKey(dateKey) === null) return;
    let active = true;
    getMovie(dateKey)
      .then((saved) => {
        if (!active) return;
        setTitle(saved ?? '');
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('ready');
        setMessage({ kind: 'error', text: 'Could not load the saved title for this date.' });
      });
    return () => {
      active = false;
    };
  }, [dateKey]);

  async function handleSave() {
    if (status !== 'ready') return;

    const clean = normalizeTitle(title);
    if (clean === null) {
      // Nothing is written, so any existing record stays as it was.
      setMessage({ kind: 'validation', text: 'Enter a movie title. Spaces alone are not saved.' });
      return;
    }

    setStatus('saving');
    setMessage(null);
    try {
      await saveMovie(dateKey, clean);
    } catch {
      // Stay here and keep what the user typed.
      setStatus('ready');
      setMessage({ kind: 'error', text: 'Could not save. Your text is still here, please try again.' });
      return;
    }

    // Back to the calendar, which is still showing the month the user was on.
    if (router.canGoBack()) {
      router.back();
    } else {
      // Opened directly (e.g. by a link): open the calendar on this date's month.
      router.replace({ pathname: '/', params: { month: dateKey.slice(0, 7) } });
    }
  }

  if (parts === null) {
    return (
      <View style={[styles.page, { backgroundColor: colors.paper }]}>
        <Text style={[styles.dateTitle, { color: colors.ink }]}>Date not found</Text>
        <Text style={[styles.hint, { color: colors.muted }]}>
          This link does not point to a valid date.
        </Text>
      </View>
    );
  }

  const busy = status !== 'ready';

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled">
      <Text style={[styles.dateTitle, { color: colors.ink }]} accessibilityRole="header">
        {formatLongDate(parts)}
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.muted }]}>
          Movie title
        </Text>
        <TextInput
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (message?.kind === 'validation') setMessage(null);
          }}
          editable={status !== 'saving'}
          placeholder={status === 'loading' ? 'Loading…' : 'What did you watch?'}
          placeholderTextColor={colors.muted}
          accessibilityLabel="Movie title"
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={200}
          style={[
            styles.input,
            {
              color: colors.ink,
              backgroundColor: colors.field,
              borderColor: message ? colors.danger : colors.hairline,
            },
          ]}
        />
        {message && (
          <Text style={[styles.hint, { color: colors.danger }]} accessibilityRole="alert">
            {message.text}
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleSave}
        disabled={busy}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.ink },
          (busy || pressed) && styles.dimmed,
        ]}>
        <Text style={[styles.buttonText, { color: colors.paper }]}>
          {status === 'saving' ? 'Saving…' : 'Save'}
        </Text>
      </Pressable>

      <Text style={[styles.hint, { color: colors.muted }]}>
        One movie per date. Saving again replaces the title. Going back without saving keeps the
        old one.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingHorizontal: space.page,
    paddingTop: space.section,
    paddingBottom: space.section * 2,
    gap: space.section,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  dateTitle: {
    fontFamily: font.display,
    fontSize: size.dateTitle,
    lineHeight: size.dateTitle * 1.3,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: size.hint,
    letterSpacing: 0.3,
  },
  input: {
    fontSize: size.body,
    borderWidth: 1,
    borderRadius: space.radius,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  button: {
    borderRadius: space.radius,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: size.body,
    fontWeight: '600',
  },
  dimmed: {
    opacity: 0.55,
  },
  hint: {
    fontSize: size.hint,
    lineHeight: 22,
  },
});
