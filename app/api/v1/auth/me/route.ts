import { NextRequest } from 'next/server';
import { authController } from '@backend/modules/auth/auth.controller';
import { withAuth } from '@backend/middleware/auth.middleware';

export async function GET(req: NextRequest) {
  return withAuth(req, (user) => authController.getMe(user));
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, (user) => authController.updateProfile(req, user));
}
