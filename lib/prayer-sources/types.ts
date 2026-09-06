/**
 * Shared types for the multi-mosque prayer-time pipeline. Every source
 * (a mosque-specific widget parser, the masjidal.com API, or the Groq
 * fallback extractor) normalizes into this same shape so the rest of the
 * app doesn't need to know which method produced a given mosque's times.
 */

export interface PrayerTimeEntry {
  adhan: string;
  iqamah: string;
}

export interface JumuahEntry {
  label: string;
  time: string;
}

export interface PrayerDayData {
  fajr: PrayerTimeEntry | null;
  dhuhr: PrayerTimeEntry | null;
  asr: PrayerTimeEntry | null;
  maghrib: PrayerTimeEntry | null;
  isha: PrayerTimeEntry | null;
  sunrise: string | null;
  jumuah: JumuahEntry[];
}

export type PrayerSourceType = 'widget' | 'masjidal-api' | 'ai-extracted' | 'none';

export interface MosquePrayerResult {
  mosqueId: string;
  status: 'ok' | 'no_source' | 'error';
  sourceUrl: string;
  sourceType: PrayerSourceType;
  day: PrayerDayData | null;
  error?: string;
  fetchedAt: string;
}
