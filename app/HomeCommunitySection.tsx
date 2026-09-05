'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/firebase/community';
import { CommunityPost } from '@/components/cards/CommunityPost';
import type { ForumPost } from '@/lib/types';

/** Client component that fetches the 4 hottest posts from Firestore for the homepage. */
export function HomeCommunitySection() {
  const [posts,   setPosts]   = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ sort: 'hot', limit: 4 })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-sm text-stone-400 py-4 text-center">
        No community posts yet. <Link href="/community/new" className="text-emerald-600 hover:underline">Start the conversation!</Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map(post => <CommunityPost key={post.id} post={post} />)}
    </div>
  );
}
