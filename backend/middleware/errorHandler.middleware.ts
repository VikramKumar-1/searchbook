import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export function handleError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
      },
    }, { status: 400 });
  }

  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: { code: error.code, message: error.message },
    }, { status: error.statusCode });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: { code: 'CONFLICT', message: 'This record already exists.' },
      }, { status: 409 });
    }
  }

  console.error('[API Error]:', error);
  const errMsg = (error as Error)?.message || 'An unexpected error occurred.';
  return NextResponse.json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: errMsg },
  }, { status: 500 });
}
