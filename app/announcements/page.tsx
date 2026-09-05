import { Megaphone } from 'lucide-react';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { staticAnnouncements } from '@/lib/data/announcements';
import { AnnouncementBrowser } from '@/components/announcements/AnnouncementBrowser';
import { ymdInTz } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';
import type { Announcement, Event } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcements',
  description: 'Real announcements from local mosques in and around Teaneck, NJ.',
};

export const revalidate = 3600;

function isRealDescription(desc: string): boolean {
  return desc.length > 60 && !desc.startsWith('Event at');
}

/** Real posts pulled straight from mosque event feeds that read like an
 *  announcement (a registration-open notice, a recruiting post, etc.)
 *  rather than a plain calendar entry. Nothing here is invented — it's
 *  the mosque's own description text, and it ages out automatically once
 *  the event is no longer upcoming. */
function deriveEventAnnouncements(events: Event[]): Announcement[] {
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);
  return events
    .filter(e => e.date >= todayStr && isRealDescription(e.description))
    .slice(0, 8)
    .map(e => ({
      id: `event-${e.id}`,
      organizationId: e.organizationId,
      organizationName: e.organizationName,
      category: 'community' as const,
      title: e.title,
      body: e.description,
      isUrgent: false,
      sourceUrl: e.sourceUrl,
    }));
}

export default async function AnnouncementsPage() {
  const { events } = await fetchAllMosqueEvents();
  const announcements = [...deriveEventAnnouncements(events), ...staticAnnouncements];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <Megaphone className="w-6 h-6 text-emerald-600" />
          Announcements
        </h1>
        <p className="text-stone-500 text-sm">
          Real posts and campaigns from local mosques — pulled from their own calendars and sites.
        </p>
      </div>

      <AnnouncementBrowser announcements={announcements} />
    </div>
  );
}
