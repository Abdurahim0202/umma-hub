/**
 * Firestore community functions.
 * Plain async functions — NOT server actions — so they can be called from
 * both Client Components and any server-side code that imports them.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  limit,
  where,
  increment,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import type { ForumPost, ForumComment } from '@/lib/types';

// ─── HELPERS ─────────────────────────────────────────────────

function docToPost(snap: QueryDocumentSnapshot): ForumPost {
  const d         = snap.data();
  const voteScore = (d.voteScore as number) ?? 0;
  return {
    id:           snap.id,
    authorId:     d.userId as string,
    authorName:   (d.authorName as string) ?? 'Community Member',
    authorAvatar: d.authorAvatar as string | undefined,
    community:    d.category as ForumPost['community'],
    title:        d.title as string,
    body:         d.body as string,
    postedAt:     d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    upvotes:      Math.max(0, voteScore),
    downvotes:    Math.abs(Math.min(0, voteScore)),
    commentCount: (d.commentCount as number) ?? 0,
    isPinned:     (d.isPinned as boolean) ?? false,
    tags:         (d.tags as string[]) ?? [],
    isSaved:      false,
  };
}

// ─── GET POSTS ───────────────────────────────────────────────

export async function getPosts(opts?: {
  sort?: 'hot' | 'new' | 'top';
  category?: string;
  limit?: number;
}): Promise<ForumPost[]> {
  const { sort = 'new', category, limit: lim = 50 } = opts ?? {};

  // Build query — Firestore can only orderBy indexed fields
  const postsRef = collection(db, 'posts');
  const q = sort === 'top'
    ? query(postsRef, orderBy('voteScore', 'desc'), limit(lim))
    : query(postsRef, orderBy('createdAt', 'desc'), limit(lim));

  const snap = await getDocs(q);
  let posts = snap.docs.map(docToPost);

  if (category) {
    posts = posts.filter(p => p.community === category);
  }

  if (sort === 'hot') {
    posts.sort((a, b) => {
      const ageA = (Date.now() - new Date(a.postedAt).getTime()) / (1000 * 60 * 60);
      const ageB = (Date.now() - new Date(b.postedAt).getTime()) / (1000 * 60 * 60);
      const hotA = (a.upvotes - a.downvotes) / Math.pow(ageA + 2, 1.5);
      const hotB = (b.upvotes - b.downvotes) / Math.pow(ageB + 2, 1.5);
      return hotB - hotA;
    });
  }

  return [
    ...posts.filter(p => p.isPinned),
    ...posts.filter(p => !p.isPinned),
  ];
}

// ─── GET SINGLE POST ─────────────────────────────────────────

export async function getPost(postId: string): Promise<ForumPost | null> {
  const snap = await getDoc(doc(db, 'posts', postId));
  if (!snap.exists()) return null;
  return docToPost(snap as QueryDocumentSnapshot);
}

// ─── CREATE POST ─────────────────────────────────────────────

export async function createPost(data: {
  userId:      string;
  authorName:  string;
  title:       string;
  body:        string;
  category:    string;
}): Promise<string> {
  const ref = await addDoc(collection(db, 'posts'), {
    ...data,
    isPinned:     false,
    tags:         [],
    voteScore:    0,
    commentCount: 0,
    createdAt:    serverTimestamp(),
    updatedAt:    serverTimestamp(),
  });
  return ref.id;
}

// ─── DELETE POST ─────────────────────────────────────────────

export async function deletePost(postId: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', postId));
}

// ─── VOTE POST ───────────────────────────────────────────────
// Votes are stored as /votes/{userId}_{postId}
// so each user can only have one vote per post.

export async function votePost(
  userId: string,
  postId: string,
  value: 1 | -1,
): Promise<void> {
  const voteId  = `${userId}_${postId}`;
  const voteRef = doc(db, 'votes', voteId);
  const postRef = doc(db, 'posts', postId);
  const existing = await getDoc(voteRef);

  if (existing.exists()) {
    const prevValue = existing.data().value as 1 | -1;
    if (prevValue === value) {
      // Toggle off — remove the vote
      await deleteDoc(voteRef);
      await updateDoc(postRef, { voteScore: increment(-value) });
    } else {
      // Flip the vote (e.g. upvote → downvote, change = -2)
      await setDoc(voteRef, { userId, postId, value });
      await updateDoc(postRef, { voteScore: increment(value * 2) });
    }
  } else {
    // New vote
    await setDoc(voteRef, { userId, postId, value });
    await updateDoc(postRef, { voteScore: increment(value) });
  }
}

// ─── GET USER VOTE ───────────────────────────────────────────

export async function getUserVote(userId: string, postId: string): Promise<1 | -1 | null> {
  const snap = await getDoc(doc(db, 'votes', `${userId}_${postId}`));
  if (!snap.exists()) return null;
  return snap.data().value as 1 | -1;
}

// ─── GET COMMENTS ────────────────────────────────────────────

export async function getComments(postId: string): Promise<ForumComment[]> {
  const q    = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d): ForumComment => ({
    id:           d.id,
    postId,
    authorId:     d.data().userId as string,
    authorName:   (d.data().authorName as string) ?? 'Community Member',
    authorAvatar: d.data().authorAvatar as string | undefined,
    body:         d.data().body as string,
    postedAt:     d.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    upvotes:      0,
  }));
}

// ─── CREATE COMMENT ──────────────────────────────────────────

export async function createComment(data: {
  postId:     string;
  userId:     string;
  authorName: string;
  body:       string;
}): Promise<void> {
  await addDoc(collection(db, 'posts', data.postId, 'comments'), {
    userId:     data.userId,
    authorName: data.authorName,
    body:       data.body,
    createdAt:  serverTimestamp(),
  });
  // Increment comment count on the post
  await updateDoc(doc(db, 'posts', data.postId), {
    commentCount: increment(1),
  });
}

// ─── PROFILES ────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const snap = await getDoc(doc(db, 'profiles', userId));
  return snap.exists() ? snap.data() : null;
}

export async function createProfile(data: {
  id:          string;
  email:       string;
  displayName: string;
}): Promise<void> {
  await setDoc(doc(db, 'profiles', data.id), {
    email:       data.email,
    displayName: data.displayName,
    city:        'Teaneck',
    interests:   [],
    role:        'member',
    createdAt:   serverTimestamp(),
  });
}
