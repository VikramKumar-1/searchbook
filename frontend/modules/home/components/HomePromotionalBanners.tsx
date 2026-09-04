/**
 * ═══════════════════════════════════════════════════════════
 * 📣 PROMOTIONAL BANNERS — Claymorphism Carousel
 * ═══════════════════════════════════════════════════════════
 *
 * 📱 Mobile: Clay-card-dark banners with rounded-3xl, 
 *    puffy inner glow, no heavy blur effects
 * 🖥️ Desktop: Full gradient + image + glassmorphism
 * ═══════════════════════════════════════════════════════════
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export interface PromoBanner {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaBg?: string;
  ctaTextColor?: string;
  bgGradient: string;
  image: string;
  imageAlt: string;
}

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: 'hourly-hotel-promo',
    badge: '⚡ COUPLE FRIENDLY',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    title: 'Hourly Stays From',
    highlightText: '₹199 / 2 Hours',
    subtitle: 'Flexible micro-stays for couples, transit & relaxation. Pay at hotel.',
    ctaText: 'Book Hourly Stay',
    ctaLink: '/listings?category=hourly-hotels',
    ctaBg: 'bg-[#CCFF00] hover:bg-[#b8e600] text-black',
    bgGradient: 'from-[#080E24] via-[#0F1E4A] to-[#002B99]',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Luxury Hourly Hotel Room',
  },
  {
    id: 'pg-flats-promo',
    badge: '🏡 ZERO BROKERAGE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    title: 'Move In Today:',
    highlightText: 'PGs, Hostels & Flats',
    subtitle: 'Verified rooms with WiFi, AC, food & 24/7 security near colleges.',
    ctaText: 'Explore Stays',
    ctaLink: '/listings?category=pg-hostel',
    ctaBg: 'bg-emerald-400 hover:bg-emerald-300 text-black',
    bgGradient: 'from-[#04201A] via-[#08382E] to-[#065F46]',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Modern PG & Hostel Room',
  },
  {
    id: 'partner-listing-promo',
    badge: '💼 LIST FOR FREE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    title: 'Own a Hotel or PG?',
    highlightText: 'List Business Free',
    subtitle: 'Get 10x more bookings. 50,000+ customers. Instant payouts.',
    ctaText: 'Register as Partner',
    ctaLink: '/provider/register',
    ctaBg: 'bg-[#CCFF00] hover:bg-[#b8e600] text-black',
    bgGradient: 'from-[#111827] via-[#1F2937] to-[#111827]',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Hotel Owner Partnering with SearchBook',
  },
];

interface HomePromotionalBannersProps {
  banners?: PromoBanner[];
}

export function HomePromotionalBanners({ banners = DEFAULT_BANNERS }: HomePromotionalBannersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanner = banners[currentIndex] || banners[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    timerRef.current = setInterval(() => { handleNext(); }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, banners.length, handleNext]);

  return (
    <section
      aria-label="Promotions"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══ MOBILE BANNER — Clay card dark ═══ */}
      <div className="md:hidden relative clay-card-dark overflow-hidden transition-all">
        <div className={`relative bg-gradient-to-br ${activeBanner.bgGradient} p-5 min-h-[180px] flex flex-col justify-center rounded-[1.25rem]`}>

          {/* Badge — Clay pill */}
          <div className={`clay-pill inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider mb-2.5 w-fit ${activeBanner.badgeColor}`}>
            <Sparkles className="w-2.5 h-2.5 shrink-0" />
            <span>{activeBanner.badge}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black text-white tracking-tight leading-tight mb-1">
            {activeBanner.title}{' '}
            {activeBanner.highlightText && (
              <span className="text-[#CCFF00]">{activeBanner.highlightText}</span>
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] text-gray-300 font-medium leading-relaxed mb-3 line-clamp-2">
            {activeBanner.subtitle}
          </p>

          {/* CTA — Puffy button */}
          <Link
            href={activeBanner.ctaLink}
            className={`inline-flex items-center gap-1.5 font-black text-[11px] px-4 py-2.5 rounded-xl w-fit active:scale-[0.97] transition-transform ${activeBanner.ctaBg}`}
            style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 3px 10px rgba(0,0,0,0.15)' }}
          >
            <span>{activeBanner.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="flex items-center gap-1.5 mt-3">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-5 bg-[#CCFF00]' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ DESKTOP BANNER — Full design (unchanged) ═══ */}
      <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-all">
        <div className={`relative bg-gradient-to-r ${activeBanner.bgGradient} p-10 lg:p-12 min-h-[300px] flex flex-col justify-center transition-all duration-500`}>

          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5 text-left">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-xs shadow-2xs ${activeBanner.badgeColor}`}>
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>{activeBanner.badge}</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {activeBanner.title}{' '}
                {activeBanner.highlightText && (
                  <span className="text-[#CCFF00] drop-shadow-xs block sm:inline">
                    {activeBanner.highlightText}
                  </span>
                )}
              </h2>

              <p className="text-sm text-gray-300 font-medium max-w-xl leading-relaxed">
                {activeBanner.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={activeBanner.ctaLink}
                  className={`inline-flex items-center gap-2 font-black text-sm px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${activeBanner.ctaBg}`}
                >
                  <span>{activeBanner.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold pl-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified by SearchBook</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm h-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group">
                <img src={activeBanner.image} alt={activeBanner.imageAlt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  ⚡ Instant Booking
                </div>
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <>
              <button type="button" onClick={handlePrev} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer z-20 border border-white/10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={handleNext} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer z-20 border border-white/10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {banners.map((b, idx) => (
                <button key={b.id} onClick={() => setCurrentIndex(idx)} aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'w-7 bg-[#CCFF00]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
