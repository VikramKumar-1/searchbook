import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';

export interface BookingData {
  id: string;
  bookingCode: string;
  listingId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  checkInDate: string;
  checkInTime: string;
  checkOutTime?: string | null;
  durationHours: number;
  stayPackage?: 'HOURLY_2H' | 'HOURLY_3H' | 'HOURLY_6H' | 'DAY_ONLY' | 'NIGHT_ONLY' | 'FULL_DAY' | null;
  guestsCount: number;
  specialRequests: string | null;
  totalAmount: number | null;
  paymentType: 'PAY_AT_HOTEL' | 'ONLINE';
  status: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  isReviewed?: boolean;
  guestIdType?: string | null;
  guestIdNumber?: string | null;
  guestIdPhoto?: string | null;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    address: string;
    photos: string[];
    price?: number | null;
    priceType?: string | null;
  };
}

export interface CreateBookingPayload {
  listingId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime?: string;
  durationHours: number;
  stayPackage?: 'HOURLY_2H' | 'HOURLY_3H' | 'HOURLY_6H' | 'DAY_ONLY' | 'NIGHT_ONLY' | 'FULL_DAY';
  guestsCount: number;
  specialRequests?: string;
  guestIdType?: string;
  guestIdNumber?: string;
  guestIdPhoto?: string;
}

export function useProviderBookings() {
  return useQuery<BookingData[]>({
    queryKey: ['provider', 'bookings'],
    queryFn: async () => {
      return apiClient.get<BookingData[]>('/api/v1/provider/bookings');
    },
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      return apiClient.post<BookingData>('/api/v1/bookings', payload);
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingData['status'] }) => {
      return apiClient.patch(`/api/v1/provider/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'bookings'] });
    },
  });
}
