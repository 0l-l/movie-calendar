// Pure helpers for the saved data shape. No React Native imports, so this
// file can be tested with plain Node.
//
// All records live in one JSON object: { "2026-11-22": "Paddington", ... }
// One title per date key, so saving a date again replaces its title.

export type MovieRecords = Record<string, string>;

/**
 * Turns the stored string back into records.
 * Throws if the stored data is damaged, so a later save never overwrites
 * (and loses) records we couldn't read.
 */
export function parseRecords(raw: string | null): MovieRecords {
  if (raw === null) return {};
  const parsed: unknown = JSON.parse(raw);
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Saved movie data is not in the expected format.');
  }
  const records: MovieRecords = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') records[key] = value;
  }
  return records;
}

/** Returns a new object with this date's title set (or replaced). */
export function withMovie(records: MovieRecords, dateKey: string, title: string): MovieRecords {
  return { ...records, [dateKey]: title };
}
