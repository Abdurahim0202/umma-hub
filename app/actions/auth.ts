'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Guard: warn if env vars are missing instead of throwing a cryptic fetch error
function checkEnvVars() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || url.includes('YOUR_PROJECT_REF') || !key || key.includes('YOUR_ANON_KEY')) {
    return 'Supabase is not configured yet. Please fill in your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server.';
  }
  return null;
}

// ─── SIGN UP ─────────────────────────────────────────────────

export async function signUp(formData: FormData) {
  const envError = checkEnvVars();
  if (envError) return { error: envError };

  try {
    const supabase = await createClient();

    const email       = formData.get('email')        as string;
    const password    = formData.get('password')     as string;
    const displayName = formData.get('display_name') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
      },
    });

    if (error) return { error: error.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Connection failed: ${msg}. Check your .env.local credentials.` };
  }

  revalidatePath('/', 'layout');
  redirect('/community');
}

// ─── SIGN IN ─────────────────────────────────────────────────

export async function signIn(formData: FormData) {
  const envError = checkEnvVars();
  if (envError) return { error: envError };

  try {
    const supabase = await createClient();

    const email    = formData.get('email')    as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: error.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Connection failed: ${msg}. Check your .env.local credentials.` };
  }

  revalidatePath('/', 'layout');
  redirect('/community');
}

// ─── SIGN OUT ────────────────────────────────────────────────

export async function signOut() {
  const envError = checkEnvVars();
  if (!envError) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore sign-out errors
    }
  }
  revalidatePath('/', 'layout');
  redirect('/');
}
