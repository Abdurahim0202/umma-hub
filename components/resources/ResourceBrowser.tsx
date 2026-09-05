'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Resource, ResourceCategory } from '@/lib/types';
import { RESOURCE_CATEGORY_LABELS } from '@/lib/utils';
import { ResourceCard } from '@/components/cards/ResourceCard';

interface ResourceBrowserProps {
  resources: Resource[];
}

export function ResourceBrowser({ resources }: ResourceBrowserProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ResourceCategory>('all');

  const categoryFilters = useMemo(() => {
    const present = new Set(resources.map(r => r.category));
    return [
      { value: 'all' as const, label: 'All' },
      ...([...present].map(c => ({ value: c, label: RESOURCE_CATEGORY_LABELS[c] ?? c }))),
    ];
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter(r => {
      const matchesCategory = category === 'all' || r.category === category;
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.organizationName.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [resources, query, category]);

  const featured = filtered.filter(r => r.isFeatured);
  const rest = filtered.filter(r => !r.isFeatured);

  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search resources..."
          className="flex-1 text-sm bg-transparent text-stone-700 placeholder-stone-400 outline-none"
        />
      </div>

      {/* Category filters */}
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
        <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
          <p className="text-lg mb-1">No resources found</p>
          <p className="text-sm">Try a different search term or category.</p>
        </div>
      ) : (
        <>
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
          {rest.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4">All Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map(r => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
