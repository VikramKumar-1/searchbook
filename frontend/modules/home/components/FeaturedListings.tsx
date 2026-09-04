/**
 * Featured Listings Component
 * 
 * Responsive Behavior:
 * - Mobile (md:hidden): Displays first 4 cards in a horizontal scroll using mobile-scroll-x.
 * - Desktop (md:grid): Displays all 8 cards in a standard multi-column grid layout.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useListings, ListingCardItem } from '@frontend/modules/listing/hooks/useListings';
import { ListingCard } from '@frontend/modules/listing/components/ListingCard';
import { Loader2 } from 'lucide-react';

export function FeaturedListings() {
  const { data, isLoading, isError, error } = useListings({ page: 1, limit: 8 });

  // Generate mock data if API is empty
  const displayData: ListingCardItem[] = data?.data && data.data.length > 0 
    ? data.data.slice(0, 8) 
    : Array.from({ length: 8 }).map((_, i) => ({
        id: `mock-feat-${i}`,
        title: `Premium Verified Listing ${i + 1}`,
        slug: `mock-feat-${i}`,
        price: 8500 + (i * 500),
        priceType: 'PER_MONTH',
        address: 'City Center',
        latitude: 28.6139,
        longitude: 77.2090,
        photos: [],
        city: { id: 'city1', name: 'Delhi NCR', slug: 'delhi' },
        category: { id: 'cat1', name: 'Top Rated', slug: 'top', icon: null },
        contactPhone: '9876543210',
        contactWhatsApp: '9876543210',
        _count: { reviews: 24 + i }
      }));

  // Alternate fallback images for featured section to make it look dynamic
  const fallbackImages = [
    '/services/flat.jpg',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop',
    '/services/tiffin.jpg',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
  ];

  return (
    <section className="clay-bg-mint md:bg-white py-6 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1">Trending</p>
            <h2 className="text-lg md:text-4xl font-black text-[#0f172a] tracking-tight">
              Featured Listings
            </h2>
          </div>
          <Link href="/listings" className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block">
            View all →
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#0033CC] mb-3" />
            <p className="text-gray-400 text-sm font-medium">Loading listings...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 text-red-500 p-5 rounded-xl border border-red-100 text-center text-sm font-medium">
            {error.message}
          </div>
        )}

        {/* Listings Display */}
        {!isLoading && !isError && (
          <>
            {/* ═══ MOBILE LAYOUT — Horizontal scroll cards ═══ */}
            <div className="md:hidden mobile-scroll-x will-change-scroll px-5 -mx-5">
              {displayData.slice(0, 4).map((listing: ListingCardItem, index: number) => {
                const fallback = fallbackImages[index % fallbackImages.length];
                return (
                  <div key={listing.id} className="w-[260px]">
                    <ListingCard 
                      listing={listing} 
                      fallbackImage={fallback}
                    />
                  </div>
                );
              })}
            </div>

            {/* ═══ DESKTOP LAYOUT — Grid ═══ */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayData.map((listing: ListingCardItem, index: number) => {
                const fallback = fallbackImages[index % fallbackImages.length];
                return (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    fallbackImage={fallback}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
