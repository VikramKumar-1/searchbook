import { NextRequest } from 'next/server';
import { authService } from './auth.service';
import { registerSchema, loginSchema, sendOtpSchema, verifyPhoneAuthSchema, oauthAuthSchema, updateProfileSchema, providerRegisterSchema } from './auth.validator';
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

  async sendOtp(req: NextRequest) {
    try {
      const input = sendOtpSchema.parse(await req.json());
      const result = await authService.sendOtp(input);
      return apiSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  },

  async verifyPhone(req: NextRequest) {
    try {
      const input = verifyPhoneAuthSchema.parse(await req.json());
      const { user, token } = await authService.verifyPhoneAuth(input);
      return setAuthCookie(apiSuccess(user), token);
    } catch (error) {
      return handleError(error);
    }
  },

  async oauth(req: NextRequest) {
    try {
      const input = oauthAuthSchema.parse(await req.json());
      const { user, token } = await authService.oauthLogin(input);
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

  async updateProfile(req: NextRequest, user: import('@backend/middleware/auth.middleware').AuthenticatedUser) {
    try {
      const body = await req.json();
      const validated = updateProfileSchema.parse(body);
      const updated = await authService.updateProfile(user.userId, validated);
      return apiSuccess(updated);
    } catch (error) {
      return handleError(error);
    }
  },

  async registerProvider(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = providerRegisterSchema.parse(body);
      const { user, token } = await authService.registerProvider(validated);
      return setAuthCookie(apiSuccess(user, undefined, 201), token);
    } catch (error) {
      return handleError(error);
    }
  },
};