import { NextRequest } from 'next/server';
import { authController } from '@backend/modules/auth/auth.controller';

export async function POST(req: NextRequest) {
  return authController.registerProvider(req);
}
