/**
 * Middleware — Firebase Auth doesn't use server-side session cookies
 * (the Firebase JS SDK handles auth state client-side via IndexedDB/localStorage).
 * No session refresh is needed here, so we pass through all requests.
 */

import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and Next.js internals.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
