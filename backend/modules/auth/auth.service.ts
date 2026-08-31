import { authRepository } from './auth.repository';
import { hashPassword, verifyPassword, signJwt } from '@backend/utils/jwt';
import { ConflictError, UnauthorizedError } from '@backend/utils/errors';
import type { RegisterInput, LoginInput } from './auth.validator';

export const authService = {
  async register(input: RegisterInput) {
    // Check if email already exists
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password and create user
    const hashedPassword = hashPassword(input.password);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: hashedPassword,
      role: input.role || 'PROVIDER',
    });

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });

    return { user, token };
  },

  async login(input: LoginInput) {
    // Find user
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValid = verifyPassword(input.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });

    // Remove password from response
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  },
};
