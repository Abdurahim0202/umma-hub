# Ummah Hub — Developer Guide

## Quick Start

```powershell
# 1. Navigate to the project
cd "C:\Users\user\Desktop\Hack Darul Islah\ummah-hub"

# 2. Run the dev server (using the bundled pnpm)
$env:PATH = "C:\Users\user\.cache\shims;" + $env:PATH
pnpm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Project Structure

```
ummah-hub/
├── app/                        # All pages (Next.js App Router)
│   ├── page.tsx                # Home / Discover
│   ├── calendar/page.tsx       # Community Calendar
│   ├── mosques/
│   │   ├── page.tsx            # Mosque Directory
│   │   └── [slug]/page.tsx     # Mosque Detail
│   ├── prayer-times/page.tsx   # Prayer Times
│   ├── resources/page.tsx      # Community Resources
│   ├── announcements/page.tsx  # Announcements
│   ├── community/page.tsx      # Forum
│   ├── explore/page.tsx        # Map / Explore
│   ├── search/page.tsx         # Global Search
│   └── profile/page.tsx        # User Profile
│
├── components/
│   ├── layout/Navbar.tsx       # Desktop navigation
│   ├── layout/MobileNav.tsx    # Mobile bottom nav
│   ├── prayer/PrayerBar.tsx    # Prayer times header bar
│   └── cards/
│       ├── EventCard.tsx
│       ├── MosqueCard.tsx
│       ├── AnnouncementCard.tsx
│       ├── ResourceCard.tsx
│       └── CommunityPost.tsx
│
└── lib/
    ├── config.ts               # App name, city, defaults — CHANGE HERE
    ├── types/index.ts          # All TypeScript types
    ├── utils.ts                # Helpers, category labels/colors
    └── data/
        ├── mosques.ts          # Mosque + org mock data ← ADD YOUR DATA HERE
        ├── events.ts           # Event mock data ← ADD YOUR DATA HERE
        └── community.ts        # Announcements, resources, posts ← ADD YOUR DATA HERE
```

---

## Adding Real Data

When you're ready to add real mosque/event data:

1. **Edit** `lib/data/mosques.ts` — replace placeholder mosques with real ones
2. **Edit** `lib/data/events.ts` — replace placeholder events
3. **Edit** `lib/data/community.ts` — replace announcements and resources

### Changing the App Name or City

Edit `lib/config.ts`:

```typescript
export const APP_CONFIG = {
  name: 'Ummah Hub',      // ← Change app name here
  city: 'Teaneck',        // ← Change city here
  state: 'NJ',
  // ...
}
```

---

## Running for Hackathon Demo

```powershell
$env:PATH = "C:\Users\user\.cache\shims;" + $env:PATH
pnpm run dev
```

App will be available at:
- Local: http://localhost:3000
- Network: http://192.168.68.24:3000 (accessible from other devices on same WiFi)
