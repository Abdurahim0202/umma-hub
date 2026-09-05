import { ExternalLink, Tag } from 'lucide-react';
import type { Resource } from '@/lib/types';
import { cn, RESOURCE_CATEGORY_LABELS } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  education: 'bg-indigo-50 text-indigo-700',
  quran: 'bg-teal-50 text-teal-700',
  sunday_school: 'bg-blue-50 text-blue-700',
  arabic: 'bg-cyan-50 text-cyan-700',
  islamic_studies: 'bg-emerald-50 text-emerald-700',
  youth: 'bg-orange-50 text-orange-700',
  scholarship: 'bg-amber-50 text-amber-700',
  financial: 'bg-green-50 text-green-700',
  food: 'bg-red-50 text-red-700',
  mental_health: 'bg-purple-50 text-purple-700',
  marriage: 'bg-pink-50 text-pink-700',
  new_muslim: 'bg-emerald-50 text-emerald-800',
  funeral: 'bg-slate-50 text-slate-700',
  career: 'bg-sky-50 text-sky-700',
  legal: 'bg-violet-50 text-violet-700',
  volunteer: 'bg-rose-50 text-rose-700',
  housing: 'bg-lime-50 text-lime-700',
  business: 'bg-yellow-50 text-yellow-700',
};

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const categoryLabel = RESOURCE_CATEGORY_LABELS[resource.category] ?? resource.category;
  const categoryColor = CATEGORY_COLORS[resource.category] ?? 'bg-gray-50 text-gray-700';

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-stone-100 p-4 card-hover', className)}>
      {/* Category */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={cn('category-pill', categoryColor)}>{categoryLabel}</span>
        {resource.isFeatured && (
          <span className="category-pill bg-amber-50 text-amber-700">Featured</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-stone-900 text-base leading-snug mb-1">{resource.title}</h3>
      <p className="text-xs text-emerald-700 font-medium mb-2">{resource.organizationName}</p>

      {/* Description */}
      <p className="text-stone-500 text-sm line-clamp-2 mb-3">{resource.description}</p>

      {/* Details grid */}
      <div className="space-y-1">
        {resource.eligibility && (
          <p className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">Eligibility:</span> {resource.eligibility}
          </p>
        )}
        {resource.schedule && (
          <p className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">Schedule:</span> {resource.schedule}
          </p>
        )}
        {resource.cost && (
          <p className="text-xs text-stone-500">
            <span className="font-medium text-stone-700">Cost:</span> {resource.cost}
          </p>
        )}
        {resource.deadline && (
          <p className="text-xs text-red-600 font-medium">Deadline: {resource.deadline}</p>
        )}
      </div>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resource.tags.slice(0, 4).map(tag => (
            <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
        <p className="text-xs text-stone-400">{resource.city}</p>
        <div className="flex gap-2">
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
