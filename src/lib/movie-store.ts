// Reads and writes movie records on the device with AsyncStorage.
// Works offline; data survives closing Expo Go.

import AsyncStorage from '@react-native-async-storage/async-storage';

import { parseRecords, withMovie, type MovieRecords } from '@/lib/records';

const STORAGE_KEY = 'movie-calendar/records/v1';

export async function loadRecords(): Promise<MovieRecords> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return parseRecords(raw);
}

export async function getMovie(dateKey: string): Promise<string | null> {
  const records = await loadRecords();
  return records[dateKey] ?? null;
}

/** Saves (or replaces) the title for one date. Throws if reading or writing fails. */
export async function saveMovie(dateKey: string, title: string): Promise<void> {
  const records = await loadRecords();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withMovie(records, dateKey, title)));
}
