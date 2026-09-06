/**
 * Fast local blocklist — a cheap first pass before the Groq semantic check.
 * Catches explicit profanity and slurs by direct match so obvious cases
 * don't need an API round-trip. Deliberately conservative (exact/near-exact
 * matches only) since nuance and context are Groq's job, not this list's.
 */

export const BLOCKED_TERMS: string[] = [
  'fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'bullshit', 'asshole',
  'bitch', 'bastard', 'cunt', 'dick', 'pussy', 'cock', 'slut', 'whore',
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'kike', 'spic',
  'chink', 'gook', 'wetback', 'towelhead', 'raghead', 'sandnigger', 'paki',
  'tranny', 'dyke',
];

const escaped = BLOCKED_TERMS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

/** Word-boundary match against the blocklist, case-insensitive. */
export const BLOCKLIST_REGEX = new RegExp(`\\b(${escaped.join('|')})\\b`, 'i');

export function containsBlockedTerm(text: string): string | null {
  const match = text.match(BLOCKLIST_REGEX);
  return match ? match[0] : null;
}
