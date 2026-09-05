// ============================================================
// UMMAH HUB — App Configuration
// Change APP_NAME here to rebrand
// ============================================================

export const APP_CONFIG = {
  name: 'Ummah Hub',
  tagline: 'Your Muslim community, all in one place.',
  city: 'Teaneck',
  state: 'NJ',
  cityFull: 'Teaneck, NJ',
  // Default coordinates (Teaneck center)
  defaultLat: 40.8918,
  defaultLng: -74.0121,
  // Prayer time calculation settings
  prayerMethod: 'ISNA',   // North America
  timezone: 'America/New_York',
} as const;

// Default prayer times for Teaneck, NJ (September 5, 2026)
// These are calculated adhan times — iqamah times come from each mosque
export const DEFAULT_PRAYER_TIMES = {
  fajr: '5:12 AM',
  sunrise: '6:38 AM',
  dhuhr: '12:52 PM',
  asr: '4:15 PM',
  maghrib: '7:41 PM',
  isha: '9:08 PM',
};
