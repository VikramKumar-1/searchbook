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

  // Distance score: 1.0 when distance=0, 0.0 when distance=maxRadius
  const distanceScore = Math.max(0, 1 - distanceKm / maxRadiusKm);

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
    0.40 * distanceScore +
    0.30 * ratingScore +
    0.15 * recencyScore +
    0.10 * verifiedScore +
    0.05 * premiumScore
  );
}
