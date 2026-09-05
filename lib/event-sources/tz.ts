/**
 * Shared timezone helpers for adapters that receive "floating" wall-clock
 * times (no UTC offset) from a mosque's feed — e.g. an iCal TZID value or a
 * plain "5:00 pm" field. Every mosque we source from is in
 * America/New_York, so times must always be interpreted in that zone
 * regardless of the timezone the server process happens to run in.
 */

/** Get the UTC offset (e.g. "-04:00") a named IANA timezone observes on a given calendar date. */
export function tzOffsetForDate(year: number, month: number, day: number, tz: string): string {
  const probe = new Date(Date.UTC(year, month - 1, day, 12)); // midday avoids DST-boundary edge cases
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(probe);
  const tzName = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const match = tzName.match(/GMT([+-]\d+)(?::?(\d{2}))?/);
  const hours = match ? parseInt(match[1], 10) : -5;
  const minutes = match?.[2] ? parseInt(match[2], 10) : 0;
  const sign = hours < 0 ? '-' : '+';
  return `${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Parse "5:00 pm" / "6:00 AM" into 24-hour { hour, minute }, or null if unparseable. */
export function parse12HourTime(raw: string): { hour: number; minute: number } | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const isPM = m[3].toLowerCase() === 'pm';
  if (hour === 12) hour = isPM ? 12 : 0;
  else if (isPM) hour += 12;
  return { hour, minute };
}

/** Build "YYYY-MM-DDTHH:MM:00±HH:MM" for a wall-clock date/time in `tz`. */
export function toZonedIso(year: number, month: number, day: number, hour: number, minute: number, tz: string): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const offset = tzOffsetForDate(year, month, day, tz);
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${offset}`;
}
