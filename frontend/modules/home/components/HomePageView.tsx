/**
 * ═══════════════════════════════════════════════════════════
 * 🏠 HOME PAGE VIEW (Client Component Orchestrator)
 * ═══════════════════════════════════════════════════════════
 *
 * Handles responsive layout switching between:
 * - Desktop: Always displays full homepage overview sections.
 * - Mobile:
 *   - 'all' tab: Displays standard overview (banners, services, featured, cities).
 *   - Specific category tab (e.g., 'pg-hostel'): Hides generic "all" sections
 *     and renders 4 targeted horizontal 10-card sub-sections for that category.
 * ═══════════════════════════════════════════════════════════
 */
'use client';

import React from 'react';
import { HeroSection } from '@frontend/modules/home/components/HeroSection';
import { HomePromotionalBanners } from '@frontend/modules/home/components/HomePromotionalBanners';
import { PopularServices } from '@frontend/modules/home/components/PopularServices';
import { FeaturedListings } from '@frontend/modules/home/components/FeaturedListings';
import { NearMeFeedSection } from '@frontend/modules/home/components/NearMeFeedSection';
import { CitiesSection } from '@frontend/modules/home/components/CitiesSection';
import { CategoryListings } from '@frontend/modules/home/components/CategoryListings';
import { CTASection } from '@frontend/modules/home/components/CTASection';
import { CategorySubsectionsView } from '@frontend/modules/home/components/CategorySubsectionsView';
import { useCategoryNavStore } from '@frontend/stores/categoryNavStore';

export function HomePageView() {
  const mobileCategory = useCategoryNavStore((s) => s.mobileCategory);

  return (
    <>
      {/* Hero section (includes Blinkit search, category icon strip & bento grid) */}
      <HeroSection />

      {/* ═══ DESKTOP CONTENT (Always rendered on desktop >= md) ═══ */}
      <div className="hidden md:block">
        {/* Near Me Live Feed (Flats, PGs, Hotels, Services interleaved via DSA) */}
        <NearMeFeedSection />

        <HomePromotionalBanners />
        <PopularServices />
        <FeaturedListings />
        <CitiesSection />
        
        {/* 5 Dedicated Category Listing Sections on Desktop */}
        <CategoryListings 
          title="Hourly Hotels & Short Stays" 
          subtitle="100% Couple Friendly · Pay at Hotel Desk" 
          categorySlug="hourly-hotels"
          bgWhite={false}
          fallbackImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
        />
        <CategoryListings 
          title="Hostels & PGs" 
          subtitle="Safe & Verified Stays" 
          categorySlug="pg-hostel"
          bgWhite={true}
          fallbackImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"
        />
        <CategoryListings 
          title="Flats & Apartments" 
          subtitle="Brokerage Free Homes" 
          categorySlug="flats"
          bgWhite={false}
          fallbackImage="/services/flat.jpg"
        />
        <CategoryListings 
          title="Mess & Tiffin Services" 
          subtitle="Home Cooked Meals" 
          categorySlug="mess-tiffin"
          bgWhite={true}
          fallbackImage="/services/tiffin.jpg"
        />
        <CategoryListings 
          title="Gas Connection & Cylinder" 
          subtitle="Fast Delivery" 
          categorySlug="gas-delivery"
          bgWhite={false}
          fallbackImage="/services/gas.jpg"
        />

        <CTASection />
      </div>

      {/* ═══ MOBILE CONTENT (Rendered on mobile < md) ═══ */}
      <div className="md:hidden">
        {mobileCategory === 'all' ? (
          /* When "All" is active: show the standard general overview sections */
          <>
            <HomePromotionalBanners />
            <PopularServices />
            {/* Near Me Live Feed (Flats, PGs, Hotels, Services interleaved via DSA) */}
            <NearMeFeedSection />
            <FeaturedListings />
            <CitiesSection />
            <CategoryListings 
              title="Hourly Hotels & Short Stays" 
              subtitle="100% Couple Friendly · Pay at Hotel Desk" 
              categorySlug="hourly-hotels"
              bgWhite={false}
              fallbackImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            />
            <CategoryListings 
              title="Hostels & PGs" 
              subtitle="Safe & Verified Stays" 
              categorySlug="pg-hostel"
              bgWhite={true}
              fallbackImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"
            />
            <CTASection />
          </>
        ) : (
          /* When a specific category is active:
             Hide all generic "All" sections and exclusively show that category's 10-card sub-sections */
          <CategorySubsectionsView category={mobileCategory} />
        )}
      </div>
    </>
  );
}
