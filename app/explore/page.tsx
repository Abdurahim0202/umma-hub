import { Map } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { resources } from '@/lib/data/resources';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { ExploreBrowser } from '@/components/explore/ExploreBrowser';
import { ymdInTz } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore mosques, events, and resources near you in Teaneck, NJ.',
};

export const revalidate = 3600;

export default async function ExplorePage() {
  const { events } = await fetchAllMosqueEvents();
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);
  const upcoming = events
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <Map className="w-6 h-6 text-emerald-600" />
          Explore
        </h1>
        <p className="text-stone-500 text-sm">Discover what&apos;s around you in Teaneck, NJ</p>
      </div>

      <ExploreBrowser mosques={mosques} events={upcoming} resources={resources} />
    </div>
  );
}
