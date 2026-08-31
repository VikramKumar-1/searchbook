import { NextRequest } from 'next/server';
import { listingController } from '@backend/modules/listing/listing.controller';

/**
 * @route   GET /api/v1/listings
 * @desc    Fetch paginated listings with optional filters (city, category, search, etc.)
 * @access  Public
 * 
 * @query   {string} [citySlug]     - Filter by city slug (e.g., 'delhi-ncr')
 * @query   {string} [categorySlug] - Filter by category slug (e.g., 'pg-hostel')
 * @query   {string} [search]       - Search keyword in title or description
 * @query   {number} [page=1]       - Page number for pagination
 * @query   {number} [limit=20]     - Number of items per page
 * 
 * @example 
 * GET http://localhost:3000/api/v1/listings?citySlug=delhi-ncr&page=1&limit=20
 * 
 * @returns {object} { success: true, data: Listing[], meta: PaginationMeta }
 */
export async function GET(req: NextRequest) {
  return listingController.getAll(req);
}

export async function POST(req: NextRequest) {
  const { withAuth } = await import('@backend/middleware/auth.middleware');
  return withAuth(req, (user) => listingController.create(req, user));
}
