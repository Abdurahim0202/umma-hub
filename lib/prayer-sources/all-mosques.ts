/**
 * Prayer-time aggregator for all 9 mosques.
 *
 * Preference order per mosque, strongest first:
 *   1. A mosque-specific structured widget/API we can parse exactly
 *      (Darul Islah's Masjidal WordPress widget, the masjidal.com JSON API,
 *      the mohid.co widget shared by ICPC/BCIEC).
 *   2. Groq, asked to extract times from the mosque's own homepage text —
 *      only for mosques with no structured source, and only ever returning
 *      times it can point to explicitly in that text.
 *   3. No data — shown as "not available" rather than invented.
 *
 * An LLM is deliberately the fallback, not the default: a direct parse of a
 * mosque's own structured feed is strictly more reliable than an LLM's best
 * guess at unstructured text, so we only reach for Groq when nothing better
 * exists.
 */

import type { Mosque, PrayerTime, IqamahTime, JummahTime } from '@/lib/types';
import type { MosquePrayerResult, PrayerDayData } from './types';
import { fetchDarulIslahPrayerTimes } from './darul-islah';
import { fetchMasjidalApiDay } from './masjidal-api';
import { parseMohidWidget } from './mohid-widget';
import { extractPrayerTimesWithGroq } from './groq-extract';
import { ymdInTz } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';

type SourceConfig =
  | { kind: 'darul-islah' }
  | { kind: 'masjidal-api'; masjidId: string; url: string }
  | { kind: 'mohid-widget'; url: string }
  | { kind: 'ai-fallback'; url: string }
  | { kind: 'none' };

const MOSQUE_SOURCES: Record<string, SourceConfig> = {
  'darul-islah': { kind: 'darul-islah' },
  icpc: { kind: 'mohid-widget', url: 'https://us.mohid.co/nj/paterson/icpc/masjid/widget/api/index/?m=prayertimings' },
  bciec: { kind: 'mohid-widget', url: 'https://us.mohid.co/nj/njrgn/bcic/masjid/widget/api/index/?m=prayertimings' },
  'mcc-paramus': { kind: 'masjidal-api', masjidId: '1QL0VadZ', url: 'https://www.fmccnj.com' },
  'masjid-al-aisha': { kind: 'masjidal-api', masjidId: 'VL4JvVdx', url: 'https://masjidalaisha.org' },
  'nida-ul-islam': { kind: 'ai-fallback', url: 'https://nidaulislam.org' },
  'ulu-cami': { kind: 'ai-fallback', url: 'https://ulucami.org' },
  'omar-mosque': { kind: 'ai-fallback', url: 'https://omarmosque.org' },
  'diyanet-bergen': { kind: 'none' }, // page confirmed gone; no current URL to check
};

async function fetchOne(mosqueId: string, mosqueName: string, config: SourceConfig): Promise<MosquePrayerResult> {
  const fetchedAt = new Date().toISOString();
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);

  if (config.kind === 'none') {
    return { mosqueId, status: 'no_source', sourceUrl: '', sourceType: 'none', day: null, fetchedAt };
  }

  if (config.kind === 'darul-islah') {
    const result = await fetchDarulIslahPrayerTimes();
    if (result.status !== 'ok' || !result.today) {
      return { mosqueId, status: 'error', sourceUrl: result.sourceUrl, sourceType: 'widget', day: null, error: result.error, fetchedAt };
    }
    const t = result.today;
    const day: PrayerDayData = {
      fajr: t.fajr, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha,
      sunrise: t.sunrise,
      jumuah: t.jumuah,
    };
    return { mosqueId, status: 'ok', sourceUrl: result.sourceUrl, sourceType: 'widget', day, fetchedAt };
  }

  try {
    if (config.kind === 'masjidal-api') {
      const day = await fetchMasjidalApiDay(config.masjidId, todayStr);
      return day
        ? { mosqueId, status: 'ok', sourceUrl: config.url, sourceType: 'masjidal-api', day, fetchedAt }
        : { mosqueId, status: 'no_source', sourceUrl: config.url, sourceType: 'masjidal-api', day: null, fetchedAt };
    }

    if (config.kind === 'mohid-widget') {
      const res = await fetch(config.url, {
        headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
        next: { revalidate: 3600 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const day = parseMohidWidget(html);
      return day
        ? { mosqueId, status: 'ok', sourceUrl: config.url, sourceType: 'widget', day, fetchedAt }
        : { mosqueId, status: 'no_source', sourceUrl: config.url, sourceType: 'widget', day: null, fetchedAt };
    }

    // ai-fallback
    const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: APP_CONFIG.timezone });
    const day = await extractPrayerTimesWithGroq(mosqueName, config.url, todayLabel);
    return day
      ? { mosqueId, status: 'ok', sourceUrl: config.url, sourceType: 'ai-extracted', day, fetchedAt }
      : { mosqueId, status: 'no_source', sourceUrl: config.url, sourceType: 'ai-extracted', day: null, fetchedAt };
  } catch (err) {
    const url = 'url' in config ? config.url : '';
    return { mosqueId, status: 'error', sourceUrl: url, sourceType: 'none', day: null, error: String(err), fetchedAt };
  }
}

