/**
 * ═══════════════════════════════════════════════════════════
 * 🧭 DSA HYPERLOCAL "NEAR ME" FEED ENGINE
 * ═══════════════════════════════════════════════════════════
 * 
 * Implements:
 * 1. Haversine Great-Circle Geodesic Distance Calculation (O(1))
 * 2. Exponential Distance-Decay Hyperlocal Scoring Function:
 *    Score = W_dist * exp(-ln(2)*d / halfLife) + W_rating * (r/5) + W_verif + W_rec
 * 3. Stratified Multi-Stream Category Interleaving (Greedy Round-Robin K-Way Merge):
 *    Guarantees balanced diversity: [Flat, PG, Hourly Hotel, Tiffin, Service]
 * 4. Resilient Fallback Synthesizer for fresh/sparse localities.
 * ═══════════════════════════════════════════════════════════
 */

import { ListingCardItem } from '@frontend/modules/listing/hooks/useListings';
import { CityInfo, SUPPORTED_CITIES } from '@frontend/stores/locationStore';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ScoredListingItem extends ListingCardItem {
  distanceKm: number;
  score: number;
}

/**
 * Calculates Great-Circle distance between two coordinates on Earth in kilometers.
 * Formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
 *          c = 2 ⋅ atan2( √a, √(1−a) )
 *          d = R ⋅ c
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Hyperlocal Multi-Factor Score with exponential distance decay.
 * Distance half-life is 4.5 km (listings within 1.5km get peak scores).
 */
export function calculateHyperlocalScore(
  distanceKm: number,
  avgRating: number = 4.5,
  isVerified: boolean = true
): number {
  const halfLifeKm = 4.5;
  const distanceScore = Math.exp((-Math.LN2 * distanceKm) / halfLifeKm);
  const ratingScore = Math.min(1, Math.max(0, avgRating / 5));
  const verifiedScore = isVerified ? 1 : 0;

  return 0.50 * distanceScore + 0.30 * ratingScore + 0.20 * verifiedScore;
}

/**
 * DSA Stratified Round-Robin Interleaving
 * Takes a pool of listings, groups them by main category:
 * [PG & Hostel, Flats, Hourly Hotels, Mess/Tiffin, Services]
 * and interleaves them 1-by-1 so the user gets a vibrant, multi-category feed.
 */
export function stratifyAndInterleaveCategories(
  listings: ScoredListingItem[],
  limit: number = 24
): ScoredListingItem[] {
  if (listings.length <= 1) return listings;

  const categoryBuckets = new Map<string, ScoredListingItem[]>();

  const getBucketKey = (slug?: string) => {
    const s = slug?.toLowerCase() || '';
    if (s.includes('pg') || s.includes('hostel') || s.includes('co-living')) return 'pg';
    if (s.includes('flat') || s.includes('apartment') || s.includes('bhk')) return 'flat';
    if (s.includes('hotel') || s.includes('hourly') || s.includes('stay')) return 'hotel';
    if (s.includes('tiffin') || s.includes('mess') || s.includes('food') || s.includes('cook')) return 'tiffin';
    return 'services'; // maid, plumber, electrician, etc.
  };

  for (const item of listings) {
    const key = getBucketKey(item.category?.slug);
    const bucket = categoryBuckets.get(key) || [];
    bucket.push(item);
    categoryBuckets.set(key, bucket);
  }

  // Sort each category queue by score descending (closest & best first)
  for (const queue of categoryBuckets.values()) {
    queue.sort((a, b) => b.score - a.score);
  }

  // Balanced priority rotation: PG -> Flat -> Hourly Hotel -> Tiffin -> Services
  const rotationOrder = ['pg', 'flat', 'hotel', 'tiffin', 'services'];
  const activeQueues = [
    ...rotationOrder.filter((k) => categoryBuckets.has(k)),
    ...Array.from(categoryBuckets.keys()).filter((k) => !rotationOrder.includes(k)),
  ];

  const interleavedResult: ScoredListingItem[] = [];
  let remainingCount = listings.length;

  while (interleavedResult.length < limit && remainingCount > 0) {
    let pushedInRound = false;
    for (const key of activeQueues) {
      const queue = categoryBuckets.get(key);
      if (queue && queue.length > 0) {
        interleavedResult.push(queue.shift()!);
        remainingCount--;
        pushedInRound = true;
        if (interleavedResult.length >= limit) break;
      }
    }
    if (!pushedInRound) break;
  }

  return interleavedResult;
}

/**
 * Synthesizes dynamic, realistic localized nearby stays and services
 * when database entries for a specific coordinate are sparse.
 */
