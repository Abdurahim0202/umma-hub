/**
 * DEPRECATED — Supabase has been replaced with Firebase.
 * This stub exists so any lingering import sites compile without errors.
 * The real middleware is in middleware.ts (a simple NextResponse.next passthrough).
 */

import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request });
}
