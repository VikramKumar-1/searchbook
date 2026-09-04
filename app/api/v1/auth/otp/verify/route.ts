import { NextRequest } from 'next/server';
import { authController } from '@backend/modules/auth/auth.controller';

/**
 * @route POST /api/v1/auth/otp/verify
 * @desc Verify OTP or Firebase ID Token, create/login user and set JWT session cookie
 * @access Public
 */
export async function POST(req: NextRequest) {
  return authController.verifyPhone(req);
}
