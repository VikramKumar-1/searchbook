import { authController } from '@backend/modules/auth/auth.controller';

export async function POST() {
  return authController.logout();
}
