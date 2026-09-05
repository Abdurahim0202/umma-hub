import { MessageCircle, TrendingUp, Clock, Star, PlusCircle } from 'lucide-react';
import { forumPosts } from '@/lib/data/community';
import { CommunityPost } from '@/components/cards/CommunityPost';
import { FORUM_CATEGORY_LABELS } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Muslim community discussions for Teaneck, NJ — questions, recommendations, jobs, events, and more.',
};

const COMMUNITIES = [
  'general', 'questions', 'recommendations', 'events', 'jobs',
  'housing', 'education', 'students', 'volunteering', 'businesses',
];

export default function CommunityPage() {
  const pinned = forumPosts.filter(p => p.isPinned);
  const regular = forumPosts.filter(p => !p.isPinned);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left: Feed */}
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
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
              <PlusCircle className="w-4 h-4" />
              New Post
            </button>
          </div>

          {/* Sort tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1">
            {[
              { label: 'Hot', icon: TrendingUp },
              { label: 'New', icon: Clock },
              { label: 'Top', icon: Star },
            ].map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === 0 ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Pinned posts */}
          {pinned.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                📌 Pinned
              </p>
              <div className="space-y-3">
                {pinned.map(post => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </div>
              <div className="border-b border-stone-200 my-4" />
            </div>
          )}

          {/* Regular posts */}
          <div className="space-y-3">
            {regular.map(post => (
              <CommunityPost key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* About */}
          <div className="bg-emerald-600 rounded-2xl p-4 text-white">
            <h2 className="font-bold mb-1">r/TeaneckMuslims</h2>
            <p className="text-emerald-100 text-xs mb-3">
              The Muslim community hub for Teaneck, NJ. Ask questions, share resources, and connect.
            </p>
            <button className="w-full bg-white text-emerald-700 rounded-lg py-2 text-sm font-semibold hover:bg-emerald-50 transition-colors">
              Create Post
            </button>
          </div>

          {/* Communities */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="font-semibold text-stone-900 mb-3 text-sm">Communities</h3>
            <div className="space-y-0.5">
              {COMMUNITIES.map(community => (
                <button
                  key={community}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-stone-600 hover:bg-stone-50 hover:text-emerald-700 transition-colors capitalize"
                >
                  r/{FORUM_CATEGORY_LABELS[community] ?? community}
                </button>
              ))}
            </div>
          </div>

          {/* Community rules */}
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
