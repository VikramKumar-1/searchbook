import { NextRequest } from 'next/server';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validator';
import { apiSuccess, setAuthCookie } from '@backend/utils/apiResponse';
import { handleError } from '@backend/middleware/errorHandler.middleware';

export const authController = {
  async register(req: NextRequest) {
    try {
      const input = registerSchema.parse(await req.json());
      const { user, token } = await authService.register(input);
      return setAuthCookie(apiSuccess(user, undefined, 201), token);
    } catch (error) {
      return handleError(error);
    }
  },

  async login(req: NextRequest) {
    try {
      const input = loginSchema.parse(await req.json());
      const { user, token } = await authService.login(input);
      return setAuthCookie(apiSuccess(user), token);
    } catch (error) {
      return handleError(error);
    }
  }, 
 
  async logout() {
    return setAuthCookie(apiSuccess({ message: 'Logged out successfully' }), null);
  },

  async getMe(user: import('@backend/middleware/auth.middleware').AuthenticatedUser) {
    try {
      const profile = await authService.getMe(user.userId);
      return apiSuccess(profile);
    } catch (error) {
      return handleError(error);
    }
  },
};   
 