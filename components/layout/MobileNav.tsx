'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Calendar, BookOpen, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Map },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/community', label: 'Community', icon: MessageCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 md:hidden safe-area-bottom">
      <div className="flex items-stretch h-16">
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
                active ? 'text-emerald-600' : 'text-stone-400'
              )}
            >
              <Icon
                className={cn('w-5 h-5', active ? 'text-emerald-600' : 'text-stone-400')}
                strokeWidth={active ? 2.5 : 1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
