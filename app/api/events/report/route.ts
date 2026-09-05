import { NextResponse } from 'next/server';
import { fetchAllMosqueEvents } from '@/lib/event-sources';

// Per-mosque import status: how many events were found, which sources
// failed or had nothing public, and which source URLs were used.
export async function GET() {
  const { events, report, fetchedAt } = await fetchAllMosqueEvents();

  const summary = report.map(r => ({
    mosque: r.meta.mosqueName,
    status: r.status,
    eventsFound: r.eventsFound,
    sourceUrl: r.meta.sourceUrl,
    sourceType: r.meta.sourceType,
    error: r.error,
  }));

  return NextResponse.json({
    fetchedAt,
    totalEvents: events.length,
    summary,
  });
}
