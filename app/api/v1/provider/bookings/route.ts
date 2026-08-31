import { NextRequest } from 'next/server';
import { bookingController } from '@backend/modules/booking/booking.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

/**
 * @route GET /api/v1/provider/bookings
 * @desc Get all customer bookings for the logged-in provider's hotels/listings
 * @access Private (Provider)
 */
export async function GET(req: NextRequest) {
  return withAuth(req, (user) => bookingController.getProviderBookings(user));
}
