'use client';

import Link from 'next/link';
import { User, LogIn, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/providers/AuthProvider';

export function NavbarAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          title={user.displayName ?? user.email ?? undefined}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-700" />
          </div>
        </Link>
        <button
          onClick={() => signOut(auth)}
          title="Sign out"
          className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Link>
  );
}
