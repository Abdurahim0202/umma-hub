'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MapPin, Bell, User, Menu } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/mosques', label: 'Mosques' },
  { href: '/resources', label: 'Resources' },
  { href: '/community', label: 'Community' },
];

export function Navbar() {
  const pathname = usePathname();

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
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Location */}
            <div className="hidden sm:flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{APP_CONFIG.cityFull}</span>
            </div>

            {/* Search (mobile icon) */}
            <Link
              href="/search"
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Profile */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
