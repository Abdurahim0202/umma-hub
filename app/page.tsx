import Link from 'next/link';
import { Search, Mosque, Calendar, BookOpen, Megaphone, MessageCircle, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { APP_CONFIG } from '@/lib/config';
import { events, getTodayEvents, getFeaturedEvents } from '@/lib/data/events';
import { mosques } from '@/lib/data/mosques';
import { announcements, resources, forumPosts } from '@/lib/data/community';
import { EventCard } from '@/components/cards/EventCard';
import { MosqueCard } from '@/components/cards/MosqueCard';
import { AnnouncementCard } from '@/components/cards/AnnouncementCard';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CommunityPost } from '@/components/cards/CommunityPost';

export default function HomePage() {
  const todayEvents = getTodayEvents();
  const upcomingEvents = events.slice(3, 9);
  const featuredEvents = getFeaturedEvents().slice(0, 3);
  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 fade-in-up">

      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <section className="pattern-bg rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
            <span>📍 {APP_CONFIG.cityFull}</span>
            <span>·</span>
            <span>{todayStr}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">
            Your Muslim community,<br className="hidden sm:block" /> all in one place.
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg mb-6 max-w-xl font-medium">
            Events, prayer times, mosque directory, resources, and community for {APP_CONFIG.cityFull}.
          </p>
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg max-w-lg">
            <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search events, mosques, classes, resources..."
              className="flex-1 bg-transparent text-stone-700 placeholder-stone-400 text-sm outline-none"
              readOnly
            />
          </div>
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
            <p className="text-sm text-stone-600">{todayStr}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
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
        {mosques.map(mosque => (
            <MosqueCard key={mosque.id} mosque={mosque} />
          ))}
        </div>
      </section>

      {/* ─── COMMUNITY ANNOUNCEMENTS ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Community Announcements</h2>
          <Link href="/announcements" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {announcements.slice(0, 4).map(ann => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </section>

      {/* ─── COMMUNITY RESOURCES ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Community Resources</h2>
          <Link href="/resources" className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-800">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.filter(r => r.isFeatured).slice(0, 3).map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
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
