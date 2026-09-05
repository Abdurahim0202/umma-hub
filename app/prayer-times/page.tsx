import { Clock, MapPin, Info } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { DEFAULT_PRAYER_TIMES } from '@/lib/config';
import { fetchDarulIslahPrayerTimes, toPrayerTime, withLiveDarulIslahTimes } from '@/lib/prayer-sources/darul-islah';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Prayer Times',
  description: 'Today\'s prayer times and iqamah schedules for mosques in Teaneck, NJ.',
};

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

export default async function PrayerTimesPage() {
  const [prayerResult, mosquesWithLiveTimes] = await Promise.all([
    fetchDarulIslahPrayerTimes(),
    withLiveDarulIslahTimes(mosques),
  ]);
  const liveAdhan = prayerResult.status === 'ok' && prayerResult.today
    ? toPrayerTime(prayerResult.today)
    : null;
  const adhanTimes = liveAdhan ?? DEFAULT_PRAYER_TIMES;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <Clock className="w-6 h-6 text-emerald-600" />
          Prayer Times
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-stone-500">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Teaneck, NJ · Today
        </div>
      </div>

      {/* Adhan times card */}
      <div className="bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">{liveAdhan ? 'Today’s Prayer Times' : 'Calculated Prayer Times'}</h2>
            <p className="text-emerald-200 text-xs">
              {liveAdhan ? 'Live from Darul Islah · Teaneck, NJ' : 'ISNA method (estimated) · Teaneck, NJ'}
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

        <p className="text-emerald-200 text-xs mt-4 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0" />
          {liveAdhan
            ? 'These are adhan times as published by Darul Islah today. Iqamah (congregation) times vary by mosque — see below.'
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
          {mosquesWithLiveTimes.map(mosque => (
            <div
              key={mosque.id}
              className="grid items-center px-4 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
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
          {liveAdhan
            ? 'Adhan and iqamah times for Darul Islah are pulled live from darulislah.org/salah. Other mosques don’t publish a live schedule yet, so their iqamah times aren’t shown.'
            : 'Live prayer times were unavailable, so estimated adhan times are shown instead.'}
          {' '}Always verify with the mosque directly.
        </p>
      </div>
    </div>
  );
}
