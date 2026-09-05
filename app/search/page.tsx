import { Search as SearchIcon } from 'lucide-react';
import { events } from '@/lib/data/events';
import { mosques } from '@/lib/data/mosques';
import { resources, forumPosts, announcements } from '@/lib/data/community';
import { EventCard } from '@/components/cards/EventCard';
import { MosqueCard } from '@/components/cards/MosqueCard';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CommunityPost } from '@/components/cards/CommunityPost';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search events, mosques, resources, and community posts in Teaneck, NJ.',
};

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
        <SearchIcon className="w-6 h-6 text-emerald-600" />
        Search
      </h1>

      {/* Search input */}
      <div className="flex items-center gap-3 bg-white border-2 border-emerald-200 rounded-2xl px-5 py-4 mb-8 shadow-sm focus-within:border-emerald-400 transition-colors">
        <SearchIcon className="w-5 h-5 text-stone-400" />
        <input
          placeholder="Search events, mosques, classes, resources..."
          className="flex-1 text-stone-700 bg-transparent outline-none text-base placeholder-stone-400"
          autoFocus
        />
      </div>

      <p className="text-stone-400 text-sm mb-6 text-center">
        Start typing to search across all community content
      </p>

      {/* Sample results structure */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">EVENTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.slice(0, 2).map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">MOSQUES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mosques.slice(0, 2).map(m => <MosqueCard key={m.id} mosque={m} />)}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">RESOURCES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.slice(0, 2).map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">COMMUNITY POSTS</h2>
          <div className="space-y-3">
            {forumPosts.slice(0, 2).map(p => <CommunityPost key={p.id} post={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
