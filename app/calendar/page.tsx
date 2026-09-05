import { Calendar as CalendarIcon } from 'lucide-react';
import { events } from '@/lib/data/events';
import { EventCard } from '@/components/cards/EventCard';
import { formatEventDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Calendar',
  description: 'All Muslim community events in Teaneck, NJ — mosques, halaqas, classes, social events, and more.',
};

// Group events by date
function groupEventsByDate(evts: typeof events) {
  const groups: Record<string, typeof events> = {};
  for (const evt of evts) {
    if (!groups[evt.date]) groups[evt.date] = [];
    groups[evt.date].push(evt);
  }
  return groups;
}

const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'jummah', label: "Jumu'ah" },
  { value: 'halaqa', label: 'Halaqa' },
  { value: 'quran', label: 'Quran' },
  { value: 'education', label: 'Education' },
  { value: 'youth', label: 'Youth' },
  { value: 'sisters', label: 'Sisters' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'food', label: 'Food' },
  { value: 'career', label: 'Career' },
];

export default function CalendarPage() {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const grouped = groupEventsByDate(sorted);
  const dates = Object.keys(grouped).sort();

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

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {EVENT_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-stone-200 bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors first:bg-emerald-600 first:text-white first:border-emerald-600"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events by date */}
      <div className="space-y-8">
        {dates.map(date => (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-600 text-white rounded-xl px-3 py-1 text-sm font-semibold">
                {formatEventDate(date)}
              </div>
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400">{grouped[date].length} events</span>
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {grouped[date].map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state if no events */}
      {dates.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No events found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
