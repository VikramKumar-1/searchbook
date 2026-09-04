'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Map, Loader2, Navigation, ChevronRight, Sparkles } from 'lucide-react';
import { useLocationSearch, LocationSearchResult } from '@frontend/modules/location/hooks/useLocationSearch';
import { useDebounce } from '@frontend/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import {
  useLocationStore,
  SUPPORTED_CITIES,
  CITY_LOCALITIES,
  CityInfo,
} from '@frontend/stores/locationStore';

export function LocationAutocomplete() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 150);
  const [isFocused, setIsFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedCity = useLocationStore((s) => s.selectedCity);
  const setSelectedCity = useLocationStore((s) => s.setSelectedCity);
  const setSelectedLocality = useLocationStore((s) => s.setSelectedLocality);
  const openLocationModal = useLocationStore((s) => s.openLocationModal);
  const activateNearMe = useLocationStore((s) => s.activateNearMe);
  const isNearMeActive = useLocationStore((s) => s.isNearMeActive);

  const { data: results = [], isLoading } = useLocationSearch(debouncedQuery);

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

  const handleSelect = (item: { name: string; citySlug: string; localitySlug?: string; slug?: string; type?: string }) => {
    setQuery(item.name);
    setIsFocused(false);

    // Synchronize global Zustand locationStore
    const targetCity = SUPPORTED_CITIES.find((c) => c.slug === item.citySlug);
    if (targetCity) {
      setSelectedCity(targetCity);
      if (item.localitySlug) {
        const targetLocality = (CITY_LOCALITIES[targetCity.slug] || []).find((l) => l.slug === item.localitySlug);
        setSelectedLocality(targetLocality || null);
      } else {
        setSelectedLocality(null);
      }
    }

    // Navigate to listings with proper query params
    const params = new URLSearchParams();
    params.set('city', item.citySlug);
    if (item.localitySlug) {
      params.set('locality', item.localitySlug);
    }
    if (item.type === 'landmark' && item.slug) {
      params.set('landmark', item.slug);
    }

    router.push(`/listings?${params.toString()}`);
  };

  const handleNearMe = async () => {
    setIsFocused(false);
    await activateNearMe();
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'city':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'locality':
        return <Map className="w-4 h-4 text-emerald-500" />;
      case 'landmark':
        return <Navigation className="w-4 h-4 text-orange-500" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 z-50">
      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0033CC] pointer-events-none z-10" />
      <input
        type="text"
        placeholder={
          isNearMeActive
            ? '📍 Near Me (Live GPS Active) — or type a city/area...'
            : `Search in ${selectedCity.name}, or type another city/locality...`
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onClick={() => setIsFocused(true)}
        className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 text-black text-[16px] md:text-xs font-semibold border border-gray-100 focus:bg-white focus:border-[#0033CC]/30 focus:outline-none transition-all cursor-text shadow-2xs"
      />

      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-2 liquid-glass-dropdown max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-elegant p-2.5 z-50 shadow-2xl">
          {/* Always show Near Me option at the top */}
          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLocating}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-left mb-2 active:scale-[0.99] ${
              isNearMeActive
                ? 'bg-gradient-to-r from-blue-600 to-[#0033CC] text-white border-blue-600 shadow-xs'
                : 'bg-blue-50/80 hover:bg-blue-100/90 border-blue-200/80'
            }`}
          >
            <div className={`mt-0.5 shadow-xs p-1.5 rounded-lg border ${
              isNearMeActive ? 'bg-white/20 text-white border-white/30' : 'bg-white text-[#0033CC] border-[#0033CC]/20'
            }`}>
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-xs font-black leading-tight ${isNearMeActive ? 'text-white' : 'text-[#0033CC]'}`}>
                  {isLocating ? 'Detecting Location...' : '📍 Near Me (Auto GPS)'}
                </p>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isNearMeActive ? 'bg-[#CCFF00] text-black' : 'bg-[#0033CC] text-white'
                }`}>
                  {isNearMeActive ? 'Active' : 'GPS'}
                </span>
              </div>
              <p className={`text-[10px] font-medium mt-0.5 ${isNearMeActive ? 'text-white/80' : 'text-[#0033CC]/70'}`}>
                Instant match to nearest verified stays & services
              </p>
            </div>
          </button>

          {/* Quick Popular Cities when query is empty */}
          {!query.trim() && (
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <span>Available in 15 Hubs</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    openLocationModal();
                  }}
                  className="text-[10px] font-bold text-[#0033CC] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Browse All Localities</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* 15 Cities Grid (Pill droplets) */}
              <div className="grid grid-cols-3 gap-1.5 px-0.5">
                {SUPPORTED_CITIES.map((c: CityInfo) => {
                  const isCurrent = selectedCity.slug === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleSelect({ name: c.name, citySlug: c.slug })}
                      className={`px-2 py-1.5 rounded-xl text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0033CC] text-white shadow-xs font-bold'
                          : 'liquid-glass-droplet-interactive text-gray-800 hover:text-[#0033CC]'
                      }`}
                    >
                      <span className="text-xs shrink-0">{c.emoji}</span>
                      <div className="truncate flex-1">
                        <p className="text-[11px] font-bold truncate leading-none">{c.name}</p>
                        <p className={`text-[8px] truncate mt-0.5 ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>
                          {c.state}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Full Modal Trigger Banner */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    openLocationModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-gray-100 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/60 border border-gray-200/80 text-[#0033CC] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Explore Localities by Area (Harmu, DLF, etc.)</span>
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim().length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 text-[#0033CC] animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1">
                    Matching Locations
                  </p>
                  {results.map((item: LocationSearchResult) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex items-start gap-2.5 px-3 py-2 rounded-xl liquid-glass-droplet-interactive hover:border-blue-300 transition-all cursor-pointer text-left"
                    >
                      <div className="mt-0.5 bg-blue-50 p-1.5 rounded-lg border border-blue-200/60 shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-wide truncate">
                          {item.context} • <span className="text-[#0033CC]">{item.type}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="py-5 px-4 text-center">
                  <p className="text-xs font-bold text-gray-600">
                    No exact location match for "{query}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFocused(false);
                      router.push(`/listings?search=${encodeURIComponent(query)}`);
                    }}
                    className="mt-2 text-xs font-extrabold text-[#0033CC] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Search all listings matching "{query}"</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
