import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateHaversineDistanceKm } from '@frontend/lib/search/searchEngine';

export interface CityInfo {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  tier: 'mid-town' | 'metro';
  badge: string;
  emoji: string;
}

export interface LocalityInfo {
  slug: string;
  name: string;
  citySlug: string;
  popular?: boolean;
}

export const SUPPORTED_CITIES: CityInfo[] = [
  // ── Mid-Towns & Hill Stations (User's Core Hubs)
  {
    slug: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    lat: 23.3441,
    lng: 85.3096,
    tier: 'mid-town',
    badge: 'Mid-Town Hub',
    emoji: '🌳',
  },
  {
    slug: 'patna',
    name: 'Patna',
    state: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    tier: 'mid-town',
    badge: 'Mid-Town Hub',
    emoji: '🏛️',
  },
  {
    slug: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    lat: 30.3165,
    lng: 78.0322,
    tier: 'mid-town',
    badge: 'Valley & Stays Hub',
    emoji: '⛰️',
  },
  {
    slug: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lng: 77.1734,
    tier: 'mid-town',
    badge: 'Hill Station Hub',
    emoji: '❄️',
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Tricity',
    lat: 30.7333,
    lng: 76.7794,
    tier: 'mid-town',
    badge: 'Mid-Town Hub',
    emoji: '🏙️',
  },

  // ── Major Metros & Tech Centers
  {
    slug: 'delhi',
    name: 'Delhi NCR',
    state: 'Capital Region',
    lat: 28.6692,
    lng: 77.23,
    tier: 'metro',
    badge: 'Metro Hub',
    emoji: '🏛️',
  },
  {
    slug: 'new-delhi',
    name: 'New Delhi',
    state: 'Central Delhi',
    lat: 28.6139,
    lng: 77.209,
    tier: 'metro',
    badge: 'Capital Center',
    emoji: '🏢',
  },
  {
    slug: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana NCR',
    lat: 28.4595,
    lng: 77.0266,
    tier: 'metro',
    badge: 'Cyber City',
    emoji: '💼',
  },
  {
    slug: 'noida',
    name: 'Noida',
    state: 'UP NCR',
    lat: 28.5355,
    lng: 77.391,
    tier: 'metro',
    badge: 'Tech Hub',
    emoji: '⚡',
  },
  {
    slug: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    tier: 'metro',
    badge: 'Silicon Valley',
    emoji: '🚀',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    tier: 'metro',
    badge: 'Cyberabad Hub',
    emoji: '🕌',
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.8777,
    tier: 'metro',
    badge: 'Financial Capital',
    emoji: '🌊',
  },
  {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    tier: 'metro',
    badge: 'Education & IT Hub',
    emoji: '🎓',
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    tier: 'metro',
    badge: 'Cultural Capital',
    emoji: '🚋',
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    tier: 'metro',
    badge: 'Commercial Hub',
    emoji: '🦁',
  },
];

