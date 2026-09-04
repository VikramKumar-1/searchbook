/**
 * CategoryListings Component
 * 
 * Mobile Layout: Uses horizontal scrolling list (`mobile-scroll-x`) with fixed width snap cards (260px)
 * Desktop Layout: Uses standard CSS grid (md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
 * Both layouts use the same ListingCard component underneath.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useListings, ListingCardItem } from '@frontend/modules/listing/hooks/useListings';
import { ListingCard } from '@frontend/modules/listing/components/ListingCard';
import { Loader2 } from 'lucide-react';

interface CategoryListingsProps {
  title: string;
  subtitle: string;
  categorySlug?: string;
  pageParam?: number;
  bgWhite?: boolean;
  fallbackImage?: string;
}

export function CategoryListings({
  title,
  subtitle,
  categorySlug,
  pageParam = 1,
  bgWhite = false,
  fallbackImage,
}: CategoryListingsProps) {
  const { data, isLoading, isError, error } = useListings({
    categorySlug: categorySlug || undefined,
    page: pageParam,
    limit: 4,
  });

  // If real listings exist in this category, display them
  const hasRealData = data?.data && data.data.length > 0;
  const displayData: ListingCardItem[] = hasRealData
    ? data.data.slice(0, 4)
    : Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-${categorySlug || pageParam}-${i}`,
        title: `Premium ${title.split(' ')[0]} in City Center`,
        slug: `mock-${categorySlug || pageParam}-${i}`,
        price: 4500 + i * 1000,
        priceType: 'PER_MONTH',
        address: 'City Center',
        latitude: 28.6139,
        longitude: 77.2090,
        photos: [],
        city: { id: 'city1', name: 'Delhi NCR', slug: 'delhi' },
        category: { id: 'cat1', name: title.split(' ')[0], slug: categorySlug || 'cat', icon: null },
        contactPhone: '9876543210',
        contactWhatsApp: '9876543210',
        _count: { reviews: 12 + i },
      }));

  const exploreUrl = categorySlug ? `/listings?category=${categorySlug}` : '/listings';

  return (
    <section className={`${bgWhite ? 'clay-bg-mint md:bg-white' : 'clay-bg-blue md:bg-[#FAFBFD]'} py-6 md:py-14 px-4 md:px-8 border-b border-gray-100/80`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1">{subtitle}</p>
            <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href={exploreUrl}
            className="text-sm font-bold text-[#0033CC] hover:underline hidden md:block shrink-0 ml-4"
          >
            View all →
          </Link>
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
            {error?.message || 'Failed to load listings'}
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {/* ═══ MOBILE LAYOUT — Horizontal scroll ═══ */}
            <div className="md:hidden mobile-scroll-x will-change-scroll px-5 -mx-5">
              {displayData.map((listing: ListingCardItem) => (
                <div key={listing.id} className="w-[260px]">
                  <ListingCard listing={listing} fallbackImage={fallbackImage} />
                </div>
              ))}
            </div>

            {/* ═══ DESKTOP LAYOUT — Grid ═══ */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayData.map((listing: ListingCardItem) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  fallbackImage={fallbackImage}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
