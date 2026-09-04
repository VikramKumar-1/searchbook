import React from 'react';

export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFD] animate-pulse">
      {/* ── MOBILE SKELETON (md:hidden) ── */}
      <div className="block md:hidden pb-24">
        {/* Top Sticky Bar Skeleton */}
        <div className="sticky top-0 z-30 h-14 bg-white/90 border-b border-gray-100 px-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-32 bg-gray-200 rounded-md" />
              <div className="h-2 w-20 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-200" />
        </div>

        {/* Hero Photo Carousel Skeleton */}
        <div className="relative w-full aspect-[4/3] bg-gray-300" />

        {/* Title Clay Card Skeleton */}
        <div className="relative z-10 -mt-3 mx-3 rounded-[26px] p-4 bg-white border-2 border-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-blue-100 rounded-full" />
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-100 rounded-[18px]" />
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <div className="h-6 w-16 bg-gray-100 rounded-xl" />
            <div className="h-6 w-24 bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Quick Specs Clay Skeleton */}
        <div className="mx-3 mt-3 p-4 rounded-[26px] bg-white border-2 border-white shadow-sm space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded-md" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-20 bg-gray-100 rounded-2xl" />
            <div className="h-20 bg-gray-100 rounded-2xl" />
            <div className="h-20 bg-gray-100 rounded-2xl" />
            <div className="h-20 bg-gray-100 rounded-2xl" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mx-3 mt-3 p-4 rounded-[26px] bg-white border-2 border-white shadow-sm space-y-2.5">
          <div className="h-4 w-28 bg-gray-200 rounded-md" />
          <div className="h-3 w-full bg-gray-100 rounded-md" />
          <div className="h-3 w-5/6 bg-gray-100 rounded-md" />
          <div className="h-3 w-4/6 bg-gray-100 rounded-md" />
        </div>

        {/* Sticky Bottom Bar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
            <div className="h-3 w-16 bg-gray-100 rounded-md" />
          </div>
          <div className="h-12 w-36 bg-[#0033CC]/30 rounded-2xl" />
        </div>
      </div>

      {/* ── DESKTOP SKELETON (hidden md:block) ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-8 w-80 bg-gray-200 rounded-full" />

        {/* Title & Info Bar Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-blue-100 rounded-full" />
              <div className="h-6 w-32 bg-emerald-100 rounded-full" />
            </div>
            <div className="h-9 w-2/3 bg-gray-200 rounded-xl" />
            <div className="flex gap-3">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-48 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="h-11 w-32 bg-gray-200 rounded-2xl" />
        </div>

        {/* Photo Gallery Grid Skeleton */}
        <div className="h-[460px] rounded-[36px] bg-gray-200 overflow-hidden grid grid-cols-4 gap-2.5 p-2.5">
          <div className="col-span-2 h-full bg-gray-300 rounded-2xl" />
          <div className="col-span-2 grid grid-cols-2 gap-2.5 h-full">
            <div className="bg-gray-300 rounded-2xl" />
            <div className="bg-gray-300 rounded-2xl" />
            <div className="bg-gray-300 rounded-2xl" />
            <div className="bg-gray-300 rounded-2xl" />
          </div>
        </div>

        {/* Content & Sticky Sidebar Grid */}
        <div className="grid grid-cols-3 gap-8 pt-4">
          <div className="col-span-2 space-y-6">
            <div className="h-36 rounded-[36px] bg-white border-2 border-white p-6" />
            <div className="h-64 rounded-[36px] bg-white border-2 border-white p-6" />
            <div className="h-48 rounded-[36px] bg-white border-2 border-white p-6" />
          </div>
          <div className="col-span-1">
            <div className="h-[480px] rounded-[36px] bg-white border-2 border-white p-6 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
