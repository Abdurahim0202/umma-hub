'use client';

import { useEffect, useState } from 'react';
import { User, Settings, Bell, Bookmark, Heart, MapPin, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getProfile } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<{
    displayName?: string;
    city?: string;
    interests?: string[];
  } | null>(null);

  useEffect(() => {
    if (user) {
      getProfile(user.uid).then(data => {
        if (data) setProfile(data as typeof profile);
      });
    }
  }, [user]);

  const displayName = profile?.displayName ?? user?.displayName ?? 'Guest User';
  const city        = profile?.city ?? 'Teaneck';
  const interests   = profile?.interests ?? [];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-stone-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Header card */}
      <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold">{displayName}</h1>
        {user && <p className="text-emerald-100 text-sm mt-0.5">{user.email}</p>}
        <div className="flex items-center justify-center gap-1 text-emerald-100 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {city}, NJ
        </div>

        {user ? (
          <button
            onClick={() => signOut(auth)}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        ) : (
          <Link
            href="/auth"
            className="mt-4 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In / Create Account
          </Link>
        )}
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-4">
        <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-600" />
          My Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {interests.length > 0 ? interests.map((interest: string) => (
            <span key={interest} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              {interest}
            </span>
          )) : (
            <span className="text-sm text-stone-400">No interests set yet.</span>
          )}
          <button className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm hover:bg-stone-200 transition-colors">
            + Add
          </button>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {[
          { icon: Bookmark, label: 'Saved Events & Resources', href: '#' },
          { icon: Bell,     label: 'Notification Preferences',  href: '#' },
          { icon: MapPin,   label: 'Change City',               href: '#' },
          { icon: Settings, label: 'Settings',                  href: '#' },
        ].map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
          >
            <Icon className="w-4 h-4 text-emerald-600" />
            {label}
            <span className="ml-auto text-stone-300">›</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-stone-400 mt-6">
        Ummah Hub · Teaneck, NJ
        {!user && (
          <> · <Link href="/auth" className="text-emerald-600 hover:underline">Sign in to access all features</Link></>
        )}
      </p>
    </div>
  );
}
