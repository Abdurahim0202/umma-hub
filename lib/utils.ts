import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ────────────────────────────────────────────────────────────
// Date & Time Utilities
// ────────────────────────────────────────────────────────────

export function formatEventDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE, MMMM d');
}

export function formatEventTime(isoStr: string): string {
  return format(parseISO(isoStr), 'h:mm a');
}

export function formatRelativeTime(isoStr: string): string {
  return formatDistanceToNow(parseISO(isoStr), { addSuffix: true });
}

export function formatFullDate(isoStr: string): string {
  return format(parseISO(isoStr), 'EEEE, MMMM d, yyyy');
}

// ────────────────────────────────────────────────────────────
// Category Labels & Colors
// ────────────────────────────────────────────────────────────

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  lecture: 'Lecture',
  halaqa: 'Halaqa',
  quran: 'Quran',
  education: 'Education',
  youth: 'Youth',
  sisters: 'Sisters',
  brothers: 'Brothers',
  family: 'Family',
  social: 'Social',
  sports: 'Sports',
  volunteer: 'Volunteer',
  fundraiser: 'Fundraiser',
  conference: 'Conference',
  food: 'Food',
  career: 'Career',
  jummah: "Jumu'ah",
  other: 'Other',
};

export const EVENT_CATEGORY_COLORS: Record<string, string> = {
  lecture: 'bg-blue-100 text-blue-800',
  halaqa: 'bg-emerald-100 text-emerald-800',
  quran: 'bg-teal-100 text-teal-800',
  education: 'bg-indigo-100 text-indigo-800',
  youth: 'bg-orange-100 text-orange-800',
  sisters: 'bg-pink-100 text-pink-800',
  brothers: 'bg-cyan-100 text-cyan-800',
  family: 'bg-purple-100 text-purple-800',
  social: 'bg-yellow-100 text-yellow-800',
  sports: 'bg-lime-100 text-lime-800',
  volunteer: 'bg-rose-100 text-rose-800',
  fundraiser: 'bg-amber-100 text-amber-800',
  conference: 'bg-violet-100 text-violet-800',
  food: 'bg-red-100 text-red-800',
  career: 'bg-sky-100 text-sky-800',
  jummah: 'bg-emerald-100 text-emerald-900',
  other: 'bg-gray-100 text-gray-700',
};

export const AUDIENCE_LABELS: Record<string, string> = {
  everyone: 'Everyone',
  brothers: 'Brothers',
  sisters: 'Sisters',
  families: 'Families',
  youth: 'Youth',
  children: 'Children',
  adults: 'Adults',
};

export const ANNOUNCEMENT_CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-100 text-gray-700',
  janazah: 'bg-slate-100 text-slate-800',
  urgent: 'bg-red-100 text-red-800',
  community: 'bg-blue-100 text-blue-800',
  fundraiser: 'bg-amber-100 text-amber-800',
  volunteer: 'bg-rose-100 text-rose-800',
  education: 'bg-indigo-100 text-indigo-800',
  ramadan: 'bg-emerald-100 text-emerald-800',
  eid: 'bg-teal-100 text-teal-800',
};

export const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  quran: 'Quran',
  sunday_school: 'Sunday School',
  arabic: 'Arabic',
  islamic_studies: 'Islamic Studies',
  youth: 'Youth',
  scholarship: 'Scholarship',
  financial: 'Financial Aid',
  food: 'Food Assistance',
  mental_health: 'Mental Health',
  marriage: 'Marriage',
  new_muslim: 'New Muslim',
  funeral: 'Funeral Services',
  career: 'Career',
  legal: 'Legal',
  volunteer: 'Volunteer',
  housing: 'Housing',
  business: 'Business',
};

export const FORUM_CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  questions: 'Questions',
  events: 'Events',
  recommendations: 'Recommendations',
  jobs: 'Jobs',
  housing: 'Housing',
  education: 'Education',
  marriage_family: 'Marriage & Family',
  students: 'Students',
  youth: 'Youth',
  businesses: 'Businesses',
  volunteering: 'Volunteering',
  announcements: 'Announcements',
  buy_sell: 'Buy/Sell',
  lost_found: 'Lost & Found',
};

// ────────────────────────────────────────────────────────────
// Prayer Utilities
// ────────────────────────────────────────────────────────────

export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = typeof PRAYER_NAMES[number];

// Parse "5:41 AM" to minutes since midnight for comparison
export function parseTimeToMinutes(timeStr: string): number {
  const [timePart, period] = timeStr.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  let h = hours;
  if (period === 'PM' && hours !== 12) h += 12;
  if (period === 'AM' && hours === 12) h = 0;
  return h * 60 + minutes;
}

export function getNextPrayer(prayerTimes: Record<string, string>): {
  name: string;
  time: string;
  minutesUntil: number;
} | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const prayerMinutes = parseTimeToMinutes(prayer.time);
    if (prayerMinutes > nowMinutes) {
      return {
        name: prayer.name,
        time: prayer.time,
        minutesUntil: prayerMinutes - nowMinutes,
      };
    }
  }

  // After Isha — next is Fajr (tomorrow)
  const fajrMinutes = parseTimeToMinutes(prayerTimes.fajr);
  return {
    name: 'Fajr',
    time: prayerTimes.fajr,
    minutesUntil: (24 * 60 - nowMinutes) + fajrMinutes,
  };
}

export function formatMinutesUntil(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
