import { LocationRepository } from './location.repository';

export interface LocationSearchResult {
  id: string;
  name: string;
  slug: string;
  type: 'city' | 'locality' | 'landmark';
  context: string; // e.g., "City", "New Delhi", "Lado Sarai, New Delhi"
  citySlug: string; 
  localitySlug?: string;
}  

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async search(query: string): Promise<LocationSearchResult[]> {
    const rawQuery = query.trim();
    if (rawQuery.length < 2) return [];

    // 1. Search our super-fast local PostgreSQL database first
    const { cities, localities, landmarks } = await this.repository.searchAll(rawQuery, 5);
    const results: LocationSearchResult[] = [];

    cities.forEach(c => results.push({ id: c.id, name: c.name, slug: c.slug, type: 'city', context: 'City', citySlug: c.slug }));
    localities.forEach(l => results.push({ id: l.id, name: l.name, slug: l.slug, type: 'locality', context: l.city.name, citySlug: l.city.slug, localitySlug: l.slug }));
    landmarks.forEach(lm => results.push({ id: lm.id, name: lm.name, slug: lm.slug, type: 'landmark', context: `${lm.locality.name}, ${lm.locality.city.name}`, citySlug: lm.locality.city.slug, localitySlug: lm.locality.slug }));

    // 2. If we found enough results locally, return immediately (Highly Optimized)
    if (results.length >= 3) {
      return results.slice(0, 8);
    }

    // 3. Fallback to FREE Maps API (Photon OSM) if local DB has no/few results
    try {
      // Append 'India' to prioritize Indian locations
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(rawQuery + ' India')}&limit=5`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Parse OSM features
        for (const feature of data.features || []) {
          const props = feature.properties;
          const name = props.name;
          const city = props.city || props.county || props.state;
          
          // Skip if missing name or city, or if we already have it in local results
          if (!name || !city || results.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            continue;
          }

          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

          // We determine type based on OSM tags (highway/amenity = landmark, else locality)
          const isLandmark = props.osm_value === 'hospital' || props.osm_value === 'mall' || props.osm_key === 'amenity';
          
          results.push({
            id: `osm-${props.osm_id}`,
            name: name,
            slug: slug,
            type: isLandmark ? 'landmark' : 'locality',
            context: `${city} (Maps)`,
            citySlug: citySlug,
            localitySlug: isLandmark ? undefined : slug,
          });

          // 4. Lazy Background Caching (Optional):
          // In a production environment, we could fire an async function here to 
          // save this new locality into our Postgres DB for future speed!
        }
      }
    } catch (e) {
      console.error('Map API Fallback Error:', e);
      // Fail silently and just return whatever local results we had
    }

    return results.slice(0, 8);
  }
}