export async function fetchAllMosquePrayerTimes(mosques: Mosque[]): Promise<MosquePrayerResult[]> {
  return Promise.all(
    mosques.map(m => fetchOne(m.id, m.name, MOSQUE_SOURCES[m.id] ?? { kind: 'none' }))
  );
}

/** Like `withLivePrayerTimes`, but only fetches the one mosque requested —
 *  for pages (like a mosque's own detail page) that don't need all 9. */
export async function withLivePrayerTimesFor(mosque: Mosque): Promise<Mosque> {
  const result = await fetchOne(mosque.id, mosque.name, MOSQUE_SOURCES[mosque.id] ?? { kind: 'none' });
  if (result.status !== 'ok' || !result.day) return mosque;
  return {
    ...mosque,
    prayerTimes: toPrayerTime(result.day) ?? mosque.prayerTimes,
    iqamahTimes: toIqamahTime(mosque.id, result.day) ?? mosque.iqamahTimes,
    jummahTimes: toJummahTime(mosque.id, result.day) ?? mosque.jummahTimes,
  };
}

// ── convert into the app's shared PrayerTime/IqamahTime/JummahTime shapes ──

function toPrayerTime(day: PrayerDayData): PrayerTime | undefined {
  if (!day.fajr && !day.dhuhr && !day.asr && !day.maghrib && !day.isha) return undefined;
  return {
    fajr: day.fajr?.adhan ?? '—',
    sunrise: day.sunrise ?? '—',
    dhuhr: day.dhuhr?.adhan ?? '—',
    asr: day.asr?.adhan ?? '—',
    maghrib: day.maghrib?.adhan ?? '—',
    isha: day.isha?.adhan ?? '—',
  };
}

function toIqamahTime(mosqueId: string, day: PrayerDayData): IqamahTime | undefined {
  if (!day.fajr && !day.dhuhr && !day.asr && !day.maghrib && !day.isha) return undefined;
  return {
    mosqueId,
    fajr: day.fajr?.iqamah ?? '—',
    dhuhr: day.dhuhr?.iqamah ?? '—',
    asr: day.asr?.iqamah ?? '—',
    maghrib: day.maghrib?.iqamah ?? '—',
    isha: day.isha?.iqamah ?? '—',
  };
}

function toJummahTime(mosqueId: string, day: PrayerDayData): JummahTime | undefined {
  if (day.jumuah.length === 0) return undefined;
  return { mosqueId, khutbahs: day.jumuah.map(j => ({ label: j.label, time: j.time })) };
}

/** Returns `mosques` with every mosque's prayer/iqamah/Jumu'ah fields filled
 *  in from whatever real source is available for it. Mosques with no
 *  reachable source are left untouched (no invented data). */
export async function withLivePrayerTimes(mosques: Mosque[]): Promise<Mosque[]> {
  const results = await fetchAllMosquePrayerTimes(mosques);
  const byId = new Map(results.map(r => [r.mosqueId, r]));

  return mosques.map(m => {
    const result = byId.get(m.id);
    if (!result || result.status !== 'ok' || !result.day) return m;
    return {
      ...m,
      prayerTimes: toPrayerTime(result.day) ?? m.prayerTimes,
      iqamahTimes: toIqamahTime(m.id, result.day) ?? m.iqamahTimes,
      jummahTimes: toJummahTime(m.id, result.day) ?? m.jummahTimes,
    };
  });
}
