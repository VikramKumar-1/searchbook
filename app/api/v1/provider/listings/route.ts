import { NextRequest } from 'next/server';
import { listingController } from '@backend/modules/listing/listing.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

/**
 * @route GET /api/v1/provider/listings
 * @desc Get all listings created by the logged-in provider with dashboard stats
 * @access Private (Provider)
 */
export async function GET(req: NextRequest) {
  return withAuth(req, (user) => listingController.getProviderDashboard(user));
}
