/**
 * Darul Islah event adapter.
 * Source: The Events Calendar (WordPress plugin) iCal feed
 * Feed URL: https://www.darulislah.org/events/?ical=1
 *
 * This is our home mosque and the only confirmed iCal source among the 9.
 */

import type { Event } from '@/lib/types';
import type { ImportResult } from './types';
import { parseIcal, vEventDate } from './ical-parser';

const FEED_URL = 'https://www.darulislah.org/events/?ical=1';
const MOSQUE_ID = 'darul-islah';
const MOSQUE_NAME = 'Darul Islah';
const MOSQUE_CITY = 'Teaneck';

/** Map iCal CATEGORIES to our Event category enum */
function mapCategory(cats: string): Event['category'] {
  const c = cats.toLowerCase();
  if (c.includes('jumu') || c.includes('friday')) return 'jummah';
  if (c.includes('quran') || c.includes('tajweed') || c.includes('hifz')) return 'quran';
  if (c.includes('halaqa') || c.includes('circle')) return 'halaqa';
  if (c.includes('sister')) return 'halaqa'; // sisters' circles
  if (c.includes('class') || c.includes('education') || c.includes('school') || c.includes('lecture')) return 'education';
  if (c.includes('youth')) return 'education';
  if (c.includes('fundrais') || c.includes('donation')) return 'fundraiser';
  if (c.includes('food') || c.includes('iftar') || c.includes('dinner')) return 'food';
  if (c.includes('volunteer')) return 'volunteer';
  if (c.includes('sport') || c.includes('basketball')) return 'sports';
  return 'education'; // default
}

/** Best-effort audience inference from title/description */
function inferAudience(title: string, desc: string): Event['audience'] {
  const t = (title + ' ' + desc).toLowerCase();
  if (t.includes('sister') || t.includes('women')) return 'sisters';
  if (t.includes('brother') || t.includes('men')) return 'brothers';
  if (t.includes('youth') || t.includes('teen') || t.includes('student')) return 'youth';
  if (t.includes('child') || t.includes('kids') || t.includes('junior')) return 'children';
  if (t.includes('famil')) return 'families';
  return 'everyone';
}

// ── main fetch function ──────────────────────────────────────────────────────

export async function fetchDarulIslahEvents(): Promise<ImportResult> {
  const fetchedAt = new Date().toISOString();
  const meta = {
    mosqueId: MOSQUE_ID,
    mosqueName: MOSQUE_NAME,
    sourceUrl: FEED_URL,
    sourceType: 'ical' as const,
  };

  let rawText: string;
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'Ummah Hub Community App/1.0' },
      next: { revalidate: 3600 }, // ISR: re-fetch every hour
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rawText = await res.text();
  } catch (err) {
    return {
      meta,
      status: 'error',
      eventsFound: 0,
      events: [],
      error: String(err),
      fetchedAt,
    };
  }

  // Ensure it's actually iCal
  if (!rawText.includes('BEGIN:VCALENDAR')) {
    return {
      meta,
      status: 'error',
      eventsFound: 0,
      events: [],
      error: 'Response was not iCal (BEGIN:VCALENDAR not found)',
      fetchedAt,
    };
  }

  const vEvents = parseIcal(rawText);
  const today = new Date().toISOString().slice(0, 10);

  // Only keep upcoming/today events
  const upcoming = vEvents.filter(ve => vEventDate(ve) >= today);

  const events: Event[] = upcoming.map(ve => {
    const date = vEventDate(ve);
    return {
      id: `darul-islah-${ve.uid}`,
      title: ve.summary,
      description: ve.description || `Event at ${MOSQUE_NAME}. See website for details.`,
      organizationId: MOSQUE_ID,
      organizationName: MOSQUE_NAME,
      address: '320 Fabry Terrace',
      city: MOSQUE_CITY,
      latitude: 40.8715992,
      longitude: -74.0014555,
      startTime: ve.dtstart,
      endTime: ve.dtend,
      date,
      category: mapCategory(ve.categories || ''),
      audience: inferAudience(ve.summary, ve.description),
      isFeatured: false,
      tags: ['darul-islah', 'teaneck'],
      sourceType: 'scraped',
      sourceUrl: ve.url || FEED_URL,
      image: ve.image,
      lastFetched: fetchedAt,
    };
  });

  return {
    meta,
    status: events.length > 0 ? 'ok' : 'no_events',
    eventsFound: events.length,
    events,
    fetchedAt,
  };
}
