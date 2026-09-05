'use client';

import { DEFAULT_PRAYER_TIMES } from '@/lib/config';
import { getNextPrayer, formatMinutesUntil } from '@/lib/utils';
import { Clock } from 'lucide-react';

const PRAYER_DISPLAY = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
] as const;

export function PrayerBar() {
  const next = getNextPrayer(DEFAULT_PRAYER_TIMES);

  return (
    <div className="prayer-bar-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[52px] overflow-x-auto gap-4">
          {/* Prayer times */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
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
                    {DEFAULT_PRAYER_TIMES[key as keyof typeof DEFAULT_PRAYER_TIMES]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Next prayer countdown */}
          {next && (
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 flex-shrink-0 text-xs">
              <Clock className="w-3 h-3 text-yellow-300" />
              <span className="text-emerald-100">
                {next.name} in{' '}
                <span className="font-semibold text-yellow-300">
                  {formatMinutesUntil(next.minutesUntil)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
