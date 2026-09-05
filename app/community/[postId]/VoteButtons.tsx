'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { votePost, getUserVote } from '@/lib/firebase/community';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  postId: string;
  score:  number;
}

export function VoteButtons({ postId, score }: VoteButtonsProps) {
  const { user }                              = useAuth();
  const [optimisticScore, setOptimisticScore] = useState(score);
  const [activeVote, setActiveVote]           = useState<1 | -1 | null>(null);
  const [pending, setPending]                 = useState(false);
  const [loadedFor, setLoadedFor]             = useState<string | null>(null);

  // `score` already reflects any vote this user previously cast, but the
  // arrow highlight state doesn't — without this, re-clicking after a
  // refresh double-counts a vote (or silently removes it) because
  // handleVote assumes activeVote:null means "never voted".
  //
  // Voting is disabled (see `voteLoaded` below) until this resolves. Without
  // that guard, a click landing before this fetch finishes would compute its
  // optimistic delta against a wrongly-assumed activeVote:null while
  // Firestore's votePost — which always reads the real prior vote — applies
  // the correct ±2 "flip" adjustment. Server and client would disagree, and
  // the vote could appear to swing by 2 instead of 1 once the page re-synced.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getUserVote(user.uid, postId).then(v => {
      if (cancelled) return;
      setActiveVote(v);
      setLoadedFor(user.uid);
    });
    return () => { cancelled = true; };
  }, [user, postId]);

  // Reset once, on sign-out, without setState running synchronously inside
  // the effect body — only when there's actually stale state to clear.
  const shouldResetOnSignOut = !user && loadedFor !== null;
  if (shouldResetOnSignOut) {
    setActiveVote(null);
    setLoadedFor(null);
  }

  const voteLoaded = !!user && loadedFor === user.uid;

  async function handleVote(value: 1 | -1) {
    if (!user || pending || !voteLoaded) return;
    const prev  = activeVote;
    const next  = prev === value ? null : value;
    const delta = (next ?? 0) - (prev ?? 0);
    setActiveVote(next);
    setOptimisticScore(s => s + delta);
    setPending(true);
    try {
      await votePost(user.uid, postId, value);
    } catch {
      // Revert on failure
      setActiveVote(prev);
      setOptimisticScore(s => s - delta);
    } finally {
      setPending(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <Link href="/auth" title="Sign in to vote" className="p-1 rounded hover:bg-stone-100 text-stone-300">
          <ArrowUp className="w-5 h-5" />
        </Link>
        <span className="text-sm font-bold text-stone-500">{optimisticScore}</span>
        <Link href="/auth" title="Sign in to vote" className="p-1 rounded hover:bg-stone-100 text-stone-300">
          <ArrowDown className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <button
        onClick={() => handleVote(1)}
        disabled={pending || !voteLoaded}
        title={voteLoaded ? undefined : 'Loading your vote…'}
        className={cn(
          'p-1 rounded transition-colors disabled:opacity-50',
          activeVote === 1
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-stone-400 hover:text-emerald-600 hover:bg-emerald-50',
        )}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
      <span className={cn(
        'text-sm font-bold',
        activeVote === 1 ? 'text-emerald-600' : activeVote === -1 ? 'text-red-500' : 'text-stone-700',
      )}>
        {optimisticScore}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={pending || !voteLoaded}
        title={voteLoaded ? undefined : 'Loading your vote…'}
        className={cn(
          'p-1 rounded transition-colors disabled:opacity-50',
          activeVote === -1
            ? 'text-red-500 bg-red-50'
            : 'text-stone-400 hover:text-red-500 hover:bg-red-50',
        )}
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </div>
  );
}
