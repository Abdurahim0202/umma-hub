import { Clock, MapPin } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { withLivePrayerTimes } from '@/lib/prayer-sources/all-mosques';
import { PrayerTimesBrowser } from '@/components/prayer-times/PrayerTimesBrowser';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Prayer Times',
  description: 'Today\'s prayer times and iqamah schedules for mosques in Teaneck, NJ.',
};

export default async function PrayerTimesPage() {
  const mosquesWithLiveTimes = await withLivePrayerTimes(mosques);

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

      <PrayerTimesBrowser mosques={mosquesWithLiveTimes} />
    </div>
  );
}
