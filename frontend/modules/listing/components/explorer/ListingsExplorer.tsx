'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useListings } from '@frontend/modules/listing/hooks/useListings';
import { ListingCard } from '@frontend/modules/listing/components/ListingCard';
import { useDebounce } from '@frontend/hooks/useDebounce';
import { Search, MapPin, Navigation, Building2, X, Plus } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { slug: '', label: '✨ All Categories' },
  { slug: 'pg-hostel', label: '🛏️ Hostels & PGs' },
  { slug: 'flats', label: '🏢 Flats & Houses' },
  { slug: 'hourly-hotels', label: '🏨 Hourly Hotels' },
  { slug: 'mess-tiffin', label: '🍲 Mess & Tiffin' },
  { slug: 'maid', label: '🧹 Housemaid' },
  { slug: 'home-cook', label: '👨‍🍳 Home Cook' },
  { slug: 'plumber', label: '🔧 Plumber' },
  { slug: 'electrician', label: '⚡ Electrician' },
  { slug: 'gas-delivery', label: '🔥 Gas Delivery' },
  { slug: 'water-supply', label: '💧 Water Tanker' },
  { slug: 'ac-repair', label: '❄️ AC Repair' },
  { slug: 'laundry', label: '👔 Laundry' },
];

const CITIES = [
  { slug: '', name: 'All Cities' },
  { slug: 'delhi', name: 'Delhi NCR' },
  { slug: 'gurugram', name: 'Gurugram' },
  { slug: 'noida', name: 'Noida' },
  { slug: 'ranchi', name: 'Ranchi' },
  { slug: 'chandigarh', name: 'Chandigarh' },
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { data, isLoading, isError, error } = useListings({
    categorySlug: selectedCategory || undefined,
    citySlug: selectedCity || undefined,
    search: debouncedSearch || undefined,
    lat: userCoords?.lat,
    lng: userCoords?.lng,
    limit: 24,
    page: 1,
  });

  const handleNearMe = () => {
    if (userCoords) {
      setUserCoords(null);
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        alert('Please allow location access to see listings near you.');
        setIsLocating(false);
      }
    );
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) params.set('category', slug);
    else params.delete('category');
    router.replace(`/listings?${params.toString()}`, { scroll: false });
  };

  const handleCitySelect = (slug: string) => {
    setSelectedCity(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) params.set('city', slug);
    else params.delete('city');
    router.replace(`/listings?${params.toString()}`, { scroll: false });
  };

  const listings = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, service, locality, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Near Me Toggle */}
            <button
              onClick={handleNearMe}
              className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                userCoords
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {userCoords ? 'Near Me (Active)' : 'Near Me'}
            </button>
          </div>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-gray-100">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900">
            {selectedCategory
              ? CATEGORIES.find((c) => c.slug === selectedCategory)?.label.replace(/^[^\s]+\s/, '')
              : 'All Explore Listings'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {isLoading
              ? 'Finding available listings...'
              : `Showing ${listings.length} verified listings in your area`}
          </p>
        </div>

        <Link
          href="/provider/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-900 hover:bg-black text-white px-3.5 py-2 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          List Your Business
        </Link>
      </div>

      {/* Loading Skeleton Grid (Rule: Skeleton loading states, not spinners) */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded-lg pt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
          <p className="font-bold text-sm">Could not load listings</p>
          <p className="text-xs text-red-500 mt-1">{error?.message || 'Please try again.'}</p>
        </div>
      )}

      {/* Empty View */}
      {!isLoading && !isError && listings.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">No Listings Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              We couldn't find any listings matching your current filter. Be the first to list in this category or city!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedCity('');
                setSearchQuery('');
                setUserCoords(null);
                router.replace('/listings');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
            <Link
              href="/provider/onboarding"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
            >
              Add Listing Here
            </Link>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {!isLoading && !isError && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              listing={{
                id: item.id,
                title: item.title,
                slug: item.slug,
                price: item.price !== null && item.price !== undefined ? Number(item.price) : null,
                priceType: item.priceType,
                photos: item.photos || [],
                city: item.city,
                category: item.category,
                contactPhone: item.contactPhone,
                contactWhatsApp: item.contactWhatsApp,
                _count: item._count || { reviews: 0 },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ListingsExplorer() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-400">
          Loading explorer...
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
