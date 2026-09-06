'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageCircle, TrendingUp, Clock, Star, PlusCircle, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CommunityPost } from '@/components/cards/CommunityPost';
import { FORUM_CATEGORY_LABELS } from '@/lib/utils';
import { getPosts } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';
import type { ForumPost } from '@/lib/types';

const COMMUNITIES = [
  'general', 'questions', 'recommendations', 'events', 'jobs',
  'housing', 'education', 'students', 'volunteering', 'businesses',
];

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24 text-stone-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    }>
      <CommunityPageContent />
    </Suspense>
  );
}

function CommunityPageContent() {
  const searchParams = useSearchParams();
  const sort     = (searchParams.get('sort') as 'hot' | 'new' | 'top') || 'hot';
  const category = searchParams.get('category') ?? undefined;

  const { user }            = useAuth();
  const [posts, setPosts]   = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts({ sort, category })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [sort, category]);

  const pinned  = posts.filter(p => p.isPinned);
  const regular = posts.filter(p => !p.isPinned);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Left: Feed ── */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-0.5">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
                Community
              </h1>
              <p className="text-stone-500 text-sm">Teaneck Muslim Community Forum</p>
            </div>
            {user ? (
              <Link
                href="/community/new"
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                New Post
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 bg-stone-100 text-stone-600 px-4 py-2.5 rounded-xl font-medium hover:bg-stone-200 transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign in to Post
              </Link>
            )}
          </div>

          {/* Sort tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1">
            {[
              { label: 'Hot', icon: TrendingUp, value: 'hot' },
              { label: 'New', icon: Clock,       value: 'new' },
              { label: 'Top', icon: Star,        value: 'top' },
            ].map(({ label, icon: Icon, value }) => (
              <Link
                key={label}
                href={`/community?sort=${value}${category ? `&category=${category}` : ''}`}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === value
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-stone-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading posts...
            </div>
          ) : (
            <>
              {/* Pinned posts */}
              {pinned.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                    📌 Pinned
                  </p>
                  <div className="space-y-3">
                    {pinned.map(post => <CommunityPost key={post.id} post={post} />)}
                  </div>
                  <div className="border-b border-stone-200 my-4" />
                </div>
              )}

              {/* Regular posts / empty state */}
              {regular.length === 0 && pinned.length === 0 ? (
                <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium mb-1">No posts yet</p>
                  <p className="text-sm">Be the first to start a conversation!</p>
                  {user && (
                    <Link href="/community/new" className="mt-4 inline-block text-sm text-emerald-600 font-medium hover:underline">
                      Create the first post →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {regular.map(post => <CommunityPost key={post.id} post={post} />)}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="lg:col-span-1 space-y-4">
          {/* About */}
          <div className="bg-emerald-600 rounded-2xl p-4 text-white">
            <h2 className="font-bold mb-1">m/TeaneckMuslims</h2>
            <p className="text-emerald-100 text-xs mb-3">
              The Muslim community hub for Teaneck, NJ. Ask questions, share resources, and connect.
            </p>
            <Link
              href={user ? '/community/new' : '/auth'}
              className="block w-full bg-white text-emerald-700 rounded-lg py-2 text-sm font-semibold hover:bg-emerald-50 transition-colors text-center"
            >
              {user ? 'Create Post' : 'Sign In to Post'}
            </Link>
          </div>

          {/* Communities */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="font-semibold text-stone-900 mb-3 text-sm">Communities</h3>
            <div className="space-y-0.5">
              {COMMUNITIES.map(community => (
                <Link
                  key={community}
                  href={`/community?category=${community}`}
                  className={`block w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors capitalize ${
                    category === community
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-700'
                  }`}
                >
                  m/{FORUM_CATEGORY_LABELS[community] ?? community}
                </Link>
              ))}
              {category && (
                <Link href="/community" className="block w-full text-left px-2 py-1.5 rounded-lg text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  ✕ Clear filter
                </Link>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="font-semibold text-stone-900 mb-3 text-sm">Community Guidelines</h3>
            <ol className="space-y-2 text-xs text-stone-500 list-decimal list-inside">
              <li>Be kind and respectful — we are one community</li>
              <li>Keep content relevant to local Muslim life</li>
              <li>No hate speech or discrimination</li>
              <li>Respect Islamic adab in discussions</li>
              <li>Verify before sharing — accurate info only</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
