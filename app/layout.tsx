import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { PrayerBar } from '@/components/prayer/PrayerBar';
import { APP_CONFIG } from '@/lib/config';
import { mosques } from '@/lib/data/mosques';
import { AuthProvider } from '@/providers/AuthProvider';
import { HomeMosqueProvider } from '@/providers/HomeMosqueProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: `${APP_CONFIG.name} — ${APP_CONFIG.cityFull} Muslim Community`,
  },
  description: `${APP_CONFIG.tagline} Events, prayer times, mosque directory, resources, and community for the Muslim community in ${APP_CONFIG.cityFull}.`,
  keywords: ['Muslim community', 'Teaneck', 'masjid', 'Islamic events', 'prayer times', 'halal'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Static list only — no live fetch here. The bar fetches live times
  // client-side for just the selected mosque (see PrayerBar), so this
  // layout (rendered on every page) never has to hit 9 mosque sources
  // (3 of them via Groq) on every navigation.
  const mosqueOptions = mosques.map(m => ({ id: m.id, name: m.name }));

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        <AuthProvider>
          <HomeMosqueProvider>
            <Navbar />
            <PrayerBar mosqueOptions={mosqueOptions} />
            <main className="min-h-screen pb-20 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </HomeMosqueProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
