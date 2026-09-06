'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Globe, Clock, CheckCircle, Navigation, Home, Loader2 } from 'lucide-react';
import type { IqamahTime, Mosque } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useHomeMosque } from '@/providers/HomeMosqueProvider';

interface MosqueCardProps {
  mosque: Mosque;
  variant?: 'default' | 'compact';
  className?: string;
}

export function MosqueCard({ mosque, variant = 'default', className }: MosqueCardProps) {
  const { mosqueId: selectedMosqueId, hydrated } = useHomeMosque();
  const isSelected = hydrated && mosque.id === selectedMosqueId;

  // Only the selected home mosque's card fetches live iqamah times — the
  // rest of the directory shows no time panel at all, so we never fetch
  // (let alone display) prayer data for mosques the user isn't following.
  const [liveIqamah, setLiveIqamah] = useState<IqamahTime | null | undefined>(mosque.iqamahTimes);
  const [loadingIqamah, setLoadingIqamah] = useState(false);

  useEffect(() => {
    if (!isSelected) return;
    let cancelled = false;
    // Kicking off a fetch is exactly what this effect exists to do — the
    // loading flag just mirrors that fetch being in flight, not state we
    // could compute during render (network requests can't run there).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingIqamah(true);
    fetch(`/api/prayer-times?mosqueId=${encodeURIComponent(mosque.id)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!cancelled) setLiveIqamah(data?.iqamahTimes ?? null);
      })
      .catch(() => {
        if (!cancelled) setLiveIqamah(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingIqamah(false);
      });
    return () => { cancelled = true; };
  }, [isSelected, mosque.id]);

  const nextIqamah = isSelected ? liveIqamah : null;

  if (variant === 'compact') {
    return (
      <Link href={`/mosques/${mosque.slug}`}>
        <div className={cn('flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors', className)}>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-lg">
            🕌
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-medium text-stone-900 text-sm line-clamp-1">{mosque.name}</p>
              {mosque.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{mosque.shortDescription}</p>
          </div>
          {mosque.isHomeMosque ? (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">Home</span>
          ) : mosque.distanceLabel ? (
            <span className="text-xs text-stone-400 flex-shrink-0">{mosque.distanceLabel}</span>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden card-hover flex flex-col', className)}>
      {/* Entire upper section navigates to detail page */}
      <Link href={`/mosques/${mosque.slug}`} className="flex-1">
        {/* Cover */}
        <div
          className={cn(
            'h-32 relative flex items-center justify-center',
            !mosque.coverImage && 'bg-linear-to-br from-emerald-600 to-teal-700'
          )}
        >
          {mosque.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mosque.coverImage} alt={mosque.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🕌</span>
          )}

          {mosque.isHomeMosque && (
            <div className="absolute top-3 left-3 bg-amber-400 rounded-full px-2 py-0.5 flex items-center gap-1">
              <Home className="w-3 h-3 text-amber-900" />
              <span className="text-[10px] font-bold text-amber-900">Home Mosque</span>
            </div>
          )}

          {mosque.verified && (
            <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Verified</span>
            </div>
          )}

          {/* Distance badge — bottom right */}
          {mosque.distanceLabel && !mosque.isHomeMosque && (
            <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-0.5">
              <span className="text-[10px] text-white font-medium">{mosque.distanceLabel}</span>
            </div>
          )}
        </div>

        <div className="p-4 pb-3">
          <h3 className="font-semibold text-stone-900 text-base mb-0.5 line-clamp-1">{mosque.name}</h3>
          <p className="text-stone-500 text-xs line-clamp-2 mb-3">{mosque.shortDescription}</p>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-stone-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{mosque.address}, {mosque.city}, {mosque.state}</span>
          </div>

          {/* Phone — plain text here; the actual tel: link lives in the
              action row below so it isn't nested inside the card's <Link> */}
          {mosque.phone && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{mosque.phone}</span>
            </div>
          )}

          {/* Today's Iqamah preview — selected home mosque only. Other
              mosques' cards show no time panel and fetch nothing. */}
          {isSelected && (
            loadingIqamah ? (
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading prayer times…
              </div>
            ) : nextIqamah ? (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  Today&apos;s Iqamah
                </p>
                <div className="grid grid-cols-5 gap-1 text-center">
                  {[
                    { label: 'Fajr', time: nextIqamah.fajr },
                    { label: 'Dhuhr', time: nextIqamah.dhuhr },
                    { label: 'Asr', time: nextIqamah.asr },
                    { label: 'Maghrib', time: nextIqamah.maghrib },
                    { label: 'Isha', time: nextIqamah.isha },
                  ].map(p => (
                    <div key={p.label}>
                      <p className="text-[9px] text-stone-400 uppercase">{p.label}</p>
                      <p className="text-[11px] font-semibold text-stone-700">
                        {p.time.replace(' AM', '').replace(' PM', '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-400 italic">Prayer times not available yet</p>
              </div>
            )
          )}

          {/* Tags */}
          {mosque.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {mosque.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full capitalize">
                  {tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Action buttons — outside the Link to prevent nested <a> */}
      <div className="px-4 pb-4 pt-0 flex gap-2">
        {mosque.phone && (
          <a
            href={`tel:${mosque.phone}`}
            onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg py-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        )}
        <a
          href={mosque.directionsUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg py-2 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Directions
        </a>
        {mosque.website && (
          <a
            href={mosque.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-stone-50 text-stone-600 hover:bg-stone-100 rounded-lg py-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        )}
      </div>
    </div>
  );
}
