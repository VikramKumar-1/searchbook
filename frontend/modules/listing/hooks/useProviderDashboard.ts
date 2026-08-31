import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';

export interface ProviderListing {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  priceType: 'PER_MONTH' | 'PER_DAY' | 'ONE_TIME' | 'PER_MEAL' | null;
  address: string;
  photos: string[];
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  tenantType: string | null;
  bhkType: string | null;
  furnishing: string | null;
  customCategory: string | null;
  category: { id: string; name: string; slug: string };
  city: { id: string; name: string; slug: string };
  _count: { reviews: number };
}

export interface ProviderDashboardData {
  listings: ProviderListing[];
  stats: {
    totalListings: number;
    activeListings: number;
    pausedListings: number;
    totalViews: number;
    totalReviews: number;
  };
}

export function useProviderDashboard() {
  return useQuery<ProviderDashboardData>({
    queryKey: ['provider', 'dashboard'],
    queryFn: async () => {
      return apiClient.get<ProviderDashboardData>('/api/v1/provider/listings');
    },
  });
}

export function useToggleListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      return apiClient.patch(`/api/v1/provider/listings/${listingId}/status`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'dashboard'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      return apiClient.delete(`/api/v1/provider/listings/${listingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'dashboard'] });
    },
  });
}
