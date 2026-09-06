import { Search as SearchIcon } from 'lucide-react';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { mosques } from '@/lib/data/mosques';
import { resources } from '@/lib/data/resources';
import { ymdInTz } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';
import { SearchBrowser } from '@/components/search/SearchBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search events, mosques, resources, and community posts in Teaneck, NJ.',
};

export const revalidate = 3600;

export default async function SearchPage() {
  const { events } = await fetchAllMosqueEvents();
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);
  const upcoming = events.filter(e => e.date >= todayStr);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
        <SearchIcon className="w-6 h-6 text-emerald-600" />
        Search
      </h1>

      <SearchBrowser events={upcoming} mosques={mosques} resources={resources} />
    </div>
  );
}
