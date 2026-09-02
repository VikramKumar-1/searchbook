'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

const stayCategories = [
  { 
    title: 'PG & Hostels', 
    subtitle: 'Boys · Girls · Co-Living',
    slug: 'pg-hostel',
    emoji: '🏠',
    gradient: 'from-orange-500 to-rose-500',
    listings: '2,400+',
    span: 'col-span-2 row-span-2',  // Hero card
  },
  { 
    title: 'Flats & Rooms', 
    subtitle: '1RK · 1BHK · 2BHK · Sharing',
    slug: 'flats',
    emoji: '🏢',
    gradient: 'from-blue-600 to-indigo-600',
    listings: '3,100+',
    span: 'col-span-2',
  },
  { 
    title: 'Mess & Tiffin', 
    subtitle: 'Veg · Non-Veg · Diet Meals',
    slug: 'mess-tiffin',
    emoji: '🍱',
    gradient: 'from-emerald-500 to-teal-600',
    listings: '1,800+',
    span: 'col-span-1',
  },
  { 
    title: 'Hourly Hotels', 
    subtitle: 'Couple Friendly · Transit',
    slug: 'hourly-hotels',
    emoji: '🏨',
    gradient: 'from-violet-500 to-purple-600',
    listings: '890+',
    span: 'col-span-1',
  },
];

const serviceCategories = [
  { title: 'Plumber', emoji: '🔧', slug: 'plumber', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { title: 'Electrician', emoji: '⚡', slug: 'electrician', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { title: 'Maid', emoji: '🧹', slug: 'maid', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { title: 'Gas Delivery', emoji: '🔥', slug: 'gas-delivery', color: 'bg-red-50 text-red-700 border-red-200' },
  { title: 'Water Supply', emoji: '💧', slug: 'water-supply', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { title: 'Pest Control', emoji: '🐛', slug: 'pest-control', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { title: 'AC Repair', emoji: '❄️', slug: 'ac-repair', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { title: 'Carpenter', emoji: '🪚', slug: 'carpenter', color: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export function CategoriesSection() {
  return (
    <section className="bg-white py-14 md:py-20 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ─── SECTION 1: Stay & Living ─── */}
        <div className="mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Stay & Living</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Find your next home
              </h2>
            </div>
            <a href="/listings" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors hidden md:flex items-center gap-1 group">
              Explore all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
            {stayCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`/listings?category=${cat.slug}`}
                className={`${cat.span} group relative bg-gradient-to-br ${cat.gradient} rounded-2xl p-5 md:p-6 flex flex-col justify-end overflow-hidden cursor-pointer`}
              >
                {/* Background emoji watermark */}
                <span className="absolute top-3 right-3 md:top-4 md:right-4 text-4xl md:text-5xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none pointer-events-none">
                  {cat.emoji}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  <span className="inline-block text-white/60 text-[11px] font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2 border border-white/10">
                    {cat.listings} listings
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 font-medium">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
              </a>
            ))}
          </div>
        </div>

        {/* ─── SECTION 2: Home Services ─── */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Home Services</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Get it done today
              </h2>
            </div>
          </div>

          {/* Horizontal scrollable pills on mobile, wrapped grid on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible">
            {serviceCategories.map((svc) => (
              <a
                key={svc.slug}
                href={`/listings?category=${svc.slug}`}
                className={`flex items-center gap-3 ${svc.color} border rounded-xl px-5 py-4 hover:shadow-md transition-all duration-200 cursor-pointer shrink-0 group`}
              >
                <span className="text-2xl select-none">{svc.emoji}</span>
                <span className="text-sm font-semibold whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
                  {svc.title}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
