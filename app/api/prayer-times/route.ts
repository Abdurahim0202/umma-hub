import { NextResponse } from 'next/server';
import { mosques } from '@/lib/data/mosques';
import { withLivePrayerTimesFor } from '@/lib/prayer-sources/all-mosques';

// Fetches live prayer/iqamah/Jumu'ah times for exactly one mosque — used by
// the header PrayerBar and the home-mosque selector so we never have to
// fetch all 9 mosques (3 of which go through Groq) just to render the bar.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mosqueId = searchParams.get('mosqueId');
  if (!mosqueId) {
    return NextResponse.json({ error: 'mosqueId is required' }, { status: 400 });
  }

  const staticMosque = mosques.find(m => m.id === mosqueId);
  if (!staticMosque) {
    return NextResponse.json({ error: 'Unknown mosqueId' }, { status: 404 });
  }

  const mosque = await withLivePrayerTimesFor(staticMosque);

  return NextResponse.json({
    mosqueId,
    prayerTimes: mosque.prayerTimes ?? null,
    iqamahTimes: mosque.iqamahTimes ?? null,
    jummahTimes: mosque.jummahTimes ?? null,
  });
}
