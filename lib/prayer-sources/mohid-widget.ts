/**
 * Parser for the "mohid.co" masjid-management prayer-time widget — used by
 * both ICPC and BCIEC (and possibly other mosques on the same platform).
 * The widget server-renders real adhan/iqamah/Jumu'ah times directly into
 * plain HTML `<li>` blocks, so — like the Darul Islah/Masjidal widget — it
 * can be parsed directly with no LLM needed.
 *
 * URL pattern: https://us.mohid.co/{state}/{region}/{masjid-slug}/masjid/widget/api/index/?m=prayertimings
 */

import type { PrayerDayData } from './types';

function extractPrayer(html: string, labelPattern: string): { adhan: string; iqamah: string } | null {
  const re = new RegExp(
    `(?:${labelPattern})[\\s\\S]*?prayer_iqama_div"[^>]*>\\s*([^<]+?)\\s*<\\/div>[\\s\\S]*?prayer_azaan_div"[^>]*>\\s*([^<]+?)\\s*<\\/div>`,
    'i'
  );
  const m = html.match(re);
  if (!m) return null;
  return { iqamah: m[1].trim(), adhan: m[2].trim() };
}

function extractJumuah(html: string): { label: string; time: string }[] {
  const results: { label: string; time: string }[] = [];
  const re = /Friday Khutba\s*(\d+)[\s\S]*?prayer_iqama_div"[^>]*>\s*([^<]+?)\s*<\/div>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    results.push({ label: `Khutbah ${m[1]}`, time: m[2].trim() });
  }
  return results;
}

export function parseMohidWidget(html: string): PrayerDayData | null {
  const fajr = extractPrayer(html, 'Fajr|Fajar');
  const dhuhr = extractPrayer(html, 'Dhuhr|Duhar|Duhr|Zuhr');
  const asr = extractPrayer(html, 'Asr');
  const maghrib = extractPrayer(html, 'Maghrib');
  const isha = extractPrayer(html, "Isha(?:a')?");

  if (!fajr && !dhuhr && !asr && !maghrib && !isha) return null;

  return {
    fajr, dhuhr, asr, maghrib, isha,
    sunrise: null, // this widget doesn't publish a sunrise time
    jumuah: extractJumuah(html),
  };
}
