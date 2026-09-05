/**
 * Event-source aggregator.
 *
 * Runs all 9 mosque adapters in parallel, merges their events,
 * deduplicates by (organizationId + title + date), and returns:
 *   - a combined Event[] sorted by date
 *   - an ImportReport with per-mosque status
 *
 * Used by the calendar page (server-side) and the /api/events/report endpoint.
 */

import type { Event } from '@/lib/types';
import type { ImportResult } from './types';

import { fetchDarulIslahEvents } from './darul-islah';
import { fetchIcpcEvents }       from './icpc';
import {
  fetchBciecEvents,
  fetchNidaEvents,
  fetchAlAishaEvents,
  fetchUluCamiEvents,
  fetchOmarMosqueEvents,
  fetchFusionEvents,
  fetchDiyanetEvents,
} from './stubs';

export type { ImportResult };

export interface AggregatorResult {
  events: Event[];
  report: ImportResult[];
  fetchedAt: string;
}

// ── deduplication ────────────────────────────────────────────────────────────

function deduplicate(events: Event[]): Event[] {
  const seen = new Set<string>();
  return events.filter(ev => {
    const key = `${ev.organizationId}::${ev.title.toLowerCase().trim()}::${ev.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── main aggregator ──────────────────────────────────────────────────────────

export async function fetchAllMosqueEvents(): Promise<AggregatorResult> {
  const fetchedAt = new Date().toISOString();

  // Run all adapters concurrently
  const results = await Promise.allSettled([
    fetchDarulIslahEvents(),
    fetchIcpcEvents(),
    fetchBciecEvents(),
    fetchNidaEvents(),
    fetchAlAishaEvents(),
    fetchUluCamiEvents(),
    fetchOmarMosqueEvents(),
    fetchFusionEvents(),
    fetchDiyanetEvents(),
  ]);

  const report: ImportResult[] = results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : {
          meta: { mosqueId: 'unknown', mosqueName: 'Unknown', sourceUrl: '', sourceType: 'none' as const },
          status: 'error' as const,
          eventsFound: 0,
          events: [],
          error: r.reason?.toString() ?? 'Unknown error',
          fetchedAt,
        }
  );

  const allEvents = report.flatMap(r => r.events);
  const deduped = deduplicate(allEvents);
  const sorted = deduped.sort(
    (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  );

  return { events: sorted, report, fetchedAt };
}
