/**
 * Fallback prayer-time extraction via Groq, for mosques whose sites don't
 * expose a structured widget/API we can parse directly. Only used when no
 * deterministic source exists — an LLM should never be preferred over an
 * exact parse when one is available, since it can hallucinate.
 *
 * Instructed hard to report "not found" rather than guess — an event/prayer
 * time that reads plausibly but is invented is worse than showing nothing.
 */

import type { PrayerDayData } from './types';

const GROQ_MODEL = 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function stripToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

interface GroqPrayerJson {
  found: boolean;
  fajr?: { adhan: string; iqamah: string } | null;
  dhuhr?: { adhan: string; iqamah: string } | null;
  asr?: { adhan: string; iqamah: string } | null;
  maghrib?: { adhan: string; iqamah: string } | null;
  isha?: { adhan: string; iqamah: string } | null;
  sunrise?: string | null;
  jummah?: { label: string; time: string }[];
}

/** Fetches `url`, strips it to plain text, and asks Groq to extract today's
 *  real prayer times if — and only if — they're explicitly present. */
export async function extractPrayerTimesWithGroq(mosqueName: string, url: string, todayLabel: string): Promise<PrayerDayData | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  let text: string;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    text = stripToText(await res.text()).slice(0, 6000);
  } catch {
    return null;
  }

  const prompt =
    `You are extracting prayer time information from ${mosqueName}'s website content. ` +
    `Today's date is ${todayLabel}.\n\n` +
    'Extract ONLY today\'s prayer times (adhan/start time and iqamah/congregation time), plus Friday Jumu\'ah times, ' +
    'if they are explicitly present in the text below. Return ONLY valid JSON, no markdown fences, no explanation, ' +
    'matching exactly this shape:\n' +
    '{"found":true,"fajr":{"adhan":"5:10 AM","iqamah":"5:40 AM"},"dhuhr":{...},"asr":{...},"maghrib":{...},' +
    '"isha":{...},"sunrise":"6:27 AM","jummah":[{"label":"Jumu\'ah 1","time":"1:40 PM"}]}\n\n' +
    'Rules:\n' +
    '- Only use times EXPLICITLY written in the text. Never guess, calculate, estimate, or infer a time.\n' +
    '- If no real prayer/iqamah times for this specific mosque are found anywhere in the text, return exactly {"found":false}.\n' +
    '- If some prayers are found but others are not mentioned, set the missing ones to null and keep "found":true.\n' +
    '- Ignore times that belong to something else (e.g. business hours, event start times unrelated to prayer).\n\n' +
    `Website text:\n"""\n${text}\n"""`;

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    // Models occasionally wrap JSON in a fence despite instructions — strip it defensively.
    const jsonText = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    const parsed: GroqPrayerJson = JSON.parse(jsonText);

    if (!parsed.found) return null;
    if (!parsed.fajr && !parsed.dhuhr && !parsed.asr && !parsed.maghrib && !parsed.isha) return null;

    return {
      fajr: parsed.fajr ?? null,
      dhuhr: parsed.dhuhr ?? null,
      asr: parsed.asr ?? null,
      maghrib: parsed.maghrib ?? null,
      isha: parsed.isha ?? null,
      sunrise: parsed.sunrise ?? null,
      jumuah: parsed.jummah ?? [],
    };
  } catch {
    return null;
  }
}
