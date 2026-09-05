import { Search, MapPin } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { MosqueCard } from '@/components/cards/MosqueCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mosque Directory',
  description: 'Find local mosques in Teaneck, NJ with prayer times, iqamah schedules, and programs.',
};

export default function MosquesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
          <span className="text-2xl">🕌</span>
          Mosque Directory
        </h1>
        <p className="text-stone-500 text-sm">
          Local mosques and Islamic centers in {' '}
          <span className="text-emerald-700 font-medium">Teaneck, NJ</span>
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          placeholder="Search mosques..."
          className="flex-1 text-sm bg-transparent text-stone-700 placeholder-stone-400 outline-none"
        />
        <div className="flex items-center gap-1 text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
          <MapPin className="w-3 h-3 text-emerald-600" />
          Teaneck, NJ
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Mosques', value: mosques.length },
          { label: 'Verified', value: mosques.filter(m => m.verified).length },
          { label: 'Jumu\'ah times', value: mosques.filter(m => m.jummahTimes).length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-stone-100 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{stat.value}</p>
            <p className="text-xs text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mosque grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mosques.map((mosque, i) => (
          <MosqueCard
            key={mosque.id}
            mosque={mosque}
            distanceMiles={[0.8, 1.2, 1.7][i] ?? Math.random() * 3}
          />
        ))}
      </div>
    </div>
  );
}
