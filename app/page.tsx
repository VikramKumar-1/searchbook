import { HeroSection } from '@frontend/components/home/HeroSection';
import { PopularServices } from '@frontend/components/home/PopularServices';
import { FeaturedListings } from '@frontend/components/home/FeaturedListings';
import { CitiesSection } from '@frontend/components/home/CitiesSection';
import { CategoryListings } from '@frontend/components/home/CategoryListings';
import { CTASection } from '@frontend/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularServices />
      <FeaturedListings />
      <CitiesSection />
      
      {/* 4 Separate Dedicated Category Listing Sections */}
      <CategoryListings 
        title="Hostels & PGs" 
        subtitle="Safe & Verified Stays" 
        pageParam={1} 
        bgWhite={false}
        fallbackImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"
      />
      <CategoryListings 
        title="Flats & Apartments" 
        subtitle="Brokerage Free Homes" 
        pageParam={2} 
        bgWhite={true}
        fallbackImage="/api/services/flat"
      />
      <CategoryListings 
        title="Mess & Tiffin Services" 
        subtitle="Home Cooked Meals" 
        pageParam={3} 
        bgWhite={false}
        fallbackImage="/api/services/tiffin"
      />
      <CategoryListings 
        title="Gas Connection" 
        subtitle="Fast Delivery" 
        pageParam={4} 
        bgWhite={true}
        fallbackImage="/api/services/gas"
      />

      <CTASection />
    </>
  );
}
