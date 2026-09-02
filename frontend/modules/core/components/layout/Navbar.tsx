'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@frontend/stores/authStore';

const navLinks = [
  { label: 'PG & Hostels', href: '/listings?category=pg-hostel' },
  { label: 'Flats', href: '/listings?category=flats' },
  { label: 'Hourly Hotels', href: '/listings?category=hourly-hotels' },
  { label: 'Services', href: '/listings' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="sticky top-0 z-50 bg-[#0033CC]/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1">
          <span className="bg-[#CCFF00] text-black font-black text-sm px-1.5 py-0.5 rounded">Search</span>
          <span className="text-white font-black text-sm">Book</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/my-bookings"
            className="text-white/80 hover:text-white text-xs font-bold transition-colors"
          >
            My Bookings
          </a>

          {user ? (
            <>
              <span className="text-white/80 text-xs font-bold">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="text-white/60 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Logout
              </button>
              <a
                href="/provider/dashboard"
                className="bg-[#CCFF00] text-black font-extrabold text-xs px-5 py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Dashboard
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="text-white/60 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register', '/provider/onboarding')}
                className="bg-[#CCFF00] text-black font-extrabold text-xs px-5 py-2 rounded-lg hover:brightness-110 transition-all cursor-pointer"
              >
                List Business
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden text-white/80 cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#002299] border-t border-white/10 px-5 py-4 space-y-2">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block text-white/70 hover:text-white text-sm font-bold py-1.5">{l.label}</a>
          ))}
          <a href="/my-bookings" className="block text-white/90 font-bold text-sm py-1.5 border-t border-white/10 pt-2">
            🏨 My Bookings
          </a>
          <div className="pt-2 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <span className="block text-white/80 text-sm font-bold py-1.5">Hi, {user.name}</span>
                <button onClick={logout} className="block text-white/70 text-sm font-bold py-1.5 w-full text-left cursor-pointer">Logout</button>
                <a href="/provider/dashboard" className="block bg-[#CCFF00] text-black font-extrabold text-sm px-5 py-2.5 rounded-lg w-full text-center">Dashboard</a>
              </>
            ) : (
              <>
                <button onClick={() => { openAuthModal('login'); setOpen(false); }} className="block text-white/70 text-sm font-bold py-1.5 w-full text-left cursor-pointer">Sign In</button>
                <button onClick={() => { openAuthModal('register', '/provider/onboarding'); setOpen(false); }} className="bg-[#CCFF00] text-black font-extrabold text-sm px-5 py-2.5 rounded-lg w-full cursor-pointer">List Business</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
