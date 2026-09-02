import { HeroSection } from '@frontend/modules/home/components/HeroSection';
import { PopularServices } from '@frontend/modules/home/components/PopularServices';
import { FeaturedListings } from '@frontend/modules/home/components/FeaturedListings';
import { CitiesSection } from '@frontend/modules/home/components/CitiesSection';
import { CategoryListings } from '@frontend/modules/home/components/CategoryListings';
import { CTASection } from '@frontend/modules/home/components/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularServices />
      <FeaturedListings />
      <CitiesSection />
      
      {/* 5 Dedicated Category Listing Sections */}
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
        fallbackImage="/api/services/flat"
      />
      <CategoryListings 
        title="Mess & Tiffin Services" 
        subtitle="Home Cooked Meals" 
        categorySlug="mess-tiffin"
        bgWhite={true}
        fallbackImage="/api/services/tiffin"
      />
      <CategoryListings 
        title="Gas Connection & Cylinder" 
        subtitle="Fast Delivery" 
        categorySlug="gas-delivery"
        bgWhite={false}
        fallbackImage="/api/services/gas"
      />

      <CTASection />
    </>
  );
}
