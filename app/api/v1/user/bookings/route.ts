import { NextRequest } from 'next/server';
import { bookingController } from '@backend/modules/booking/booking.controller';

/**
 * @route GET /api/v1/user/bookings
 * @desc Get all bookings for current user or guest phone number
 * @access Public / Authenticated
 */
export async function GET(req: NextRequest) {
  return bookingController.getUserBookings(req);
}
