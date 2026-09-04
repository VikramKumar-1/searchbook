import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';

export interface FetchListingsParams {
  citySlug?: string;
  categorySlug?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface ListingCardItem {
  id: string;
  title: string;
  slug: string;
  price: number | string | null;
  priceType: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  contactPhone?: string;
  contactWhatsApp?: string | null;
  isVerified?: boolean;
  isFeatured?: boolean;
  city: { id: string; name: string; slug: string };
  locality?: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string; icon: string | null };
  _count?: { reviews: number };
}

export interface ListingsApiResponse {
  data: ListingCardItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useListings(params: FetchListingsParams = {}) {
  return useQuery<ListingsApiResponse>({
    queryKey: ['listings', params],
    queryFn: async () => {
      // Clean undefined values
      const cleanParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = String(val);
        }
      });
      
      const searchParams = new URLSearchParams(cleanParams).toString();
      const url = `/api/v1/listings${searchParams ? `?${searchParams}` : ''}`;
      
      // Use getWithMeta to preserve the { data, meta } structure
      const response = await apiClient.getWithMeta<ListingCardItem[]>(url);
      
      return {
        data: response.data,
        meta: response.meta as ListingsApiResponse['meta']
      };
    },
  });
}

export function useInfiniteListings(params: Omit<FetchListingsParams, 'page'> = {}) {
  return useInfiniteQuery<ListingsApiResponse>({
    queryKey: ['listings', 'infinite', params],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const cleanParams: Record<string, string> = { page: String(pageParam) };
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = String(val);
        }
      });
      const searchParams = new URLSearchParams(cleanParams).toString();
      const url = `/api/v1/listings${searchParams ? `?${searchParams}` : ''}`;
      const response = await apiClient.getWithMeta<ListingCardItem[]>(url);
      return {
        data: response.data,
        meta: response.meta as ListingsApiResponse['meta'],
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
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
  contactEmail?: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  openingTime: string | null;
  closingTime: string | null;
  tenantType: string | null;
  bhkType: string | null;
  furnishing: string | null;
  totalRooms?: number | null;
  city: { id: string; name: string; slug: string };
  locality?: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string; icon: string | null };
  user: { id: string; name: string; isPremium: boolean; phone: string | null; avatar: string | null };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null } | null;
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

