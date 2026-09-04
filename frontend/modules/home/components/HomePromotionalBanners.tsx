/**
 * ═══════════════════════════════════════════════════════════
 * 📣 PROMOTIONAL BANNERS — Industry Standard Clean UI
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile: Pixel-perfect, compact 2-column card (124px height)
 *    - Strict fixed height container: 0 Layout Shift (no jumps)
 *    - Clean, modern, high-contrast pastel cards with subtle borders
 *    - Real product trust badges (ShieldCheck, CheckCircle2, Building2, Briefcase)
 *    - Rounded photo with floating price/feature pill
 *    - Touch swipe gesture support for smooth carousel sliding
 * 🖥️ Desktop: Premium gradient banner with verified badges & clear CTA
 * ═══════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface PromoBanner {
  id: string;
  title: string;
  highlightText: string;
  highlightColor: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaBg: string;
  cardBg: string;
  desktopBgGradient: string;
  accentDotColor: string;
  image: string;
  imageAlt: string;
}

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: 'pg-hostel',
    title: 'PGs & Hostels',
    highlightText: 'Zero Brokerage',
    highlightColor: '#F8CB46',
    subtitle: 'Direct from owners · Verified rooms',
    ctaText: 'Explore PGs',
    ctaLink: '/listings?category=pg-hostel',
    ctaBg: 'bg-[#F8CB46] hover:bg-[#EAC038] text-zinc-950 font-extrabold',
    cardBg: 'bg-[#151816] border border-zinc-800/90',
    desktopBgGradient: 'from-[#121513] via-[#181D1A] to-[#121513]',
    accentDotColor: 'bg-[#F8CB46]',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Modern PG Room',
  },
  {
    id: 'hourly-hotels',
    title: 'Hourly Hotels',
    highlightText: 'Pay Only For Hours',
    highlightColor: '#FBBF24',
    subtitle: '100% Couple Safe · Pay at hotel',
    ctaText: 'Book Hourly',
    ctaLink: '/listings?category=hourly-hotels',
    ctaBg: 'bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold',
    cardBg: 'bg-[#14161C] border border-zinc-800/90',
    desktopBgGradient: 'from-[#111319] via-[#171B24] to-[#111319]',
    accentDotColor: 'bg-[#FBBF24]',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Hourly Hotel Stay',
  },
  {
    id: 'flats-rent',
    title: '1 & 2 BHK Flats',
    highlightText: '0 Broker Fee',
    highlightColor: '#F8CB46',
    subtitle: 'Near IT hubs & top colleges',
    ctaText: 'View Flats',
    ctaLink: '/listings?category=flats',
    ctaBg: 'bg-[#F8CB46] hover:bg-[#EAC038] text-zinc-950 font-extrabold',
    cardBg: 'bg-[#171615] border border-zinc-800/90',
    desktopBgGradient: 'from-[#141312] via-[#1C1A18] to-[#141312]',
    accentDotColor: 'bg-[#F8CB46]',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Furnished Flat',
  },
  {
    id: 'partner-register',
    title: 'Property Owners',
    highlightText: 'List 100% Free',
    highlightColor: '#34D399',
    subtitle: '50,000+ tenants · 0% commission',
    ctaText: 'List Property',
    ctaLink: '/provider/register',
    ctaBg: 'bg-[#34D399] hover:bg-[#2BB885] text-zinc-950 font-extrabold',
    cardBg: 'bg-[#141716] border border-zinc-800/90',
    desktopBgGradient: 'from-[#111413] via-[#161C19] to-[#111413]',
    accentDotColor: 'bg-[#34D399]',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Property Owner Partner',
  },
];

interface HomePromotionalBannersProps {
  banners?: PromoBanner[];
}

export function HomePromotionalBanners({ banners = DEFAULT_BANNERS }: HomePromotionalBannersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const activeBanner = banners[currentIndex] || banners[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, banners.length, handleNext]);

  // Touch swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-label="Promotions"
      className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 md:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══ MOBILE BANNER — AUTHENTIC BLINKIT CARBON CARD (ZERO JUMP) ═══ */}
      <div
        className="md:hidden relative h-[116px] w-full rounded-2xl overflow-hidden select-none shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner, idx) => {
          const isActive = currentIndex === idx;
          return (
            <Link
              key={banner.id}
              href={banner.ctaLink}
              className={`absolute inset-0 p-3.5 flex items-center justify-between gap-3 transition-opacity duration-300 ease-out cursor-pointer ${
                isActive
                  ? 'opacity-100 pointer-events-auto z-10'
                  : 'opacity-0 pointer-events-none z-0'
              } ${banner.cardBg}`}
            >
              {/* Left Column: Clean Typography & Tactile Action */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 z-10 pr-1">
                <div className="space-y-0.5">
                  <h2 className="text-[16px] sm:text-[17px] font-display font-extrabold text-white tracking-tight leading-tight truncate">
                    {banner.title}
                  </h2>

                  <p
                    className="text-[13px] sm:text-[14px] font-display font-extrabold tracking-tight truncate"
                    style={{ color: banner.highlightColor }}
                  >
                    {banner.highlightText}
                  </p>
                </div>

                <p className="text-[11px] text-zinc-400 font-medium truncate">
                  {banner.subtitle}
                </p>

                {/* Real Blinkit Tactile Mini-Pill CTA */}
                <div className="pt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] px-2.5 py-0.5 rounded-md shadow-xs active:scale-95 transition-transform ${banner.ctaBg}`}
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </div>
              </div>

              {/* Right Column: Clean Photo Thumbnail */}
              <div className="w-[80px] h-[80px] sm:w-[86px] sm:h-[86px] shrink-0 rounded-xl overflow-hidden border border-zinc-700/60 shadow-xs relative bg-zinc-900">
                <img
                  src={banner.image}
                  alt={banner.imageAlt}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          );
        })}

        {/* Minimal Bottom Pagination Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 z-20 pointer-events-none">
            {banners.map((_, dotIdx) => {
              const isDotActive = currentIndex === dotIdx;
              return (
                <div
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isDotActive
                      ? `w-4 ${activeBanner.accentDotColor}`
                      : 'w-1 bg-zinc-600'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ DESKTOP BANNER — Authentic Matte Carbon Hero ═══ */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden shadow-xl border border-zinc-800 transition-all">
        <div
          className={`relative bg-gradient-to-r ${activeBanner.desktopBgGradient} p-8 lg:p-9 min-h-[220px] flex flex-col justify-center transition-all duration-500`}
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2.5 text-left">
              <h2 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tight leading-tight">
                {activeBanner.title}{' '}
                <span
                  style={{ color: activeBanner.highlightColor }}
                  className="font-display font-black"
                >
                  · {activeBanner.highlightText}
                </span>
              </h2>

              <p className="text-sm text-zinc-300 font-medium max-w-lg leading-relaxed">
                {activeBanner.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={activeBanner.ctaLink}
                  className={`inline-flex items-center gap-2 font-display font-black text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${activeBanner.ctaBg}`}
                >
                  <span>{activeBanner.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 relative flex justify-end">
              <div className="relative w-48 h-40 lg:w-56 lg:h-44 rounded-xl overflow-hidden shadow-2xl border border-zinc-700/60 bg-zinc-900">
                <img
                  src={activeBanner.image}
                  alt={activeBanner.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-zinc-700/60"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-zinc-700/60"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? `w-6 ${activeBanner.accentDotColor}`
                      : 'w-1.5 bg-zinc-600 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


