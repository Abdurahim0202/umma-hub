'use client';

import { useMemo, useState } from 'react';
import type { Announcement, AnnouncementCategory } from '@/lib/types';
import { AnnouncementCard } from '@/components/cards/AnnouncementCard';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  janazah: '🤍 Janazah',
  urgent: '🚨 Urgent',
  community: 'Community',
  fundraiser: 'Fundraiser',
  volunteer: 'Volunteer',
  education: 'Education',
  ramadan: 'Ramadan',
  eid: 'Eid',
};

export function AnnouncementBrowser({ announcements }: { announcements: Announcement[] }) {
  const [category, setCategory] = useState<'all' | AnnouncementCategory>('all');

  const categoryFilters = useMemo(() => {
    const present = new Set(announcements.map(a => a.category));
    return [
      { value: 'all' as const, label: 'All' },
      ...[...present].map(c => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
    ];
  }, [announcements]);

  const filtered = category === 'all' ? announcements : announcements.filter(a => a.category === category);
  const urgent = filtered.filter(a => a.isUrgent);
  const regular = filtered.filter(a => !a.isUrgent);

  return (
    <>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categoryFilters.map(cat => (
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

      {filtered.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400">
          <p className="font-medium mb-1">No announcements right now</p>
          <p className="text-sm">Check back soon — this updates automatically from mosque calendars.</p>
        </div>
      ) : (
        <>
          {/* Urgent first */}
          {urgent.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">⚡ Urgent</h2>
              <div className="space-y-3">
                {urgent.map(ann => (
                  <AnnouncementCard key={ann.id} announcement={ann} />
                ))}
              </div>
            </div>
          )}

          {/* Regular */}
          <div className="space-y-3">
            {regular.map(ann => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
