/**
 * Islamic Center of Passaic County (ICPC) event adapter.
 * Source: WordPress RSS events feed
 * Feed URL: https://icpcnj.org/events/feed/
 *
 * ICPC uses Modern Events Calendar plugin. The /?ical=1 endpoint returns
 * HTML (not iCal), but /events/feed/ is a standard WordPress RSS feed that
 * lists upcoming events.
 */

import type { Event } from '@/lib/types';
import type { ImportResult } from './types';

const FEED_URL = 'https://icpcnj.org/events/feed/';
const MOSQUE_ID = 'icpc';
const MOSQUE_NAME = 'Islamic Center of Passaic County';
const MOSQUE_CITY = 'Paterson';

/** Extract text content between XML tags */
function xmlTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!m) return '';
  // Strip CDATA wrapper if present
  return m[1].replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '').trim();
}

/** Parse a date string from RSS pubDate or similar */
function parseRssDate(raw: string): string {
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch { /* ignore */ }
  return new Date().toISOString().slice(0, 10);
}

function mapCategory(title: string, desc: string): Event['category'] {
  const t = (title + ' ' + desc).toLowerCase();
  if (t.includes('jumu') || t.includes('friday prayer')) return 'jummah';
  if (t.includes('quran') || t.includes('tajweed')) return 'quran';
  if (t.includes('halaqa') || t.includes('circle')) return 'halaqa';
  if (t.includes('class') || t.includes('school') || t.includes('lecture') || t.includes('seminar')) return 'education';
  if (t.includes('fundrais') || t.includes('dinner') && t.includes('gala')) return 'fundraiser';
  if (t.includes('iftar') || t.includes('food') || t.includes('dinner')) return 'food';
  if (t.includes('volunteer')) return 'volunteer';
  if (t.includes('youth')) return 'education';
  return 'education';
}

function inferAudience(title: string, desc: string): Event['audience'] {
  const t = (title + ' ' + desc).toLowerCase();
  if (t.includes('sister') || t.includes('women')) return 'sisters';
  if (t.includes('youth') || t.includes('teen')) return 'youth';
  if (t.includes('child') || t.includes('kid')) return 'children';
  if (t.includes('famil')) return 'families';
  return 'everyone';
}

// ── main fetch function ──────────────────────────────────────────────────────

export async function fetchIcpcEvents(): Promise<ImportResult> {
  const fetchedAt = new Date().toISOString();
  const meta = {
    mosqueId: MOSQUE_ID,
    mosqueName: MOSQUE_NAME,
    sourceUrl: FEED_URL,
    sourceType: 'rss' as const,
  };

  let rssText: string;
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rssText = await res.text();
  } catch (err) {
    return { meta, status: 'error', eventsFound: 0, events: [], error: String(err), fetchedAt };
  }

  if (!rssText.includes('<rss') && !rssText.includes('<feed')) {
    return { meta, status: 'error', eventsFound: 0, events: [], error: 'Response was not RSS', fetchedAt };
  }

  // Split by <item> tags
  const itemMatches = rssText.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const events: Event[] = [];

  for (const item of itemMatches) {
    const title   = xmlTag(item, 'title');
    const link    = xmlTag(item, 'link') || xmlTag(item, 'guid');
    const desc    = xmlTag(item, 'description').replace(/<[^>]+>/g, '').trim();
    const pubDate = xmlTag(item, 'pubDate') || xmlTag(item, 'dc:date');
    const date    = parseRssDate(pubDate);

    if (!title) continue;
    if (date < today) continue; // skip past events

    // Try to find event-specific date from Modern Events Calendar meta
    const startMeta = xmlTag(item, 'mec:start_date') || xmlTag(item, 'tribe_start_date');
    const eventDate = startMeta ? startMeta.slice(0, 10) : date;

    events.push({
      id: `icpc-${eventDate}-${Buffer.from(`${title}::${link}`).toString('base64').slice(0, 24)}`,
      title,
      description: desc || `Event at ${MOSQUE_NAME}. See website for details.`,
      organizationId: MOSQUE_ID,
      organizationName: MOSQUE_NAME,
      address: '152 Derrom Ave',
      city: MOSQUE_CITY,
      latitude: 40.9175704,
      longitude: -74.1403532,
      startTime: eventDate + 'T00:00:00',
      endTime:   eventDate + 'T23:59:00',
      date: eventDate,
      category: mapCategory(title, desc),
      audience: inferAudience(title, desc),
      isFeatured: false,
      tags: ['icpc', 'paterson'],
      sourceType: 'rss',
      sourceUrl: link || FEED_URL,
      lastSyncedAt: fetchedAt,
    });
  }

  return {
    meta,
    status: events.length > 0 ? 'ok' : 'no_events',
    eventsFound: events.length,
    events,
    fetchedAt,
  };
}
