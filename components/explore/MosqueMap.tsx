'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Mosque } from '@/lib/types';
import { APP_CONFIG } from '@/lib/config';

function pinIcon(isHome: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${isHome ? '#f59e0b' : '#059669'};
      color:white;
      border-radius:9999px;
      padding:4px 9px;
      font-size:16px;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      white-space:nowrap;
      border:2px solid white;
      transform:translate(-50%,-100%);
    ">🕌</div>`,
    iconSize: [0, 0],
  });
}

export function MosqueMap({ mosques }: { mosques: Mosque[] }) {
  const center = useMemo((): [number, number] => [APP_CONFIG.defaultLat, APP_CONFIG.defaultLng], []);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-3xl border border-stone-200 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mosques.map(mosque => (
        <Marker
          key={mosque.id}
          position={[mosque.latitude, mosque.longitude]}
          icon={pinIcon(!!mosque.isHomeMosque)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-stone-900">{mosque.name}</p>
              <p className="text-stone-500 text-xs mb-1.5">{mosque.address}, {mosque.city}</p>
              <Link href={`/mosques/${mosque.slug}`} className="text-emerald-600 text-xs font-medium hover:underline">
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
