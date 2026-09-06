'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createPost } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';
import { FORUM_CATEGORY_LABELS } from '@/lib/utils';

const CATEGORIES = [
  'general', 'questions', 'recommendations', 'events', 'jobs',
  'housing', 'education', 'students', 'volunteering', 'businesses',
  'marriage_family', 'youth', 'buy_sell', 'lost_found',
];

export default function NewPostPage() {
  const router         = useRouter();
  const { user }       = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-stone-500 mb-4">You must be signed in to create a post.</p>
        <Link href="/auth" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd       = new FormData(e.currentTarget);
    const title    = (fd.get('title')    as string).trim();
    const body     = (fd.get('body')     as string).trim();
    const category = fd.get('category') as string || 'general';

    if (!title || !body) {
      setError('Title and body are required.');
      setLoading(false);
      return;
    }

    try {
      const modRes = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      const mod = await modRes.json();
      if (mod.blocked) {
        setError(mod.reason ?? 'This post violates our community guidelines.');
        setLoading(false);
        return;
      }
    } catch {
      // If the moderation check itself fails, let the post through rather
      // than blocking a legitimate user on an infrastructure hiccup.
    }

    try {
      await createPost({
        userId:     user!.uid,
        authorName: user!.displayName ?? user!.email?.split('@')[0] ?? 'Community Member',
        title,
        body,
        category,
      });
      router.push('/community');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="border-b border-stone-100 p-5">
          <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Create a Post
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">Share something with the Teaneck Muslim community</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
              Community
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  m/{FORUM_CATEGORY_LABELS[cat] ?? cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={3}
              maxLength={300}
              placeholder="What do you want to discuss?"
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={6}
              maxLength={10000}
              placeholder="Share your thoughts, question, or information..."
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-y"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Post
            </button>
            <Link href="/community" className="px-6 py-3 rounded-xl font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors text-center">
              Cancel
            </Link>
          </div>

          <p className="text-xs text-stone-400">
            Please follow our community guidelines — be respectful, relevant, and kind. 🌙
          </p>
        </form>
      </div>
    </div>
  );
}
