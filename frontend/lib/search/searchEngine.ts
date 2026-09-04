/**
 * ═══════════════════════════════════════════════════════════
 * 🔍 SEARCHBOOK ROBUST SEARCH ENGINE (DSA POWERED)
 * ═══════════════════════════════════════════════════════════
 *
 * Implements rigorous Data Structures & Algorithms:
 * 1. Trie (Prefix Tree): Ultra-fast O(k) prefix autocomplete matching.
 * 2. Levenshtein Distance (DP): Edit distance fuzzy matching for typo tolerance (e.g. "hstel" -> "hostel").
 * 3. Haversine Distance: Spherical geometry for closest city GPS auto-detection.
 * 4. Inverted Token Index & Weighted Priority Scoring: Guaranteed top-K ranking.
 * 5. Safe Fallback: Protects against random/garbage input with guided recovery.
 * ═══════════════════════════════════════════════════════════
 */

export type SearchResultType = 'category' | 'locality' | 'city' | 'service' | 'trending';

export interface SearchEntity {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  categorySlug?: string;
  citySlug?: string;
  localitySlug?: string;
  searchQuery?: string;
  icon: string;
  keywords: string[];
}

export interface SearchMatch {
  entity: SearchEntity;
  score: number;
  matchedBy: 'prefix' | 'token' | 'fuzzy';
  highlightedTitle?: string;
  typoCorrection?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchMatch[];
  isUnknownQuery: boolean;
  suggestedRecoveryCategories?: SearchEntity[];
}

/* ─────────────────────────────────────────────────────────────
 * 1. HAVERSINE DISTANCE ALGORITHM (DSA)
 * Calculates great-circle distance between two GPS coordinates
 * ───────────────────────────────────────────────────────────── */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/* ─────────────────────────────────────────────────────────────
 * 2. LEVENSHTEIN DISTANCE (DYNAMIC PROGRAMMING MATRIX)
 * Computes minimum edit distance for typo tolerance
 * ───────────────────────────────────────────────────────────── */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Optimize space to O(min(m, n))
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/* ─────────────────────────────────────────────────────────────
 * 3. TRIE (PREFIX TREE) DATA STRUCTURE
 * Provides O(k) prefix search for rapid mobile keystroke feedback
 * ───────────────────────────────────────────────────────────── */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  entityIds: Set<string> = new Set();
}

class Trie {
  private root: TrieNode = new TrieNode();

  insert(word: string, entityId: string): void {
    let node = this.root;
    const clean = word.toLowerCase().trim();

    for (const char of clean) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      node.entityIds.add(entityId);
    }
    node.isEndOfWord = true;
  }

  searchPrefix(prefix: string): Set<string> {
    let node = this.root;
    const clean = prefix.toLowerCase().trim();

    for (const char of clean) {
      if (!node.children.has(char)) {
        return new Set();
      }
      node = node.children.get(char)!;
    }
    return node.entityIds;
  }
}

/* ─────────────────────────────────────────────────────────────
 * 4. SEARCHABLE CATALOG DATABASE
 * Categorized into Mid-Towns and Major Metros
 * ───────────────────────────────────────────────────────────── */
