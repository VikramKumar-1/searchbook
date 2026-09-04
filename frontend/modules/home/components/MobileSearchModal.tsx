'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowLeft,
  X,
  MapPin,
  Grid,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useLocationStore, CITY_LOCALITIES } from '@frontend/stores/locationStore';
import { globalSearchEngine, SearchMatch, SearchEntity } from '@frontend/lib/search/searchEngine';
import { useDebounce } from '@frontend/hooks/useDebounce';

const TRENDING_SEARCHES = [
  { label: 'Hourly Hotels', category: 'hourly-hotels', search: 'hotel' },
  { label: 'Boys PG', category: 'pg-hostel', search: 'boys pg' },
  { label: 'Girls PG', category: 'pg-hostel', search: 'girls pg' },
  { label: '1 BHK Flat', category: 'flats', search: '1 bhk' },
  { label: 'Couple Friendly', category: 'hourly-hotels', search: 'couple friendly' },
  { label: 'Student Mess', category: 'tiffin', search: 'student mess' },
  { label: 'Maid / Bai', category: 'services', search: 'maid' },
  { label: 'AC Repair', category: 'services', search: 'ac repair' },
];

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
    ],
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
    ],
  },
  {
    title: 'Hourly Hotels',
    icon: '⏱️',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    items: [
      { label: 'Couple Friendly', category: 'hourly-hotels', search: 'couple friendly' },
      { label: 'Short Stay', category: 'hourly-hotels', search: 'short stay' },
    ],
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
    ],
  },
  {
    title: 'Tiffin & Mess',
    icon: '🍱',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    items: [
      { label: 'Pure Veg Tiffin', category: 'tiffin', search: 'veg' },
      { label: 'Student Mess', category: 'tiffin', search: 'student mess' },
    ],
  },
];

