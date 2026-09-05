import type { Mosque, Organization, OrganizationType } from '@/lib/types';

// ============================================================
// MOCK MOSQUES — Teaneck, NJ
// Replace with real data as you receive it
// ============================================================

export const mosques: Mosque[] = [
  {
    id: 'mosque-1',
    name: 'Masjid Al-Wadud',
    slug: 'masjid-al-wadud',
    type: 'mosque',
    description:
      'Masjid Al-Wadud serves as a cornerstone of the Teaneck Muslim community, offering daily prayers, Friday khutbahs, and a wide range of educational programs for all ages.',
    shortDescription: 'Community masjid serving Teaneck since the 1980s.',
    address: '2020 Maple Ave',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8918,
    longitude: -74.0121,
    website: 'https://example.com',
    phone: '(201) 555-0101',
    email: 'info@masjid-al-wadud.org',
    verified: true,
    tags: ['prayers', 'education', 'youth', 'sisters', 'quran'],
    prayerTimes: {
      fajr: '5:12 AM',
      sunrise: '6:38 AM',
      dhuhr: '12:52 PM',
      asr: '4:15 PM',
      maghrib: '7:41 PM',
      isha: '9:08 PM',
    },
    iqamahTimes: {
      mosqueId: 'mosque-1',
      fajr: '5:45 AM',
      dhuhr: '1:15 PM',
      asr: '4:45 PM',
      maghrib: '7:46 PM',
      isha: '9:30 PM',
    },
    jummahTimes: {
      mosqueId: 'mosque-1',
      khutbahs: [
        { label: '1st Khutbah', time: '1:00 PM', language: 'English', imam: 'Imam Placeholder' },
        { label: '2nd Khutbah', time: '2:00 PM', language: 'Arabic', imam: 'Imam Placeholder' },
      ],
    },
    wuduFacilities: true,
    sistetsSection: true,
  },
  {
    id: 'mosque-2',
    name: 'Islamic Center of Teaneck',
    slug: 'islamic-center-teaneck',
    type: 'islamic_center',
    description:
      'The Islamic Center of Teaneck provides a full-service Islamic environment including a school, weekend programs, and active community outreach.',
    shortDescription: 'Full-service Islamic center with school and community programs.',
    address: '100 Cedar Lane',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8875,
    longitude: -74.0082,
    website: 'https://example.com',
    phone: '(201) 555-0202',
    email: 'info@ict.org',
    verified: true,
    tags: ['school', 'education', 'youth', 'weekend_school', 'full-service'],
    prayerTimes: {
      fajr: '5:12 AM',
      sunrise: '6:38 AM',
      dhuhr: '12:52 PM',
      asr: '4:15 PM',
      maghrib: '7:41 PM',
      isha: '9:08 PM',
    },
    iqamahTimes: {
      mosqueId: 'mosque-2',
      fajr: '5:40 AM',
      dhuhr: '1:00 PM',
      asr: '4:30 PM',
      maghrib: '7:46 PM',
      isha: '9:15 PM',
    },
    jummahTimes: {
      mosqueId: 'mosque-2',
      khutbahs: [
        { label: '1st Khutbah', time: '12:30 PM', language: 'English' },
        { label: '2nd Khutbah', time: '1:30 PM', language: 'Arabic' },
      ],
    },
    wuduFacilities: true,
    sistetsSection: true,
  },
  {
    id: 'mosque-3',
    name: 'Masjid Al-Noor',
    slug: 'masjid-al-noor',
    type: 'mosque',
    description:
      'Masjid Al-Noor is dedicated to serving the spiritual and educational needs of the Teaneck Muslim community with a focus on family programs.',
    shortDescription: 'Family-focused masjid with active youth and sisters programs.',
    address: '340 Queen Anne Road',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8942,
    longitude: -74.0198,
    website: 'https://example.com',
    phone: '(201) 555-0303',
    email: 'contact@masjid-al-noor-teaneck.org',
    verified: true,
    tags: ['family', 'youth', 'sisters', 'education', 'quran'],
    prayerTimes: {
      fajr: '5:12 AM',
      sunrise: '6:38 AM',
      dhuhr: '12:52 PM',
      asr: '4:15 PM',
      maghrib: '7:41 PM',
      isha: '9:08 PM',
    },
    iqamahTimes: {
      mosqueId: 'mosque-3',
      fajr: '5:50 AM',
      dhuhr: '1:20 PM',
      asr: '4:50 PM',
      maghrib: '7:46 PM',
      isha: '9:30 PM',
    },
    jummahTimes: {
      mosqueId: 'mosque-3',
      khutbahs: [
        { label: '1st Khutbah', time: '1:15 PM', language: 'English' },
      ],
    },
    wuduFacilities: true,
    sistetsSection: true,
  },
];

// ============================================================
// MOCK ORGANIZATIONS — Teaneck area
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
    description: 'Serving the broader Bergen County Muslim community through social services, interfaith dialogue, and community building.',
    shortDescription: 'Community organization serving Bergen County Muslims.',
    address: 'Bergen County, NJ',
    city: 'Teaneck',
    state: 'NJ',
    zip: '07666',
    latitude: 40.8900,
    longitude: -74.0150,
    verified: true,
    tags: ['social_services', 'interfaith', 'community'],
  },
  {
    id: 'org-3',
    name: 'MSA — Rutgers–Newark',
    slug: 'msa-rutgers-newark',
    type: 'msa',
    description: 'Muslim Student Association at Rutgers University–Newark, serving students in the greater metro area.',
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

// Helper: get org by id
export function getOrganizationById(id: string): Organization | undefined {
  return organizations.find(o => o.id === id);
}

export function getMosqueById(id: string): Mosque | undefined {
  return mosques.find(m => m.id === id);
}
