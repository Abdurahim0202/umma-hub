import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, CheckCircle } from 'lucide-react';
import type { Mosque } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
  variant?: 'default' | 'compact';
  distanceMiles?: number;
  className?: string;
}

export function MosqueCard({ mosque, variant = 'default', distanceMiles, className }: MosqueCardProps) {
  const nextIqamah = mosque.iqamahTimes;

  if (variant === 'compact') {
    return (
      <Link href={`/mosques/${mosque.slug}`}>
        <div className={cn('flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors', className)}>
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-lg">
            🕌
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-medium text-stone-900 text-sm line-clamp-1">{mosque.name}</p>
              {mosque.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{mosque.shortDescription}</p>
          </div>
          {distanceMiles !== undefined && (
            <span className="text-xs text-stone-400 flex-shrink-0">{distanceMiles.toFixed(1)} mi</span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/mosques/${mosque.slug}`}>
      <div className={cn('bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden card-hover', className)}>
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-emerald-600 to-teal-700 relative flex items-center justify-center">
          <span className="text-5xl">🕌</span>
          {mosque.verified && (
            <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Verified</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-stone-900 text-base mb-0.5">{mosque.name}</h3>
          <p className="text-stone-500 text-xs line-clamp-2 mb-3">{mosque.shortDescription}</p>

          {/* Meta */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="line-clamp-1">{mosque.address}</span>
              {distanceMiles !== undefined && (
                <span className="ml-auto text-stone-400 flex-shrink-0">{distanceMiles.toFixed(1)} mi</span>
              )}
            </div>
            {mosque.phone && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{mosque.phone}</span>
              </div>
            )}
            {mosque.website && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Globe className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{mosque.website.replace('https://', '')}</span>
              </div>
            )}
          </div>

          {/* Today's Iqamah preview */}
          {nextIqamah && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <p className="text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                Today's Iqamah
              </p>
              <div className="grid grid-cols-5 gap-1 text-center">
                {[
                  { label: 'Fajr', time: nextIqamah.fajr },
                  { label: 'Dhuhr', time: nextIqamah.dhuhr },
                  { label: 'Asr', time: nextIqamah.asr },
                  { label: 'Maghrib', time: nextIqamah.maghrib },
                  { label: 'Isha', time: nextIqamah.isha },
                ].map(p => (
                  <div key={p.label}>
                    <p className="text-[9px] text-stone-400 uppercase">{p.label}</p>
                    <p className="text-[11px] font-semibold text-stone-700">{p.time.replace(' AM', '').replace(' PM', '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {mosque.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {mosque.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full capitalize">
                  {tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
