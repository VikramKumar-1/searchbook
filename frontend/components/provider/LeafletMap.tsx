'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue in webpack/nextjs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle map clicks
function MapEvents({ onPinDrop }: { onPinDrop: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPinDrop(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to fly to a location when searched
function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

interface LeafletMapProps {
  mapCenter: [number, number];
  zoomLevel: number;
  position: [number, number] | null;
  onPinDrop: (lat: number, lng: number) => void;
}

export default function LeafletMap({ mapCenter, zoomLevel, position, onPinDrop }: LeafletMapProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={zoomLevel}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      {/* Google Maps Standard Tile */}
      <TileLayer
        attribution='&copy; Google Maps'
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={20}
      />
      <MapFlyTo center={mapCenter} zoom={zoomLevel} />
      <MapEvents onPinDrop={onPinDrop} />
      {position && <Marker position={position} />}
    </MapContainer>
  );
}
