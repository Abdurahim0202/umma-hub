import { Calendar as CalendarIcon } from 'lucide-react';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { CalendarBrowser } from '@/components/calendar/CalendarBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Calendar',
  description: 'All Muslim community events in Teaneck, NJ — mosques, halaqas, classes, social events, and more.',
};

// Re-fetch mosque event feeds at most once per hour
export const revalidate = 3600;

export default async function CalendarPage() {
  const { events } = await fetchAllMosqueEvents();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter(evt => evt.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <CalendarIcon className="w-6 h-6 text-emerald-600" />
          Community Calendar
        </h1>
        <p className="text-stone-500 text-sm">
          All events from local mosques and organizations — in one place.
        </p>
      </div>

      <CalendarBrowser events={upcoming} />
    </div>
  );
}
