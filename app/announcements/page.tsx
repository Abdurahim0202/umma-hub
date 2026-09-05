import { Megaphone } from 'lucide-react';
import { announcements } from '@/lib/data/community';
import { AnnouncementCard } from '@/components/cards/AnnouncementCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcements',
  description: 'Community announcements from mosques and organizations in Teaneck, NJ.',
};

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'urgent', label: '🚨 Urgent' },
  { value: 'janazah', label: '🤍 Janazah' },
  { value: 'general', label: 'General' },
  { value: 'community', label: 'Community' },
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'education', label: 'Education' },
];

export default function AnnouncementsPage() {
  const urgent = announcements.filter(a => a.isUrgent);
  const regular = announcements.filter(a => !a.isUrgent);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <Megaphone className="w-6 h-6 text-emerald-600" />
          Announcements
        </h1>
        <p className="text-stone-500 text-sm">
          Official announcements from local mosques and community organizations.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORY_FILTERS.map((cat, i) => (
          <button
            key={cat.value}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              i === 0
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

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
    </div>
  );
}
