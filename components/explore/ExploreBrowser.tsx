'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { Mosque, Event, Resource } from '@/lib/types';
import { MosqueCard } from '@/components/cards/MosqueCard';
import { EventCard } from '@/components/cards/EventCard';
import { ResourceCard } from '@/components/cards/ResourceCard';

const MosqueMap = dynamic(() => import('./MosqueMap').then(m => m.MosqueMap), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full rounded-3xl border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-400">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  ),
});

type Tab = 'mosques' | 'events' | 'classes' | 'youth' | 'sisters';

const TABS: { value: Tab; label: string }[] = [
  { value: 'mosques', label: '🕌 Mosques' },
  { value: 'events', label: '📅 Events' },
  { value: 'classes', label: '📚 Classes' },
  { value: 'youth', label: '👧 Youth' },
  { value: 'sisters', label: '🧕 Sisters' },
];

const RESOURCE_CATEGORIES_BY_TAB: Record<'classes' | 'youth' | 'sisters', Resource['category'][]> = {
  classes: ['education', 'quran', 'sunday_school', 'arabic', 'islamic_studies'],
  youth: ['youth'],
  sisters: ['new_muslim'], // no dedicated "sisters" resource category — filtered further by tag below
};

interface ExploreBrowserProps {
  mosques: Mosque[];
  events: Event[];
  resources: Resource[];
}

export function ExploreBrowser({ mosques, events, resources }: ExploreBrowserProps) {
  const [tab, setTab] = useState<Tab>('mosques');

  const filteredMosques = useMemo(() => {
    if (tab === 'mosques' || tab === 'events') return mosques;
    if (tab === 'sisters') return mosques.filter(m => m.tags.includes('sisters'));
    return mosques.filter(m => m.tags.includes(tab));
  }, [mosques, tab]);

  const filteredResources = useMemo(() => {
    if (tab === 'mosques' || tab === 'events') return [];
    if (tab === 'sisters') {
      return resources.filter(r => r.tags.some(t => t.toLowerCase().includes('sister')) || r.title.toLowerCase().includes('sister'));
    }
    const cats = RESOURCE_CATEGORIES_BY_TAB[tab];
    return resources.filter(r => cats.includes(r.category));
  }, [resources, tab]);

  return (
    <>
      {/* Filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              tab === t.value
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Interactive map — always shows mosques relevant to the current tab */}
      <div className="mb-6">
        <MosqueMap mosques={filteredMosques} />
      </div>

      {/* List below map — content depends on tab */}
      {tab === 'mosques' && (
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Nearby Mosques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mosques.map(mosque => (
              <MosqueCard key={mosque.id} mosque={mosque} />
            ))}
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
              <p>No upcoming events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {(tab === 'classes' || tab === 'youth' || tab === 'sisters') && (
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-4">
            {TABS.find(t => t.value === tab)?.label} Near You
          </h2>
          {filteredMosques.length === 0 && filteredResources.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
              <p>Nothing found in this category yet.</p>
            </div>
          ) : (
            <>
              {filteredMosques.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {filteredMosques.map(mosque => (
                    <MosqueCard key={mosque.id} mosque={mosque} />
                  ))}
                </div>
              )}
              {filteredResources.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
