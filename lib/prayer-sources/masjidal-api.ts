/**
 * masjidal.com publishes a public, unauthenticated JSON API for any mosque
 * using their platform (found via network inspection of a mosque's embedded
 * widget — Fusion MCC and Al Aisha both use it, likely under different
 * front-end skins but the same backend/masjid_id). No API key needed.
 */

import type { PrayerDayData } from './types';

function normalizeTime(raw: string | undefined): string {
  if (!raw) return '';
  // "5:09AM" -> "5:09 AM"
  return raw.replace(/(\d)(AM|PM)/i, '$1 $2').trim();
}

export async function fetchMasjidalApiDay(masjidId: string, dateStr: string): Promise<PrayerDayData | null> {
  const url = `https://masjidal.com/api/v1/time/range?masjid_id=${encodeURIComponent(masjidId)}&masjid_detail=yes&from_date=${dateStr}&to_date=${dateStr}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const salah = data?.data?.salah?.[0];
  const iqamah = data?.data?.iqamah?.[0];
  if (!salah && !iqamah) return null;

  const pair = (salahKey: string, iqamahKey: string) => {
    const adhan = normalizeTime(salah?.[salahKey]);
    const iq = normalizeTime(iqamah?.[iqamahKey]);
    return adhan || iq ? { adhan: adhan || iq, iqamah: iq || adhan } : null;
  };

  const jumuah = ['jummah1', 'jummah2']
    .map((key, i) => ({ label: `Jumu'ah ${i + 1}`, time: normalizeTime(iqamah?.[key]) }))
    .filter(j => j.time && j.time !== '-');

  return {
    fajr: pair('fajr', 'fajr'),
    dhuhr: pair('zuhr', 'zuhr'),
    asr: pair('asr', 'asr'),
    maghrib: pair('maghrib', 'maghrib'),
    isha: pair('isha', 'isha'),
    sunrise: normalizeTime(salah?.sunrise) || null,
    jumuah,
  };
}
