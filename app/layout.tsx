import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { PrayerBar } from '@/components/prayer/PrayerBar';
import { APP_CONFIG } from '@/lib/config';
import { mosques } from '@/lib/data/mosques';
import { withLivePrayerTimes } from '@/lib/prayer-sources/all-mosques';
import type { PrayerTime } from '@/lib/types';
import { AuthProvider } from '@/providers/AuthProvider';

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
  const liveMosques = await withLivePrayerTimes(mosques);
  const prayerTimesByMosque: Record<string, PrayerTime> = {};
  for (const m of liveMosques) {
    if (m.prayerTimes) prayerTimesByMosque[m.id] = m.prayerTimes;
  }
  const mosqueOptions = liveMosques.map(m => ({ id: m.id, name: m.name, hasData: !!m.prayerTimes }));

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        <AuthProvider>
          <Navbar />
          <PrayerBar prayerTimesByMosque={prayerTimesByMosque} mosqueOptions={mosqueOptions} />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
