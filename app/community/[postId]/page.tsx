'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getPost, getComments, createComment } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';
import { FORUM_CATEGORY_LABELS, formatRelativeTime } from '@/lib/utils';
import { VoteButtons } from './VoteButtons';
import type { ForumPost, ForumComment } from '@/lib/types';

export default function PostDetailPage() {
  const params              = useParams<{ postId: string }>();
  const postId              = params.postId;
  const { user }            = useAuth();

  const [post,     setPost]     = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!postId) return;
    Promise.all([getPost(postId), getComments(postId)])
      .then(([p, c]) => { setPost(p); setComments(c); })
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setCommenting(true);
    setCommentError(null);
    try {
      await createComment({
        postId,
        userId:     user.uid,
        authorName: user.displayName ?? user.email?.split('@')[0] ?? 'Community Member',
        body:       commentText.trim(),
      });
      setCommentText('');
      // Refresh comments
      const updated = await getComments(postId);
      setComments(updated);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setCommenting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-stone-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-stone-400">
        <p className="text-lg font-medium mb-2">Post not found</p>
        <Link href="/community" className="text-emerald-600 hover:underline text-sm">← Back to Community</Link>
      </div>
    );
  }

  const score = post.upvotes - post.downvotes;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>

      {/* Post card */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-5">
        <div className="flex gap-4">
          <VoteButtons postId={postId} score={score} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-2">
              <span className="category-pill bg-emerald-100 text-emerald-700">
                r/{FORUM_CATEGORY_LABELS[post.community] ?? post.community}
              </span>
              <span className="text-xs text-stone-400">
                Posted by <strong className="text-stone-600">{post.authorName}</strong>
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(post.postedAt)}
              </span>
            </div>

            <h1 className="text-xl font-bold text-stone-900 mb-3 leading-snug">{post.title}</h1>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{post.body}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-900 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleComment} className="border-b border-stone-100 p-5">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              required
              rows={3}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-y mb-3"
            />
            {commentError && (
              <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                <AlertCircle className="w-4 h-4" /> {commentError}
              </div>
            )}
            <button
              type="submit"
              disabled={commenting || !commentText.trim()}
              className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {commenting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Comment
            </button>
          </form>
        ) : (
          <div className="border-b border-stone-100 p-5 bg-stone-50 flex items-center justify-between">
            <p className="text-sm text-stone-500">Sign in to leave a comment</p>
            <Link href="/auth" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          </div>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <div className="p-8 text-center text-stone-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {comments.map(comment => (
              <div key={comment.id} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                    {comment.authorName[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-stone-700">{comment.authorName}</span>
                  <span className="text-xs text-stone-400">{formatRelativeTime(comment.postedAt)}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed pl-8 whitespace-pre-wrap">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
