import type { Event } from '@/lib/types';

// ============================================================
// MOCK EVENTS — Teaneck, NJ
// Replace with real event data as you receive it
// ============================================================

const TODAY = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const events: Event[] = [
  // ─── TODAY ───────────────────────────────────────────────
  {
    id: 'evt-1',
    title: "Jumu'ah Prayer",
    description: "Weekly Friday prayer and khutbah. All are welcome. Sisters section available.",
    organizationId: 'mosque-1',
    organizationName: 'Masjid Al-Wadud',
    address: '2020 Maple Ave, Teaneck, NJ',
    city: 'Teaneck',
    latitude: 40.8918,
    longitude: -74.0121,
    startTime: fmt(TODAY) + 'T13:00:00',
    endTime: fmt(TODAY) + 'T14:00:00',
    date: fmt(TODAY),
    category: 'jummah',
    audience: 'everyone',
    isFeatured: true,
    tags: ['jummah', 'prayer', 'weekly'],
    sourceType: 'manual',
  },
  {
    id: 'evt-2',
    title: 'Quran Halaqa for Adults',
    description: 'Weekly Quran study circle covering tajweed, tafsir, and memorization tips. Open to brothers and sisters.',
    organizationId: 'mosque-1',
    organizationName: 'Masjid Al-Wadud',
    address: '2020 Maple Ave, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(TODAY) + 'T19:00:00',
    endTime: fmt(TODAY) + 'T20:30:00',
    date: fmt(TODAY),
    category: 'quran',
    audience: 'adults',
    tags: ['quran', 'halaqa', 'tajweed', 'weekly'],
    sourceType: 'manual',
  },
  {
    id: 'evt-3',
    title: 'Youth Basketball Night',
    description: "Open gym for Muslim youth ages 13–21. Come for fun, fitness, and brotherhood/sisterhood. Hosted by Teaneck MYA.",
    organizationId: 'org-1',
    organizationName: 'Teaneck Muslim Youth Association',
    address: 'Votee Park Recreation Center, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(TODAY) + 'T17:30:00',
    endTime: fmt(TODAY) + 'T20:00:00',
    date: fmt(TODAY),
    category: 'sports',
    audience: 'youth',
    tags: ['basketball', 'sports', 'youth', 'weekly'],
    sourceType: 'manual',
  },
  // ─── UPCOMING ────────────────────────────────────────────
  {
    id: 'evt-4',
    title: 'Community Iftar Dinner',
    description: 'Join us for a community iftar. Families welcome. Bring a dish to share! RSVP appreciated but not required.',
    organizationId: 'mosque-2',
    organizationName: 'Islamic Center of Teaneck',
    address: '100 Cedar Lane, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 2)) + 'T18:30:00',
    endTime: fmt(addDays(TODAY, 2)) + 'T21:00:00',
    date: fmt(addDays(TODAY, 2)),
    category: 'food',
    audience: 'families',
    image: '/images/placeholder-event.jpg',
    isFeatured: true,
    tags: ['iftar', 'community', 'dinner', 'family'],
    sourceType: 'manual',
  },
  {
    id: 'evt-5',
    title: 'Islamic Finance & Investing Workshop',
    description: 'Learn about halal investment options, avoiding riba, and building wealth Islamically. Speaker: Local financial planner.',
    organizationId: 'mosque-3',
    organizationName: 'Masjid Al-Noor',
    address: '340 Queen Anne Road, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 3)) + 'T19:30:00',
    endTime: fmt(addDays(TODAY, 3)) + 'T21:30:00',
    date: fmt(addDays(TODAY, 3)),
    category: 'education',
    audience: 'adults',
    tags: ['finance', 'halal', 'investing', 'workshop'],
    sourceType: 'manual',
  },
  {
    id: 'evt-6',
    title: "Sisters' Halaqa — Names of Allah",
    description: "Weekly sisters' circle exploring the 99 Names of Allah. All sisters welcome. Light refreshments provided.",
    organizationId: 'mosque-1',
    organizationName: 'Masjid Al-Wadud',
    address: '2020 Maple Ave, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 4)) + 'T11:00:00',
    endTime: fmt(addDays(TODAY, 4)) + 'T12:30:00',
    date: fmt(addDays(TODAY, 4)),
    category: 'halaqa',
    audience: 'sisters',
    tags: ['sisters', 'halaqa', 'aqeedah', 'weekly'],
    sourceType: 'manual',
  },
  {
    id: 'evt-7',
    title: 'Youth Career Day — Muslim Professionals Panel',
    description: 'High school and college students hear from Muslim professionals in medicine, law, tech, and business. Q&A session included.',
    organizationId: 'org-2',
    organizationName: 'Bergen County Islamic Society',
    address: 'Teaneck Community Center, 100 Elizabeth Ave, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 5)) + 'T14:00:00',
    endTime: fmt(addDays(TODAY, 5)) + 'T17:00:00',
    date: fmt(addDays(TODAY, 5)),
    category: 'career',
    audience: 'youth',
    tags: ['career', 'youth', 'networking', 'professionals'],
    sourceType: 'manual',
  },
  {
    id: 'evt-8',
    title: 'Sunday Islamic School Registration',
    description: 'Registration open for the Fall semester of Sunday School for children ages 5–16. Limited seats available.',
    organizationId: 'mosque-2',
    organizationName: 'Islamic Center of Teaneck',
    address: '100 Cedar Lane, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 6)) + 'T09:00:00',
    endTime: fmt(addDays(TODAY, 6)) + 'T12:00:00',
    date: fmt(addDays(TODAY, 6)),
    category: 'education',
    audience: 'children',
    isFeatured: true,
    tags: ['school', 'children', 'education', 'registration'],
    sourceType: 'manual',
  },
  {
    id: 'evt-9',
    title: 'Eid Dinner Fundraiser',
    description: "Annual Eid celebration dinner and fundraiser benefiting the masjid expansion project. Three-course dinner, auction, and entertainment.",
    organizationId: 'mosque-3',
    organizationName: 'Masjid Al-Noor',
    address: 'Marriott at Glenpointe, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 10)) + 'T18:00:00',
    endTime: fmt(addDays(TODAY, 10)) + 'T22:00:00',
    date: fmt(addDays(TODAY, 10)),
    category: 'fundraiser',
    audience: 'everyone',
    isFeatured: true,
    registrationUrl: 'https://example.com/tickets',
    tags: ['eid', 'fundraiser', 'dinner', 'masjid'],
    sourceType: 'manual',
  },
  {
    id: 'evt-10',
    title: 'New Muslim Support Circle',
    description: 'A welcoming monthly gathering for new Muslims and those exploring Islam. Mentors available. Completely judgment-free.',
    organizationId: 'mosque-1',
    organizationName: 'Masjid Al-Wadud',
    address: '2020 Maple Ave, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 7)) + 'T13:00:00',
    endTime: fmt(addDays(TODAY, 7)) + 'T15:00:00',
    date: fmt(addDays(TODAY, 7)),
    category: 'social',
    audience: 'everyone',
    tags: ['new-muslim', 'support', 'welcome', 'monthly'],
    sourceType: 'manual',
  },
  {
    id: 'evt-11',
    title: 'Food Bank Volunteer Day',
    description: 'Help sort and distribute food at the Bergen County food bank. Sign up below. Open to all ages 10+.',
    organizationId: 'org-2',
    organizationName: 'Bergen County Islamic Society',
    address: 'Bergen County Community Food Bank, Hackensack, NJ',
    city: 'Hackensack',
    startTime: fmt(addDays(TODAY, 8)) + 'T09:00:00',
    endTime: fmt(addDays(TODAY, 8)) + 'T13:00:00',
    date: fmt(addDays(TODAY, 8)),
    category: 'volunteer',
    audience: 'everyone',
    registrationUrl: 'https://example.com/volunteer',
    tags: ['volunteer', 'food-bank', 'service', 'community'],
    sourceType: 'manual',
  },
  {
    id: 'evt-12',
    title: 'Arabic Language Course — Beginner',
    description: '8-week beginner Arabic course covering reading, writing, and basic conversation. Class meets every Saturday.',
    organizationId: 'mosque-2',
    organizationName: 'Islamic Center of Teaneck',
    address: '100 Cedar Lane, Teaneck, NJ',
    city: 'Teaneck',
    startTime: fmt(addDays(TODAY, 9)) + 'T10:00:00',
    endTime: fmt(addDays(TODAY, 9)) + 'T11:30:00',
    date: fmt(addDays(TODAY, 9)),
    category: 'education',
    audience: 'adults',
    registrationUrl: 'https://example.com/arabic',
    tags: ['arabic', 'language', 'beginner', 'course'],
    sourceType: 'manual',
  },
];

// Helper functions
export function getTodayEvents(): Event[] {
  const todayStr = fmt(TODAY);
  return events.filter(e => e.date === todayStr);
}

export function getUpcomingEvents(days = 14): Event[] {
  const todayStr = fmt(TODAY);
  const endStr = fmt(addDays(TODAY, days));
  return events.filter(e => e.date > todayStr && e.date <= endStr);
}

export function getFeaturedEvents(): Event[] {
  return events.filter(e => e.isFeatured);
}

export function getEventsByCategory(category: string): Event[] {
  return events.filter(e => e.category === category);
}

export function getEventsByOrg(orgId: string): Event[] {
  return events.filter(e => e.organizationId === orgId);
}