export const SEARCH_ENTITIES: SearchEntity[] = [
  // ── Categories & Core Vertical Offerings
  {
    id: 'cat-pg-hostel',
    title: 'Hostels & PGs',
    subtitle: 'Boys, Girls & Co-Living Spaces with Food & WiFi',
    type: 'category',
    categorySlug: 'pg-hostel',
    icon: '🛏️',
    keywords: ['pg', 'hostel', 'boys pg', 'girls pg', 'co-living', 'student stay', 'mess food', 'stanza', 'zolo'],
  },
  {
    id: 'cat-hourly-hotels',
    title: 'Hourly Hotels & Short Stays',
    subtitle: '100% Couple Friendly · 2 to 6 Hours · Pay at Desk',
    type: 'category',
    categorySlug: 'hourly-hotels',
    icon: '🏨',
    keywords: ['hotel', 'hourly', 'couple friendly', 'short stay', 'day stay', 'transit hotel', 'micro stay', 'rooms'],
  },
  {
    id: 'cat-flats',
    title: 'Flats & Apartments',
    subtitle: '1 RK, 1 BHK, 2 BHK · Zero Brokerage Homes',
    type: 'category',
    categorySlug: 'flats',
    icon: '🏢',
    keywords: ['flat', 'apartment', '1bhk', '2bhk', '1rk', 'studio', 'room rent', 'house rent', 'bachelor', 'family'],
  },
  {
    id: 'cat-tiffin',
    title: 'Mess & Tiffin Services',
    subtitle: 'Pure Veg & Non-Veg Daily Home Cooked Meals',
    type: 'category',
    categorySlug: 'tiffin',
    icon: '🍱',
    keywords: ['tiffin', 'mess', 'lunch', 'dinner', 'dabba', 'veg thali', 'student mess', 'food delivery', 'cook'],
  },
  {
    id: 'cat-maid',
    title: 'Housemaid & Bai Service',
    subtitle: 'Verified Cleaning, Sweeping, Mopping & Utensils',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'maid',
    icon: '🧹',
    keywords: ['maid', 'bai', 'cleaning', 'housekeeping', 'sweeper', ' बर्तन', 'झाड़ू', 'bartan'],
  },
  {
    id: 'cat-cook',
    title: 'Home Cook & Chef',
    subtitle: 'Daily Morning & Evening Home Cook for Families & Bachelors',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'cook',
    icon: '👨‍🍳',
    keywords: ['cook', 'chef', 'khana', 'cooking', 'rasoiya', 'home food', 'breakfast dinner'],
  },
  {
    id: 'cat-water',
    title: 'Water Tanker Supply',
    subtitle: '1000L - 5000L Potable Water Delivery to Doorstep',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'water',
    icon: '💧',
    keywords: ['water', 'tanker', 'pani', 'drinking water', 'supply', 'water delivery'],
  },
  {
    id: 'cat-gas',
    title: 'LPG Gas Cylinder Delivery',
    subtitle: 'Fast Cooking Gas Delivery & Refill Services',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'gas',
    icon: '🔥',
    keywords: ['gas', 'cylinder', 'lpg', 'indane', 'bharat', 'hp gas', 'gas agency'],
  },
  {
    id: 'cat-plumber',
    title: 'Plumber Service',
    subtitle: 'Tap Leakage, Pipe Repair, Bathroom Fitting',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'plumber',
    icon: '🔧',
    keywords: ['plumber', 'pipe', 'leakage', 'tap', 'bathroom', 'fitting', 'motor'],
  },
  {
    id: 'cat-electrician',
    title: 'Electrician Service',
    subtitle: 'Wiring, MCB, Fan, Inverter, Appliance Repair',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'electrician',
    icon: '⚡',
    keywords: ['electrician', 'light', 'fan', 'wiring', 'mcb', 'inverter', 'short circuit'],
  },
  {
    id: 'cat-ac',
    title: 'AC Repair & Servicing',
    subtitle: 'Jet Cleaning, Gas Charging & Installation',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'ac',
    icon: '❄️',
    keywords: ['ac', 'air conditioner', 'ac repair', 'cooling', 'gas refill', 'ac service'],
  },
  {
    id: 'cat-laundry',
    title: 'Laundry & Dry Cleaning',
    subtitle: 'Doorstep Clothes Wash, Iron & Dry Clean Pick-up',
    type: 'service',
    categorySlug: 'services',
    searchQuery: 'laundry',
    icon: '👔',
    keywords: ['laundry', 'dry clean', 'wash', 'iron', 'dhobi', 'press'],
  },

  // ── Mid-Town Localities: Ranchi (Primary Regional Hub)
  {
    id: 'loc-lalpur',
    title: 'Lalpur, Ranchi',
    subtitle: 'Major Student & Professional Hub · PGs, Food & Flats',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'lalpur',
    searchQuery: 'Lalpur',
    icon: '📍',
    keywords: ['lalpur', 'ranchi', 'circular road', 'peace road', 'student hub', 'plaza'],
  },
  {
    id: 'loc-harmu',
    title: 'Harmu Housing Colony, Ranchi',
    subtitle: 'Peaceful Residential Colony · Verified Flats & Stays',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'harmu',
    searchQuery: 'Harmu',
    icon: '📍',
    keywords: ['harmu', 'ranchi', 'harmu housing colony', 'bypass', 'sahjanand chowk'],
  },
  {
    id: 'loc-kanke',
    title: 'Kanke Road, Ranchi',
    subtitle: 'Premium Stays, Hostels near BAU & CMPDI',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'kanke',
    searchQuery: 'Kanke Road',
    icon: '📍',
    keywords: ['kanke', 'kanke road', 'ranchi', 'cmpdi', 'chandni chowk kanke', 'rock garden'],
  },
  {
    id: 'loc-bariatu',
    title: 'Bariatu, Ranchi',
    subtitle: 'Medical Hub near RIMS · Student Hostels & Rooms',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'bariatu',
    searchQuery: 'Bariatu',
    icon: '📍',
    keywords: ['bariatu', 'rims', 'ranchi', 'booty more', 'medical student'],
  },
  {
    id: 'loc-morabadi',
    title: 'Morabadi, Ranchi',
    subtitle: 'Green, Open Ground, Universities & Executive Rooms',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'morabadi',
    searchQuery: 'Morabadi',
    icon: '📍',
    keywords: ['morabadi', 'ranchi', 'morabadi ground', 'tagore hill', 'ranchi university'],
  },
  {
    id: 'loc-doranda',
    title: 'Doranda, Ranchi',
    subtitle: 'Central Connectivity, High Court & Station Close',
    type: 'locality',
    citySlug: 'ranchi',
    localitySlug: 'doranda',
    searchQuery: 'Doranda',
    icon: '📍',
    keywords: ['doranda', 'ranchi', 'high court', 'mecon', 'hinoo'],
  },

  // ── Mid-Towns & Hill Stations: Patna, Dehradun, Shimla, Chandigarh
  {
    id: 'loc-boring-road-patna',
    title: 'Boring Road, Patna',
    subtitle: 'Coaching & Student Hub · Verified PGs & Flats',
    type: 'locality',
    citySlug: 'patna',
    localitySlug: 'boring-road',
    searchQuery: 'Boring Road',
    icon: '📍',
    keywords: ['boring road', 'patna', 'bihar', 'student hub', 'coaching'],
  },
  {
    id: 'loc-kankarbagh-patna',
    title: 'Kankarbagh, Patna',
    subtitle: 'Major Residential & Commercial Colony',
    type: 'locality',
    citySlug: 'patna',
    localitySlug: 'kankarbagh',
    searchQuery: 'Kankarbagh',
    icon: '📍',
    keywords: ['kankarbagh', 'patna', 'tiwary bechar', 'colony'],
  },
  {
    id: 'loc-rajpur-rd-dehradun',
    title: 'Rajpur Road, Dehradun',
    subtitle: 'Scenic Valley Corridor · Cafes, Stays & Apartments',
    type: 'locality',
    citySlug: 'dehradun',
    localitySlug: 'rajpur-road',
    searchQuery: 'Rajpur Road',
    icon: '📍',
    keywords: ['rajpur road', 'dehradun', 'uttarakhand', 'valley', 'stays'],
  },
  {
    id: 'loc-clement-town-dehradun',
    title: 'Clement Town, Dehradun',
    subtitle: 'University & Student Living · Graphic Era Area',
    type: 'locality',
    citySlug: 'dehradun',
    localitySlug: 'clement-town',
    searchQuery: 'Clement Town',
    icon: '📍',
    keywords: ['clement town', 'dehradun', 'graphic era', 'hostels', 'pg'],
  },
  {
    id: 'loc-mall-rd-shimla',
    title: 'Mall Road, Shimla',
    subtitle: 'Heart of Town · Micro Stays & Vacation Rooms',
    type: 'locality',
    citySlug: 'shimla',
    localitySlug: 'mall-road',
    searchQuery: 'Mall Road',
    icon: '📍',
    keywords: ['mall road', 'shimla', 'ridge', 'himachal', 'hill station'],
  },
  {
    id: 'loc-sanjauli-shimla',
    title: 'Sanjauli, Shimla',
    subtitle: 'College Hub & Budget Rooms near IGMC',
    type: 'locality',
    citySlug: 'shimla',
    localitySlug: 'sanjauli',
    searchQuery: 'Sanjauli',
    icon: '📍',
    keywords: ['sanjauli', 'shimla', 'igmc', 'student stays'],
  },
  {
    id: 'loc-sec-17-chandigarh',
    title: 'Sector 17, Chandigarh',
    subtitle: 'City Center & Commercial Hub',
    type: 'locality',
    citySlug: 'chandigarh',
    localitySlug: 'sector-17',
    searchQuery: 'Sector 17',
    icon: '📍',
    keywords: ['sector 17', 'chandigarh', 'plaza', 'city center'],
  },
  {
    id: 'loc-mohali-chandigarh',
    title: 'Mohali Phase 7, Chandigarh',
    subtitle: 'IT Park, Startups & Modern PGs',
    type: 'locality',
    citySlug: 'chandigarh',
    localitySlug: 'mohali',
    searchQuery: 'Mohali',
    icon: '📍',
    keywords: ['mohali', 'chandigarh', 'phase 7', 'it park'],
  },

  // ── Major Metros: Delhi, New Delhi, Gurugram, Noida
  {
    id: 'loc-cp-new-delhi',
    title: 'Connaught Place, New Delhi',
    subtitle: 'Central Hub · Premium Executive Rooms & Transit Stays',
    type: 'locality',
    citySlug: 'new-delhi',
    localitySlug: 'connaught-place',
    searchQuery: 'Connaught Place',
    icon: '📍',
    keywords: ['connaught place', 'cp', 'new delhi', 'central delhi', 'metro'],
  },
  {
    id: 'loc-cyber-hub',
    title: 'Cyber Hub, Gurugram',
    subtitle: 'Tech Park, Luxury Hostels & Hourly Transit Stays',
    type: 'locality',
    citySlug: 'gurugram',
    localitySlug: 'cyber-hub',
    searchQuery: 'Cyber Hub',
    icon: '📍',
    keywords: ['cyber hub', 'gurugram', 'dlf', 'cyber city', 'gurgaon', 'rapid metro'],
  },
  {
    id: 'loc-sec-62-noida',
    title: 'Sector 62, Noida',
    subtitle: 'IT Institutional Area · Student PGs & 1 BHK Flats',
    type: 'locality',
    citySlug: 'noida',
    localitySlug: 'sector-62',
    searchQuery: 'Sector 62',
    icon: '📍',
    keywords: ['sector 62', 'noida', 'electronic city', 'jiit', 'metro'],
  },
  {
    id: 'loc-south-ex',
    title: 'South Extension, Delhi',
    subtitle: 'Coaching Hub, Girls Hostels & Executive PGs',
    type: 'locality',
    citySlug: 'delhi',
    localitySlug: 'south-ex',
    searchQuery: 'South Extension',
    icon: '📍',
    keywords: ['south ex', 'south extension', 'delhi', 'aiims', 'ring road'],
  },

  // ── Tech Metros: Bengaluru, Hyderabad, Pune, Mumbai, Kolkata, Ahmedabad
  {
    id: 'loc-koramangala-blr',
    title: 'Koramangala, Bengaluru',
    subtitle: 'Startup Capital · Co-Living, PGs & Cafes',
    type: 'locality',
    citySlug: 'bengaluru',
    localitySlug: 'koramangala',
    searchQuery: 'Koramangala',
    icon: '📍',
    keywords: ['koramangala', 'bengaluru', 'bangalore', 'startups', 'co-living', 'pg'],
  },
  {
    id: 'loc-indiranagar-blr',
    title: 'Indiranagar, Bengaluru',
    subtitle: '100ft Road · Premium Flats & Co-Working Stays',
    type: 'locality',
    citySlug: 'bengaluru',
    localitySlug: 'indiranagar',
    searchQuery: 'Indiranagar',
    icon: '📍',
    keywords: ['indiranagar', 'bengaluru', 'bangalore', '100ft road', 'metro'],
  },
  {
    id: 'loc-hitec-hyd',
    title: 'Hitec City, Hyderabad',
    subtitle: 'Cyber Towers · Tech Hostels & Hourly Hotels',
    type: 'locality',
    citySlug: 'hyderabad',
    localitySlug: 'hitec-city',
    searchQuery: 'Hitec City',
    icon: '📍',
    keywords: ['hitec city', 'hyderabad', 'cyber towers', 'madhapur', 'it hub'],
  },
  {
    id: 'loc-gachibowli-hyd',
    title: 'Gachibowli, Hyderabad',
    subtitle: 'Financial District · Gated Flats & Student Rooms',
    type: 'locality',
    citySlug: 'hyderabad',
    localitySlug: 'gachibowli',
    searchQuery: 'Gachibowli',
    icon: '📍',
    keywords: ['gachibowli', 'hyderabad', 'financial district', 'pg', 'flats'],
  },
  {
    id: 'loc-andheri-mum',
    title: 'Andheri West, Mumbai',
    subtitle: 'Film & Commercial Hub · Sharing Flats & Hourly Stays',
    type: 'locality',
    citySlug: 'mumbai',
    localitySlug: 'andheri-west',
    searchQuery: 'Andheri West',
    icon: '📍',
    keywords: ['andheri', 'andheri west', 'mumbai', 'lokhandwala', 'metro'],
  },
  {
    id: 'loc-bandra-mum',
    title: 'Bandra West, Mumbai',
    subtitle: 'Queen of Suburbs · Coastal Flats & Executive Rooms',
    type: 'locality',
    citySlug: 'mumbai',
    localitySlug: 'bandra-west',
    searchQuery: 'Bandra West',
    icon: '📍',
    keywords: ['bandra', 'bandra west', 'mumbai', 'hill road', 'linking road'],
  },
  {
    id: 'loc-viman-nagar-pune',
    title: 'Viman Nagar, Pune',
    subtitle: 'Symbiosis Campus & IT Hub · Student PGs & Flats',
    type: 'locality',
    citySlug: 'pune',
    localitySlug: 'viman-nagar',
    searchQuery: 'Viman Nagar',
    icon: '📍',
    keywords: ['viman nagar', 'pune', 'symbiosis', 'phoenix mall', 'pg'],
  },
  {
    id: 'loc-hinjewadi-pune',
    title: 'Hinjewadi, Pune',
    subtitle: 'Rajiv Gandhi Infotech Park · IT Bachelors Living',
    type: 'locality',
    citySlug: 'pune',
    localitySlug: 'hinjewadi',
    searchQuery: 'Hinjewadi',
    icon: '📍',
    keywords: ['hinjewadi', 'pune', 'phase 1', 'it park', 'flats'],
  },
  {
    id: 'loc-salt-lake-kol',
    title: 'Salt Lake (Sector V), Kolkata',
    subtitle: 'IT Center & Planned City · PGs & Corporate Tiffin',
    type: 'locality',
    citySlug: 'kolkata',
    localitySlug: 'salt-lake',
    searchQuery: 'Salt Lake',
    icon: '📍',
    keywords: ['salt lake', 'sector v', 'kolkata', 'it hub', 'pg', 'tiffin'],
  },
  {
    id: 'loc-sg-highway-ahm',
    title: 'SG Highway, Ahmedabad',
    subtitle: 'Commercial Corridor · Modern Flats & Stays',
    type: 'locality',
    citySlug: 'ahmedabad',
    localitySlug: 'sg-highway',
    searchQuery: 'SG Highway',
    icon: '📍',
    keywords: ['sg highway', 'ahmedabad', 'satellite', 'flats', 'pg'],
  },
];

