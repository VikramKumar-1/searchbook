'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Map, Loader2, Navigation } from 'lucide-react';
import { useLocationSearch, LocationSearchResult } from '@frontend/modules/location/hooks/useLocationSearch';
import { useDebounce } from '@frontend/hooks/useDebounce';
import { useRouter } from 'next/navigation';

export function LocationAutocomplete() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [isFocused, setIsFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: results, isLoading } = useLocationSearch(debouncedQuery);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: LocationSearchResult) => {
    setQuery(item.name);
    setIsFocused(false);
    
    // Navigate to listings with proper query params
    const params = new URLSearchParams();
    params.set('city', item.citySlug);
    if (item.localitySlug) {
      params.set('locality', item.localitySlug);
    }
    if (item.type === 'landmark') {
      params.set('landmark', item.slug);
    }
    
    router.push(`/listings?${params.toString()}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        setIsFocused(false);
        
        // Navigate to listings with lat/lng params
        const params = new URLSearchParams();
        params.set('lat', latitude.toString());
        params.set('lng', longitude.toString());
        params.set('radius', '10'); // Default 10 KM
        
        router.push(`/listings?${params.toString()}`);
      },
      (err) => {
        console.error(err);
        alert('Please allow location access to use "Near Me".');
        setIsLocating(false);
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'city': return <Building className="w-4 h-4 text-blue-500" />;
      case 'locality': return <Map className="w-4 h-4 text-green-500" />;
      case 'landmark': return <Navigation className="w-4 h-4 text-orange-500" />;
      default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 z-50">
      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search City, Locality, or Landmark..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 text-black text-xs font-semibold border border-gray-100 focus:bg-white focus:border-[#0033CC]/30 focus:outline-none transition-all cursor-text"
      />

      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-elegant p-1.5">
          
          {/* Always show Near Me option at the top */}
          <button
            onClick={handleNearMe}
            disabled={isLocating}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-[#E6F0FF] hover:bg-[#D0E2FF] transition-all cursor-pointer text-left mb-1"
          >
            <div className="mt-0.5 bg-white shadow-sm p-1.5 rounded-lg border border-[#0033CC]/20">
              {isLocating ? (
                <Loader2 className="w-4 h-4 text-[#0033CC] animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-[#0033CC]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-[#0033CC] leading-tight">
                {isLocating ? 'Detecting Location...' : 'Near Me'}
              </p>
              <p className="text-[10px] font-bold text-[#0033CC]/70 mt-0.5">
                Find services around your current location
              </p>
            </div>
          </button>

          {/* Search Results */}
          {query.length >= 2 ? (
            isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-[#0033CC] animate-spin" />
              </div>
            ) : results && results.length > 0 ? (
              <div className="flex flex-col gap-0.5 mt-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1">Search Results</p>
                {results.map((item: LocationSearchResult) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/80 hover:shadow-sm transition-all cursor-pointer text-left border border-transparent hover:border-white"
                  >
                    <div className="mt-0.5 bg-white shadow-sm p-1.5 rounded-lg border border-gray-50">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#0f172a] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-wide">
                        {item.context} • <span className="text-[#0033CC]">{item.type}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-xs font-bold text-gray-400">No locations found</p>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
