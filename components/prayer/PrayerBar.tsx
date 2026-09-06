'use client';

import { useState } from 'react';
import { DEFAULT_PRAYER_TIMES } from '@/lib/config';
import { getNextPrayer, formatMinutesUntil } from '@/lib/utils';
import { useHomeMosque } from '@/lib/hooks/useHomeMosque';
import { Clock, MapPin, ChevronDown, Check } from 'lucide-react';
import type { PrayerTime } from '@/lib/types';

const PRAYER_DISPLAY = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
] as const;

interface MosqueOption {
  id: string;
  name: string;
  hasData: boolean;
}

interface PrayerBarProps {
  prayerTimesByMosque: Record<string, PrayerTime>;
  mosqueOptions: MosqueOption[];
}

export function PrayerBar({ prayerTimesByMosque, mosqueOptions }: PrayerBarProps) {
  const { mosqueId, setMosqueId, hydrated } = useHomeMosque();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fall back gracefully: selected mosque's live times, else Darul Islah's
  // (our best-covered source), else the static estimate — never a blank bar.
  const prayerTimes =
    prayerTimesByMosque[mosqueId] ??
    prayerTimesByMosque['darul-islah'] ??
    DEFAULT_PRAYER_TIMES;

  const selectedMosque = mosqueOptions.find(m => m.id === mosqueId);
  const next = getNextPrayer(prayerTimes);

  return (
    <div className="prayer-bar-gradient text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[52px] gap-3">
          {/* Prayer times */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 overflow-x-auto">
            {PRAYER_DISPLAY.map(({ key, label }) => {
              const isNext = next?.name.toLowerCase() === label.toLowerCase();
              return (
                <div key={key} className="flex flex-col items-center">
                  <span
                    className={`text-[10px] uppercase tracking-wide font-medium ${
                      isNext ? 'text-yellow-300' : 'text-emerald-200'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isNext ? 'text-yellow-300 prayer-pulse' : 'text-white'
                    }`}
                  >
                    {prayerTimes[key as keyof PrayerTime]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Next prayer countdown */}
            {next && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs">
                <Clock className="w-3 h-3 text-yellow-300" />
                <span className="text-emerald-100">
                  {next.name} in{' '}
                  <span className="font-semibold text-yellow-300">
                    {formatMinutesUntil(next.minutesUntil)}
                  </span>
                </span>
              </div>
            )}

            {/* Home mosque selector */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                disabled={!hydrated}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-xs transition-colors disabled:opacity-60"
              >
                <MapPin className="w-3 h-3 text-emerald-200 flex-shrink-0" />
                <span className="max-w-[110px] truncate">{selectedMosque?.name ?? 'Select mosque'}</span>
                <ChevronDown className="w-3 h-3 text-emerald-200 flex-shrink-0" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 z-50 max-h-80 overflow-y-auto">
                    <p className="px-3 pb-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
                      Show prayer times for
                    </p>
                    {mosqueOptions.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setMosqueId(m.id); setMenuOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50 transition-colors"
                      >
                        <span className="flex flex-col">
                          <span>{m.name}</span>
                          {!m.hasData && <span className="text-[10px] text-stone-400">No live data yet</span>}
                        </span>
                        {mosqueId === m.id && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
