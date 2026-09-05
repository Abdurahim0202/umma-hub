'use server';

/**
 * Community server actions — re-exports the Firestore helpers from
 * lib/firebase/community so that server components can call them.
 *
 * IMPORTANT: Every export in a 'use server' file must be an async function.
 * Non-async helpers and types live in @/lib/community-utils instead.
 */

export { getPosts, getPost, deletePost, getComments } from '@/lib/firebase/community';

// Re-export types so existing consumers don't break
export type { DbPost } from '@/lib/community-utils';
