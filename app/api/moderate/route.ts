import { NextResponse } from 'next/server';
import { moderateFields } from '@/lib/moderation/check';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') fields[key] = value;
  }

  const result = await moderateFields(fields);
  return NextResponse.json(result);
}
