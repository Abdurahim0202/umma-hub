'use client';

import { useEffect, useState } from 'react';
import { User, Heart, MapPin, LogOut, LogIn, Check, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getProfile, updateProfile } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';

const SUGGESTED_INTERESTS = ['Quran', 'Youth', 'Volunteering', 'Sisters', 'Education', 'Sports', 'Marriage', 'Finance'];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<{
    displayName?: string;
    city?: string;
    interests?: string[];
  } | null>(null);

  const [editingCity, setEditingCity] = useState(false);
  const [cityDraft, setCityDraft] = useState('');
  const [addingInterest, setAddingInterest] = useState(false);
  const [interestDraft, setInterestDraft] = useState('');
  const [saving, setSaving] = useState(false);

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

  async function saveCity() {
    if (!user || !cityDraft.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user.uid, { city: cityDraft.trim() });
      setProfile(p => ({ ...p, city: cityDraft.trim() }));
      setEditingCity(false);
    } finally {
      setSaving(false);
    }
  }

  async function addInterest(interest: string) {
    if (!user || !interest.trim() || interests.includes(interest.trim())) {
      setAddingInterest(false);
      setInterestDraft('');
      return;
    }
    const next = [...interests, interest.trim()];
    setSaving(true);
    try {
      await updateProfile(user.uid, { interests: next });
      setProfile(p => ({ ...p, interests: next }));
      setAddingInterest(false);
      setInterestDraft('');
    } finally {
      setSaving(false);
    }
  }

  async function removeInterest(interest: string) {
    if (!user) return;
    const next = interests.filter(i => i !== interest);
    setSaving(true);
    try {
      await updateProfile(user.uid, { interests: next });
      setProfile(p => ({ ...p, interests: next }));
    } finally {
      setSaving(false);
    }
  }

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

        {/* City — editable */}
        {editingCity ? (
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <input
              autoFocus
              value={cityDraft}
              onChange={e => setCityDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveCity()}
              className="bg-white/20 placeholder-emerald-100 text-white text-sm rounded-lg px-2 py-1 outline-none w-32 text-center"
            />
            <button onClick={saveCity} disabled={saving} className="p-1 rounded hover:bg-white/20">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditingCity(false)} className="p-1 rounded hover:bg-white/20">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setCityDraft(city); setEditingCity(true); }}
            disabled={!user}
            className="flex items-center justify-center gap-1 text-emerald-100 text-sm mt-1 mx-auto hover:text-white transition-colors disabled:hover:text-emerald-100"
          >
            <MapPin className="w-3.5 h-3.5" />
            {city}, NJ
            {user && <Pencil className="w-3 h-3 opacity-60" />}
          </button>
        )}

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
        <div className="flex flex-wrap gap-2 items-center">
          {interests.length === 0 && !addingInterest && (
            <span className="text-sm text-stone-400">No interests set yet.</span>
          )}
          {interests.map((interest: string) => (
            <span
              key={interest}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
            >
              {interest}
              <button onClick={() => removeInterest(interest)} className="hover:text-emerald-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {user && addingInterest ? (
            <span className="flex items-center gap-1">
              <input
                autoFocus
                list="suggested-interests"
                value={interestDraft}
                onChange={e => setInterestDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInterest(interestDraft)}
                placeholder="e.g. Quran"
                className="px-2 py-1 border border-stone-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-28"
              />
              <datalist id="suggested-interests">
                {SUGGESTED_INTERESTS.map(i => <option key={i} value={i} />)}
              </datalist>
              <button onClick={() => addInterest(interestDraft)} disabled={saving} className="p-1 text-emerald-600 hover:text-emerald-800">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setAddingInterest(false); setInterestDraft(''); }} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </span>
          ) : (
            <button
              onClick={() => user ? setAddingInterest(true) : undefined}
              className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm hover:bg-stone-200 transition-colors disabled:opacity-50"
              disabled={!user}
              title={user ? undefined : 'Sign in to set interests'}
            >
              + Add
            </button>
          )}
        </div>
        {!user && (
          <p className="text-xs text-stone-400 mt-2">
            <Link href="/auth" className="text-emerald-600 hover:underline">Sign in</Link> to set your interests.
          </p>
        )}
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
