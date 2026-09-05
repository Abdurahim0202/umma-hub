'use server';

/**
 * Auth server actions — DEPRECATED.
 * Auth is now handled entirely client-side via Firebase Auth SDK.
 * The auth page (`/auth`) calls firebase/auth directly.
 *
 * These stubs are kept so any old import site doesn't crash at build time,
 * but they should not be called. If you see one of these redirects fire,
 * that means a page is using the old server-action flow.
 */

import { redirect } from 'next/navigation';

export async function signUp(): Promise<{ error: string }> {
  return { error: 'Use the /auth page (Firebase client-side auth).' };
}

export async function signIn(): Promise<{ error: string }> {
  return { error: 'Use the /auth page (Firebase client-side auth).' };
}

export async function signOut() {
  redirect('/');
}
