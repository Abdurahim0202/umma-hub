'use server';

/**
 * IMPORTANT: Every export in a 'use server' file must be an async function.
 * Non-async helpers and types live in @/lib/community-utils instead.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { dbPostToForumPost, type DbPost } from '@/lib/community-utils';
import type { ForumPost, ForumComment } from '@/lib/types';

// Re-export types so existing consumers don't break
export type { DbPost } from '@/lib/community-utils';

// ─── GET POSTS ───────────────────────────────────────────────

export async function getPosts(opts?: {
  sort?: 'hot' | 'new' | 'top';
  category?: string;
  limit?: number;
}): Promise<ForumPost[]> {
  const { sort = 'new', category, limit = 50 } = opts ?? {};
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select(`
      id,
      user_id,
      title,
      body,
      category,
      is_pinned,
      tags,
      created_at,
      profiles ( display_name, avatar_url ),
      votes ( value ),
      comments ( id )
    `)
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  // Compute aggregates client-side (simpler than Supabase RPCs for hackathon)
  const posts: DbPost[] = (data as any[]).map((row) => {
    const votes: { value: number }[] = row.votes ?? [];
    const voteScore = votes.reduce((sum: number, v: { value: number }) => sum + v.value, 0);
    return {
      ...row,
      comment_count: (row.comments ?? []).length,
      vote_score:    voteScore,
      user_vote:     null,
    };
  });

  // Sort
  const sorted = [...posts];
  if (sort === 'new') {
    sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === 'top') {
    sorted.sort((a, b) => b.vote_score - a.vote_score);
  } else {
    // 'hot' — score weighted by recency
    sorted.sort((a, b) => {
      const ageA = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60);
      const ageB = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60);
      const hotA = a.vote_score / Math.pow(ageA + 2, 1.5);
      const hotB = b.vote_score / Math.pow(ageB + 2, 1.5);
      return hotB - hotA;
    });
  }

  // Pinned posts always first
  return [
    ...sorted.filter(p => p.is_pinned).map(dbPostToForumPost),
    ...sorted.filter(p => !p.is_pinned).map(dbPostToForumPost),
  ];
}

// ─── GET SINGLE POST ─────────────────────────────────────────

export async function getPost(postId: string): Promise<ForumPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      user_id,
      title,
      body,
      category,
      is_pinned,
      tags,
      created_at,
      profiles ( display_name, avatar_url ),
      votes ( value ),
      comments ( id )
    `)
    .eq('id', postId)
    .single();

  if (error || !data) return null;

  const row = data as any;
  const votes: { value: number }[] = row.votes ?? [];
  const voteScore = votes.reduce((sum: number, v: { value: number }) => sum + v.value, 0);
  const dbPost: DbPost = {
    ...row,
    comment_count: (row.comments ?? []).length,
    vote_score:    voteScore,
    user_vote:     null,
  };
  return dbPostToForumPost(dbPost);
}

// ─── CREATE POST ─────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to post.' };

  const title    = (formData.get('title')    as string).trim();
  const body     = (formData.get('body')     as string).trim();
  const category = (formData.get('category') as string) || 'general';

  if (!title || !body) return { error: 'Title and body are required.' };

  const { error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, title, body, category });

  if (error) return { error: error.message };

  revalidatePath('/community');
  revalidatePath('/');
  redirect('/community');
}

// ─── VOTE POST ───────────────────────────────────────────────

export async function votePost(postId: string, value: 1 | -1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to vote.' };

  // Check if user already voted
  const { data: existing } = await supabase
    .from('votes')
    .select('id, value')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    if (existing.value === value) {
      // Same vote — remove it (toggle off)
      await supabase.from('votes').delete().eq('id', existing.id);
    } else {
      // Opposite vote — update it
      await supabase.from('votes').update({ value }).eq('id', existing.id);
    }
  } else {
    // No vote yet — insert
    await supabase.from('votes').insert({ post_id: postId, user_id: user.id, value });
  }

  revalidatePath('/community');
  revalidatePath(`/community/${postId}`);
  revalidatePath('/');
}

// ─── GET COMMENTS ────────────────────────────────────────────

export async function getComments(postId: string): Promise<ForumComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_id,
      user_id,
      body,
      parent_comment_id,
      created_at,
      profiles ( display_name, avatar_url )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return (data as any[]).map((row): ForumComment => ({
    id:              row.id,
    postId:          row.post_id,
    authorId:        row.user_id,
    authorName:      row.profiles?.display_name ?? 'Community Member',
    authorAvatar:    row.profiles?.avatar_url ?? undefined,
    body:            row.body,
    postedAt:        row.created_at,
    upvotes:         0,
    parentCommentId: row.parent_comment_id ?? undefined,
  }));
}

// ─── CREATE COMMENT ──────────────────────────────────────────

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to comment.' };

  const postId = formData.get('post_id') as string;
  const body   = (formData.get('body') as string).trim();

  if (!body) return { error: 'Comment cannot be empty.' };

  const { error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: user.id, body });

  if (error) return { error: error.message };

  revalidatePath(`/community/${postId}`);
}

// ─── DELETE POST ─────────────────────────────────────────────

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/community');
  redirect('/community');
}
