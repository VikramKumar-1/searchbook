/**
 * ═══════════════════════════════════════════════════════════
 * 📱 MOBILE BOTTOM NAVIGATION BAR
 * ═══════════════════════════════════════════════════════════
 *
 * Fixed bottom tab bar for mobile devices (visible only below md breakpoint).
 * Replaces the hamburger menu with native app-like bottom navigation.
 *
 * Design reference: Travel App UI (4-tab bottom nav with icons + labels)
 *
 * Shows: Home | Search | Bookings | Profile
 * Hidden on: md+ screens (desktop uses top Navbar)
 *
 * Performance:
 * - Uses solid background instead of backdrop-blur on mobile
 * - will-change: transform for smooth scroll hide/show (future)
 * - Safe area padding for iPhone home indicator
 * ═══════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, CalendarCheck, User } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Match these path prefixes to mark this tab as active */
  activePaths: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />,
    activePaths: ['/'],
  },
  {
    label: 'Search',
    href: '/listings',
    icon: <Search className="w-5 h-5" />,
    activePaths: ['/listings', '/city/'],
  },
  {
    label: 'Bookings',
    href: '/my-bookings',
    icon: <CalendarCheck className="w-5 h-5" />,
    activePaths: ['/my-bookings'],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <User className="w-5 h-5" />,
    activePaths: ['/profile', '/provider'],
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem): boolean => {
    if (item.href === '/' && pathname === '/') return true;
    if (item.href === '/') return false;
    return item.activePaths.some((path) => pathname.startsWith(path));
  };

  return (
    /* ═══ MOBILE ONLY — Hidden on md+ screens ═══ */
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden liquid-glass-bar pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-15 max-w-lg mx-auto px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-2xl transition-all ${
                active
                  ? 'text-[#0033CC]'
                  : 'text-gray-400 active:text-gray-600'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon Container with Liquid Glass styling */}
              <div
                className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-all ${
                  active
                    ? 'liquid-glass-droplet text-[#0033CC] scale-105 shadow-sm'
                    : 'text-gray-400'
                }`}
              >
                {item.icon}
                {/* Active neon dot indicator */}
                {active && (
                  <span className="absolute top-0.5 right-1 w-2 h-2 bg-[#CCFF00] rounded-full border border-white shadow-xs" />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] leading-none font-bold tracking-tight ${
                  active ? 'text-[#0033CC]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