export const CITY_LOCALITIES: Record<string, LocalityInfo[]> = {
  ranchi: [
    { slug: 'harmu', name: 'Harmu Housing Colony', citySlug: 'ranchi', popular: true },
    { slug: 'lalpur', name: 'Lalpur', citySlug: 'ranchi', popular: true },
    { slug: 'kanke', name: 'Kanke Road', citySlug: 'ranchi', popular: true },
    { slug: 'bariatu', name: 'Bariatu', citySlug: 'ranchi', popular: true },
    { slug: 'doranda', name: 'Doranda', citySlug: 'ranchi', popular: true },
    { slug: 'morabadi', name: 'Morabadi', citySlug: 'ranchi', popular: true },
    { slug: 'ratu-road', name: 'Ratu Road', citySlug: 'ranchi', popular: true },
    { slug: 'ashok-nagar', name: 'Ashok Nagar', citySlug: 'ranchi' },
    { slug: 'hinoo', name: 'Hinoo', citySlug: 'ranchi' },
    { slug: 'namkum', name: 'Namkum', citySlug: 'ranchi' },
  ],
  patna: [
    { slug: 'boring-road', name: 'Boring Road', citySlug: 'patna', popular: true },
    { slug: 'kankarbagh', name: 'Kankarbagh', citySlug: 'patna', popular: true },
    { slug: 'bailey-road', name: 'Bailey Road', citySlug: 'patna', popular: true },
    { slug: 'rajendra-nagar', name: 'Rajendra Nagar', citySlug: 'patna', popular: true },
    { slug: 'fraser-road', name: 'Fraser Road', citySlug: 'patna' },
    { slug: 'danapur', name: 'Danapur', citySlug: 'patna' },
  ],
  dehradun: [
    { slug: 'rajpur-road', name: 'Rajpur Road', citySlug: 'dehradun', popular: true },
    { slug: 'clock-tower', name: 'Paltan Bazar / Clock Tower', citySlug: 'dehradun', popular: true },
    { slug: 'clement-town', name: 'Clement Town', citySlug: 'dehradun', popular: true },
    { slug: 'karanpur', name: 'Karanpur (Student Hub)', citySlug: 'dehradun', popular: true },
    { slug: 'ballupur', name: 'Ballupur Chowk', citySlug: 'dehradun' },
    { slug: 'prem-nagar', name: 'Prem Nagar', citySlug: 'dehradun' },
  ],
  shimla: [
    { slug: 'mall-road', name: 'Mall Road', citySlug: 'shimla', popular: true },
    { slug: 'sanjauli', name: 'Sanjauli', citySlug: 'shimla', popular: true },
    { slug: 'chotta-shimla', name: 'Chotta Shimla', citySlug: 'shimla', popular: true },
    { slug: 'summer-hill', name: 'Summer Hill', citySlug: 'shimla', popular: true },
    { slug: 'kasumpti', name: 'Kasumpti', citySlug: 'shimla' },
  ],
  chandigarh: [
    { slug: 'sector-17', name: 'Sector 17', citySlug: 'chandigarh', popular: true },
    { slug: 'sector-35', name: 'Sector 35', citySlug: 'chandigarh', popular: true },
    { slug: 'mohali', name: 'Mohali Phase 7', citySlug: 'chandigarh', popular: true },
    { slug: 'panchkula', name: 'Panchkula Sector 5', citySlug: 'chandigarh', popular: true },
    { slug: 'zirakpur', name: 'Zirakpur', citySlug: 'chandigarh' },
  ],
  delhi: [
    { slug: 'south-ex', name: 'South Extension', citySlug: 'delhi', popular: true },
    { slug: 'hauz-khas', name: 'Hauz Khas', citySlug: 'delhi', popular: true },
    { slug: 'laxmi-nagar', name: 'Laxmi Nagar', citySlug: 'delhi', popular: true },
    { slug: 'dwarka', name: 'Dwarka Mor', citySlug: 'delhi', popular: true },
    { slug: 'mukherjee-nagar', name: 'Mukherjee Nagar (Student Hub)', citySlug: 'delhi', popular: true },
    { slug: 'karol-bagh', name: 'Karol Bagh', citySlug: 'delhi' },
  ],
  'new-delhi': [
    { slug: 'connaught-place', name: 'Connaught Place (CP)', citySlug: 'new-delhi', popular: true },
    { slug: 'chanakyapuri', name: 'Chanakyapuri', citySlug: 'new-delhi', popular: true },
    { slug: 'khan-market', name: 'Khan Market', citySlug: 'new-delhi', popular: true },
    { slug: 'paharganj', name: 'Paharganj (Transit Rooms)', citySlug: 'new-delhi', popular: true },
    { slug: 'barakhamba', name: 'Barakhamba Road', citySlug: 'new-delhi' },
  ],
  gurugram: [
    { slug: 'cyber-hub', name: 'Cyber Hub / DLF Phase 2', citySlug: 'gurugram', popular: true },
    { slug: 'sector-29', name: 'Sector 29', citySlug: 'gurugram', popular: true },
    { slug: 'golf-course', name: 'Golf Course Road', citySlug: 'gurugram', popular: true },
    { slug: 'sohna-road', name: 'Sohna Road', citySlug: 'gurugram', popular: true },
    { slug: 'dlf-phase-3', name: 'DLF Phase 3 (U-Block)', citySlug: 'gurugram' },
    { slug: 'huda-city', name: 'Millennium City / Huda', citySlug: 'gurugram' },
  ],
  noida: [
    { slug: 'sector-62', name: 'Sector 62 (Electronic City)', citySlug: 'noida', popular: true },
    { slug: 'sector-18', name: 'Sector 18 (Atta Market)', citySlug: 'noida', popular: true },
    { slug: 'sector-137', name: 'Sector 137 (Expressway)', citySlug: 'noida', popular: true },
    { slug: 'knowledge-park', name: 'Knowledge Park (Greater Noida)', citySlug: 'noida', popular: true },
    { slug: 'sector-15', name: 'Sector 15', citySlug: 'noida' },
  ],
  bengaluru: [
    { slug: 'koramangala', name: 'Koramangala', citySlug: 'bengaluru', popular: true },
    { slug: 'indiranagar', name: 'Indiranagar', citySlug: 'bengaluru', popular: true },
    { slug: 'hsr-layout', name: 'HSR Layout', citySlug: 'bengaluru', popular: true },
    { slug: 'whitefield', name: 'Whitefield (IT Hub)', citySlug: 'bengaluru', popular: true },
    { slug: 'electronic-city', name: 'Electronic City', citySlug: 'bengaluru', popular: true },
    { slug: 'btm-layout', name: 'BTM Layout', citySlug: 'bengaluru' },
    { slug: 'marathahalli', name: 'Marathahalli', citySlug: 'bengaluru' },
  ],
  hyderabad: [
    { slug: 'hitec-city', name: 'Hitec City', citySlug: 'hyderabad', popular: true },
    { slug: 'gachibowli', name: 'Gachibowli', citySlug: 'hyderabad', popular: true },
    { slug: 'madhapur', name: 'Madhapur', citySlug: 'hyderabad', popular: true },
    { slug: 'banjara-hills', name: 'Banjara Hills', citySlug: 'hyderabad', popular: true },
    { slug: 'jubilee-hills', name: 'Jubilee Hills', citySlug: 'hyderabad' },
    { slug: 'kukatpally', name: 'Kukatpally (JNTU Hub)', citySlug: 'hyderabad' },
  ],
  mumbai: [
    { slug: 'andheri-west', name: 'Andheri West', citySlug: 'mumbai', popular: true },
    { slug: 'bandra-west', name: 'Bandra West', citySlug: 'mumbai', popular: true },
    { slug: 'powai', name: 'Powai (Hiranandani)', citySlug: 'mumbai', popular: true },
    { slug: 'juhu', name: 'Juhu', citySlug: 'mumbai', popular: true },
    { slug: 'dadar', name: 'Dadar', citySlug: 'mumbai' },
    { slug: 'thane', name: 'Thane West', citySlug: 'mumbai' },
    { slug: 'navi-mumbai', name: 'Vashi (Navi Mumbai)', citySlug: 'mumbai' },
  ],
  pune: [
    { slug: 'viman-nagar', name: 'Viman Nagar', citySlug: 'pune', popular: true },
    { slug: 'hinjewadi', name: 'Hinjewadi (IT Park)', citySlug: 'pune', popular: true },
    { slug: 'kothrud', name: 'Kothrud', citySlug: 'pune', popular: true },
    { slug: 'wakad', name: 'Wakad', citySlug: 'pune', popular: true },
    { slug: 'koregaon-park', name: 'Koregaon Park', citySlug: 'pune' },
    { slug: 'baner', name: 'Baner', citySlug: 'pune' },
  ],
  kolkata: [
    { slug: 'salt-lake', name: 'Salt Lake (Sector V IT)', citySlug: 'kolkata', popular: true },
    { slug: 'new-town', name: 'New Town / Rajarhat', citySlug: 'kolkata', popular: true },
    { slug: 'park-street', name: 'Park Street', citySlug: 'kolkata', popular: true },
    { slug: 'ballygunge', name: 'Ballygunge', citySlug: 'kolkata', popular: true },
    { slug: 'gariahata', name: 'Gariahat', citySlug: 'kolkata' },
    { slug: 'jadavpur', name: 'Jadavpur', citySlug: 'kolkata' },
  ],
  ahmedabad: [
    { slug: 'navrangpura', name: 'Navrangpura', citySlug: 'ahmedabad', popular: true },
    { slug: 'sg-highway', name: 'SG Highway', citySlug: 'ahmedabad', popular: true },
    { slug: 'satellite', name: 'Satellite / Shivranjani', citySlug: 'ahmedabad', popular: true },
    { slug: 'vastrapur', name: 'Vastrapur (IIM Area)', citySlug: 'ahmedabad', popular: true },
    { slug: 'prahlad-nagar', name: 'Prahlad Nagar', citySlug: 'ahmedabad' },
    { slug: 'bodakdev', name: 'Bodakdev', citySlug: 'ahmedabad' },
  ],
};

