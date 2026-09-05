'use client';

import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Event, EventCategory } from '@/lib/types';
import { EventCard } from '@/components/cards/EventCard';
import { formatEventDate } from '@/lib/utils';

const EVENT_CATEGORIES: { value: 'all' | EventCategory; label: string }[] = [
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

function groupByDate(evts: Event[]) {
  const groups: Record<string, Event[]> = {};
  for (const evt of evts) {
    if (!groups[evt.date]) groups[evt.date] = [];
    groups[evt.date].push(evt);
  }
  return groups;
}

export function CalendarBrowser({ events }: { events: Event[] }) {
  const [category, setCategory] = useState<'all' | EventCategory>('all');

  const availableCategories = useMemo(() => {
    const present = new Set(events.map(e => e.category));
    return EVENT_CATEGORIES.filter(c => c.value === 'all' || present.has(c.value));
  }, [events]);

  const filtered = useMemo(
    () => (category === 'all' ? events : events.filter(e => e.category === category)),
    [events, category]
  );

  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort();

  return (
    <>
      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {availableCategories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat.value
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
            }`}
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
          <p className="text-sm">Try a different category.</p>
        </div>
      )}
    </>
  );
}
