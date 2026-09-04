'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Crosshair,
  Check,
  X,
  Loader2,
  Search,
  Navigation,
  Sparkles,
} from 'lucide-react';
import {
  useLocationStore,
  SUPPORTED_CITIES,
  CITY_LOCALITIES,
  CityInfo,
  LocalityInfo,
} from '@frontend/stores/locationStore';
import { globalSearchEngine, SearchEntity } from '@frontend/lib/search/searchEngine';

export function LocationSelectorModal() {
  const [mounted, setMounted] = useState(false);
  const isLocationModalOpen = useLocationStore((s) => s.isLocationModalOpen);
  const closeLocationModal = useLocationStore((s) => s.closeLocationModal);
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const selectedLocality = useLocationStore((s) => s.selectedLocality);
  const setSelectedCity = useLocationStore((s) => s.setSelectedCity);
  const setSelectedLocality = useLocationStore((s) => s.setSelectedLocality);
  const isLocating = useLocationStore((s) => s.isLocating);
  const isNearMeActive = useLocationStore((s) => s.isNearMeActive);
  const activateNearMe = useLocationStore((s) => s.activateNearMe);

  const [searchFilter, setSearchFilter] = useState('');
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Client hydration check for React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isLocationModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocationModalOpen]);

  if (!mounted || !isLocationModalOpen) return null;

  const currentLocalities = CITY_LOCALITIES[selectedCity.slug] || [];

  const searchFilterTrimmed = searchFilter.trim();
  const filteredCities = SUPPORTED_CITIES.filter((c) => {
    if (!searchFilterTrimmed) return true;
    const q = searchFilterTrimmed.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
  });

  const dsaLocalities = searchFilterTrimmed.length >= 2
    ? globalSearchEngine.search(searchFilterTrimmed).results.filter(r => r.entity.type === 'locality')
    : [];

  const handleNearMeClick = async () => {
    setGpsMessage('Detecting GPS location...');
    const res = await activateNearMe();
    setGpsMessage(res.message);
    if (res.success) {
      setTimeout(() => {
        closeLocationModal();
        setGpsMessage(null);
      }, 700);
    }
  };

  const handleCitySelect = (city: CityInfo) => {
    setSelectedCity(city);
    // If not searching, just select city. The localities list will update automatically.
    // If searching, we clear search to show localities of that city
    setSearchFilter('');
  };

  const handleLocalitySelect = (locality: LocalityInfo | null) => {
    setSelectedLocality(locality);
    closeLocationModal();
  };

  const handleDsaLocalitySelect = (entity: SearchEntity) => {
    const city = SUPPORTED_CITIES.find(c => c.slug === entity.citySlug);
    if (city) {
      setSelectedCity(city);
      const existingLoc = CITY_LOCALITIES[city.slug]?.find(l => l.slug === entity.localitySlug);
      const locInfo: LocalityInfo = existingLoc || {
        slug: entity.localitySlug!,
        name: entity.title.split(',')[0].trim(),
        citySlug: city.slug,
        popular: false
      };
      setSelectedLocality(locInfo);
      closeLocationModal();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeLocationModal}
    >
      {/* Modal Surface — Simple, Clean, Liquid Glassmorphism */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg liquid-glass-modal rounded-t-[2.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-300 shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/60 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-[#0033CC] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-950 tracking-tight">Select Location</h3>
              <p className="text-[10px] text-gray-500 font-medium">
                Choose Near Me or pick your city below
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLocationModal}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-black/5 flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="p-4 space-y-3.5 overflow-y-auto scrollbar-elegant">
          {/* ═══ 1. PROMINENT "NEAR ME" ONE-TAP BUTTON ═══ */}
          <button
            type="button"
            onClick={handleNearMeClick}
            disabled={isLocating}
            className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] border shadow-xs ${
              isNearMeActive
                ? 'bg-gradient-to-r from-blue-600 to-[#0033CC] text-white border-blue-600 shadow-blue-500/20'
                : 'liquid-glass-droplet-interactive border-blue-200/80 bg-gradient-to-r from-blue-50 via-white to-blue-50/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
                isNearMeActive ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
              }`}>
                {isLocating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-black leading-tight ${isNearMeActive ? 'text-white' : 'text-[#0033CC]'}`}>
                    {isLocating ? 'Detecting Location...' : '📍 Near Me (Use Current Location)'}
                  </p>
                  {isNearMeActive && (
                    <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  )}
                </div>
                <p className={`text-[10px] font-medium mt-0.5 ${isNearMeActive ? 'text-white/80' : 'text-gray-500'}`}>
                  Auto-detects GPS and shows flats, PGs & services near you
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
              isNearMeActive 
                ? 'bg-[#CCFF00] text-black shadow-xs font-black' 
                : 'bg-blue-600 text-white shadow-2xs'
            }`}>
              {isNearMeActive ? 'Active' : 'Detect'}
            </span>
          </button>

          {/* GPS Feedback Message */}
          {gpsMessage && (
            <p className="text-[11px] font-bold text-center text-emerald-800 bg-emerald-50/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs animate-in fade-in">
              {gpsMessage}
            </p>
          )}

          {/* ═══ 2. SIMPLE CITY SEARCH ═══ */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search your city (e.g. Ranchi, Patna, Mumbai, Delhi)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0033CC]/20 border border-white/90 shadow-2xs transition-all"
            />
          </div>

          {/* ═══ 3. SIMPLE 15 CITIES GRID (No Confusing Tabs!) ═══ */}
          {filteredCities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                  Select City ({filteredCities.length})
                </span>
                {isNearMeActive && (
                  <span className="text-[10px] font-bold text-gray-500">
                    Or tap a city to switch off Near Me
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-elegant">
                {filteredCities.map((city) => {
                  const isSelected = !isNearMeActive && selectedCity.slug === city.slug;
                  return (
                    <button
                      key={city.slug}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`p-2.5 rounded-2xl text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#0033CC] bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-white/80 shadow-md ring-2 ring-blue-400/20'
                          : 'liquid-glass-droplet-interactive border border-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl leading-none drop-shadow-xs">{city.emoji || '📍'}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#0033CC] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-[11px] font-black text-gray-950 leading-tight truncate">
                          {city.name}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-medium truncate mt-0.5">
                          {city.state}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 3.5. DSA LOCALITIES (TYPO TOLERANT) ═══ */}
          {searchFilterTrimmed.length >= 2 && dsaLocalities.length > 0 && (
            <div className="pt-2 border-t border-black/5 mt-2">
              <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#0033CC]" />
                Matching Areas & Localities
              </span>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-elegant">
                {dsaLocalities.map((match) => (
                  <button
                    key={match.entity.id}
                    type="button"
                    onClick={() => handleDsaLocalitySelect(match.entity)}
                    className="p-3 rounded-xl text-left flex items-center justify-between liquid-glass-droplet-interactive border border-white/80 hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-gray-950">
                            {match.entity.title}
                          </h4>
                          {match.typoCorrection && (
                            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                              Typo fixed
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                          {match.entity.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 4. POPULAR AREAS IN ACTIVE CITY ═══ */}
          {!isNearMeActive && !searchFilterTrimmed && (
            <div className="pt-2 border-t border-black/5 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                  Popular Areas in {selectedCity.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleLocalitySelect(null)}
                  className="text-[11px] font-bold text-[#0033CC] hover:underline cursor-pointer"
                >
                  All {selectedCity.name}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-elegant">
                {currentLocalities.map((loc) => {
                  const isSelected = selectedLocality?.slug === loc.slug;
                  return (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => handleLocalitySelect(loc)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0033CC] text-white border-[#0033CC] shadow-sm font-bold'
                          : 'liquid-glass-droplet-interactive text-gray-800 hover:text-[#0033CC] border-white/70'
                      }`}
                    >
                      <span className="truncate">{loc.name}</span>
                      {loc.popular && !isSelected && (
                        <span className="text-[9px] font-bold bg-amber-100/90 text-amber-800 px-1.5 py-0.5 rounded-md ml-1 shrink-0">
                          Top
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 py-2.5 bg-white/60 backdrop-blur-md border-t border-white/60 flex items-center justify-between text-[11px] text-gray-600 font-medium">
          <span>Active Mode:</span>
          {isNearMeActive ? (
            <span className="font-black text-[#0033CC] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
              <span>Near Me (GPS Active)</span>
            </span>
          ) : (
            <span className="font-black text-gray-950 flex items-center gap-1">
              <span>{selectedCity.emoji}</span>
              <span>{selectedLocality?.name ? `${selectedLocality.name}, ${selectedCity.name}` : selectedCity.name}</span>
            </span>
          )}
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
