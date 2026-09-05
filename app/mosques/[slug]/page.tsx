import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Clock, CheckCircle, Calendar, ExternalLink, Navigation, Star, Home } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { fetchAllMosqueEvents } from '@/lib/event-sources';
import { withLiveDarulIslahTimes } from '@/lib/prayer-sources/darul-islah';
import { ymdInTz } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/config';
import { EventCard } from '@/components/cards/EventCard';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mosques.map(m => ({ slug: m.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const mosque = mosques.find(m => m.slug === params.slug);
  if (!mosque) return { title: 'Mosque Not Found' };
  return {
    title: mosque.name,
    description: mosque.description,
  };
}

const PRAYER_ROWS = [
  { label: 'Fajr',    key: 'fajr'    as const },
  { label: 'Sunrise', key: 'sunrise' as const },
  { label: 'Dhuhr',   key: 'dhuhr'   as const },
  { label: 'Asr',     key: 'asr'     as const },
  { label: 'Maghrib', key: 'maghrib' as const },
  { label: 'Isha',    key: 'isha'    as const },
];

export default async function MosqueDetailPage(props: Props) {
  const params = await props.params;
  const liveMosques = await withLiveDarulIslahTimes(mosques);
  const mosque = liveMosques.find(m => m.slug === params.slug);
  if (!mosque) notFound();

  const { events } = await fetchAllMosqueEvents();
  const todayStr = ymdInTz(new Date(), APP_CONFIG.timezone);
  const mosqueEvents = events
    .filter(e => e.organizationId === mosque.id && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 4);

  const directionsUrl =
    mosque.directionsUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Cover */}
      <div className="h-48 sm:h-64 rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center mb-6 relative overflow-hidden">
        <span className="text-7xl">🕌</span>

        {mosque.isHomeMosque && (
          <div className="absolute top-4 left-4 bg-amber-400 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <Home className="w-3.5 h-3.5 text-amber-900" />
            <span className="text-xs font-bold text-amber-900">Home Mosque</span>
          </div>
        )}

        {mosque.verified && (
          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Verified</span>
          </div>
        )}

        {mosque.rating !== undefined && (
          <div className="absolute bottom-4 right-4 bg-black/50 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold">{mosque.rating.toFixed(1)}</span>
            {mosque.reviewCount !== undefined && (
              <span className="text-white/70 text-sm">({mosque.reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}

        {mosque.distanceLabel && !mosque.isHomeMosque && (
          <div className="absolute bottom-4 left-4 bg-black/50 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span className="text-white text-sm font-medium">{mosque.distanceLabel} from Darul Islah</span>
          </div>
        )}
      </div>

      {/* Name & Info */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">{mosque.name}</h1>
        <p className="text-stone-500 mb-4">{mosque.description}</p>

        <div className="flex items-center gap-1.5 text-sm text-stone-600 mb-4">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {mosque.address}, {mosque.city}, {mosque.state} {mosque.zip}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
          {mosque.phone && (
            <a
              href={`tel:${mosque.phone}`}
              className="flex items-center gap-2 bg-stone-100 text-stone-700 px-5 py-2.5 rounded-xl font-medium hover:bg-stone-200 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              {mosque.phone}
            </a>
          )}
          {mosque.website && (
            <a
              href={mosque.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-stone-100 text-stone-700 px-5 py-2.5 rounded-xl font-medium hover:bg-stone-200 transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {mosque.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
            {tag.replace('_', ' ')}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Prayer Times sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Prayer / Iqamah */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-4 py-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prayer Times
              </h2>
              <p className="text-emerald-100 text-xs mt-0.5">Today&apos;s schedule</p>
            </div>

            {mosque.prayerTimes ? (
              <div className="divide-y divide-stone-100">
                {PRAYER_ROWS.map(({ label, key }) => {
                  const pt = mosque.prayerTimes!;
                  const adhan = pt[key];
                  const iqamah =
                    key !== 'sunrise' && mosque.iqamahTimes
                      ? mosque.iqamahTimes[key as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha']
                      : null;
                  return (
                    <div key={label} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700 w-20">{label}</span>
                      <div className="text-right">
                        <p className="text-xs text-stone-400">
                          Adhan: <span className="text-stone-700 font-medium">{adhan}</span>
                        </p>
                        {iqamah && key !== 'sunrise' && (
                          <p className="text-xs text-emerald-700 font-medium">Iqamah: {iqamah}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-500 font-medium">Prayer times not available yet</p>
                {mosque.website && (
                  <a
                    href={mosque.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline mt-1 block"
                  >
                    Check mosque website →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Jumu'ah Times */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-amber-500 to-amber-600 px-4 py-3">
              <h2 className="text-white font-semibold">Jumu&apos;ah</h2>
            </div>
            {mosque.jummahTimes ? (
              <div className="divide-y divide-stone-100">
                {mosque.jummahTimes.khutbahs.map(k => (
                  <div key={k.label} className="px-4 py-3">
                    <p className="text-sm font-semibold text-stone-800">{k.label}</p>
                    <p className="text-lg font-bold text-emerald-600">{k.time}</p>
                    {k.language && <p className="text-xs text-stone-400">{k.language}</p>}
                    {k.imam && <p className="text-xs text-stone-400">Imam: {k.imam}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5 text-center">
                <p className="text-sm text-stone-500">Jumu&apos;ah times not available yet</p>
                {mosque.website && (
                  <a
                    href={mosque.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline mt-1 block"
                  >
                    Check mosque website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Events from this mosque */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Upcoming Events
            </h2>
          </div>

          {mosqueEvents.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-400">
              <p>No upcoming events from this mosque.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mosqueEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map / Directions placeholder */}
      <div className="mt-8 bg-stone-100 rounded-2xl h-48 flex items-center justify-center text-stone-400 border border-stone-200">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Map coming soon</p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 hover:underline mt-1 block"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>

    </div>
  );
}
