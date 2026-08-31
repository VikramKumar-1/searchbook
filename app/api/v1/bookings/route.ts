import { NextRequest } from 'next/server';
import { bookingController } from '@backend/modules/booking/booking.controller';

/**
 * @route POST /api/v1/bookings
 * @desc Create an hourly hotel / service booking (Pay at Hotel)
 * @access Public (optional auth)
 */
export async function POST(req: NextRequest) {
  return bookingController.create(req);
}
