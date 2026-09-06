'use client';

import { useEffect, useState } from 'react';
import { User, Heart, MapPin, LogOut, LogIn, Check, X, Pencil, MessageSquare, Trash2, ArrowUp, ArrowDown, Home } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getProfile, updateProfile, getUserPosts, deletePost } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';
import { useHomeMosque } from '@/providers/HomeMosqueProvider';
import { mosques } from '@/lib/data/mosques';
import { FORUM_CATEGORY_LABELS, formatRelativeTime } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ForumPost } from '@/lib/types';

const SUGGESTED_INTERESTS = ['Quran', 'Youth', 'Volunteering', 'Sisters', 'Education', 'Sports', 'Marriage', 'Finance'];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { mosqueId: homeMosqueId, hydrated: mosqueHydrated } = useHomeMosque();
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

  const [myPosts, setMyPosts] = useState<ForumPost[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ForumPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      getProfile(user.uid).then(data => {
        if (data) setProfile(data as typeof profile);
      });
      getUserPosts(user.uid).then(setMyPosts);
    }
  }, [user]);

  async function confirmDeletePost() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      setMyPosts(posts => posts?.filter(p => p.id !== deleteTarget.id) ?? null);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const homeMosque = mosques.find(m => m.id === homeMosqueId);

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

      {/* Home mosque */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-4">
        <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-600" />
          My Home Mosque
        </h2>
        {mosqueHydrated && homeMosque ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{homeMosque.name}</p>
                <p className="text-xs text-stone-400 truncate">{homeMosque.city}, {homeMosque.state}</p>
              </div>
            </div>
            <Link
              href={`/mosques/${homeMosque.slug}`}
              className="text-xs font-medium text-emerald-600 hover:underline flex-shrink-0"
            >
              View
            </Link>
          </div>
        ) : (
          <p className="text-sm text-stone-400">No home mosque selected yet.</p>
        )}
        <p className="text-xs text-stone-400 mt-2">
          Change this any time from the prayer times bar at the top of the page.
        </p>
      </div>

      {/* My Posts */}
      {user && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            My Posts
          </h2>
          {myPosts === null ? (
            <p className="text-sm text-stone-400">Loading your posts...</p>
          ) : myPosts.length === 0 ? (
            <p className="text-sm text-stone-400">
              You haven&apos;t posted anything yet. <Link href="/community/new" className="text-emerald-600 hover:underline">Create a post</Link>
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {myPosts.map(post => (
                <div key={post.id} className="py-3 flex items-start justify-between gap-3">
                  <Link href={`/community/${post.id}`} className="min-w-0 flex-1 group">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium text-stone-400">
                        m/{FORUM_CATEGORY_LABELS[post.community] ?? post.community}
                      </span>
                      <span className="text-[10px] text-stone-300">·</span>
                      <span className="text-[10px] text-stone-400">{formatRelativeTime(post.postedAt)}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-800 truncate group-hover:text-emerald-700">{post.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-stone-400">
                      <span className="flex items-center gap-0.5"><ArrowUp className="w-3 h-3" />{post.upvotes}</span>
                      <span className="flex items-center gap-0.5"><ArrowDown className="w-3 h-3" />{post.downvotes}</span>
                      <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.commentCount}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/community/${post.id}`}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this post?"
        description={deleteTarget ? `"${deleteTarget.title}" and its comments will be permanently removed. This can't be undone.` : ''}
        confirmLabel="Delete"
        danger
        pending={deleting}
        onConfirm={confirmDeletePost}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
