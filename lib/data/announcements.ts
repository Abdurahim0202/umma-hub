import type { Announcement } from '@/lib/types';

// ============================================================
// REAL, STATIC ANNOUNCEMENTS
// Ongoing campaigns/notices published directly on a mosque's own
// site that aren't tied to a specific calendar event, so they can't
// be picked up from the event feeds. No `postedAt` — we don't know
// when these were actually published, so we don't guess.
//
// Most mosque sites don't run anything resembling a dedicated
// "announcements" or "news" page (checked all 9); this list stays
// small and only grows when a mosque actually publishes something
// like this. Time-sensitive, event-shaped announcements (e.g. a
// registration-open post) are derived live from the real event feed
// instead — see deriveEventAnnouncements() in the announcements page.
// ============================================================

export const staticAnnouncements: Announcement[] = [
  {
    id: 'aisha-expansion',
    organizationId: 'masjid-al-aisha',
    organizationName: 'Al Aisha Mosque',
    category: 'fundraiser',
    title: 'Masjid Al Aisha Expansion Project',
    body: 'Al Aisha Mosque is raising funds for an expansion with a spacious prayer area and enhanced facilities to serve its growing community. Donations are ongoing.',
    isUrgent: false,
    sourceUrl: 'https://masjidalaisha.org/expansion-project/',
  },
];
