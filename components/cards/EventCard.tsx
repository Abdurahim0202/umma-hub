import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import type { Event } from '@/lib/types';
import {
  cn,
  formatEventDate,
  formatEventTime,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
  AUDIENCE_LABELS,
} from '@/lib/utils';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const categoryLabel = EVENT_CATEGORY_LABELS[event.category] ?? event.category;
  const categoryColor = EVENT_CATEGORY_COLORS[event.category] ?? 'bg-gray-100 text-gray-700';
  const audienceLabel = AUDIENCE_LABELS[event.audience] ?? event.audience;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-start gap-3 py-3', className)}>
        {/* Time column */}
        <div className="text-right flex-shrink-0 w-20">
          <p className="text-xs text-stone-500">{formatEventDate(event.date)}</p>
          <p className="text-sm font-semibold text-stone-800">{formatEventTime(event.startTime)}</p>
        </div>
        {/* Divider */}
        <div className="w-px bg-emerald-200 self-stretch flex-shrink-0" />
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-900 text-sm line-clamp-1">{event.title}</p>
          <p className="text-xs text-stone-500 mt-0.5">{event.organizationName}</p>
        </div>
        {/* Category badge */}
        <span className={cn('category-pill flex-shrink-0', categoryColor)}>{categoryLabel}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden card-hover',
        variant === 'featured' && 'ring-1 ring-emerald-200',
        className
      )}
    >
      {/* Category bar */}
      <div className="h-1 bg-emerald-500" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={cn('category-pill', categoryColor)}>{categoryLabel}</span>
          <span className="text-xs text-stone-400 flex-shrink-0">
            {audienceLabel !== 'Everyone' && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {audienceLabel}
              </span>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2 mb-1">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{event.description}</p>

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium text-stone-700">{formatEventDate(event.date)}</span>
            <span>·</span>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatEventTime(event.startTime)}</span>
            {event.endTime && (
              <>
                <span>–</span>
                <span>{formatEventTime(event.endTime)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.address}</span>
          </div>
        </div>

        {/* Source */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Source:{' '}
            {event.sourceUrl ? (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-medium hover:underline"
              >
                {event.organizationName}
              </a>
            ) : (
              <span className="text-emerald-700 font-medium">{event.organizationName}</span>
            )}
          </span>
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Register <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
