/**
 * Darul Islah prayer-time adapter.
 * Source: https://www.darulislah.org/salah/ — a server-rendered "Masjidal"
 * WordPress widget that publishes a 7-day slideshow of adhan + iqamah +
 * Jumu'ah + sunrise/sunset times directly in the page HTML (no separate
 * API — the widget itself is the data source, so we parse the page).
 */

import type { PrayerTime, IqamahTime, JummahTime, Mosque } from '@/lib/types';

const SOURCE_URL = 'https://www.darulislah.org/salah/';
const MOSQUE_ID = 'darul-islah';

export interface PrayerTimeEntry {
  adhan: string;
  iqamah: string;
}

export interface PrayerDay {
  dateLabel: string;   // "Saturday, Sep 05 | Rabi' al-Awwal 23, 1448"
  fajr: PrayerTimeEntry;
  dhuhr: PrayerTimeEntry;
  asr: PrayerTimeEntry;
  maghrib: PrayerTimeEntry;
  isha: PrayerTimeEntry;
  sunrise: string;
  sunset: string;
  jumuah: { label: string; time: string }[];
}

export interface PrayerFetchResult {
  status: 'ok' | 'error';
  today: PrayerDay | null;
  days: PrayerDay[];
  sourceUrl: string;
  fetchedAt: string;
  error?: string;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

function prayerRegex(name: string): RegExp {
  return new RegExp(
    `namze_name">\\s*${name}\\s*</span></div><div class="time_namze"><span>([^<]+)</span><span class="text-center">([^<]+)</span>`
  );
}

function parseDay(block: string): PrayerDay | null {
  const dateMatch = block.match(/heading_date[^>]*>([^<]+)</);
  const fajr = block.match(prayerRegex('Fajr'));
  const dhuhr = block.match(prayerRegex('Dhuhr'));
  const asr = block.match(prayerRegex('Asr'));
  const maghrib = block.match(prayerRegex('Maghrib'));
  const isha = block.match(prayerRegex('Isha'));

  if (!dateMatch || !fajr || !dhuhr || !asr || !maghrib || !isha) return null;

  const jumuah = [...block.matchAll(/col-6 text-center"><h1>([^<]+)<\/h1><span>JUMUAH (\d)<\/span>/g)]
    .map(m => ({ label: `Jumu'ah ${m[2]}`, time: clean(m[1]) }));

  // Sunrise/sunset render as two <h1> values inside the "am-pm" row —
  // sunrise (AM icon) on the left, sunset (matches Maghrib adhan) on the right.
  const ampm = block.match(/am-pm">.*?<h1>(?:<img[^>]*>)?([^<]+)<\/h1>.*?<h1>([^<]+)<img/);

  const entry = (m: RegExpMatchArray): PrayerTimeEntry => ({ adhan: clean(m[1]), iqamah: clean(m[2]) });

  return {
    dateLabel: clean(dateMatch[1]),
    fajr: entry(fajr),
    dhuhr: entry(dhuhr),
    asr: entry(asr),
    maghrib: entry(maghrib),
    isha: entry(isha),
    sunrise: ampm ? clean(ampm[1]) : entry(fajr).adhan,
    sunset: ampm ? clean(ampm[2]) : entry(maghrib).adhan,
    jumuah,
  };
}

export async function fetchDarulIslahPrayerTimes(): Promise<PrayerFetchResult> {
  const fetchedAt = new Date().toISOString();

  try {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
      next: { revalidate: 3600 }, // widget publishes daily; re-check hourly
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const blocks = html.split('mySlides_new fade count_').slice(1);
    const days = blocks.map(parseDay).filter((d): d is PrayerDay => d !== null);

    if (days.length === 0) throw new Error('No prayer time blocks found on page');

    return { status: 'ok', today: days[0], days, sourceUrl: SOURCE_URL, fetchedAt };
  } catch (err) {
    return { status: 'error', today: null, days: [], sourceUrl: SOURCE_URL, fetchedAt, error: String(err) };
  }
}

// ── converters into the app's shared prayer-time types ──────────────────────

export function toPrayerTime(day: PrayerDay): PrayerTime {
  return {
    fajr: day.fajr.adhan,
    sunrise: day.sunrise,
    dhuhr: day.dhuhr.adhan,
    asr: day.asr.adhan,
    maghrib: day.maghrib.adhan,
    isha: day.isha.adhan,
  };
}

export function toIqamahTime(day: PrayerDay): IqamahTime {
  return {
    mosqueId: MOSQUE_ID,
    fajr: day.fajr.iqamah,
    dhuhr: day.dhuhr.iqamah,
    asr: day.asr.iqamah,
    maghrib: day.maghrib.iqamah,
    isha: day.isha.iqamah,
  };
}

export function toJummahTime(day: PrayerDay): JummahTime {
  return {
    mosqueId: MOSQUE_ID,
    khutbahs: day.jumuah.map(j => ({ label: j.label, time: j.time })),
  };
}

/** Returns `mosques` with Darul Islah's prayer/iqamah/Jumu'ah fields filled
 *  in from the live source. Leaves every other mosque untouched — we only
 *  have a real feed for our home mosque. Falls back silently to the input
 *  array (no live fields) if the source can't be reached. */
export async function withLiveDarulIslahTimes(mosques: Mosque[]): Promise<Mosque[]> {
  const result = await fetchDarulIslahPrayerTimes();
  if (result.status !== 'ok' || !result.today) return mosques;
  const { today } = result;
  return mosques.map(m =>
    m.id === MOSQUE_ID
      ? { ...m, prayerTimes: toPrayerTime(today), iqamahTimes: toIqamahTime(today), jummahTimes: toJummahTime(today) }
      : m
  );
}
