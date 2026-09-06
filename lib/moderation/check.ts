/**
 * Content moderation for community posts/comments (server-side only —
 * requires GROQ_API_KEY).
 *
 * Two layers:
 *   1. A local blocklist (`wordlist.ts`) catches explicit profanity/slurs
 *      instantly, with no API call.
 *   2. Groq classifies the remaining text for hate speech, harassment, or
 *      profanity it wouldn't otherwise catch (coded language, context-
 *      dependent slurs, etc).
 *
 * Fails OPEN on Groq errors (missing key, network failure, bad response) —
 * the blocklist layer still applies, but we never block a legitimate post
 * just because the moderation API is down.
 */

import { containsBlockedTerm } from './wordlist';

const GROQ_MODEL = 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ModerationResult {
  blocked: boolean;
  reason?: string;
}

async function checkWithGroq(text: string): Promise<ModerationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { blocked: false };

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
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You moderate posts for a local Muslim community platform. ' +
              'Classify the user text for profanity, hate speech, slurs, harassment, or ' +
              'incitement to violence — including coded/obfuscated language and hate speech ' +
              'targeting any religion, ethnicity, race, gender, or nationality. ' +
              'Ordinary disagreement, criticism, religious discussion, or venting is NOT a violation. ' +
              'Reply with ONLY a JSON object: {"violation": boolean, "reason": string}. ' +
              'If no violation, set reason to "".',
          },
          { role: 'user', content: text.slice(0, 4000) },
        ],
      }),
    });

    if (!res.ok) return { blocked: false };
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return { blocked: false };

    const parsed = JSON.parse(raw);
    if (parsed?.violation === true) {
      return { blocked: true, reason: parsed.reason || 'This content violates our community guidelines.' };
    }
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

/** Checks a single piece of text (title, body, or comment). */
export async function moderateText(text: string): Promise<ModerationResult> {
  const trimmed = text.trim();
  if (!trimmed) return { blocked: false };

  const localHit = containsBlockedTerm(trimmed);
  if (localHit) {
    return { blocked: true, reason: 'Your post contains language that isn\'t allowed here.' };
  }

  return checkWithGroq(trimmed);
}

/** Checks multiple fields (e.g. title + body) and returns the first violation found. */
export async function moderateFields(fields: Record<string, string>): Promise<ModerationResult> {
  for (const text of Object.values(fields)) {
    const result = await moderateText(text);
    if (result.blocked) return result;
  }
  return { blocked: false };
}
