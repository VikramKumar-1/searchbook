import { NextRequest } from 'next/server';
import { authController } from '@backend/modules/auth/auth.controller';

/**
 * @route POST /api/v1/auth/oauth
 * @desc Google and Apple OAuth Authentication
 * @access Public
 */
export async function POST(req: NextRequest) {
  return authController.oauth(req);
}
