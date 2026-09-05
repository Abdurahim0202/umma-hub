import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';
import { NavbarClient } from './NavbarClient';
import { NavbarAuth } from './NavbarAuth';

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/explore',   label: 'Explore' },
  { href: '/calendar',  label: 'Calendar' },
  { href: '/mosques',   label: 'Mosques' },
  { href: '/resources', label: 'Resources' },
  { href: '/community', label: 'Community' },
];

/** Server Component — layout + static links. Auth state is handled by NavbarAuth (client). */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              ☪
            </div>
            <span className="font-bold text-lg text-stone-900 tracking-tight">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <NavbarClient navLinks={NAV_LINKS} />

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{APP_CONFIG.cityFull}</span>
            </div>

            {/* Mobile search */}
            <Link
              href="/search"
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Auth (client component — reads Firebase auth state) */}
            <NavbarAuth />
          </div>
        </div>
      </div>
    </header>
  );
}
