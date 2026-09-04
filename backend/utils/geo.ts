/**
 * Haversine Formula — calculates distance between two GPS points on Earth.
 * Returns distance in KILOMETERS.
 * 
 * Time Complexity: O(1)
 * Used after Bounding Box pre-filter (which is O(log N) with B-Tree index).
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Bounding Box Pre-Filter
 * 
 * Given a center point and radius, returns min/max lat/lng boundaries.
 * This lets us use PostgreSQL's B-Tree index to eliminate 95%+ rows
 * BEFORE running the expensive Haversine calculation.
 * 
 * 1 degree latitude ≈ 111 km
 * 1 degree longitude ≈ 111 * cos(latitude) km
 */
export function getBoundingBox(
  lat: number, lng: number, radiusKm: number
): { latMin: number; latMax: number; lngMin: number; lngMax: number } {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(toRad(lat)));

  return {
    latMin: lat - latDelta,
    latMax: lat + latDelta,
    lngMin: lng - lngDelta,
    lngMax: lng + lngDelta,
  };
}

/**
 * Scoring Algorithm for ranking search results.
 * 
 * Weighted multi-factor scoring:
 * - Distance (40%): Closer = better
 * - Rating (30%): Higher average = better  
 * - Recency (15%): Newer listings = better
 * - Verified (10%): Admin-verified gets bonus
 * - Premium (5%): Paid providers get slight boost
 */
export function calculateScore(params: {
  distanceKm: number;
  maxRadiusKm: number;
  avgRating: number;
  createdAt: Date;
  isVerified: boolean;
  isPremium: boolean;
}): number {
  const { distanceKm, maxRadiusKm, avgRating, createdAt, isVerified, isPremium } = params;

  // Distance score: exponential decay with half-life of 5km for hyperlocal accuracy
  const halfLifeKm = 5;
  const distanceScore = Math.exp((-Math.LN2 * distanceKm) / halfLifeKm);

  // Rating score: 0 to 1
  const ratingScore = avgRating / 5;

  // Recency score: 1.0 for today, decays to 0 over 365 days
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 1 - daysSinceCreated / 365);

  // Verified bonus
  const verifiedScore = isVerified ? 1 : 0;

  // Premium bonus
  const premiumScore = isPremium ? 1 : 0;

  return (
    0.45 * distanceScore +
    0.25 * ratingScore +
    0.15 * recencyScore +
    0.10 * verifiedScore +
    0.05 * premiumScore
  );
}

/**
 * ═══════════════════════════════════════════════════════════
 * 🔄 DSA STRATIFIED ROUND-ROBIN MULTI-STREAM MERGE
 * ═══════════════════════════════════════════════════════════
 * 
 * Used for "Near Me" full feeds.
 * If 20 closest items are all PGs, naive distance sorting displays only PGs.
 * This algorithm groups items into Category Buckets (Flats, PGs, Hotels, Services, Tiffin),
 * sorts each bucket by score desc, and round-robins across buckets.
 * 
 * Time Complexity: O(N log K + N)
 * Space Complexity: O(N)
 */
export function interleaveCategoriesRoundRobin<T extends { category?: { slug?: string } | null; score: number }>(
  items: T[],
  limit: number
): T[] {
  if (items.length <= 1) return items;

  // 1. Group candidates into category queues
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const rawCategory = item.category?.slug || 'other';
    // Map granular sub-services to high-level umbrella buckets
    let umbrella = rawCategory;
    if (['pg-hostel', 'hostel', 'pg', 'boys-pg', 'girls-pg', 'co-living'].includes(rawCategory)) umbrella = 'pg-hostel';
    else if (['flats', 'flat', 'apartment', 'house-rent'].includes(rawCategory)) umbrella = 'flats';
    else if (['hourly-hotels', 'hotels', 'hourly-hotel', 'hotel'].includes(rawCategory)) umbrella = 'hourly-hotels';
    else if (['mess-tiffin', 'tiffin', 'food', 'mess', 'home-cook'].includes(rawCategory)) umbrella = 'mess-tiffin';
    else umbrella = 'services'; // maid, plumber, electrician, etc.

    const list = buckets.get(umbrella) || [];
    list.push(item);
    buckets.set(umbrella, list);
  }

  // 2. Ensure each category queue is ordered by highest score
  for (const list of buckets.values()) {
    list.sort((a, b) => b.score - a.score);
  }

  // 3. Priority Order of categories for the round-robin cycle:
  // [Flats, PGs, Hourly Hotels, Tiffin/Food, Services]
  const priorityOrder = ['pg-hostel', 'flats', 'hourly-hotels', 'mess-tiffin', 'services'];
  const activeKeys = [
    ...priorityOrder.filter((k) => buckets.has(k)),
    ...Array.from(buckets.keys()).filter((k) => !priorityOrder.includes(k)),
  ];

  const result: T[] = [];
  let remaining = items.length;

  while (result.length < limit && remaining > 0) {
    let addedInPass = false;
    for (const key of activeKeys) {
      const bucket = buckets.get(key);
      if (bucket && bucket.length > 0) {
        result.push(bucket.shift()!);
        remaining--;
        addedInPass = true;
        if (result.length >= limit) break;
      }
    }
    if (!addedInPass) break;
  }

  return result;
}

