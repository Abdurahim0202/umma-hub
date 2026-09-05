/**
 * Minimal iCal (RFC 5545) text parser.
 * No external dependencies — parses VEVENT blocks into plain objects.
 */

export interface VEvent {
  uid: string;
  summary: string;
  description: string;
  url: string;
  dtstart: string;        // ISO 8601 string or YYYYMMDD
  dtend: string;
  allDay: boolean;
  categories: string;
  image?: string;         // ATTACH (image)
}

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * Unfold iCal lines (RFC 5545 line folding: CRLF + whitespace = continuation)
 */
function unfold(text: string): string {
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

/**
 * Parse a DTSTART/DTEND value into an ISO string.
 * Handles:
 *   DTSTART;VALUE=DATE:20260905         → "2026-09-05T00:00:00"
 *   DTSTART;TZID=America/New_York:20260905T054500 → "2026-09-05T05:45:00"
 *   DTSTART:20260905T054500Z            → "2026-09-05T05:45:00Z"
 */
function parseIcalDate(line: string): { iso: string; allDay: boolean } {
  const allDay = line.includes('VALUE=DATE') && !line.includes('T');
  // Extract value after the last colon
  const raw = line.replace(/^[^:]+:/, '').trim();

  if (/^\d{8}$/.test(raw)) {
    // Pure date — YYYYMMDD
    const iso = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T00:00:00`;
    return { iso, allDay: true };
  }
  if (/^\d{8}T\d{6}Z?$/.test(raw)) {
    const iso =
      `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}` +
      `T${raw.slice(9, 11)}:${raw.slice(11, 13)}:${raw.slice(13, 15)}` +
      (raw.endsWith('Z') ? 'Z' : '');
    return { iso, allDay: false };
  }
  // Fallback
  return { iso: raw, allDay: false };
}

// ── parser ───────────────────────────────────────────────────────────────────

/**
 * Parse raw iCal text into an array of VEvent objects.
 */
export function parseIcal(rawText: string): VEvent[] {
  const text = unfold(rawText);
  const events: VEvent[] = [];
  const blocks = text.split('BEGIN:VEVENT');

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const lines = block.split(/\r?\n/);

    const get = (prefix: string) =>
      lines
        .find(l => l.toUpperCase().startsWith(prefix.toUpperCase()))
        ?.replace(/^[^:]+:/, '')
        .trim() ?? '';

    const getLine = (prefix: string) =>
      lines.find(l => l.toUpperCase().startsWith(prefix.toUpperCase())) ?? '';

    const uidRaw    = get('UID');
    const summary   = get('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, ' ').trim();
    const desc      = get('DESCRIPTION').replace(/\\,/g, ',').replace(/\\n/g, '\n').trim();
    const url       = get('URL');
    const cats      = get('CATEGORIES');

    const dtstartLine = getLine('DTSTART');
    const dtendLine   = getLine('DTEND');

    if (!dtstartLine) continue; // skip malformed

    const { iso: startIso, allDay } = parseIcalDate(dtstartLine);
    const { iso: endIso } = dtendLine ? parseIcalDate(dtendLine) : { iso: startIso };

    // Image: ATTACH;FMTTYPE=image/...
    const imgLine = lines.find(l =>
      l.startsWith('ATTACH') && /fmttype=image\//i.test(l)
    );
    const image = imgLine ? imgLine.replace(/^[^:]+:/, '').trim() : undefined;

    if (!summary) continue; // skip events with no title

    events.push({
      uid: uidRaw,
      summary,
      description: desc,
      url,
      dtstart: startIso,
      dtend: endIso,
      allDay,
      categories: cats,
      image,
    });
  }

  return events;
}

/**
 * Convert a VEvent to the date string (YYYY-MM-DD) used throughout the app.
 */
export function vEventDate(ev: VEvent): string {
  return ev.dtstart.slice(0, 10);
}
