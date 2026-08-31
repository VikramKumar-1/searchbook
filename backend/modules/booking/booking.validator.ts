import { z } from 'zod';

export const createBookingSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  guestName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  guestPhone: z.string().min(10, 'Valid 10-digit phone number is required').max(15),
  guestEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
  
  checkInDate: z.string().min(8, 'Check-in date is required'), // YYYY-MM-DD
  checkInTime: z.string().min(2, 'Check-in time is required'), // e.g. "02:00 PM"
  checkOutTime: z.string().optional(),
  durationHours: z.coerce.number().int().min(1).max(48).default(2),
  stayPackage: z.enum(['HOURLY_2H', 'HOURLY_3H', 'HOURLY_6H', 'DAY_ONLY', 'NIGHT_ONLY', 'FULL_DAY']).optional(),
  guestsCount: z.coerce.number().int().min(1).max(10).default(2),
  specialRequests: z.string().max(500).optional(),
  
  // Express Check-in
  guestIdType: z.string().max(50).optional(),
  guestIdNumber: z.string().max(50).optional(),
  guestIdPhoto: z.string().optional(),
}).strict();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED']),
}).strict();

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
