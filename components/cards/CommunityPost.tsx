import { ArrowUp, MessageCircle, Clock, Pin } from 'lucide-react';
import type { ForumPost } from '@/lib/types';
import { cn, formatRelativeTime, FORUM_CATEGORY_LABELS } from '@/lib/utils';

interface CommunityPostProps {
  post: ForumPost;
  className?: string;
}

const COMMUNITY_COLORS: Record<string, string> = {
  general: 'bg-stone-100 text-stone-600',
  questions: 'bg-blue-100 text-blue-700',
  events: 'bg-emerald-100 text-emerald-700',
  recommendations: 'bg-amber-100 text-amber-700',
  jobs: 'bg-sky-100 text-sky-700',
  housing: 'bg-lime-100 text-lime-700',
  education: 'bg-indigo-100 text-indigo-700',
  marriage_family: 'bg-pink-100 text-pink-700',
  students: 'bg-violet-100 text-violet-700',
  youth: 'bg-orange-100 text-orange-700',
  businesses: 'bg-yellow-100 text-yellow-700',
  volunteering: 'bg-rose-100 text-rose-700',
  announcements: 'bg-red-100 text-red-700',
  buy_sell: 'bg-teal-100 text-teal-700',
  lost_found: 'bg-gray-100 text-gray-700',
};

export function CommunityPost({ post, className }: CommunityPostProps) {
  const communityLabel = FORUM_CATEGORY_LABELS[post.community] ?? post.community;
  const communityColor = COMMUNITY_COLORS[post.community] ?? 'bg-gray-100 text-gray-700';
  const score = post.upvotes - post.downvotes;

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-stone-100 p-4 card-hover', className)}>
      <div className="flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button className="p-1 rounded hover:bg-emerald-50 text-stone-400 hover:text-emerald-600 transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-stone-700">{score}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
            <span className={cn('category-pill', communityColor)}>r/{communityLabel}</span>
            {post.isPinned && (
              <span className="flex items-center gap-0.5 text-[10px] text-stone-400">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
            <span className="text-xs text-stone-400">Posted by <strong className="text-stone-600">{post.authorName}</strong></span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1.5 line-clamp-2">
            {post.title}
          </h3>

          {/* Body preview */}
          <p className="text-stone-500 text-xs line-clamp-2 mb-2">{post.body}</p>

          {/* Footer */}
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.commentCount} comments
            </button>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatRelativeTime(post.postedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
