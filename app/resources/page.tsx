import { BookOpen } from 'lucide-react';
import { resources } from '@/lib/data/resources';
import { ResourceBrowser } from '@/components/resources/ResourceBrowser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Resources',
  description: 'Real classes, services, and support programs published by mosques in and around Teaneck, NJ.',
};

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Community Resources
        </h1>
        <p className="text-stone-500 text-sm">
          Real classes, services, and support programs published by local mosques — each links back to its source.
        </p>
      </div>

      <ResourceBrowser resources={resources} />
    </div>
  );
}
