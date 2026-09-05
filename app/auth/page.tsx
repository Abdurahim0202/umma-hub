'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createProfile } from '@/lib/firebase/community';

export default function AuthPage() {
  const router = useRouter();
  const [tab,     setTab]     = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function switchTab(t: 'signin' | 'signup') {
    setTab(t);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd          = new FormData(e.currentTarget);
    const email       = (fd.get('email')        as string).trim();
    const password    = fd.get('password')       as string;
    const displayName = (fd.get('display_name') as string | null)?.trim() ?? '';

    try {
      if (tab === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Set the display name on the Firebase Auth profile
        await updateProfile(cred.user, { displayName: displayName || email.split('@')[0] });
        // Create a Firestore profile document
        await createProfile({
          id:          cred.user.uid,
          email:       email,
          displayName: displayName || email.split('@')[0],
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/community');
    } catch (err: unknown) {
      const code    = (err as { code?: string }).code ?? '';
      const message = firebaseErrorMessage(code) ?? (err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Ummah Hub</h1>
            <p className="text-emerald-100 text-sm mt-1">Teaneck Muslim Community</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-100">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {tab === 'signup' && (
              <div>
                <label htmlFor="display_name" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="display_name"
                    name="display_name"
                    type="text"
                    placeholder="Ahmad K."
                    minLength={2}
                    className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            {tab === 'signup' && (
              <p className="text-xs text-stone-400 text-center">
                By creating an account, you agree to be a respectful member of the Teaneck Muslim Community. 🌙
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')}
            className="text-emerald-600 font-medium hover:underline"
          >
            {tab === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Firebase error code → human-readable message ────────────

function firebaseErrorMessage(code: string): string | null {
  const map: Record<string, string> = {
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Incorrect email or password.',
    'auth/too-many-requests':       'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed':  'Network error. Check your connection and that Firebase is configured in .env.local.',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Firebase API key is invalid. Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env.local.',
  };
  return map[code] ?? null;
}
