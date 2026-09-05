import type { Mosque, Organization, OrganizationType } from '@/lib/types';

// ============================================================
// REAL MOSQUES — Teaneck, NJ area
// Reference / home mosque: Darul Islah (320 Fabry Terrace, Teaneck)
// Distances measured from Darul Islah.
// Prayer times, iqamah times, and Jumu'ah times are intentionally
// left undefined — they will be added per-mosque in a future update.
// ============================================================

function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const mosques: Mosque[] = [
  // ── 1. Darul Islah — HOME MOSQUE ────────────────────────────
  {
    id: 'darul-islah',
    name: 'Darul Islah',
    slug: 'darul-islah',
    type: 'mosque',
    description:
      'Darul Islah is the home mosque and community hub for Ummah Hub. Located in Teaneck, NJ, it serves as the reference point for all distance calculations and offers daily prayers, Friday khutbahs, educational programs, and community services.',
    shortDescription: 'Home mosque · Teaneck, NJ community hub.',
    address: '320 Fabry Terrace',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8715992,
    longitude: -74.0014555,
    phone: '(201) 692-7730',
    website: 'https://darulislah.org',
    directionsUrl: mapsUrl(40.8715992, -74.0014555),
    verified: true,
    isHomeMosque: true,
    distanceMiles: 0,
    distanceLabel: 'Home Mosque',
    tags: ['prayers', 'education', 'youth', 'sisters', 'quran', 'jummah'],
    // ── Prayer / Iqamah / Jumu'ah — to be added ──
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 2. Nida-Ul Islam Center — ~2.0 mi ───────────────────────
  {
    id: 'nida-ul-islam',
    name: 'Nida-Ul Islam Center',
    slug: 'nida-ul-islam',
    type: 'mosque',
    description:
      'Nida-Ul Islam Center serves the Muslim community in northern Teaneck with daily prayers and educational programs.',
    shortDescription: 'Mosque in northern Teaneck.',
    address: '250 Hargreaves Ave',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.9022327,
    longitude: -73.9899487,
    phone: '(201) 833-2162',
    website: 'https://nidaulislam.org',
    directionsUrl: mapsUrl(40.9022327, -73.9899487),
    verified: false,
    distanceMiles: 2.1,
    distanceLabel: 'Within 3 miles',
    tags: ['prayers', 'education'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 3. Bergen County Islamic Education Center — ~2.4 mi ─────
  {
    id: 'bciec',
    name: 'Bergen County Islamic Education Center',
    slug: 'bciec',
    type: 'islamic_center',
    description:
      'The Bergen County Islamic Education Center (BCIEC) in Hackensack offers Islamic education, daily prayers, and community programs for Bergen County Muslims.',
    shortDescription: 'Islamic education center in Hackensack, NJ.',
    address: '78 Trinity Pl',
    city: 'Hackensack',
    state: 'NJ',
    zip: '07601',
    latitude: 40.8844547,
    longitude: -74.0455756,
    phone: '(201) 488-8075',
    website: 'https://bciec.org',
    directionsUrl: mapsUrl(40.8844547, -74.0455756),
    verified: false,
    distanceMiles: 2.4,
    distanceLabel: 'Within 3 miles',
    tags: ['education', 'prayers', 'youth'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 4. Diyanet Mosque of Bergen — ~3.5 mi ───────────────────
  {
    id: 'diyanet-bergen',
    name: 'Diyanet Mosque of Bergen',
    slug: 'diyanet-bergen',
    type: 'mosque',
    description:
      'Diyanet Mosque of Bergen in Cliffside Park provides daily prayers and serves the Turkish-American Muslim community in Bergen County.',
    shortDescription: 'Mosque in Cliffside Park serving Bergen County.',
    address: '240 Knox Ave',
    city: 'Cliffside Park',
    state: 'NJ',
    zip: '07010',
    latitude: 40.8273944,
    longitude: -73.9838064,
    phone: '(201) 840-8065',
    website: 'https://diyanetamerica.org/mosques/bergen-diyanet-mosque/',
    directionsUrl: mapsUrl(40.8273944, -73.9838064),
    verified: false,
    distanceMiles: 3.5,
    distanceLabel: 'Within 4 miles',
    tags: ['prayers', 'jummah'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 5. Al Aisha Mosque — ~4.3 mi ────────────────────────────
  {
    id: 'masjid-al-aisha',
    name: 'Al Aisha Mosque',
    slug: 'masjid-al-aisha',
    type: 'mosque',
    description:
      'Al Aisha Mosque in Bergenfield serves the local Muslim community with daily congregational prayers and community events.',
    shortDescription: 'Community mosque in Bergenfield, NJ.',
    address: '52 E Johnson Ave',
    city: 'Bergenfield',
    state: 'NJ',
    zip: '07621',
    latitude: 40.9309711,
    longitude: -73.9931329,
    phone: '(201) 374-2838',
    website: 'https://masjidalaisha.org',
    directionsUrl: mapsUrl(40.9309711, -73.9931329),
    verified: false,
    distanceMiles: 4.3,
    distanceLabel: 'Within 5 miles',
    tags: ['prayers', 'community'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 6. Islamic Center of Passaic County — ~7.5 mi ───────────
  {
    id: 'icpc',
    name: 'Islamic Center of Passaic County',
    slug: 'icpc',
    type: 'islamic_center',
    description:
      'The Islamic Center of Passaic County (ICPC) in Paterson is one of the largest Islamic centers in northern NJ, offering daily prayers, education, and social services.',
    shortDescription: 'Major Islamic center in Paterson, NJ.',
    address: '152 Derrom Ave',
    city: 'Paterson',
    state: 'NJ',
    zip: '07504',
    latitude: 40.9175704,
    longitude: -74.1403532,
    phone: '(973) 278-7070',
    website: 'https://icpcnj.org',
    directionsUrl: mapsUrl(40.9175704, -74.1403532),
    verified: false,
    distanceMiles: 7.5,
    distanceLabel: 'Within 8 miles',
    tags: ['prayers', 'education', 'social_services', 'youth'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 7. United Islamic Center (Ulu Cami) — ~7.7 mi ───────────
  {
    id: 'ulu-cami',
    name: 'United Islamic Center (Ulu Cami Mosque)',
    slug: 'ulu-cami',
    type: 'mosque',
    description:
      'The United Islamic Center, also known as Ulu Cami Mosque, serves the Turkish-American Muslim community in Paterson with daily prayers and community programs.',
    shortDescription: 'Turkish-American mosque in Paterson, NJ.',
    address: '408 Knickerbocker Ave',
    city: 'Paterson',
    state: 'NJ',
    zip: '07503',
    latitude: 40.8926849,
    longitude: -74.1420364,
    phone: '(973) 345-6584',
    website: 'https://ulucami.org',
    directionsUrl: mapsUrl(40.8926849, -74.1420364),
    verified: false,
    distanceMiles: 7.7,
    distanceLabel: 'Within 8 miles',
    tags: ['prayers', 'community'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 8. Muslim Community Center of Paramus — ~7.9 mi ─────────
  {
    id: 'mcc-paramus',
    name: 'Muslim Community Center of Paramus (The Fusion)',
    slug: 'mcc-paramus',
    type: 'islamic_center',
    description:
      'The Muslim Community Center of Paramus, known as The Fusion, offers a vibrant community space with daily prayers, youth programs, and social events for families in Bergen County.',
    shortDescription: 'Family-focused Islamic center in Paramus, NJ.',
    address: '650 Pascack Rd',
    city: 'Paramus',
    state: 'NJ',
    zip: '07652',
    latitude: 40.9629863,
    longitude: -74.0590888,
    phone: '(201) 265-5500',
    website: 'https://fmccnj.com',
    directionsUrl: mapsUrl(40.9629863, -74.0590888),
    verified: false,
    distanceMiles: 7.9,
    distanceLabel: 'Within 8 miles',
    tags: ['prayers', 'youth', 'family', 'sisters', 'education'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },

  // ── 9. Omar Mosque — ~8.5 mi ─────────────────────────────────
  {
    id: 'omar-mosque',
    name: 'Omar Mosque',
    slug: 'omar-mosque',
    type: 'mosque',
    description:
      'Omar Mosque in Paterson provides daily congregational prayers and serves the Muslim community in western Passaic County.',
    shortDescription: 'Community mosque in Paterson, NJ.',
    address: '501 Getty Ave',
    city: 'Paterson',
    state: 'NJ',
    zip: '07503',
    latitude: 40.8909607,
    longitude: -74.1527176,
    phone: '(973) 279-6226',
    website: 'https://omarmosque.org',
    directionsUrl: mapsUrl(40.8909607, -74.1527176),
    verified: false,
    distanceMiles: 8.5,
    distanceLabel: 'Within 9 miles',
    tags: ['prayers', 'community'],
    prayerTimes: undefined,
    iqamahTimes: undefined,
    jummahTimes: undefined,
  },
];

// ============================================================
// ORGANIZATIONS — Teaneck area
// ============================================================

export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Teaneck Muslim Youth Association',
    slug: 'teaneck-mya',
    type: 'community_org',
    description: 'Empowering Muslim youth in Teaneck through sports, education, leadership, and community service.',
    shortDescription: 'Youth empowerment through sports, education, and service.',
    address: 'Teaneck, NJ',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8918,
    longitude: -74.0121,
    verified: true,
    tags: ['youth', 'sports', 'leadership', 'community'],
  },
  {
    id: 'org-2',
    name: 'Bergen County Islamic Society',
    slug: 'bcis',
    type: 'community_org',
    description:
      'Serving the broader Bergen County Muslim community through social services, interfaith dialogue, and community building.',
    shortDescription: 'Community organization serving Bergen County Muslims.',
    address: 'Bergen County, NJ',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.89,
    longitude: -74.015,
    verified: true,
    tags: ['social_services', 'interfaith', 'community'],
  },
  {
    id: 'org-3',
    name: 'MSA — Rutgers–Newark',
    slug: 'msa-rutgers-newark',
    type: 'msa',
    description:
      'Muslim Student Association at Rutgers University–Newark, serving students in the greater metro area.',
    shortDescription: 'MSA connecting Muslim students in the NJ metro area.',
    address: 'Newark, NJ',
    city: 'Newark',
    state: 'NJ',
    zip: '07102',
    latitude: 40.7402,
    longitude: -74.1748,
    verified: false,
    tags: ['students', 'education', 'youth'],
  },
  ...mosques.map(m => ({ ...m, type: m.type as OrganizationType })),
];

// ── Helpers ──────────────────────────────────────────────────

export function getOrganizationById(id: string): Organization | undefined {
  return organizations.find(o => o.id === id);
}

export function getMosqueById(id: string): Mosque | undefined {
  return mosques.find(m => m.id === id);
}
