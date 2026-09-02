import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';

export interface LocationSearchResult {
  id: string;
  name: string;
  slug: string;
  type: 'city' | 'locality' | 'landmark';
  context: string;
  citySlug: string;
  localitySlug?: string;
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ['location-search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) return [];
      
      try {
        const response = await apiClient.get<LocationSearchResult[]>(
          `/api/v1/locations/search?q=${encodeURIComponent(query.trim())}`
        );
        
        return Array.isArray(response) ? response : [];
      } catch (err) {
        console.error('Failed to search location:', err);
        return [];
      }
    },
    enabled: Boolean(query && query.trim().length >= 2),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
