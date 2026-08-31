'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, Search, Map } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the map (heavy component)
const MapPinPicker = dynamic(
  () => import('./MapPinPicker').then(mod => ({ default: mod.MapPinPicker })),
  { ssr: false, loading: () => <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-sm text-gray-400">Loading map...</p></div> }
);

interface LocationPickerProps {
  onLocationSelected: (data: { latitude: number; longitude: number; address: string; citySlug: string; localitySlug?: string }) => void;
  error?: string;
  showMapTab?: boolean; // Show map tab for fixed locations
}

export function LocationPicker({ onLocationSelected, error, showMapTab = false }: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [mode, setMode] = useState<'auto' | 'manual' | 'map'>('auto');

  const processPhotonResult = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(`https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`);
      const data = await res.json();
      if (data.features?.length > 0) {
        const props = data.features[0].properties;
        const parts = [props.name, props.street, props.district || props.locality, props.city, props.state, props.postcode].filter(Boolean);
        const fullAddress = parts.join(', ');
        setCurrentAddress(fullAddress);

        const city = props.city || props.district || props.state || 'unknown';
        const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const locality = props.locality || props.district || props.name;
        const localitySlug = locality ? locality.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;

        onLocationSelected({ latitude, longitude, address: fullAddress, citySlug, localitySlug });
      }
    } catch {
      // Still pass coordinates even if geocoding fails
      onLocationSelected({ latitude, longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, citySlug: 'unknown' });
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await processPhotonResult(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      () => {
        alert('Please allow location access.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSearch = async () => {
    if (!manualAddress.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(manualAddress)}&limit=1`);
      const data = await res.json();
      if (data.features?.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;
        await processPhotonResult(latitude, longitude);
        setMode('auto');
      } else {
        alert('Location not found. Try adding city/state name.');
      }
    } catch {
      alert('Error searching location.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPin = async (lat: number, lng: number) => {
    setIsLoading(true);
    await processPhotonResult(lat, lng);
    setIsLoading(false);
  };

  const tabs = [
    { id: 'auto' as const, label: 'GPS' },
    { id: 'manual' as const, label: 'Search' },
    ...(showMapTab ? [{ id: 'map' as const, label: 'Pin on Map' }] : []),
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Location
        </h3>
        <div className="flex bg-white rounded-md p-1 border border-gray-200 shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                mode === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Captured address display */}
      {currentAddress && (
        <div className="bg-white p-3 rounded-md border border-green-200 mb-4 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Location Captured</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{currentAddress}</p>
          </div>
        </div>
      )}

      {/* Auto GPS */}
      {mode === 'auto' && (
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-medium text-sm rounded-md hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          {isLoading ? 'Detecting...' : currentAddress ? 'Update Location' : 'Use My Current Location'}
        </button>
      )}

      {/* Manual Search */}
      {mode === 'manual' && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="E.g., B-12 Lado Sarai, New Delhi"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleManualSearch())}
            className="flex-1 px-4 py-2.5 rounded-md text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleManualSearch}
            disabled={isLoading || !manualAddress.trim()}
            className="px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Map Pin */}
      {mode === 'map' && (
        <MapPinPicker onPinDrop={handleMapPin} />
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
