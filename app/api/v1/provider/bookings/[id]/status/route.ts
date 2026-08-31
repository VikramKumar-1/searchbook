import { NextRequest } from 'next/server';
import { bookingController } from '@backend/modules/booking/booking.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

/**
 * @route PATCH /api/v1/provider/bookings/[id]/status
 * @desc Update status of a booking (CONFIRMED, CHECKED_IN, COMPLETED, CANCELLED)
 * @access Private (Provider)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAuth(req, (user) => bookingController.updateStatus(req, user, id));
}
