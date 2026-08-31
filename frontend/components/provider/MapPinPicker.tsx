'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search, Loader2, Crosshair } from 'lucide-react';

// Dynamically import the entire map component to avoid ANY SSR / DOM issues
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-gray-500 font-medium">Loading Map...</span>
      </div>
    )
  }
);

interface MapPinPickerProps {
  initialLat?: number;
  initialLng?: number;
  onPinDrop: (lat: number, lng: number) => void;
}

export function MapPinPicker({ initialLat, initialLng, onPinDrop }: MapPinPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  
  // Default center: Delhi
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLat && initialLng ? [initialLat, initialLng] : [28.6139, 77.2090] 
  );
  const [zoomLevel, setZoomLevel] = useState(13);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    onPinDrop(lat, lng);
  }, [onPinDrop]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setMapCenter([lat, lng]);
        setZoomLevel(16); // Zoom in closer when searched
      } else {
        alert('Location not found. Try a different spelling or city.');
      }
    } catch {
      alert('Error searching map.');
    } finally {
      setIsSearching(false);
    }
  };

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setZoomLevel(16);
        },
        () => alert('Please allow location access to find you on the map.'),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col relative z-0">
      
      {/* Map Search Bar */}
      <div className="bg-white p-3 border-b border-gray-200 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Search city, area, or building to jump..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
        </button>
        <button
          type="button"
          onClick={locateMe}
          title="Locate Me"
          className="px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200 cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Helper Text */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between">
        <p className="text-xs text-blue-700 font-medium">
          {position 
            ? `📍 Pin dropped. Address will auto-fill below.`
            : 'Click anywhere on the map to drop your location pin.'
          }
        </p>
      </div>

      {/* The Map (Client-Side Only) */}
      <div style={{ height: '500px', width: '100%', position: 'relative', zIndex: 0 }}>
        <DynamicLeafletMap 
          mapCenter={mapCenter}
          zoomLevel={zoomLevel}
          position={position}
          onPinDrop={handleClick}
        />
      </div>
    </div>
  );
}
