'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ListingBreadcrumbProps {
  city: { name: string; slug: string };
  category: { name: string; slug: string };
  title: string;
  className?: string;
}

export function ListingBreadcrumb({
  city,
  category,
  title,
  className = '',
}: ListingBreadcrumbProps) {
  const cityName = city?.name || 'City';
  const citySlug = city?.slug || 'city';
  const categoryName = category?.name || 'Category';
  const categorySlug = category?.slug || 'services';

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#F0F5FB] border border-white shadow-[0_2px_8px_rgba(30,70,120,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] text-xs overflow-x-auto max-w-full scrollbar-hide ${className}`}
    >
      {/* 1. Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-[#0033CC] font-bold transition-colors shrink-0"
        title="SearchBook Home"
      >
        <Home className="w-3.5 h-3.5 text-gray-500 hover:text-[#0033CC]" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

      {/* 2. City */}
      <Link
        href={`/${citySlug}`}
        className="text-gray-600 hover:text-[#0033CC] font-bold transition-colors shrink-0 truncate max-w-[100px] sm:max-w-[140px]"
        title={`Explore ${cityName}`}
      >
        {cityName}
      </Link>

      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

      {/* 3. Category */}
      <Link
        href={`/${citySlug}/${categorySlug}`}
        className="text-[#0033CC] hover:text-[#002299] font-black transition-colors shrink-0 truncate max-w-[110px] sm:max-w-[160px]"
        title={`${categoryName} in ${cityName}`}
      >
        {categoryName}
      </Link>

      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />

      {/* 4. Active Listing Title */}
      <span
        aria-current="page"
        className="text-gray-800 font-extrabold truncate max-w-[120px] sm:max-w-[200px] md:max-w-[280px]"
        title={title}
      >
        {title}
      </span>
    </nav>
  );
}