export function MobileSearchModal() {
  const router = useRouter();
  const isSearchModalOpen = useLocationStore((s) => s.isSearchModalOpen);
  const closeSearchModal = useLocationStore((s) => s.closeSearchModal);
  const openLocationModal = useLocationStore((s) => s.openLocationModal);
  const selectedCity = useLocationStore((s) => s.selectedCity);

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
      search:
        entity.type === 'category' && debouncedQuery
          ? debouncedQuery
          : entity.searchQuery || entity.title,
    });
  };

  const submitSearch = () => {
    if (searchQuery.trim()) {
      handleNavigate({
        city: selectedCity.slug,
        search: searchQuery.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-200">
      {/* ── 1. SEARCH MODAL TOP HEADER (INDUSTRY STANDARD) ── */}
      <header className="px-3 pt-3 pb-2.5 bg-white border-b border-gray-100 sticky top-0 z-20 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={closeSearchModal}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 active:scale-90 transition-all shrink-0 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Form & Input — 16px Font Prevents Mobile Safari/Chrome Auto-Zoom */}
          <form
            role="search"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
            className="flex-1 bg-[#F1F4F9] rounded-2xl px-3 h-11 flex items-center gap-2 border border-gray-200/80 focus-within:border-[#0033CC] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${selectedCity.name}...`}
              className="w-full text-[16px] font-semibold text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-90 shrink-0 cursor-pointer"
                aria-label="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Dedicated High-Contrast "Search" Action Button */}
          {searchQuery.trim() ? (
            <button
              type="button"
              onClick={submitSearch}
              className="h-11 px-4 bg-[#0033CC] hover:bg-[#0029A3] text-white text-xs font-black rounded-2xl flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer animate-in fade-in"
              title="Search"
            >
              <span>Search</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openLocationModal();
              }}
              className="h-11 px-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-2xl flex items-center gap-1 shrink-0 active:scale-95 transition-all cursor-pointer"
              title={`Selected city: ${selectedCity.name}`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[65px]">{selectedCity.name}</span>
            </button>
          )}
        </div>

        {/* Location Context Pill */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
          <span className="flex items-center gap-1 font-medium truncate">
            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
            <span>
              Searching in <strong>{selectedCity.name}</strong>
            </span>
          </span>
          <button
            type="button"
            onClick={() => openLocationModal()}
            className="text-[#0033CC] font-bold hover:underline shrink-0 ml-2 cursor-pointer"
          >
            Change City
          </button>
        </div>
      </header>

      {/* ── 2. SCROLLABLE RESULTS / GUIDANCE AREA ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        {/* ═══ STATE A: ZERO-STATE (When input is empty) ═══ */}
        {!searchQuery.trim() && (
          <div className="space-y-6 pb-6">
            {/* 🔥 Trending Searches */}
            <section className="space-y-2.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#0033CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                Trending in {selectedCity.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      handleNavigate({
                        category: item.category,
                        city: selectedCity.slug,
                        search: item.search,
                      })
                    }
                    className="px-3 py-1.5 rounded-full bg-[#F0F5FB] hover:bg-blue-100 text-gray-800 hover:text-[#0033CC] text-xs font-bold transition-all border border-blue-100 active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Search className="w-3 h-3 text-blue-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Localities (Active City) */}
            {currentCityLocalities.length > 0 && (
              <section className="space-y-2.5 pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Popular Localities in {selectedCity.name}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentCityLocalities.slice(0, 8).map((loc) => (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() =>
                        handleNavigate({
                          city: selectedCity.slug,
                          search: loc.name,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-bold transition-all border border-gray-200/60 active:scale-95 cursor-pointer shadow-2xs"
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Categories */}
            <section className="space-y-3.5 pt-1 border-t border-gray-100">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-[#0033CC]" />
                Browse Categories
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {QUICK_CATEGORIES.map((section, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden"
                  >
                    <div
                      className={`px-3 py-2 ${section.bg} border-b border-gray-100 flex items-center gap-2`}
                    >
                      <span className="text-base">{section.icon}</span>
                      <span
                        className={`text-[11px] font-black uppercase tracking-wide ${section.color}`}
                      >
                        {section.title}
                      </span>
                    </div>
                    <div className="p-2 flex flex-wrap gap-1.5">
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
                          className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-all border border-gray-200/50 active:scale-95 cursor-pointer"
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

        {/* ═══ STATE B: ACTIVE TYPING ═══ */}
        {searchQuery.trim() && (
          <div className="space-y-3">
            {/* Primary Enter / Search Action Card — Solves "enter kahi dikhta hi nhi" */}
            <button
              type="button"
              onClick={submitSearch}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200/90 flex items-center justify-between text-left active:scale-[0.98] transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-[#0033CC] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-gray-950 truncate">
                    Search for "{searchQuery}"
                  </p>
                  <p className="text-[10px] font-semibold text-blue-700 truncate">
                    Tap here or press Enter to see all listings in {selectedCity.name}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-white bg-[#0033CC] px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1 shadow-2xs">
                <span>Go</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            {/* Matching Suggestions from DSA Engine */}
            {searchResponse && !searchResponse.isUnknownQuery && searchResponse.results.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
                  Direct Matches
                </p>

                {searchResponse.results.map((match, idx) => (
                  <button
                    key={`${match.entity.id}-${idx}`}
                    type="button"
                    onClick={() => handleEntityClick(match.entity)}
                    className="w-full p-3 rounded-2xl bg-white hover:bg-blue-50/50 border border-gray-100 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xl leading-none shrink-0">{match.entity.icon}</span>
                      <div className="text-left min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-gray-950 leading-tight truncate">
                            {match.entity.title}
                          </p>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider bg-gray-100 text-gray-700 shrink-0">
                            {match.entity.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                          {match.entity.subtitle}
                        </p>
                        {match.matchedBy === 'fuzzy' && match.typoCorrection && (
                          <p className="text-[9px] font-bold text-blue-600 mt-0.5">
                            Did you mean "{match.typoCorrection}"?
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}

            {/* Fallback for Unknown / Unique Searches */}
            {searchResponse?.isUnknownQuery && (
              <div className="py-5 px-3 bg-amber-50/70 rounded-3xl border border-amber-200 text-center space-y-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">
                    Looking for "{searchQuery}" in {selectedCity.name}?
                  </h4>
                  <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                    Tap <strong>Search</strong> above to search all active listings, or explore top categories below.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {searchResponse.suggestedRecoveryCategories?.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleEntityClick(cat)}
                      className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-gray-900 text-xs font-bold hover:bg-amber-100 transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
