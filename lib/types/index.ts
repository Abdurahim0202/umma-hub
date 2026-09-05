// ============================================================
// UMMAH HUB — Core TypeScript Types
// City: Teaneck, NJ
// ============================================================

export type OrganizationType =
  | 'mosque'
  | 'islamic_center'
  | 'msa'
  | 'charity'
  | 'school'
  | 'community_org'
  | 'other';

export type EventCategory =
  | 'lecture'
  | 'halaqa'
  | 'quran'
  | 'education'
  | 'youth'
  | 'sisters'
  | 'brothers'
  | 'family'
  | 'social'
  | 'sports'
  | 'volunteer'
  | 'fundraiser'
  | 'conference'
  | 'food'
  | 'career'
  | 'jummah'
  | 'other';

export type EventAudience =
  | 'everyone'
  | 'brothers'
  | 'sisters'
  | 'families'
  | 'youth'
  | 'children'
  | 'adults';

export type AnnouncementCategory =
  | 'general'
  | 'janazah'
  | 'urgent'
  | 'community'
  | 'fundraiser'
  | 'volunteer'
  | 'education'
  | 'ramadan'
  | 'eid';

export type ResourceCategory =
  | 'education'
  | 'quran'
  | 'sunday_school'
  | 'arabic'
  | 'islamic_studies'
  | 'youth'
  | 'scholarship'
  | 'financial'
  | 'food'
  | 'mental_health'
  | 'marriage'
  | 'new_muslim'
  | 'funeral'
  | 'career'
  | 'legal'
  | 'volunteer'
  | 'housing'
  | 'business';

export type ForumCategory =
  | 'general'
  | 'questions'
  | 'events'
  | 'recommendations'
  | 'jobs'
  | 'housing'
  | 'education'
  | 'marriage_family'
  | 'students'
  | 'youth'
  | 'businesses'
  | 'volunteering'
  | 'announcements'
  | 'buy_sell'
  | 'lost_found';

export type EventSourceType =
  | 'scraper'
  | 'rss'
  | 'ical'
  | 'gcal'
  | 'eventbrite'
  | 'api'
  | 'manual';

// ────────────────────────────────────────────────────────────
// Prayer Times
// ────────────────────────────────────────────────────────────

export interface PrayerTime {
  fajr: string;       // "5:41 AM"
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface IqamahTime {
  mosqueId: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;    // Often right after adhan
  isha: string;
}

export interface JummahTime {
  mosqueId: string;
  khutbahs: Array<{
    label: string;    // "1st Khutbah"
    time: string;     // "1:15 PM"
    language?: string;
    imam?: string;
  }>;
}

// ────────────────────────────────────────────────────────────
// Organization & Mosque
// ────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  logo?: string;
  coverImage?: string;
  description: string;
  shortDescription: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  verified: boolean;
  tags: string[];
}

export interface Mosque extends Organization {
  type: 'mosque' | 'islamic_center';
  prayerTimes?: PrayerTime;         // Calculated adhan times
  iqamahTimes?: IqamahTime;         // Congregation iqamah times
  jummahTimes?: JummahTime;
  prayerTimesSource?: string;       // URL or API source
  capacity?: number;
  parkingInfo?: string;
  wuduFacilities?: boolean;
  sistetsSection?: boolean;
  // Google Places fields
  placeId?: string;                 // Google Place ID — used as slug for Places-sourced mosques
  directionsUrl?: string;           // Google Maps directions URL
  rating?: number;                  // Google rating (display only — not prayer info)
  reviewCount?: number;             // Number of Google reviews
  distanceMiles?: number;           // Distance from reference mosque, for sorting
  distanceLabel?: string;           // Human-readable label e.g. "Within 3 miles" or "Home Mosque"
  isHomeMosque?: boolean;           // True for Darul Islah (reference mosque)
}

// ────────────────────────────────────────────────────────────
// Event Source Adapter
// ────────────────────────────────────────────────────────────

export interface EventSource {
  id: string;
  organizationId: string;
  sourceType: EventSourceType;
  sourceUrl?: string;
  externalId?: string;
  lastSyncedAt?: string;
  isActive: boolean;
}

// ────────────────────────────────────────────────────────────
// Event
// ────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  mosqueId?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  startTime: string;    // ISO string
  endTime?: string;
  date: string;         // "YYYY-MM-DD"
  allDay?: boolean;      // true when no specific time is known/applicable — render as "All day" rather than a fabricated range
  category: EventCategory;
  audience: EventAudience;
  image?: string;
  sourceUrl?: string;
  registrationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  isFeatured?: boolean;
  isPinned?: boolean;
  tags: string[];
  // Source provenance
  sourceType: EventSourceType;
  externalId?: string;
  lastSyncedAt?: string;
}

// ────────────────────────────────────────────────────────────
// Announcement
// ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  postedAt?: string;    // omit rather than guess when the source doesn't expose a real posted date
  isUrgent: boolean;
  sourceUrl?: string;
  // Janazah-specific (optional)
  janazah?: {
    deceasedName?: string;         // Only if family has made public
    prayerLocation: string;
    prayerTime: string;
    burialLocation?: string;
    instructions?: string;
  };
}

// ────────────────────────────────────────────────────────────
// Resource
// ────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  category: ResourceCategory;
  eligibility?: string;
  address?: string;
  city?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationUrl?: string;
  deadline?: string;
  schedule?: string;
  ageRange?: string;
  cost?: string;
  tags: string[];
  isFeatured?: boolean;
}

// ────────────────────────────────────────────────────────────
// Community Forum
// ────────────────────────────────────────────────────────────

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  community: ForumCategory;
  title: string;
  body: string;
  postedAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  isSaved?: boolean;
  tags: string[];
  isPinned?: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  postedAt: string;
  upvotes: number;
  parentCommentId?: string;
}

// ────────────────────────────────────────────────────────────
// User
// ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  interests: string[];
  followedOrganizations: string[];
  bookmarkedEvents: string[];
  bookmarkedResources: string[];
  savedPosts: string[];
  joinedAt: string;
}

// ────────────────────────────────────────────────────────────
// Search
// ────────────────────────────────────────────────────────────

export interface SearchResults {
  events: Event[];
  mosques: Mosque[];
  organizations: Organization[];
  resources: Resource[];
  announcements: Announcement[];
  posts: ForumPost[];
}

// ────────────────────────────────────────────────────────────
// Supabase DB Row Types
// These mirror the actual table schemas in Supabase.
// ────────────────────────────────────────────────────────────

export interface DbProfile {
  id:           string;
  email:        string | null;
  display_name: string;
  city:         string | null;
  avatar_url:   string | null;
  interests:    string[];
  role:         'member' | 'admin' | 'mosque_admin';
  created_at:   string;
}

export interface DbPost {
  id:         string;
  user_id:    string;
  title:      string;
  body:       string;
  category:   string;
  is_pinned:  boolean;
  tags:       string[];
  created_at: string;
  updated_at: string;
}

export interface DbComment {
  id:                string;
  post_id:           string;
  user_id:           string;
  body:              string;
  parent_comment_id: string | null;
  created_at:        string;
}

export interface DbVote {
  id:         string;
  post_id:    string;
  user_id:    string;
  value:      1 | -1;
  created_at: string;
}

export interface DbBookmark {
  id:         string;
  post_id:    string;
  user_id:    string;
  created_at: string;
}

export interface DbFollow {
  id:         string;
  user_id:    string;
  mosque_id:  string;
  created_at: string;
}
