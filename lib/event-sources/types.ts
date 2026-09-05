/**
 * Shared types for the event-source adapter system.
 * Each mosque adapter returns ImportResult objects; the aggregator
 * merges them into Event[] for the calendar page.
 */

import type { Event } from '@/lib/types';

export interface SourceMeta {
  mosqueId: string;       // matches mosque id in mosques.ts
  mosqueName: string;
  sourceUrl: string;      // URL actually fetched
  sourceType: 'ical' | 'rss' | 'static' | 'none';
}

export type ImportStatus = 'ok' | 'error' | 'no_events' | 'no_source';

export interface ImportResult {
  meta: SourceMeta;
  status: ImportStatus;
  eventsFound: number;
  events: Event[];
  error?: string;         // set when status === 'error'
  fetchedAt: string;      // ISO timestamp
}