interface LocationState {
  selectedCity: CityInfo;
  selectedLocality: LocalityInfo | null;
  userCoords: { lat: number; lng: number } | null;
  isLocating: boolean;
  isLocationModalOpen: boolean;
  isSearchModalOpen: boolean;
  gpsDetected: boolean;
  isNearMeActive: boolean;

  openLocationModal: () => void;
  closeLocationModal: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;

  setSelectedCity: (city: CityInfo) => void;
  setSelectedLocality: (locality: LocalityInfo | null) => void;
  setUserCoords: (coords: { lat: number; lng: number } | null) => void;

  // Near Me GPS Activation & Mode Controls
  activateNearMe: () => Promise<{ success: boolean; message: string; city?: CityInfo }>;
  disableNearMe: () => void;

  // Auto-Detect GPS Location using Haversine Algorithm
  autoDetectLocation: () => Promise<{ success: boolean; message: string; city?: CityInfo }>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedCity: SUPPORTED_CITIES[0], // Default: Ranchi (Mid-Town Hub)
      selectedLocality: CITY_LOCALITIES['ranchi'][0], // Default: Harmu Housing Colony
      userCoords: null,
      isLocating: false,
      isLocationModalOpen: false,
      isSearchModalOpen: false,
      gpsDetected: false,
      isNearMeActive: false,

