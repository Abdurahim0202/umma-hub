/**
 * Community utility functions and types.
 * Kept in a plain (non-'use server') module so they can be imported
 * freely by both server actions and client components.
 */
import type { ForumPost, ForumCategory } from '@/lib/types';

// ─── TYPES ────────────────────────────────────────────────────

/** Raw row returned by Supabase with joined profile + computed aggregates. */
export interface DbPost {
  id:            string;
  user_id:       string;
  title:         string;
  body:          string;
  category:      string;
  is_pinned:     boolean;
  tags:          string[];
  created_at:    string;
  profiles:      { display_name: string; avatar_url: string | null } | null;
  comment_count: number;
  vote_score:    number;
  user_vote:     number | null;
}

/** Raw row returned for a comment. */
export interface DbComment {
  id:                string;
  post_id:           string;
  user_id:           string;
  body:              string;
  parent_comment_id: string | null;
  created_at:        string;
  profiles:          { display_name: string; avatar_url: string | null } | null;
}

// ─── HELPERS ─────────────────────────────────────────────────

/** Convert a DB post row into the ForumPost shape used by existing UI cards. */
export function dbPostToForumPost(post: DbPost): ForumPost {
  const upvotes   = Math.max(0, post.vote_score);
  const downvotes = Math.abs(Math.min(0, post.vote_score));
  return {
    id:           post.id,
    authorId:     post.user_id,
    authorName:   post.profiles?.display_name ?? 'Community Member',
    authorAvatar: post.profiles?.avatar_url ?? undefined,
    community:    post.category as ForumCategory,
    title:        post.title,
    body:         post.body,
    postedAt:     post.created_at,
    upvotes,
    downvotes,
    commentCount: post.comment_count,
    isPinned:     post.is_pinned,
    tags:         post.tags ?? [],
    isSaved:      false,
  };
}
