import { NextResponse, NextRequest } from 'next/server';
import { verifyJwt } from '@backend/utils/jwt';
import { UnauthorizedError } from '@backend/utils/errors';
import { handleError } from './errorHandler.middleware';

export interface AuthenticatedUser {
  userId: string;
  role: string;
}

/**
 * Extracts and verifies JWT from HttpOnly cookie.
 */
export function getAuthUser(req: NextRequest): AuthenticatedUser {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    throw new UnauthorizedError('Please login to continue');
  }

  const payload = verifyJwt(token);
  if (!payload || !payload.userId) {
    throw new UnauthorizedError('Session expired. Please login again');
  }

  return {
    userId: payload.userId as string,
    role: payload.role as string,
  };
}

/**
 * Optional auth - returns null if not logged in instead of throwing.
 */
export function getOptionalAuthUser(req: NextRequest): AuthenticatedUser | null {
  try {
    return getAuthUser(req);
  } catch {
    return null;
  }
}

/**
 * HOF middleware wrapper for protected routes.
 */
export async function withAuth(
  req: NextRequest,
  handler: (user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    return handler(user);
  } catch (error) {
    return handleError(error);
  }
}
