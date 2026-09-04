'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowLeft,
  X,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { useLocationStore, CITY_LOCALITIES } from '@frontend/stores/locationStore';
import { globalSearchEngine, SearchMatch, SearchEntity } from '@frontend/lib/search/searchEngine';
import { useDebounce } from '@frontend/hooks/useDebounce';

export function MobileSearchModal() {
  const router = useRouter();
  const isSearchModalOpen = useLocationStore((s) => s.isSearchModalOpen);
  const closeSearchModal = useLocationStore((s) => s.closeSearchModal);
  const openLocationModal = useLocationStore((s) => s.openLocationModal);
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const selectedLocality = useLocationStore((s) => s.selectedLocality);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 120);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  // Run DSA Search Engine (Trie + Levenshtein DP + Weighted Scoring)
  const searchResponse = debouncedQuery
    ? globalSearchEngine.search(debouncedQuery, selectedCity.slug, 8)
    : null;

  const currentCityLocalities = CITY_LOCALITIES[selectedCity.slug] || [];

  const handleNavigate = (params: { category?: string; city?: string; search?: string }) => {
    const urlParams = new URLSearchParams();
    if (params.city) urlParams.set('city', params.city);
    else if (selectedCity.slug) urlParams.set('city', selectedCity.slug);

    if (params.category) urlParams.set('category', params.category);
    if (params.search) urlParams.set('search', params.search);

    closeSearchModal();
    router.push(`/listings?${urlParams.toString()}`);
  };

  const handleEntityClick = (entity: SearchEntity) => {
    handleNavigate({
      category: entity.categorySlug,
      city: entity.citySlug || selectedCity.slug,
      search: entity.type === 'category' && debouncedQuery 
        ? debouncedQuery 
        : (entity.searchQuery || entity.title),
    });
  };

  const QUICK_CATEGORIES = [
    {
      title: 'PG & Hostels',
      icon: '🛏️',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      items: [
        { label: 'Boys PG', category: 'pg-hostel', search: 'boys pg' },
        { label: 'Girls PG', category: 'pg-hostel', search: 'girls pg' },
        { label: 'Co-living', category: 'pg-hostel', search: 'co-living' },
      ]
    },
    {
      title: 'Flats & Apartments',
      icon: '🏢',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      items: [
        { label: '1 RK / Studio', category: 'flats', search: '1 rk' },
        { label: '1 BHK Flats', category: 'flats', search: '1 bhk' },
        { label: '2 BHK Sharing', category: 'flats', search: '2 bhk' },
      ]
    },
    {
      title: 'Hourly Hotels',
      icon: '⏱️',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      items: [
        { label: 'Couple Friendly', category: 'hourly-hotels', search: 'couple friendly' },
        { label: 'Short Stay', category: 'hourly-hotels', search: 'short stay' },
      ]
    },
    {
      title: 'Home Services',
      icon: '🛠️',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      items: [
        { label: 'Maid / Bai', category: 'services', search: 'maid' },
        { label: 'Water Tanker', category: 'services', search: 'water' },
        { label: 'AC Repair', category: 'services', search: 'ac repair' },
      ]
    },
    {
      title: 'Tiffin & Mess',
      icon: '🍱',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      items: [
        { label: 'Pure Veg Tiffin', category: 'tiffin', search: 'veg' },
        { label: 'Student Mess', category: 'tiffin', search: 'student mess' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-200">
      {/* ── 1. SEARCH MODAL TOP BAR ── */}
      <header className="px-3 pt-3 pb-2.5 border-b border-gray-100 flex items-center gap-2 bg-white sticky top-0 z-10">
        <button
          type="button"
          onClick={closeSearchModal}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-transform shrink-0 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Big Search Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              handleNavigate({
                city: selectedCity.slug,
                search: searchQuery.trim(),
              });
            }
          }}
          className="flex-1 bg-gray-100 rounded-2xl pl-2 pr-3.5 h-11 flex items-center gap-1.5 border border-gray-200/60 focus-within:border-blue-600 focus-within:bg-white transition-all"
        >
          <button 
            type="submit" 
            className="p-1.5 rounded-xl hover:bg-gray-200 active:bg-gray-300 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Submit Search"
          >
            <Search className="w-4 h-4 shrink-0" />
          </button>
          <input
            ref={inputRef}
            type="text"
            enterKeyHint="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${selectedCity.name}...`}
            className="w-full text-xs font-semibold text-gray-950 placeholder-gray-500 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-gray-400 hover:text-gray-700 active:scale-90 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* City Switcher Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openLocationModal();
          }}
          className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-2 rounded-xl text-[11px] font-bold text-blue-700 shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
          <span className="truncate max-w-[70px]">{selectedCity.name}</span>
          <span className="text-[8px]">▼</span>
        </button>
      </header>

      {/* ── 2. SCROLLABLE RESULTS / GUIDANCE AREA ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">

        {/* ═══ STATE A: ZERO-STATE (When input is empty) ═══ */}
        {!searchQuery.trim() && (
          <div className="space-y-6 pb-6">
            
            {/* Quick Localities (Active City) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Popular in {selectedCity.name}
                </h4>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLocationModal();
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Change City
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentCityLocalities.slice(0, 6).map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() =>
                      handleNavigate({
                        city: selectedCity.slug,
                        search: loc.name,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-bold transition-all border border-gray-200/60 active:scale-95 cursor-pointer shadow-2xs"
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Desktop-Style Quick Categories */}
            <section className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Search Categories
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUICK_CATEGORIES.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
                    <div className={`px-3 py-2 ${section.bg} border-b border-gray-100 flex items-center gap-2`}>
                      <span className="text-base">{section.icon}</span>
                      <span className={`text-[11px] font-black uppercase tracking-wide ${section.color}`}>
                        {section.title}
                      </span>
                    </div>
                    <div className="p-2 flex flex-wrap gap-2">
                      {section.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          type="button"
                          onClick={() =>
                            handleNavigate({
                              category: item.category,
                              city: selectedCity.slug,
                              search: item.search,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-all border border-gray-200/50 active:scale-95 cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ STATE B: ACTIVE TYPING (DSA Autocomplete Results) ═══ */}
        {searchQuery.trim() && searchResponse && !searchResponse.isUnknownQuery && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
              Top Matches for "{searchQuery}"
            </p>

            <div className="space-y-1.5">
              {searchResponse.results.map((match, idx) => (
                <button
                  key={`${match.entity.id}-${idx}`}
                  type="button"
                  onClick={() => handleEntityClick(match.entity)}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-blue-50/50 border border-gray-100 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none shrink-0">{match.entity.icon}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-gray-950 leading-tight">
                          {match.entity.title}
                        </p>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider bg-gray-100 text-gray-700">
                          {match.entity.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                        {match.entity.subtitle}
                      </p>
                      {match.matchedBy === 'fuzzy' && match.typoCorrection && (
                        <p className="text-[9px] font-bold text-blue-600 mt-0.5">
                          Typo matched to "{match.typoCorrection}"
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Explicit View All button */}
            <button
              type="button"
              onClick={() => handleNavigate({ city: selectedCity.slug, search: searchQuery.trim() })}
              className="w-full mt-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer border border-blue-200 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              See all results for "{searchQuery}"
            </button>
          </div>
        )}

        {/* ═══ STATE C: UNKNOWN / GARBAGE QUERY FALLBACK ═══ */}
        {searchQuery.trim() && searchResponse?.isUnknownQuery && (
          <div className="py-6 px-3 bg-amber-50/60 rounded-3xl border border-amber-200/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                No Direct Matches for "{searchQuery}"
              </h4>
              <p className="text-[11px] text-gray-600 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                SearchBook operates in verified <strong>PGs, Flats, Hourly Hotels & Daily Services</strong> in {selectedCity.name}.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">
                Pick a Verified Category Instead:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {searchResponse.suggestedRecoveryCategories?.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleEntityClick(cat)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-gray-900 text-xs font-bold hover:bg-amber-100 transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
