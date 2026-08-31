import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';

interface FetchListingsParams {
  citySlug?: string;
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useListings(params: FetchListingsParams = {}) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      // Clean undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      ) as Record<string, string>;
      
      const searchParams = new URLSearchParams(cleanParams).toString();
      const url = `/api/v1/listings${searchParams ? `?${searchParams}` : ''}`;
      
      return apiClient.get(url);
    },
  });
}

export interface ListingDetailData {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  priceType: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  amenities: string[];
  contactPhone: string;
  contactWhatsApp: string | null;
  contactEmail: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  openingTime: string | null;
  closingTime: string | null;
  tenantType: string | null;
  bhkType: string | null;
  furnishing: string | null;
  totalRooms?: number;
  city: { id: string; name: string; slug: string };
  locality?: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string; icon: string | null };
  user: { id: string; name: string; isPremium: boolean; phone: string; avatar: string | null };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null };
  }>;
  _count: { reviews: number; bookmarks: number };
}

export function useListingBySlug(slug: string) {
  return useQuery<ListingDetailData>({
    queryKey: ['listing', slug],
    queryFn: async () => {
      return apiClient.get<ListingDetailData>(`/api/v1/listings/${slug}`);
    },
    enabled: Boolean(slug),
  });
}

