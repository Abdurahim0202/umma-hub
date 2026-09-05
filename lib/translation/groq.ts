/**
 * General-purpose text translation via the Groq API (server-side only —
 * requires GROQ_API_KEY). Not specific to events: any non-English text
 * anywhere in the app can be run through `translateToEnglish`.
 *
 * Falls back to returning the original text on any failure (missing key,
 * network error, bad response) — a missed translation should never break
 * a page.
 */

const GROQ_MODEL = 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Arabic + Arabic Supplement + Arabic Extended-A + Arabic Presentation
// Forms A/B — covers every mosque feed we currently source from. Extend
// this if a future source publishes in another non-Latin script.
// Expressed as numeric code-point ranges (not a regex literal) so the
// actual Unicode characters never need to appear in source.
const NON_ENGLISH_RANGES: [number, number][] = [
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic Supplement
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfb50, 0xfdff], // Arabic Presentation Forms-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
];

export function looksNonEnglish(text: string): boolean {
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (NON_ENGLISH_RANGES.some(([start, end]) => code >= start && code <= end)) {
      return true;
    }
  }
  return false;
}

/** Translate arbitrary text to natural English. Returns the input unchanged
 *  if it doesn't look non-English, no API key is configured, or the request fails. */
export async function translateToEnglish(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || !looksNonEnglish(trimmed)) return text;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return text;

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0,
        messages: [
          {
            role: 'user',
            content:
              'Translate the following text to natural, concise English. ' +
              'Preserve any emoji, URLs, and names as-is. ' +
              'Write all numbers using Western Arabic numerals (0-9), not Eastern Arabic-Indic digits. ' +
              'Reply with ONLY the translation — no notes, no quotes, no explanation.\n\n' +
              `Text: ${trimmed}`,
          },
        ],
      }),
      // Translations of the same feed text are cached for a week — mosque
      // event titles/descriptions essentially never change after posting.
      next: { revalidate: 604800 },
    });

    if (!res.ok) return text;
    const data = await res.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();
    return translated || text;
  } catch {
    return text;
  }
}

/** Same as `translateToEnglish`, but reuses `cache` for repeated identical
 *  strings within one run (e.g. a recurring event's title appearing many
 *  times) so they're only translated once. */
export async function translateWithCache(text: string, cache: Map<string, string>): Promise<string> {
  if (!looksNonEnglish(text)) return text;
  const cached = cache.get(text);
  if (cached !== undefined) return cached;
  const translated = await translateToEnglish(text);
  cache.set(text, translated);
  return translated;
}
