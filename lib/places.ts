/**
 * lib/places.ts
 * Server-side only — Google Places API (New) fetch helper.
 * Maps Place results → Mosque type. Falls back to static data when key is absent.
 *
 * ⚠️  Never import this file from client components or pages with 'use client'.
 */

import type { Mosque } from '@/lib/types';
import { mosques as staticMosques } from '@/lib/data/mosques';

// Teaneck, NJ center
const TEANECK_LAT = 40.8918;
const TEANECK_LNG = -74.0121;
const SEARCH_RADIUS_M = 24000; // ~15 miles

/** Haversine distance in miles between two lat/lng points */
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Slugify a Place name for use in the URL (fallback for static compat) */
function _toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Derive a short description from the name if Places doesn't give us one.
 */
function shortDescription(name: string, types: string[]): string {
  if (types.includes('mosque')) return `Mosque serving the local Muslim community.`;
  if (types.includes('church')) return `Islamic center serving the local Muslim community.`;
  return `Muslim community center in the Teaneck, NJ area.`;
}

interface PlacesResult {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  googleMapsUri?: string;
}

interface PlacesResponse {
  places?: PlacesResult[];
}

/**
 * Fetch nearby mosques from the Google Places API (New) Nearby Search.
 * Requires GOOGLE_MAPS_API_KEY env variable.
 * Returns static fallback data if key is absent or request fails.
 */
export async function fetchNearbyMosques(): Promise<Mosque[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('[places] GOOGLE_MAPS_API_KEY not set — using static fallback data.');
    return staticMosques;
  }

  const url = 'https://places.googleapis.com/v1/places:searchNearby';

  const body = {
    includedTypes: ['mosque'],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: TEANECK_LAT, longitude: TEANECK_LNG },
        radius: SEARCH_RADIUS_M,
      },
    },
  };

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.internationalPhoneNumber',
    'places.nationalPhoneNumber',
    'places.websiteUri',
    'places.rating',
    'places.userRatingCount',
    'places.types',
    'places.googleMapsUri',
  ].join(',');

  let data: PlacesResponse;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(body),
      // Next.js ISR: cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[places] API error ${res.status}: ${text}`);
      return staticMosques;
    }

    data = (await res.json()) as PlacesResponse;
  } catch (err) {
    console.error('[places] Fetch failed:', err);
    return staticMosques;
  }

  const places = data.places ?? [];

  if (places.length === 0) {
    console.warn('[places] No results returned — using static fallback.');
    return staticMosques;
  }

  // Deduplicate by Place ID, map → Mosque, sort by distance
  const seen = new Set<string>();
  const results: Mosque[] = [];

  for (const place of places) {
    if (seen.has(place.id)) continue;
    seen.add(place.id);

    const lat = place.location.latitude;
    const lng = place.location.longitude;
    const distanceMiles = haversineMiles(TEANECK_LAT, TEANECK_LNG, lat, lng);

    // Parse address into components (best-effort)
    // formattedAddress: "123 Main St, Teaneck, NJ 07666, USA"
    const addrParts = place.formattedAddress.replace(', USA', '').split(', ');
    const streetAddress = addrParts[0] ?? place.formattedAddress;
    const city = addrParts[1] ?? 'Teaneck';
    const stateZip = addrParts[2] ?? 'NJ 07666';
    const [state = 'NJ', zip = ''] = stateZip.split(' ');

    const phone = place.internationalPhoneNumber ?? place.nationalPhoneNumber;
    const name = place.displayName.text;
    const types = place.types ?? [];

    const isCenter =
      name.toLowerCase().includes('center') ||
      name.toLowerCase().includes('islamic') ||
      types.includes('community_center');

    const mosque: Mosque = {
      id: place.id,
      placeId: place.id,
      // Slug is the Place ID so detail pages work with dynamic data
      slug: place.id,
      name,
      type: isCenter ? 'islamic_center' : 'mosque',
      description: `${name} is a Muslim place of worship serving the ${city}, ${state} area. Prayer times are available on-site or via the mosque's website.`,
      shortDescription: shortDescription(name, types),
      address: streetAddress,
      city,
      state,
      zip,
      latitude: lat,
      longitude: lng,
      website: place.websiteUri,
      phone: phone ?? undefined,
      directionsUrl:
        place.googleMapsUri ??
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place.id}`,
      rating: place.rating,
      reviewCount: place.userRatingCount,
      distanceMiles,
      verified: false,
      tags: ['prayers'],
      // Prayer times intentionally left undefined — to be populated per-mosque later
      prayerTimes: undefined,
      iqamahTimes: undefined,
      jummahTimes: undefined,
    };

    results.push(mosque);
  }

  // Sort by distance from Teaneck
  results.sort((a, b) => (a.distanceMiles ?? 99) - (b.distanceMiles ?? 99));

  return results;
}
