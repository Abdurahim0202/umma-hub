'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import type { Event, Mosque, Resource, ForumPost } from '@/lib/types';
import { EventCard } from '@/components/cards/EventCard';
import { MosqueCard } from '@/components/cards/MosqueCard';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CommunityPost } from '@/components/cards/CommunityPost';
import { getPosts } from '@/lib/firebase/community';

interface SearchBrowserProps {
  events: Event[];
  mosques: Mosque[];
  resources: Resource[];
}

function matches(query: string, ...fields: (string | undefined)[]): boolean {
  const q = query.toLowerCase();
  return fields.some(f => f?.toLowerCase().includes(q));
}

export function SearchBrowser({ events, mosques, resources }: SearchBrowserProps) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    getPosts({ sort: 'new', limit: 50 })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, []);

  const q = query.trim();

  const matchedEvents = useMemo(() => {
    if (!q) return [];
    return events.filter(e => matches(q, e.title, e.description, e.organizationName, ...e.tags)).slice(0, 6);
  }, [events, q]);

  const matchedMosques = useMemo(() => {
    if (!q) return [];
    return mosques.filter(m =>
      matches(q, m.name, m.shortDescription, m.description, m.address, m.city, ...m.tags)
    ).slice(0, 6);
  }, [mosques, q]);

  const matchedResources = useMemo(() => {
    if (!q) return [];
    return resources.filter(r => matches(q, r.title, r.description, r.organizationName, ...r.tags)).slice(0, 6);
  }, [resources, q]);

  const matchedPosts = useMemo(() => {
    if (!q) return [];
    return posts.filter(p => matches(q, p.title, p.body, p.authorName, ...p.tags)).slice(0, 6);
  }, [posts, q]);

  const totalMatches = matchedEvents.length + matchedMosques.length + matchedResources.length + matchedPosts.length;

  return (
    <>
      {/* Search input */}
      <div className="flex items-center gap-3 bg-white border-2 border-emerald-200 rounded-2xl px-5 py-4 mb-8 shadow-sm focus-within:border-emerald-400 transition-colors">
        <SearchIcon className="w-5 h-5 text-stone-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search events, mosques, classes, resources..."
          className="flex-1 text-stone-700 bg-transparent outline-none text-base placeholder-stone-400"
          autoFocus
        />
        {postsLoading && <Loader2 className="w-4 h-4 text-stone-300 animate-spin flex-shrink-0" />}
      </div>

      {!q ? (
        <p className="text-stone-400 text-sm mb-6 text-center">
          Start typing to search across all community content
        </p>
      ) : totalMatches === 0 ? (
        <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400">
          <SearchIcon className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium mb-1">No results for &quot;{q}&quot;</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {matchedEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedEvents.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </div>
          )}

          {matchedMosques.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">Mosques</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedMosques.map(m => <MosqueCard key={m.id} mosque={m} />)}
              </div>
            </div>
          )}

          {matchedResources.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedResources.map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </div>
          )}

          {matchedPosts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-3">Community Posts</h2>
              <div className="space-y-3">
                {matchedPosts.map(p => <CommunityPost key={p.id} post={p} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
