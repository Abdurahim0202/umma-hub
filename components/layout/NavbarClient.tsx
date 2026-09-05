'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavbarClientProps {
  navLinks: { href: string; label: string }[];
}

export function NavbarClient({ navLinks }: NavbarClientProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === link.href
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
