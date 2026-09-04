import { NextRequest } from 'next/server';
import { authController } from '@backend/modules/auth/auth.controller';

/**
 * @route POST /api/v1/auth/otp/send
 * @desc Generate and send 4-digit SMS OTP to Indian mobile number
 * @access Public
 */
export async function POST(req: NextRequest) {
  return authController.sendOtp(req);
}
