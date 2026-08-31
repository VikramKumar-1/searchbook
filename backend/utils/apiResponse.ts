import { NextResponse } from 'next/server';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function apiSuccess<T = unknown>(data: T, meta?: PaginationMeta | Record<string, unknown>, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  }, { status });
}

export function setAuthCookie(response: NextResponse, token: string | null) {
  response.cookies.set('token', token || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: token ? 7 * 24 * 60 * 60 : 0, // 7 days or expire immediately
    path: '/',
  });
  return response;
}
