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

// Built-in offline directory for instant sub-millisecond search across key cities & localities
const POPULAR_LOCATIONS: Array<{
  name: string;
  slug: string;
  type: 'city' | 'locality' | 'landmark';
  context: string;
  citySlug: string;
  localitySlug?: string;
  keywords: string[];
}> = [
  // Delhi NCR
  { name: 'Delhi NCR', slug: 'delhi', type: 'city', context: 'Capital Region', citySlug: 'delhi', keywords: ['delhi', 'ncr', 'new delhi', 'capital'] },
  { name: 'New Delhi', slug: 'delhi', type: 'city', context: 'City Center', citySlug: 'delhi', keywords: ['delhi', 'new delhi'] },
  { name: 'Hauz Khas', slug: 'hauz-khas', type: 'locality', context: 'South Delhi', citySlug: 'delhi', localitySlug: 'hauz-khas', keywords: ['hauz khas', 'iit', 'sDA', 'south delhi'] },
  { name: 'Saket', slug: 'saket', type: 'locality', context: 'South Delhi', citySlug: 'delhi', localitySlug: 'saket', keywords: ['saket', 'select citywalk', 'saket metro'] },
  { name: 'Lado Sarai', slug: 'lado-sarai', type: 'locality', context: 'South Delhi', citySlug: 'delhi', localitySlug: 'lado-sarai', keywords: ['lado sarai', 'qutub minar'] },
  { name: 'Laxmi Nagar', slug: 'laxmi-nagar', type: 'locality', context: 'East Delhi', citySlug: 'delhi', localitySlug: 'laxmi-nagar', keywords: ['laxmi nagar', 'v3s', 'east delhi', 'metro'] },
  { name: 'Mukherjee Nagar', slug: 'mukherjee-nagar', type: 'locality', context: 'North Delhi (IAS Hub)', citySlug: 'delhi', localitySlug: 'mukherjee-nagar', keywords: ['mukherjee nagar', 'gtb', 'du', 'ias'] },
  { name: 'Karol Bagh', slug: 'karol-bagh', type: 'locality', context: 'Central Delhi (Coaching Hub)', citySlug: 'delhi', localitySlug: 'karol-bagh', keywords: ['karol bagh', 'rajendra nagar', 'ias'] },
  { name: 'Kalu Sarai', slug: 'kalu-sarai', type: 'locality', context: 'South Delhi (IIT Hub)', citySlug: 'delhi', localitySlug: 'kalu-sarai', keywords: ['kalu sarai', 'iit delhi', 'fiitjee', 'hauz khas'] },
  { name: 'Rohini', slug: 'rohini', type: 'locality', context: 'North West Delhi', citySlug: 'delhi', localitySlug: 'rohini', keywords: ['rohini', 'sector'] },
  { name: 'Dwarka', slug: 'dwarka', type: 'locality', context: 'South West Delhi', citySlug: 'delhi', localitySlug: 'dwarka', keywords: ['dwarka', 'sector'] },

  // Gurugram
  { name: 'Gurugram', slug: 'gurugram', type: 'city', context: 'Millennium City (NCR)', citySlug: 'gurugram', keywords: ['gurugram', 'gurgaon', 'haryana'] },
  { name: 'DLF Cyber City', slug: 'dlf-cyber-city', type: 'locality', context: 'DLF Phase 2, Gurugram', citySlug: 'gurugram', localitySlug: 'dlf-phase-2', keywords: ['dlf', 'cyber city', 'cyber hub', 'phase 2'] },
  { name: 'Sector 14', slug: 'sector-14', type: 'locality', context: 'Old Gurgaon', citySlug: 'gurugram', localitySlug: 'sector-14', keywords: ['sector 14', 'gurgaon'] },
  { name: 'Golf Course Road', slug: 'golf-course-road', type: 'locality', context: 'DLF Phase 5, Gurugram', citySlug: 'gurugram', localitySlug: 'golf-course-road', keywords: ['golf course', 'horizon center', 'phase 5'] },
  { name: 'Sohna Road', slug: 'sohna-road', type: 'locality', context: 'Gurugram', citySlug: 'gurugram', localitySlug: 'sohna-road', keywords: ['sohna road', 'vatika'] },

  // Noida
  { name: 'Noida', slug: 'noida', type: 'city', context: 'UP NCR', citySlug: 'noida', keywords: ['noida', 'gautam buddha nagar', 'up'] },
  { name: 'Sector 18', slug: 'sector-18', type: 'locality', context: 'Atta Market, Noida', citySlug: 'noida', localitySlug: 'sector-18', keywords: ['sector 18', 'dlf mall', 'atta market'] },
  { name: 'Sector 62', slug: 'sector-62', type: 'locality', context: 'Electronic City, Noida', citySlug: 'noida', localitySlug: 'sector-62', keywords: ['sector 62', 'fortis', 'jiit'] },
  { name: 'Greater Noida', slug: 'greater-noida', type: 'locality', context: 'Knowledge Park, Noida', citySlug: 'noida', localitySlug: 'greater-noida', keywords: ['greater noida', 'knowledge park', 'pari chowk'] },

  // Ranchi
  { name: 'Ranchi', slug: 'ranchi', type: 'city', context: 'Capital of Jharkhand', citySlug: 'ranchi', keywords: ['ranchi', 'jharkhand', 'capital'] },
  { name: 'Lalpur', slug: 'lalpur', type: 'locality', context: 'Ranchi Center', citySlug: 'ranchi', localitySlug: 'lalpur', keywords: ['lalpur', 'nucleus mall', 'circular road', 'chowk', 'ranchi'] },
  { name: 'Morabadi', slug: 'morabadi', type: 'locality', context: 'Ranchi', citySlug: 'ranchi', localitySlug: 'morabadi', keywords: ['morabadi', 'maidan', 'oxygen park', 'ranchi university', 'ranchi'] },
  { name: 'Hinoo', slug: 'hinoo', type: 'locality', context: 'Near Airport, Ranchi', citySlug: 'ranchi', localitySlug: 'hinoo', keywords: ['hinoo', 'airport', 'birsa munda', 'ranchi'] },
  { name: 'Doranda', slug: 'doranda', type: 'locality', context: 'Ranchi', citySlug: 'ranchi', localitySlug: 'doranda', keywords: ['doranda', 'high court', 'ranchi'] },
  { name: 'Kanke Road', slug: 'kanke-road', type: 'locality', context: 'Ranchi', citySlug: 'ranchi', localitySlug: 'kanke-road', keywords: ['kanke', 'kanke road', 'bau', 'ranchi'] },
  { name: 'Bariatu', slug: 'bariatu', type: 'locality', context: 'Near RIMS, Ranchi', citySlug: 'ranchi', localitySlug: 'bariatu', keywords: ['bariatu', 'rims', 'ranchi'] },
  { name: 'Ratu Road', slug: 'ratu-road', type: 'locality', context: 'Ranchi', citySlug: 'ranchi', localitySlug: 'ratu-road', keywords: ['ratu road', 'pandra', 'ranchi'] },
  { name: 'Harmu', slug: 'harmu', type: 'locality', context: 'Harmu Housing Colony, Ranchi', citySlug: 'ranchi', localitySlug: 'harmu', keywords: ['harmu', 'bypass', 'ranchi'] },
  { name: 'Ashok Nagar', slug: 'ashok-nagar', type: 'locality', context: 'Ranchi', citySlug: 'ranchi', localitySlug: 'ashok-nagar', keywords: ['ashok nagar', 'ranchi'] },

  // Chandigarh
  { name: 'Chandigarh', slug: 'chandigarh', type: 'city', context: 'Tricity', citySlug: 'chandigarh', keywords: ['chandigarh', 'tricity', 'punjab', 'haryana'] },
  { name: 'Sector 17', slug: 'sector-17', type: 'locality', context: 'City Center, Chandigarh', citySlug: 'chandigarh', localitySlug: 'sector-17', keywords: ['sector 17', 'plaza', 'chandigarh'] },
  { name: 'Sector 35', slug: 'sector-35', type: 'locality', context: 'Chandigarh', citySlug: 'chandigarh', localitySlug: 'sector-35', keywords: ['sector 35', 'market', 'chandigarh'] },
  { name: 'Mohali', slug: 'mohali', type: 'locality', context: 'Tricity', citySlug: 'chandigarh', localitySlug: 'mohali', keywords: ['mohali', 'phase', 'it park', 'chandigarh'] },

  // Patna
  { name: 'Patna', slug: 'patna', type: 'city', context: 'Capital of Bihar', citySlug: 'patna', keywords: ['patna', 'bihar'] },
  { name: 'Boring Road', slug: 'boring-road', type: 'locality', context: 'Patna', citySlug: 'patna', localitySlug: 'boring-road', keywords: ['boring road', 'an college', 'patna'] },
  { name: 'Kankarbagh', slug: 'kankarbagh', type: 'locality', context: 'Patna', citySlug: 'patna', localitySlug: 'kankarbagh', keywords: ['kankarbagh', 'patna'] },

  // Bengaluru
  { name: 'Bengaluru', slug: 'bengaluru', type: 'city', context: 'Silicon Valley of India', citySlug: 'bengaluru', keywords: ['bengaluru', 'bangalore', 'karnataka'] },
  { name: 'Koramangala', slug: 'koramangala', type: 'locality', context: 'Bengaluru', citySlug: 'bengaluru', localitySlug: 'koramangala', keywords: ['koramangala', 'sony world', 'bengaluru'] },
  { name: 'Indiranagar', slug: 'indiranagar', type: 'locality', context: 'Bengaluru', citySlug: 'bengaluru', localitySlug: 'indiranagar', keywords: ['indiranagar', '100 feet road', 'bengaluru'] },
  { name: 'HSR Layout', slug: 'hsr-layout', type: 'locality', context: 'Bengaluru', citySlug: 'bengaluru', localitySlug: 'hsr-layout', keywords: ['hsr', 'hsr layout', 'bengaluru'] },
  { name: 'Whitefield', slug: 'whitefield', type: 'locality', context: 'Bengaluru', citySlug: 'bengaluru', localitySlug: 'whitefield', keywords: ['whitefield', 'itpb', 'bengaluru'] },

  // Hyderabad
  { name: 'Hyderabad', slug: 'hyderabad', type: 'city', context: 'Cyberabad Hub', citySlug: 'hyderabad', keywords: ['hyderabad', 'telangana', 'secunderabad', 'cyberabad'] },
  { name: 'Hitec City', slug: 'hitec-city', type: 'locality', context: 'Hyderabad', citySlug: 'hyderabad', localitySlug: 'hitec-city', keywords: ['hitec city', 'cyber towers', 'hyderabad'] },
  { name: 'Gachibowli', slug: 'gachibowli', type: 'locality', context: 'Hyderabad', citySlug: 'hyderabad', localitySlug: 'gachibowli', keywords: ['gachibowli', 'financial district', 'hyderabad'] },
  { name: 'Madhapur', slug: 'madhapur', type: 'locality', context: 'Hyderabad', citySlug: 'hyderabad', localitySlug: 'madhapur', keywords: ['madhapur', 'aaspire', 'hyderabad'] },
  { name: 'Banjara Hills', slug: 'banjara-hills', type: 'locality', context: 'Hyderabad', citySlug: 'hyderabad', localitySlug: 'banjara-hills', keywords: ['banjara hills', 'road no 12', 'hyderabad'] },

  // Mumbai
  { name: 'Mumbai', slug: 'mumbai', type: 'city', context: 'Financial Capital', citySlug: 'mumbai', keywords: ['mumbai', 'bombay', 'maharashtra'] },
  { name: 'Andheri West', slug: 'andheri-west', type: 'locality', context: 'Mumbai', citySlug: 'mumbai', localitySlug: 'andheri-west', keywords: ['andheri', 'andheri west', 'lokhandwala', 'mumbai'] },
  { name: 'Bandra West', slug: 'bandra-west', type: 'locality', context: 'Mumbai', citySlug: 'mumbai', localitySlug: 'bandra-west', keywords: ['bandra', 'bandra west', 'linking road', 'mumbai'] },
  { name: 'Powai', slug: 'powai', type: 'locality', context: 'Mumbai (Hiranandani)', citySlug: 'mumbai', localitySlug: 'powai', keywords: ['powai', 'hiranandani', 'iit bombay', 'mumbai'] },
  { name: 'Juhu', slug: 'juhu', type: 'locality', context: 'Mumbai', citySlug: 'mumbai', localitySlug: 'juhu', keywords: ['juhu', 'beach', 'mumbai'] },

  // Pune
  { name: 'Pune', slug: 'pune', type: 'city', context: 'Oxford of the East & IT Hub', citySlug: 'pune', keywords: ['pune', 'poona', 'maharashtra'] },
  { name: 'Viman Nagar', slug: 'viman-nagar', type: 'locality', context: 'Pune', citySlug: 'pune', localitySlug: 'viman-nagar', keywords: ['viman nagar', 'symbiosis', 'phoenix mall', 'pune'] },
  { name: 'Hinjewadi', slug: 'hinjewadi', type: 'locality', context: 'Pune (IT Park)', citySlug: 'pune', localitySlug: 'hinjewadi', keywords: ['hinjewadi', 'phase 1', 'it park', 'pune'] },
  { name: 'Kothrud', slug: 'kothrud', type: 'locality', context: 'Pune', citySlug: 'pune', localitySlug: 'kothrud', keywords: ['kothrud', 'mit', 'pune'] },
  { name: 'Wakad', slug: 'wakad', type: 'locality', context: 'Pune', citySlug: 'pune', localitySlug: 'wakad', keywords: ['wakad', 'dange chowk', 'pune'] },

  // Kolkata
  { name: 'Kolkata', slug: 'kolkata', type: 'city', context: 'Cultural Capital', citySlug: 'kolkata', keywords: ['kolkata', 'calcutta', 'west bengal'] },
  { name: 'Salt Lake', slug: 'salt-lake', type: 'locality', context: 'Kolkata (Sector V IT)', citySlug: 'kolkata', localitySlug: 'salt-lake', keywords: ['salt lake', 'sector 5', 'bidhannagar', 'kolkata'] },
  { name: 'New Town', slug: 'new-town', type: 'locality', context: 'Kolkata / Rajarhat', citySlug: 'kolkata', localitySlug: 'new-town', keywords: ['new town', 'rajarhat', 'eco park', 'kolkata'] },
  { name: 'Park Street', slug: 'park-street', type: 'locality', context: 'Kolkata', citySlug: 'kolkata', localitySlug: 'park-street', keywords: ['park street', 'camac street', 'kolkata'] },

  // Ahmedabad
  { name: 'Ahmedabad', slug: 'ahmedabad', type: 'city', context: 'Commercial Hub of Gujarat', citySlug: 'ahmedabad', keywords: ['ahmedabad', 'gujarat', 'amdavad'] },
  { name: 'Navrangpura', slug: 'navrangpura', type: 'locality', context: 'Ahmedabad', citySlug: 'ahmedabad', localitySlug: 'navrangpura', keywords: ['navrangpura', 'gujarat university', 'ahmedabad'] },
  { name: 'SG Highway', slug: 'sg-highway', type: 'locality', context: 'Ahmedabad', citySlug: 'ahmedabad', localitySlug: 'sg-highway', keywords: ['sg highway', 'iskcon', 'prahlad nagar', 'ahmedabad'] },
  { name: 'Vastrapur', slug: 'vastrapur', type: 'locality', context: 'Ahmedabad (IIM)', citySlug: 'ahmedabad', localitySlug: 'vastrapur', keywords: ['vastrapur', 'iim', 'alpha one', 'ahmedabad'] },

  // Dehradun
  { name: 'Dehradun', slug: 'dehradun', type: 'city', context: 'Valley Hub of Uttarakhand', citySlug: 'dehradun', keywords: ['dehradun', 'doon', 'uttarakhand'] },
  { name: 'Rajpur Road', slug: 'rajpur-road', type: 'locality', context: 'Dehradun', citySlug: 'dehradun', localitySlug: 'rajpur-road', keywords: ['rajpur road', 'pacific mall', 'dehradun'] },
  { name: 'Karanpur', slug: 'karanpur', type: 'locality', context: 'Dehradun (Student Hub)', citySlug: 'dehradun', localitySlug: 'karanpur', keywords: ['karanpur', 'dav', 'survey chowk', 'dehradun'] },
  { name: 'Clement Town', slug: 'clement-town', type: 'locality', context: 'Dehradun', citySlug: 'dehradun', localitySlug: 'clement-town', keywords: ['clement town', 'graphic era', 'dehradun'] },

  // Shimla
  { name: 'Shimla', slug: 'shimla', type: 'city', context: 'Queen of Hills & Stays', citySlug: 'shimla', keywords: ['shimla', 'simla', 'himachal pradesh'] },
  { name: 'Mall Road', slug: 'mall-road', type: 'locality', context: 'Shimla Center', citySlug: 'shimla', localitySlug: 'mall-road', keywords: ['mall road', 'ridge', 'lakkar bazar', 'shimla'] },
  { name: 'Sanjauli', slug: 'sanjauli', type: 'locality', context: 'Shimla', citySlug: 'shimla', localitySlug: 'sanjauli', keywords: ['sanjauli', 'college', 'shimla'] },
  { name: 'Summer Hill', slug: 'summer-hill', type: 'locality', context: 'Shimla (HPU)', citySlug: 'shimla', localitySlug: 'summer-hill', keywords: ['summer hill', 'hpu', 'shimla'] },
];

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async search(query: string): Promise<LocationSearchResult[]> {
    const rawQuery = query.trim().toLowerCase();
    if (!rawQuery) return [];

    const results: LocationSearchResult[] = [];
    const seen = new Set<string>();

    const addResult = (item: LocationSearchResult) => {
      const key = `${item.name.toLowerCase()}-${item.citySlug.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(item);
      }
    };

    // 1. Instant match against curated offline directory (0ms, 100% reliable)
    for (const loc of POPULAR_LOCATIONS) {
      const isMatch =
        loc.name.toLowerCase().includes(rawQuery) ||
        loc.context.toLowerCase().includes(rawQuery) ||
        loc.keywords.some((k) => k.includes(rawQuery) || rawQuery.includes(k));

      if (isMatch) {
        addResult({
          id: `curated-${loc.slug}`,
          name: loc.name,
          slug: loc.slug,
          type: loc.type,
          context: loc.context,
          citySlug: loc.citySlug,
          localitySlug: loc.localitySlug,
        });
      }
    }

    // 2. Search PostgreSQL database (Cities, Localities, Landmarks, Listings)
    try {
      const { cities, localities, landmarks, listings } = await this.repository.searchAll(rawQuery, 6);

      cities.forEach((c) =>
        addResult({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: 'city',
          context: 'Verified City',
          citySlug: c.slug,
        })
      );

      localities.forEach((l) =>
        addResult({
          id: l.id,
          name: l.name,
          slug: l.slug,
          type: 'locality',
          context: l.city.name,
          citySlug: l.city.slug,
          localitySlug: l.slug,
        })
      );

      landmarks.forEach((lm) =>
        addResult({
          id: lm.id,
          name: lm.name,
          slug: lm.slug,
          type: 'landmark',
          context: `${lm.locality.name}, ${lm.locality.city.name}`,
          citySlug: lm.locality.city.slug,
          localitySlug: lm.locality.slug,
        })
      );

      // Add addresses from active listings
      listings.forEach((lst) => {
        if (lst.city) {
          addResult({
            id: `listing-loc-${lst.id}`,
            name: lst.locality?.name || lst.title,
            slug: lst.locality?.slug || lst.city.slug,
            type: 'locality',
            context: `${lst.address} (${lst.city.name})`,
            citySlug: lst.city.slug,
            localitySlug: lst.locality?.slug,
          });
        }
      });
    } catch (dbErr) {
      console.error('DB Location search error (non-fatal):', dbErr);
    }

    // 3. If we already have 4+ good results, return immediately for maximum speed
    if (results.length >= 4) {
      return results.slice(0, 8);
    }

    // 4. Fallback to Photon OpenStreetMap API with enhanced parser
    if (rawQuery.length >= 2) {
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(rawQuery + ' India')}&limit=6`,
          { signal: AbortSignal.timeout(3000) }
        );

        if (response.ok) {
          const data = await response.json();
          for (const feature of data.features || []) {
            const props = feature.properties;
            const name = props.name;
            if (!name) continue;

            const city = props.city || props.district || props.county || props.state || 'India';
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const isLandmark = props.osm_value === 'hospital' || props.osm_value === 'mall' || props.osm_key === 'amenity';

            addResult({
              id: `osm-${props.osm_id || Math.random().toString(36).slice(2, 7)}`,
              name,
              slug,
              type: isLandmark ? 'landmark' : 'locality',
              context: `${city} (Maps)`,
              citySlug: citySlug || 'delhi',
              localitySlug: isLandmark ? undefined : slug,
            });
          }
        }
      } catch {
        // Silently return what we already have
      }
    }

    return results.slice(0, 8);
  }
}

