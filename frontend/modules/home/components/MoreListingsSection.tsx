'use client';

import React from 'react';
import { useListings, ListingCardItem } from '@frontend/modules/listing/hooks/useListings';
import { ListingCard } from '@frontend/modules/listing/components/ListingCard';
import { Loader2 } from 'lucide-react';

export function MoreListingsSection() {
  const { data, isLoading, isError, error } = useListings({ page: 2, limit: 4 });

  return (
    <section className="bg-[#FAFBFD] py-14 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#0033CC] uppercase tracking-widest mb-1">Discover Daily Needs</p>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight max-w-3xl">
              More Services & Living Spaces
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Explore trusted accommodations, rentals, and hyperlocal home maintenance nearby
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0033CC]" />
            <span className="text-xs font-bold text-gray-400">Finding recommendations...</span>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 text-red-500 p-5 rounded-xl border border-red-100 text-center text-sm font-medium">
            {error.message}
          </div>
        )}

        {/* Grid */}
        {data?.data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.data.length === 0 ? (
              <div className="col-span-full py-14 text-center">
                <p className="text-gray-300 text-base font-bold">No new listings</p>
              </div>
            ) : (
              data.data.slice(0, 4).map((listing: ListingCardItem) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
