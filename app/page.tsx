import Link from 'next/link';
import { Search, ChevronRight, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { APP_CONFIG } from '@/lib/config';
import { ymdInTz } from '@/lib/utils';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { mosques } from '@/lib/data/mosques';
import { withLiveDarulIslahTimes } from '@/lib/prayer-sources/darul-islah';
import { forumPosts } from '@/lib/data/community';
import { EventCard } from '@/components/cards/EventCard';
import { MosqueCard } from '@/components/cards/MosqueCard';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CommunityPost } from '@/components/cards/CommunityPost';
import type { Event, Resource } from '@/lib/types';

export const revalidate = 3600;

function isRealDescription(desc: string): boolean {
  return desc.length > 60 && !desc.startsWith('Event at');
}

function resourceCategoryFor(cat: Event['category']): Resource['category'] {
  switch (cat) {
    case 'quran': return 'quran';
    case 'youth': return 'youth';
    case 'food': return 'food';
    case 'volunteer': return 'volunteer';
    case 'career': return 'career';
    case 'halaqa': return 'islamic_studies';
    default: return 'education';
  }
}

/** Recurring weekly classes/programs, detected directly from the real event
 *  feed (any title+mosque combo appearing 2+ times among upcoming events) —
 *  genuine ongoing community programs, not invented ones. */
function deriveRecurringPrograms(upcoming: Event[], limit: number): Resource[] {
  const groups = new Map<string, Event[]>();
  for (const e of upcoming) {
    const key = `${e.organizationId}::${e.title.trim().toLowerCase()}`;
    const list = groups.get(key);
    if (list) list.push(e);
    else groups.set(key, [e]);
  }
  return [...groups.values()]
    .filter(list => list.length >= 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, limit)
    .map(list => {
      const e = list[0];
      return {
        // Base64-encode the title rather than slugifying it — a slug regex
        // that only keeps [a-z0-9] silently collapses non-Latin titles
        // (Arabic, etc.) to an empty string, causing duplicate React keys.
        id: `program-${e.organizationId}-${Buffer.from(e.title, 'utf-8').toString('base64').slice(0, 20)}`,
        title: e.title,
        description: isRealDescription(e.description)
          ? e.description
          : `Recurring program at ${e.organizationName}.`,
        organizationId: e.organizationId,
        organizationName: e.organizationName,
        category: resourceCategoryFor(e.category),
        address: e.address,
        city: e.city,
        website: e.sourceUrl,
        schedule: `Recurring — ${list.length} upcoming sessions`,
        tags: e.tags,
      };
    });
}

export default async function HomePage() {
  const [{ events }, liveMosques] = await Promise.all([
    fetchAllMosqueEvents(),
    withLiveDarulIslahTimes(mosques),
  ]);
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);
  const todayLabel = format(new Date(), 'EEEE, MMMM d, yyyy');

  const upcoming = [...events]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const todayEvents = upcoming.filter(e => e.date === todayStr);
  const laterEvents = upcoming.filter(e => e.date > todayStr);
  const upcomingNearYou = laterEvents.slice(0, 6);

  // "From Our Mosques" spotlight — real posts with genuine, substantial
  // descriptions (e.g. an actual registration announcement), not the
  // generic placeholder text we fall back to when a feed has no description.
  // A spotlighted event may also appear in Today/Upcoming above — that's
  // fine, it's a different framing (promotional post vs. plain schedule).
  const spotlightEvents = upcoming.filter(e => isRealDescription(e.description)).slice(0, 3);

  const recurringPrograms = deriveRecurringPrograms(upcoming, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 fade-in-up">

      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <section className="rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
            <span>📍 {APP_CONFIG.cityFull}</span>
            <span>·</span>
            <span>{todayLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">
            Your Muslim community,<br className="hidden sm:block" /> all in one place.
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg mb-6 max-w-xl font-medium">
            Events, prayer times, mosque directory, resources, and community for {APP_CONFIG.cityFull}.
          </p>
          {/* Search bar */}
          <Link
            href="/search"
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg max-w-lg hover:shadow-xl transition-shadow"
          >
            <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
            <span className="flex-1 text-left text-stone-400 text-sm">
              Search events, mosques, classes, resources...
            </span>
          </Link>
        </div>
      </section>

      {/* ─── QUICK ACTIONS ───────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { href: '/mosques', emoji: '🕌', label: 'Mosques' },
            { href: '/calendar', emoji: '📅', label: 'Events' },
            { href: '/resources?category=education', emoji: '📚', label: 'Classes' },
            { href: '/resources?category=volunteer', emoji: '🤝', label: 'Volunteer' },
            { href: '/announcements', emoji: '📢', label: 'Announcements' },
            { href: '/community', emoji: '💬', label: 'Community' },
          ].map(action => (
            <Link key={action.href} href={action.href}>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-3 flex flex-col items-center gap-1.5 card-hover text-center">
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-xs font-medium text-stone-700">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── HAPPENING TODAY ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Happening Today</h2>
            <p className="text-sm text-stone-600">{todayLabel}</p>
          </div>
          <Link href="/calendar" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {todayEvents.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
            <p className="text-lg mb-1">No events scheduled today</p>
            <Link href="/calendar" className="text-sm text-emerald-600 hover:underline">Browse upcoming events →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
            {todayEvents.map(event => (
              <EventCard key={event.id} event={event} variant="compact" className="px-4" />
            ))}
          </div>
        )}
      </section>

      {/* ─── UPCOMING NEAR YOU ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Upcoming Near You</h2>
          <Link href="/calendar" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {upcomingNearYou.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
            <p className="text-lg mb-1">No upcoming events found</p>
            <p className="text-sm">Check back soon — mosque calendars update regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingNearYou.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ─── FROM YOUR MOSQUES ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Local Mosques</h2>
          <Link href="/mosques" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveMosques.map(mosque => (
            <MosqueCard key={mosque.id} mosque={mosque} />
          ))}
        </div>
      </section>

      {/* ─── FROM OUR MOSQUES (real posts) ───────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">From Our Mosques</h2>
            <p className="text-sm text-stone-600">Real posts pulled directly from mosque calendars</p>
          </div>
          <Link href="/calendar" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all events <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {spotlightEvents.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
            <p className="text-lg mb-1">Nothing to spotlight right now</p>
            <p className="text-sm">Check the calendar for everything currently scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spotlightEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ─── COMMUNITY RESOURCES (recurring real programs) ───── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Community Resources</h2>
            <p className="text-sm text-stone-600">Ongoing classes and programs, detected from recurring mosque events</p>
          </div>
          <Link href="/resources" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recurringPrograms.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
            <p className="text-lg mb-1">No recurring programs found yet</p>
            <p className="text-sm">These populate automatically once a mosque&apos;s feed shows a repeating class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurringPrograms.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* ─── COMMUNITY DISCUSSIONS ───────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Community Discussions</h2>
          <Link href="/community" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {forumPosts.slice(0, 4).map(post => (
            <CommunityPost key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Join the Discussion <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── CTA FOOTER ──────────────────────────────────────── */}
      <section className="bg-stone-900 rounded-3xl p-8 text-center text-white">
        <p className="text-2xl font-bold mb-2">One community. One platform.</p>
        <p className="text-stone-300 mb-6 max-w-md mx-auto">
          Stop scrolling through WhatsApp groups and Instagram pages. Everything for the {APP_CONFIG.cityFull} Muslim community is right here.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/calendar" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-500 transition-colors">
            Browse Events
          </Link>
          <Link href="/mosques" className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-600 transition-colors border border-emerald-500">
            Find Mosques
          </Link>
        </div>
      </section>

    </div>
  );
}
