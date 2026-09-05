import { Search, BookOpen } from 'lucide-react';
import { resources } from '@/lib/data/community';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { RESOURCE_CATEGORY_LABELS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Resources',
  description: 'Islamic education, financial assistance, mental health, new Muslim support, and more resources for the Teaneck Muslim community.',
};

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'education', label: 'Education' },
  { value: 'quran', label: 'Quran' },
  { value: 'sunday_school', label: 'Sunday School' },
  { value: 'new_muslim', label: 'New Muslims' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'financial', label: 'Financial Aid' },
  { value: 'food', label: 'Food' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'career', label: 'Career' },
  { value: 'volunteer', label: 'Volunteer' },
];

export default function ResourcesPage() {
  const featured = resources.filter(r => r.isFeatured);
  const rest = resources.filter(r => !r.isFeatured);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Community Resources
        </h1>
        <p className="text-stone-500 text-sm">
          Education, support services, programs, and more for the Teaneck Muslim community.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          placeholder="Search resources..."
          className="flex-1 text-sm bg-transparent text-stone-700 placeholder-stone-400 outline-none"
        />
      </div>

      {/* Category filters */}
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

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      )}

      {/* All resources */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4">All Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map(r => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
