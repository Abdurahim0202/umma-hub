'use client';

import { ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';
import { useHomeMosque } from '@/lib/hooks/useHomeMosque';
import { DEFAULT_PRAYER_TIMES } from '@/lib/config';
import type { Mosque } from '@/lib/types';

const PRAYERS = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'sunrise', label: 'Sunrise' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
] as const;

const IQAMAH_PRAYERS = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
] as const;

export function PrayerTimesBrowser({ mosques }: { mosques: Mosque[] }) {
  const { mosqueId, setMosqueId, hydrated } = useHomeMosque();
  const [menuOpen, setMenuOpen] = useState(false);

  const selected = mosques.find(m => m.id === mosqueId) ?? mosques.find(m => m.id === 'darul-islah');
  const liveAdhan = selected?.prayerTimes;
  const adhanTimes = liveAdhan ?? DEFAULT_PRAYER_TIMES;

  return (
    <>
      {/* Home mosque selector */}
      <div className="relative mb-4 inline-block">
        <button
          onClick={() => setMenuOpen(o => !o)}
          disabled={!hydrated}
          className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-60"
        >
          🕌 {selected?.name ?? 'Choose your mosque'}
          <ChevronDown className="w-4 h-4 text-stone-400" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 z-50 max-h-80 overflow-y-auto">
              {mosques.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMosqueId(m.id); setMenuOpen(false); }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50 transition-colors"
                >
                  <span className="flex flex-col">
                    <span className={mosqueId === m.id ? 'font-semibold text-emerald-700' : ''}>{m.name}</span>
                    {!m.prayerTimes && <span className="text-[10px] text-stone-400">No live data yet</span>}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Adhan times card */}
      <div className="bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">{liveAdhan ? "Today's Prayer Times" : 'Calculated Prayer Times'}</h2>
            <p className="text-emerald-200 text-xs">
              {liveAdhan ? `Live from ${selected?.name} · ${selected?.city}, NJ` : 'ISNA method (estimated) · Teaneck, NJ'}
            </p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5 text-xs text-white flex items-center gap-1">
            <Info className="w-3 h-3" />
            Adhan times
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PRAYERS.map(({ key, label }) => (
            <div key={key} className="text-center bg-white/10 rounded-xl px-2 py-3">
              <p className="text-emerald-200 text-xs uppercase tracking-wide mb-1">{label}</p>
              <p className="font-bold text-sm">{adhanTimes[key]}</p>
            </div>
          ))}
        </div>

        {selected?.jummahTimes && selected.jummahTimes.khutbahs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-2">
            {selected.jummahTimes.khutbahs.map(k => (
              <span key={k.label} className="bg-white/10 rounded-full px-3 py-1 text-xs">
                Jumu&apos;ah {k.label}: <span className="font-semibold">{k.time}</span>
              </span>
            ))}
          </div>
        )}

        <p className="text-emerald-200 text-xs mt-4 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0" />
          {liveAdhan
            ? `These are adhan times as published by ${selected?.name} today. Iqamah (congregation) times vary by mosque — see below.`
            : 'These are estimated adhan times. Iqamah (congregation) times vary by mosque — see below.'}
        </p>
      </div>

      {/* Mosque iqamah comparison */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 mb-3">Mosque Iqamah Times</h2>
        <p className="text-sm text-stone-500 mb-4">
          Congregation (iqamah) start times as published by each mosque. Times may change — always confirm with the mosque directly.
        </p>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid text-xs font-semibold text-stone-500 uppercase tracking-wide bg-stone-50 border-b border-stone-100 px-4 py-2.5"
            style={{ gridTemplateColumns: '1fr repeat(5, auto)' }}>
            <span>Mosque</span>
            {IQAMAH_PRAYERS.map(p => (
              <span key={p.key} className="text-center w-14">{p.label}</span>
            ))}
          </div>

          {/* Rows */}
          {mosques.map(mosque => (
            <div
              key={mosque.id}
              className={`grid items-center px-4 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors ${mosque.id === mosqueId ? 'bg-emerald-50/50' : ''}`}
              style={{ gridTemplateColumns: '1fr repeat(5, auto)' }}
            >
              <div>
                <p className="font-medium text-stone-900 text-sm">{mosque.name}</p>
                <p className="text-xs text-stone-400">{mosque.address}</p>
                {/* Jumu'ah */}
                {mosque.jummahTimes && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {mosque.jummahTimes.khutbahs.map(k => (
                      <span key={k.label} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        Jumu&apos;ah {k.label}: {k.time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {IQAMAH_PRAYERS.map(p => (
                <div key={p.key} className="text-center w-14">
                  <p className="text-sm font-semibold text-emerald-700">
                    {mosque.iqamahTimes?.[p.key] ? mosque.iqamahTimes[p.key].replace(' AM', '').replace(' PM', '') : '—'}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
        <p>
          Prayer times are pulled live from each mosque&apos;s own published schedule where available. Mosques with no
          live source shown as &ldquo;—&rdquo; haven&apos;t published one online yet. Always verify with the mosque directly.
        </p>
      </div>
    </>
  );
}
