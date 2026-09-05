import { AlertTriangle, Clock, MapPin, Heart } from 'lucide-react';
import type { Announcement } from '@/lib/types';
import { cn, formatRelativeTime, ANNOUNCEMENT_CATEGORY_COLORS } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  janazah: 'Janazah',
  urgent: 'Urgent',
  community: 'Community',
  fundraiser: 'Fundraiser',
  volunteer: 'Volunteer',
  education: 'Education',
  ramadan: 'Ramadan',
  eid: 'Eid',
};

export function AnnouncementCard({ announcement, className }: AnnouncementCardProps) {
  const categoryColor = ANNOUNCEMENT_CATEGORY_COLORS[announcement.category] ?? 'bg-gray-100 text-gray-700';
  const isJanazah = announcement.category === 'janazah';

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border overflow-hidden',
        isJanazah
          ? 'border-slate-200 bg-slate-50'
          : announcement.isUrgent
          ? 'border-red-200'
          : 'border-stone-100',
        className
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-700">{announcement.organizationName}</span>
            {announcement.isUrgent && !isJanazah && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <span className={cn('category-pill flex-shrink-0', categoryColor)}>
            {CATEGORY_LABELS[announcement.category] ?? announcement.category}
          </span>
        </div>

        {/* Janazah header */}
        {isJanazah && (
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600 italic">Inna lillahi wa inna ilayhi raji&apos;un</span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1">{announcement.title}</h3>

        {/* Body */}
        <p className="text-stone-500 text-sm line-clamp-3">{announcement.body}</p>

        {/* Janazah details */}
        {isJanazah && announcement.janazah && (
          <div className="mt-3 bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span><strong>Prayer:</strong> {announcement.janazah.prayerLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span><strong>Time:</strong> {announcement.janazah.prayerTime}</span>
            </div>
            {announcement.janazah.burialLocation && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span><strong>Burial:</strong> {announcement.janazah.burialLocation}</span>
              </div>
            )}
            {announcement.janazah.instructions && (
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                {announcement.janazah.instructions}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
          {announcement.postedAt ? (
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatRelativeTime(announcement.postedAt)}
            </span>
          ) : (
            <span />
          )}
          {announcement.sourceUrl && (
            <a
              href={announcement.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Source: {announcement.organizationName}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
