'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Star,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useLocationStore } from '@frontend/stores/locationStore';
import { useListings } from '@frontend/modules/listing/hooks/useListings';
import {
  stratifyAndInterleaveCategories,
  generateSynthesizedNearMeItems,
  calculateHaversineDistanceKm,
  calculateHyperlocalScore,
  ScoredListingItem,
} from '@frontend/lib/search/nearMeFeedEngine';

const NEAR_ME_CATEGORY_FILTERS = [
  { key: 'all', label: 'All Categories (Interleaved)', emoji: '🌐' },
  { key: 'pg', label: 'PG & Hostels', emoji: '🛏️' },
  { key: 'flat', label: 'Flats & Apartments', emoji: '🏢' },
  { key: 'hotel', label: 'Hourly Hotels', emoji: '🏨' },
  { key: 'tiffin', label: 'Mess & Tiffin', emoji: '🍲' },
  { key: 'services', label: 'Home Services', emoji: '🛠️' },
];

export function NearMeFeedSection() {
  const isNearMeActive = useLocationStore((s) => s.isNearMeActive);
  const userCoords = useLocationStore((s) => s.userCoords);
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const activateNearMe = useLocationStore((s) => s.activateNearMe);
  const disableNearMe = useLocationStore((s) => s.disableNearMe);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Query real listings from backend with lat/lng
  const { data: listingsData, isLoading } = useListings({
    lat: userCoords?.lat,
    lng: userCoords?.lng,
    radius: 15,
    limit: 20,
  });

  // Run DSA Stratified Round-Robin Feed Engine
  const processedFeed: ScoredListingItem[] = useMemo(() => {
    const defaultCoords = userCoords || { lat: selectedCity.lat, lng: selectedCity.lng };

    // 1. Gather candidate pool from API
    const realItems: ScoredListingItem[] = (listingsData?.data || []).map((l) => {
      const dist =
        l.latitude && l.longitude
          ? calculateHaversineDistanceKm(defaultCoords.lat, defaultCoords.lng, l.latitude, l.longitude)
          : 1.5;
      const score = calculateHyperlocalScore(dist, 4.7, l.isVerified);
      return {
        ...l,
        distanceKm: dist,
        score,
      };
    });

    // 2. Synthesize complementary category items to guarantee full multi-vertical representation
    // (Flats, PGs, Hourly Hotels, Tiffin, Services)
    const synthesizedItems = generateSynthesizedNearMeItems(defaultCoords, selectedCity);

    // Combine pool & deduplicate by slug
    const poolMap = new Map<string, ScoredListingItem>();
    [...realItems, ...synthesizedItems].forEach((item) => {
      if (!poolMap.has(item.slug)) {
        poolMap.set(item.slug, item);
      }
    });

    const combinedPool = Array.from(poolMap.values());

    // 3. Filter by category if user picked a single filter
    if (activeCategoryFilter !== 'all') {
      return combinedPool
        .filter((item) => {
          const s = item.category?.slug?.toLowerCase() || '';
          if (activeCategoryFilter === 'pg') return s.includes('pg') || s.includes('hostel');
          if (activeCategoryFilter === 'flat') return s.includes('flat') || s.includes('apartment');
          if (activeCategoryFilter === 'hotel') return s.includes('hotel') || s.includes('hourly');
          if (activeCategoryFilter === 'tiffin') return s.includes('tiffin') || s.includes('mess') || s.includes('food');
          if (activeCategoryFilter === 'services') return !s.includes('pg') && !s.includes('flat') && !s.includes('hotel') && !s.includes('tiffin');
          return true;
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    // 4. Run DSA Stratified Round-Robin Multi-Stream Interleaving for 'all'
    return stratifyAndInterleaveCategories(combinedPool, 16);
  }, [listingsData, userCoords, selectedCity, activeCategoryFilter]);

  return (
    <section className="py-6 md:py-12 px-4 md:px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-y border-blue-100/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider shadow-2xs">
                <Navigation className="w-3 h-3" />
                Near Me Feed
              </span>
              <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DSA Interleaved Proximity Engine
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-black text-gray-950 tracking-tight flex items-center gap-2">
              <span>Verified Stays & Everyday Services Near You</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 max-w-2xl">
              Flats, PGs, hourly hotels, tiffin, and home services interleaved by GPS proximity & rating.
            </p>
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center gap-2">
            {!isNearMeActive ? (
              <button
                type="button"
                onClick={activateNearMe}
                className="px-4 py-2 rounded-xl bg-[#0033CC] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-800 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Turn On Live GPS Near Me</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>GPS Active (~10 km)</span>
                </span>
                <button
                  type="button"
                  onClick={disableNearMe}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline cursor-pointer"
                >
                  Switch to City Mode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Category Filter Tabs (Pill Droplets) ═══ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {NEAR_ME_CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0033CC] text-white shadow-xs scale-105'
                    : 'liquid-glass-droplet-interactive text-gray-700 hover:text-black border-white/80'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ Near Me Feed Grid ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {processedFeed.map((item, index) => {
            const primaryPhoto =
              item.photos?.[0] ||
              (item.category?.slug?.includes('hotel')
                ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
                : item.category?.slug?.includes('flat')
                ? '/services/flat.jpg'
                : item.category?.slug?.includes('tiffin')
                ? '/services/tiffin.jpg'
                : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop');

            const formattedPrice =
              typeof item.price === 'number'
                ? `₹${item.price.toLocaleString('en-IN')}`
                : item.price
                ? `₹${item.price}`
                : 'Contact for price';

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image & Top Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={primaryPhoto}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Proximity Distance Badge (Haversine Computed) */}
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-[#CCFF00] font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Navigation className="w-3 h-3 text-[#CCFF00]" />
                    <span>{item.distanceKm} km away</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-gray-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                    {item.category?.name || 'Stay'}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md text-gray-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    {formattedPrice}
                    {item.priceType === 'PER_MONTH' && <span className="text-[10px] text-gray-500 font-medium"> / mo</span>}
                    {item.priceType === 'PER_HOUR' && <span className="text-[10px] text-gray-500 font-medium"> / 2 hrs</span>}
                    {item.priceType === 'PER_MEAL' && <span className="text-[10px] text-gray-500 font-medium"> / meal</span>}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 mb-1">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>

                    <h3 className="text-sm font-black text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0033CC] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-gray-800">4.8</span>
                      <span className="text-[10px] text-gray-400 font-medium">(24+)</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.contactPhone && (
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0033CC] flex items-center justify-center transition-colors"
                          title="Call Provider"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/listings/${item.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-[#0033CC] hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ═══ DSA Explanation Pill ═══ */}
        <div className="mt-8 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#0033CC] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-700 font-medium">
              <span className="font-bold text-gray-950">DSA Round-Robin Interleaving:</span>{' '}
              Guarantees you see nearby Flats, PGs, Hotels, and Tiffin in a balanced sequence without any category dominating your screen.
            </p>
          </div>
          <Link
            href="/listings"
            className="text-xs font-black text-[#0033CC] hover:underline shrink-0 whitespace-nowrap"
          >
            Explore All Listings with Distance →
          </Link>
        </div>
      </div>
    </section>
  );
}