      openLocationModal: () => set({ isLocationModalOpen: true }),
      closeLocationModal: () => set({ isLocationModalOpen: false }),
      openSearchModal: () => set({ isSearchModalOpen: true }),
      closeSearchModal: () => set({ isSearchModalOpen: false }),

      setSelectedCity: (city: CityInfo) => {
        const localities = CITY_LOCALITIES[city.slug] || [];
        set({
          selectedCity: city,
          selectedLocality: localities.length > 0 ? localities[0] : null,
          gpsDetected: false,
          isNearMeActive: false,
        });
      },

      setSelectedLocality: (locality: LocalityInfo | null) => {
        set({ selectedLocality: locality, isNearMeActive: false });
      },

      setUserCoords: (coords: { lat: number; lng: number } | null) => {
        set({ userCoords: coords });
      },

      disableNearMe: () => {
        set({ isNearMeActive: false });
      },

      activateNearMe: async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          return { success: false, message: 'Geolocation is not supported by your browser.' };
        }

        set({ isLocating: true });

        return new Promise<{ success: boolean; message: string; city?: CityInfo }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              set({ userCoords: { lat: latitude, lng: longitude }, isNearMeActive: true });

              // Snap to closest city anchor via Haversine
              let closestCity: CityInfo = SUPPORTED_CITIES[0];
              let minDistanceKm = Infinity;

              for (const city of SUPPORTED_CITIES) {
                const distance = calculateHaversineDistanceKm(latitude, longitude, city.lat, city.lng);
                if (distance < minDistanceKm) {
                  minDistanceKm = distance;
                  closestCity = city;
                }
              }

              const localities = CITY_LOCALITIES[closestCity.slug] || [];
              set({
                selectedCity: closestCity,
                selectedLocality: localities[0] || null,
                isLocating: false,
                gpsDetected: true,
                isNearMeActive: true,
                isLocationModalOpen: false,
              });

              resolve({
                success: true,
                message: `Near Me active! (${Math.round(minDistanceKm)} km from ${closestCity.name})`,
                city: closestCity,
              });
            },
            (err) => {
              set({ isLocating: false });
              resolve({
                success: false,
                message: err.message || 'Location permission denied. Please allow location access.',
              });
            },
            { timeout: 10000, enableHighAccuracy: true }
          );
        });
      },

      autoDetectLocation: async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          return { success: false, message: 'Geolocation is not supported by your browser.' };
        }

        set({ isLocating: true });

        return new Promise<{ success: boolean; message: string; city?: CityInfo }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              set({ userCoords: { lat: latitude, lng: longitude } });

              // DSA Haversine matching to find the closest city
              let closestCity: CityInfo = SUPPORTED_CITIES[0];
              let minDistanceKm = Infinity;

              for (const city of SUPPORTED_CITIES) {
                const distance = calculateHaversineDistanceKm(latitude, longitude, city.lat, city.lng);
                if (distance < minDistanceKm) {
                  minDistanceKm = distance;
                  closestCity = city;
                }
              }

              // If within 150km of a supported city, auto-bind to it!
              if (minDistanceKm <= 150) {
                const localities = CITY_LOCALITIES[closestCity.slug] || [];
                set({
                  selectedCity: closestCity,
                  selectedLocality: localities[0] || null,
                  isLocating: false,
                  gpsDetected: true,
                });
                resolve({
                  success: true,
                  message: `Detected near ${closestCity.name} (${Math.round(minDistanceKm)} km away)`,
                  city: closestCity,
                });
              } else {
                // Outside supported zone, fallback to flagship Mid-Town (Ranchi)
                set({ isLocating: false, gpsDetected: false });
                resolve({
                  success: true,
                  message: `GPS detected, but SearchBook currently operates in Mid-Towns (Ranchi, Patna, Chandigarh) & Metros. Defaulting to Ranchi.`,
                  city: closestCity,
                });
              }
            },
            (err) => {
              set({ isLocating: false });
              resolve({
                success: false,
                message: err.message || 'Please allow location permission to auto-detect.',
              });
            },
            { timeout: 10000, enableHighAccuracy: true }
          );
        });
      },
    }),
    {
      name: 'searchbook-location-storage',
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        selectedLocality: state.selectedLocality,
        userCoords: state.userCoords,
        gpsDetected: state.gpsDetected,
        isNearMeActive: state.isNearMeActive,
      }),
    }
  )
);
