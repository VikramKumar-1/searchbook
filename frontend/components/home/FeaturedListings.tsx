'use client';

import React from 'react';
import { useListings } from '@frontend/modules/listing/hooks/useListings';
import { ListingCard } from '@frontend/modules/listing/components/ListingCard';
import { Loader2 } from 'lucide-react';

type ListingCardData = {
  id: string;
  title: string;
  slug: string;
  price: string | number;
  priceType: string;
  photos: string[];
  city: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string; icon: string | null };
  _count: { reviews: number };
};

export function FeaturedListings() {
  const { data, isLoading, isError, error } = useListings({ page: 1, limit: 8 });

  // Generate mock data if API is empty
  const displayData = data?.data && data.data.length > 0 
    ? data.data.slice(0, 8) 
    : Array.from({ length: 8 }).map((_, i) => ({
        id: `mock-feat-${i}`,
        title: `Premium Verified Listing ${i + 1}`,
        slug: `mock-feat-${i}`,
        price: 8500 + (i * 500),
        priceType: 'MONTH',
        photos: [],
        city: { id: 'city1', name: 'Delhi NCR', slug: 'delhi' },
        category: { id: 'cat1', name: 'Top Rated', slug: 'top', icon: null },
        _count: { reviews: 24 + i }
      }));

  return (
    <section className="bg-white py-14 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1">Trending</p>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tight">
              Featured Listings
            </h2>
          </div>
          <a href="/listings" className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block">
            View all →
          </a>
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

        {/* Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayData.map((listing: ListingCardData, index: number) => {
              // Alternate fallback images for featured section to make it look dynamic
              const images = [
                '/api/services/flat',
                'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop',
                '/api/services/tiffin',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
              ];
              const fallback = images[index % images.length];

              return (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  fallbackImage={fallback}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