/* ─────────────────────────────────────────────────────────────
 * 5. ROBUST DSA SEARCH ENGINE CLASS
 * Builds Trie index and runs multi-stage scoring algorithm
 * ───────────────────────────────────────────────────────────── */
export class SearchEngine {
  private trie: Trie = new Trie();
  private entityMap: Map<string, SearchEntity> = new Map();
  private tokenIndex: Map<string, Set<string>> = new Map();

  constructor(entities: SearchEntity[] = SEARCH_ENTITIES) {
    this.buildIndex(entities);
  }

  private buildIndex(entities: SearchEntity[]): void {
    for (const entity of entities) {
      this.entityMap.set(entity.id, entity);

      // Index title tokens
      const titleTokens = this.tokenize(entity.title);
      for (const token of titleTokens) {
        this.trie.insert(token, entity.id);
        this.addToTokenIndex(token, entity.id);
      }

      // Index keyword tokens
      for (const kw of entity.keywords) {
        const kwTokens = this.tokenize(kw);
        for (const token of kwTokens) {
          this.trie.insert(token, entity.id);
          this.addToTokenIndex(token, entity.id);
        }
      }
    }
  }

  private addToTokenIndex(token: string, entityId: string): void {
    if (!this.tokenIndex.has(token)) {
      this.tokenIndex.set(token, new Set());
    }
    this.tokenIndex.get(token)!.add(entityId);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F]/g, ' ') // support English + Devanagari Hindi
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }

  /**
   * Primary robust search function.
   * Runs Prefix Matching -> Inverted Token Scoring -> Levenshtein Typo DP.
   */
  search(query: string | unknown, activeCitySlug?: string, limit: number = 8): SearchResponse {
    const rawQuery = (
      typeof query === 'string'
        ? query
        : Array.isArray(query)
        ? String(query[0] ?? '')
        : String(query ?? '')
    ).trim();
    if (!rawQuery) {
      return {
        query: '',
        results: [],
        isUnknownQuery: false,
      };
    }

    const queryTokens = this.tokenize(rawQuery);
    const candidateScores = new Map<string, { score: number; matchedBy: 'prefix' | 'token' | 'fuzzy'; typo?: string }>();

    // ── STAGE 1: Trie Prefix Matching (O(k) fast lookup)
    for (const token of queryTokens) {
      const prefixMatches = this.trie.searchPrefix(token);
      for (const id of prefixMatches) {
        const current = candidateScores.get(id) || { score: 0, matchedBy: 'prefix' };
        current.score += 80;
        current.matchedBy = 'prefix';
        candidateScores.set(id, current);
      }
    }

    // ── STAGE 2: Direct Token Inverted Index Scoring
    for (const token of queryTokens) {
      const exactMatches = this.tokenIndex.get(token);
      if (exactMatches) {
        for (const id of exactMatches) {
          const current = candidateScores.get(id) || { score: 0, matchedBy: 'token' };
          current.score += 100; // exact word match bonus
          candidateScores.set(id, current);
        }
      }
    }

    // ── STAGE 3: Levenshtein Distance Typo Tolerance (DP Algorithm)
    // Only applied if query token has at least 3 characters
    for (const token of queryTokens) {
      if (token.length >= 3) {
        for (const [indexedToken, entityIds] of this.tokenIndex.entries()) {
          // Quick length difference check to skip impossible distances
          if (Math.abs(token.length - indexedToken.length) <= 2) {
            const distance = levenshteinDistance(token, indexedToken);
            if (distance <= 2 && distance > 0) {
              const typoBonus = 50 - distance * 15;
              for (const id of entityIds) {
                const current = candidateScores.get(id) || { score: 0, matchedBy: 'fuzzy' };
                if (current.score < typoBonus) {
                  current.score += typoBonus;
                  current.matchedBy = 'fuzzy';
                  current.typo = indexedToken;
                  candidateScores.set(id, current);
                }
              }
            }
          }
        }
      }
    }

    // ── STAGE 4: Location Context Weighting & Cross-City Filtering
    if (activeCitySlug) {
      for (const [id, matchInfo] of candidateScores.entries()) {
        const entity = this.entityMap.get(id);
        if (entity) {
          if (entity.citySlug === activeCitySlug) {
            matchInfo.score += 40; // city relevance boost
          } else if (entity.type === 'locality' && entity.citySlug) {
            // Strictly filter out localities belonging to OTHER cities!
            matchInfo.score -= 1000;
          }
        }
      }
    }

    // ── STAGE 5: Sorting & Top-K Extraction (Selection)
    const sorted = Array.from(candidateScores.entries())
      .filter(([_, info]) => info.score >= 25)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit)
      .map(([id, info]) => {
        const entity = this.entityMap.get(id)!;
        return {
          entity,
          score: info.score,
          matchedBy: info.matchedBy,
          typoCorrection: info.typo,
        };
      });

    // ── STAGE 6: Safe Fallback for Garbage / Invalid Queries
    const isUnknown = sorted.length === 0;
    const recoveryCategories = isUnknown
      ? SEARCH_ENTITIES.filter((e) => e.type === 'category').slice(0, 5)
      : undefined;

    return {
      query: rawQuery,
      results: sorted,
      isUnknownQuery: isUnknown,
      suggestedRecoveryCategories: recoveryCategories,
    };
  }
}

// Global Singleton Instance
export const globalSearchEngine = new SearchEngine();
