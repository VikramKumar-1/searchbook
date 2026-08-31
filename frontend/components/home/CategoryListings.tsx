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

interface CategoryListingsProps {
  title: string;
  subtitle: string;
  pageParam: number;
  bgWhite?: boolean;
  fallbackImage?: string;
}

export function CategoryListings({ title, subtitle, pageParam, bgWhite = false, fallbackImage }: CategoryListingsProps) {
  const { data, isLoading, isError, error } = useListings({ page: pageParam, limit: 4 });

  // Generate mock data if API is empty for this page
  const displayData = data?.data && data.data.length > 0 
    ? data.data.slice(0, 4) 
    : Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-${pageParam}-${i}`,
        title: `Premium ${title.split(' ')[0]} in City Center`,
        slug: `mock-${pageParam}-${i}`,
        price: 4500 + (i * 1000),
        priceType: 'MONTH',
        photos: [],
        city: { id: 'city1', name: 'Delhi NCR', slug: 'delhi' },
        category: { id: 'cat1', name: title.split(' ')[0], slug: 'cat', icon: null },
        _count: { reviews: 12 + i }
      }));

  return (
    <section className={`${bgWhite ? 'bg-white' : 'bg-[#FAFBFD]'} py-14 px-5 md:px-8 border-b border-gray-100/80`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1">{subtitle}</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
              {title}
            </h2>
          </div>
          <a href="/listings" className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block shrink-0 ml-4">
            View all →
          </a>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0033CC] mb-3" />
            <p className="text-gray-400 text-sm font-medium">Loading {title.toLowerCase()}...</p>
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
            {displayData.map((listing: ListingCardData) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                fallbackImage={fallbackImage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