export function generateSynthesizedNearMeItems(
  userCoords: GeoPoint,
  city: CityInfo
): ScoredListingItem[] {
  const blueprints = [
    {
      title: `${city.name} Central Luxury Boys & Girls PG`,
      slug: `${city.slug}-central-luxury-pg`,
      category: { id: 'c-pg', name: 'PG & Hostel', slug: 'pg-hostel', icon: '🛏️' },
      price: 5499,
      priceType: 'PER_MONTH',
      address: `Near City Center, ${city.name}`,
      offsetKm: 0.7,
      rating: 4.8,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop'],
    },
    {
      title: `Furnished 1 BHK Apartment (0 Brokerage)`,
      slug: `${city.slug}-1bhk-apartment`,
      category: { id: 'c-flat', name: 'Flats & Houses', slug: 'flats', icon: '🏢' },
      price: 8999,
      priceType: 'PER_MONTH',
      address: `Main Road, ${city.name}`,
      offsetKm: 1.2,
      rating: 4.6,
      isVerified: true,
      photos: ['/services/flat.jpg'],
    },
    {
      title: `Couple Friendly Boutique Stay (2h / 4h / Daily)`,
      slug: `${city.slug}-boutique-hourly-hotel`,
      category: { id: 'c-hotel', name: 'Hourly Hotels', slug: 'hourly-hotels', icon: '🏨' },
      price: 299,
      priceType: 'PER_HOUR',
      address: `Opposite Metro Station, ${city.name}`,
      offsetKm: 1.6,
      rating: 4.9,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'],
    },
    {
      title: `Annapurna Ghar Ka Khana (Lunch & Dinner Tiffin)`,
      slug: `${city.slug}-annapurna-tiffin`,
      category: { id: 'c-tiffin', name: 'Mess & Tiffin', slug: 'mess-tiffin', icon: '🍲' },
      price: 75,
      priceType: 'PER_MEAL',
      address: `Student Colony, ${city.name}`,
      offsetKm: 0.5,
      rating: 4.7,
      isVerified: true,
      photos: ['/services/tiffin.jpg'],
    },
    {
      title: `Verified Housemaid & Cooking Service`,
      slug: `${city.slug}-verified-maid-service`,
      category: { id: 'c-maid', name: 'Housemaid', slug: 'maid', icon: '🧹' },
      price: 1999,
      priceType: 'PER_MONTH',
      address: `All Sectors, ${city.name}`,
      offsetKm: 0.9,
      rating: 4.9,
      isVerified: true,
      photos: ['/services/flat.jpg'],
    },
    {
      title: `Co-Living Studio Room (WiFi + Food Included)`,
      slug: `${city.slug}-coliving-studio`,
      category: { id: 'c-pg2', name: 'PG & Hostel', slug: 'pg-hostel', icon: '🛏️' },
      price: 6999,
      priceType: 'PER_MONTH',
      address: `Tech Hub Road, ${city.name}`,
      offsetKm: 2.1,
      rating: 4.7,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
    },
    {
      title: `2 BHK Semi-Furnished Flat Near IT Park`,
      slug: `${city.slug}-2bhk-it-park`,
      category: { id: 'c-flat2', name: 'Flats & Houses', slug: 'flats', icon: '🏢' },
      price: 14500,
      priceType: 'PER_MONTH',
      address: `Ring Road, ${city.name}`,
      offsetKm: 2.7,
      rating: 4.8,
      isVerified: true,
      photos: ['/services/flat.jpg'],
    },
    {
      title: `Express AC Repair & Deep Gas Refill`,
      slug: `${city.slug}-express-ac-service`,
      category: { id: 'c-ac', name: 'AC Repair', slug: 'ac-repair', icon: '❄️' },
      price: 399,
      priceType: 'PER_SERVICE',
      address: `Doorstep Service, ${city.name}`,
      offsetKm: 1.4,
      rating: 4.6,
      isVerified: true,
      photos: ['/services/gas.jpg'],
    },
  ];

  return blueprints.map((b, idx) => {
    const dist = b.offsetKm;
    const score = calculateHyperlocalScore(dist, b.rating, b.isVerified);
    return {
      id: `near-me-${city.slug}-${idx}`,
      title: b.title,
      slug: b.slug,
      price: b.price,
      priceType: b.priceType,
      address: b.address,
      latitude: userCoords.lat + (Math.sin(idx) * dist) / 111,
      longitude: userCoords.lng + (Math.cos(idx) * dist) / 111,
      photos: b.photos,
      contactPhone: '9876543210',
      contactWhatsApp: '9876543210',
      isVerified: b.isVerified,
      isFeatured: true,
      city: { id: `c-${city.slug}`, name: city.name, slug: city.slug },
      category: b.category,
      _count: { reviews: 18 + idx * 4 },
      distanceKm: dist,
      score,
    };
  });
}
