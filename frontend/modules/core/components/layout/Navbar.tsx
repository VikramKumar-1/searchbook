/**
 * ═══════════════════════════════════════════════════════════
 * 🔝 TOP NAVIGATION BAR
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile: Compact header — logo + Partner CTA only.
 *    Primary navigation moved to MobileBottomNav.tsx
 *
 * 🖥️ Desktop: Full navbar with links, auth, and CTA buttons.
 *    Uses glassmorphism (backdrop-blur-lg) for premium feel.
 *
 * Performance:
 * - Mobile uses glass-mobile-dark (solid bg, no blur)
 * - Desktop keeps full backdrop-blur effect
 * ═══════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@frontend/stores/authStore';
import { useCategoryNavStore, CATEGORY_THEMES } from '@frontend/stores/categoryNavStore';
import { useLocationStore } from '@frontend/stores/locationStore';
import { LocationSelectorModal } from '@frontend/modules/home/components/LocationSelectorModal';
import { MobileSearchModal } from '@frontend/modules/home/components/MobileSearchModal';

const navLinks = [
  { label: 'PG & Hostels', href: '/listings?category=pg-hostel' },
  { label: 'Flats', href: '/listings?category=flats' },
  { label: 'Hourly Hotels', href: '/listings?category=hourly-hotels' },
  { label: 'Services', href: '/listings' },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  const mobileTab = useCategoryNavStore((s) => s.mobileCategory);
  const theme = CATEGORY_THEMES[mobileTab] || CATEGORY_THEMES['all'];
  const isHomePage = pathname === '/';

  const selectedCity = useLocationStore((s) => s.selectedCity);
  const selectedLocality = useLocationStore((s) => s.selectedLocality);
  const isNearMeActive = useLocationStore((s) => s.isNearMeActive);
  const openLocationModal = useLocationStore((s) => s.openLocationModal);
  const autoDetectLocation = useLocationStore((s) => s.autoDetectLocation);
  const userCoords = useLocationStore((s) => s.userCoords);

  // Auto-detect GPS location on mount if not yet detected
  React.useEffect(() => {
    if (!userCoords && typeof window !== 'undefined' && 'geolocation' in navigator) {
      autoDetectLocation().catch(() => {});
    }
  }, [userCoords, autoDetectLocation]);

  const segments = pathname.split('/').filter(Boolean);
  const isListingDetailPage =
    pathname.startsWith('/listing/') ||
    (pathname.startsWith('/listings/') && pathname !== '/listings') ||
    (segments.length === 3 && !['provider', 'api', 'admin', 'auth', '_next'].includes(segments[0]));

  return (
    <>
      {/* ═══ MOBILE ONLY — Unified App Header (Hidden on listing detail pages) ═══ */}
      {!isListingDetailPage && (
        <header 
          className={`md:hidden px-4 pt-3 pb-2 transition-all duration-500 ease-out ${
            isHomePage 
              ? `${theme.navBg} border-none` 
              : 'bg-white border-b border-gray-100 shadow-2xs'
          }`}
        >
        <div className="flex items-center justify-between">
          {/* Left: Brand + Location (Unified & Clean, Zero "10 minutes") */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-1">
              <span className="bg-gray-950 text-[#CCFF00] font-black text-xs px-2 py-0.5 rounded-md tracking-wider shadow-2xs">
                Search
              </span>
              <span className="text-gray-950 font-black text-sm tracking-tight">
                Book
              </span>
            </Link>
            
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openLocationModal();
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-800 mt-1 text-left cursor-pointer active:opacity-75"
            >
              <MapPin className="w-3 h-3 text-red-600 fill-red-500 shrink-0" />
              <span className="truncate max-w-[200px] flex items-center gap-1">
                {isNearMeActive ? (
                  <>
                    <span className="text-[#0033CC] font-black">Near Me</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </>
                ) : selectedLocality?.name ? (
                  `${selectedLocality.name}, ${selectedCity.name}`
                ) : (
                  selectedCity.name
                )}
              </span>
              <ChevronDown className="w-2.5 h-2.5 text-gray-600 shrink-0" />
            </button>
          </div>

          {/* Right: Clean Profile Avatar / Account (No fake ₹0 wallet pill) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => (user ? null : openAuthModal('login'))}
              className="w-9 h-9 rounded-full bg-white/95 border border-black/10 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
              aria-label="User Account"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : user ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              ) : (
                <User className="w-4 h-4 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Location Selector Modal */}
      <LocationSelectorModal />

      {/* Mobile Guided Smart Search Modal */}
      <MobileSearchModal />

      {/* ═══ DESKTOP ONLY — Deep Electric Blue Navbar (100% Intact) ═══ */}
      <nav className="hidden md:block sticky top-0 z-50 bg-[#0033CC]/95 backdrop-blur-lg border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-14">

          {/* Logo + Desktop Location Selector */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-1">
              <span className="bg-[#CCFF00] text-black font-black text-sm px-1.5 py-0.5 rounded">Search</span>
              <span className="text-white font-black text-sm">Book</span>
            </a>

            {/* Desktop Location Selector Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openLocationModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-xs"
              title="Click to select location or Near Me"
            >
              <MapPin className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate max-w-[170px] text-white flex items-center gap-1.5">
                {isNearMeActive ? (
                  <>
                    <span className="font-extrabold text-[#CCFF00]">Near Me</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                  </>
                ) : selectedLocality?.name ? (
                  `${selectedLocality.name}, ${selectedCity.name}`
                ) : (
                  selectedCity.name
                )}
              </span>
              <ChevronDown className="w-3 h-3 text-white/70 shrink-0" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-7">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Auth & CTA */}
          <div className="flex items-center gap-4">
            <a
              href="/my-bookings"
              className="text-white/80 hover:text-white text-xs font-bold transition-colors"
            >
              My Bookings
            </a>

            {user ? (
              <>
                <a
                  href="/profile"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition-all text-white text-xs font-bold group"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#CCFF00] text-black font-black text-[10px] flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="group-hover:text-[#CCFF00] transition-colors">{user.name.split(' ')[0]}</span>
                </a>

                <button
                  onClick={logout}
                  className="text-white/60 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Logout
                </button>

                {user.role === 'PROVIDER' ? (
                  <a
                    href="/provider/dashboard"
                    className="bg-[#CCFF00] text-black font-extrabold text-xs px-5 py-2 rounded-lg hover:brightness-110 transition-all"
                  >
                    Dashboard
                  </a>
                ) : (
                  <a
                    href="/provider/register"
                    className="bg-[#CCFF00] text-black font-extrabold text-xs px-5 py-2 rounded-lg hover:brightness-110 transition-all"
                  >
                    Partner with Us
                  </a>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-white/60 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <a
                  href="/provider/register"
                  className="bg-[#CCFF00] text-black font-extrabold text-xs px-5 py-2 rounded-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  Partner with Us
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
