import { Map, Filter } from 'lucide-react';
import { mosques } from '@/lib/data/mosques';
import { MosqueCard } from '@/components/cards/MosqueCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore mosques, events, and resources near you in Teaneck, NJ.',
};

const EXPLORE_FILTERS = [
  { label: '🕌 Mosques', active: true },
  { label: '📅 Events', active: false },
  { label: '📚 Classes', active: false },
  { label: '👧 Youth', active: false },
  { label: '🧕 Sisters', active: false },
  { label: '🤝 Volunteer', active: false },
];

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2 mb-1">
            <Map className="w-6 h-6 text-emerald-600" />
            Explore
          </h1>
          <p className="text-stone-500 text-sm">Discover what's around you in Teaneck, NJ</p>
        </div>
        <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-700 px-4 py-2 rounded-xl text-sm hover:bg-stone-50">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {EXPLORE_FILTERS.map(f => (
          <button
            key={f.label}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              f.active
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="bg-stone-100 rounded-3xl h-80 flex items-center justify-center mb-6 border border-stone-200 relative overflow-hidden">
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Fake pins */}
        {mosques.map((mosque, i) => (
          <div
            key={mosque.id}
            className="absolute bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-medium cursor-pointer hover:bg-emerald-700 transition-colors"
            style={{
              left: `${30 + i * 20}%`,
              top: `${35 + (i % 2 === 0 ? 10 : -10)}%`,
            }}
          >
            🕌 {mosque.name.split(' ')[0]}
          </div>
        ))}

        <div className="relative z-10 text-center bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm">
          <Map className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="text-stone-600 font-medium text-sm">Interactive map coming soon</p>
          <p className="text-stone-400 text-xs">All mosques and events will appear here</p>
        </div>
      </div>

      {/* List below map */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4">Nearby Mosques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mosques.map((mosque, i) => (
            <MosqueCard
              key={mosque.id}
              mosque={mosque}
              distanceMiles={[0.8, 1.2, 1.7][i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
