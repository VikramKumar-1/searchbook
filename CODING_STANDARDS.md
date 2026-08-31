# SearchBook — Engineering Standards & Coding Guidelines

> **This document is the single source of truth for all coding standards in SearchBook.**
> Every developer, AI agent, and contributor MUST read and follow these guidelines before writing any code.
> **Never break existing working functionality when adding new features.**

---

## 🏛️ 10 Golden Rules

| # | Rule | Why |
|---|---|---|
| 1 | **Never break existing functionality** | Always verify existing features work after your changes. Run tests. |
| 2 | **No business logic in `app/` folder** | `app/` is routing ONLY. Logic goes in `frontend/` or `backend/`. |
| 3 | **No business logic in frontend** | Frontend = UI only. All rules, validation, access control in `backend/`. |
| 4 | **Controller never touches database** | Controller → Service → Repository → Prisma. Always. |
| 5 | **Validate ALL input with Zod** | Every API endpoint validates input. Never trust client data. |
| 6 | **No `any` type in TypeScript** | Type everything. Use `unknown` if truly unknown, then narrow. |
| 7 | **No `setState` in Flutter** | Use BLoC for everything. `setState` = uncontrolled rebuilds. |
| 8 | **No `useEffect` for data fetching** | Use TanStack Query. `useEffect` = no caching, no dedup, race conditions. |
| 9 | **Every component has a single responsibility** | One component = one job. Split if it does more. |
| 10 | **Security first, features second** | Never skip input validation, auth checks, or sanitization for speed.|

---

## 📁 Architecture Rules

### Folder Responsibility — STRICT

```
app/          → ONLY routing, layouts, metadata (2-3 line files max)
frontend/     → ONLY UI components, hooks, stores (NO business logic)
backend/      → ONLY business logic (controller/service/repository)
shared/       → ONLY types, constants, enums (NO logic, NO UI) 
```

### Import Rules — Who Can Import Whom

```
✅ app/        → can import from frontend/, backend/ (API routes only)
✅ frontend/   → can import from shared/, other frontend modules
✅ backend/    → can import from shared/, other backend modules
❌ frontend/   → CANNOT import from backend/
❌ backend/    → CANNOT import from frontend/
❌ shared/     → CANNOT import from frontend/ or backend/
```

### Module Structure — Every Module is Self-Contained

```
frontend/modules/listing/
├── components/        # UI components for this feature
├── hooks/             # Data-fetching hooks (TanStack Query)
├── index.ts           # Public API — only export what others need
└── (nothing else)

backend/modules/listing/
├── listing.controller.ts    # Parse request → validate → call service → respond
├── listing.service.ts       # Business logic, rules, orchestration
├── listing.repository.ts   # Prisma queries ONLY
├── listing.validator.ts    # Zod schemas
├── listing.types.ts        # TypeScript interfaces
└── index.ts                # Public exports
---

## ⚙️ Backend Architecture Deep Dive

> **This is the most important section for any backend developer joining this project.**
> Read this fully before writing a single line of backend code.

### Request Lifecycle — Complete Flow

```
Client Request (App / Website)
      │
      ▼
┌─────────────────────────────────────────────────┐
│  app/api/v1/listings/route.ts  (ROUTE)          │
│  → Just maps HTTP method to controller           │
│  → 2-3 lines max, ZERO logic                    │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  MIDDLEWARE (runs before controller)             │
│  → auth.middleware.ts     (verify JWT/session)   │
│  → role.middleware.ts     (check user role)      │
│  → rateLimit.middleware.ts (throttle requests)   │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  listing.controller.ts  (CONTROLLER)            │
│  → Extract params from request                   │
│  → Validate input using Zod (VALIDATOR)          │
│  → Call service method                           │
│  → Format & return API response                  │
│  → Catch errors, return error response           │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  listing.service.ts  (SERVICE)                  │
│  → ALL business logic lives HERE                 │
│  → Business rules, validations, limits           │
│  → Orchestrate multiple repositories if needed   │
│  → Transform data for response                   │
│  → Throw custom errors for business violations   │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  listing.repository.ts  (REPOSITORY)            │
│  → ONLY Prisma database queries                  │
│  → findMany, findById, create, update, delete    │
│  → Joins, includes, pagination                   │
│  → NO business logic, NO data transformation     │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  Prisma schema  (MODEL)                         │
│  → Database table structure                      │
│  → Relations, indexes, constraints               │
│  → prisma/schema.prisma                          │
└──────────────────┬──────────────────────────────┘
                   │
      ▼            ▼
┌─────────────────────────────────────────────────┐
│  🗄️ PostgreSQL Database                         │
└─────────────────────────────────────────────────┘
```

---

### Layer 1: Route (`app/api/v1/.../route.ts`)

**Purpose:** HTTP method → Controller method bridge. That's it.

**Rules:**
- Maximum 2-3 lines per method
- ZERO logic, ZERO validation, ZERO database
- Only import controller and call its method
- Apply middleware here (auth, role check)

```typescript
// app/api/v1/listings/route.ts
import { listingController } from '@backend/modules/listing';
import { withAuth } from '@backend/middleware/auth.middleware';
import { withRole } from '@backend/middleware/role.middleware';

// Public — anyone can view listings
export async function GET(req: NextRequest) {
  return listingController.getAll(req);
}

// Protected — only authenticated providers can create
export async function POST(req: NextRequest) {
  return withAuth(req, (user) => 
    withRole(user, 'PROVIDER', () => 
      listingController.create(req, user)
    )
  );
}
```

```typescript
// app/api/v1/listings/[id]/route.ts
import { listingController } from '@backend/modules/listing';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return listingController.getById(params.id);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, (user) =>
    listingController.update(req, params.id, user)
  );
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(req, (user) =>
    listingController.delete(params.id, user)
  );
}
```

---

### Layer 2: Middleware (`backend/middleware/`)

**Purpose:** Cross-cutting concerns that run BEFORE the controller.

**Rules:**
- Reusable across all routes
- Never contain business logic
- Return early with error if check fails
- Order: Rate Limit → Auth → Role → Controller

```typescript
// backend/middleware/auth.middleware.ts
import { getSession } from '@backend/lib/auth';
import { apiError, UnauthorizedError } from '@backend/utils/errors';

export async function withAuth<T>(
  req: NextRequest,
  handler: (user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getSession(req);
  
  if (!session?.user) {
    return apiError(new UnauthorizedError('Login required'));
  }
  
  return handler(session.user);
}
```

```typescript
// backend/middleware/role.middleware.ts
import { apiError, ForbiddenError } from '@backend/utils/errors';

export async function withRole<T>(
  user: AuthUser,
  requiredRole: UserRole | UserRole[],
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!roles.includes(user.role)) {
    return apiError(new ForbiddenError(`Requires ${roles.join(' or ')} role`));
  }
  
  return handler();
}
```

```typescript
// backend/middleware/rateLimit.middleware.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({ points: 100, duration: 60 });
const authLimiter = new RateLimiterMemory({ points: 5, duration: 300 });

export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  type: 'default' | 'auth' = 'default'
): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const activeLimiter = type === 'auth' ? authLimiter : limiter;
  
  try {
    await activeLimiter.consume(ip);
    return handler();
  } catch {
    return apiError(new TooManyRequestsError('Rate limit exceeded. Try again later.'));
  }
}
```

```typescript
// backend/middleware/errorHandler.middleware.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@backend/utils/errors';
import { logger } from '@backend/lib/logger';

export function handleError(error: unknown): NextResponse {
  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    }, { status: 400 });
  }

  // Custom app error (NotFound, Forbidden, etc.)
  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }, { status: error.statusCode });
  }

  // Unknown error — log and return generic
  logger.error('Unhandled error:', error);
  return NextResponse.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',  // Never expose internal details
    },
  }, { status: 500 });
}
```

---

### Layer 3: Validator (`backend/modules/*/listing.validator.ts`)

**Purpose:** Zod schemas for input validation. Shared between controller (runtime) and types (compile-time).

**Rules:**
- One file per module
- Export schemas AND inferred TypeScript types
- Use `.strict()` to reject unknown fields
- Add `.trim()` to all string fields
- Add sensible min/max limits

```typescript
// backend/modules/listing/listing.validator.ts
import { z } from 'zod';

// ── Create Listing ──
export const createListingSchema = z.object({
  title: z.string().trim().min(3, 'Title too short').max(200, 'Title too long'),
  description: z.string().trim().min(10).max(5000),
  price: z.number().positive('Price must be positive').max(10000000),
  priceType: z.enum(['PER_MONTH', 'PER_DAY', 'ONE_TIME', 'PER_MEAL']),
  categoryId: z.string().cuid('Invalid category'),
  subCategoryId: z.string().cuid('Invalid sub-category').optional(),
  cityId: z.string().cuid('Invalid city'),
  address: z.string().trim().min(5).max(500),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  photos: z.array(z.string().url()).min(1, 'At least 1 photo').max(10, 'Max 10 photos'),
  amenities: z.array(z.string()).optional(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  contactWhatsApp: z.string().regex(/^[6-9]\d{9}$/).optional(),
}).strict();

// ── Update Listing (partial) ──
export const updateListingSchema = createListingSchema.partial().strict();

// ── Query Listings (GET params) ──
export const listingQuerySchema = z.object({
  citySlug: z.string().optional(),
  categorySlug: z.string().optional(),
  subCategorySlug: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  search: z.string().trim().max(200).optional(),
}).strict();

// ── Infer TypeScript types from schemas ──
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
```

---

### Layer 4: Controller (`backend/modules/*/listing.controller.ts`)

**Purpose:** Parse request → Validate input → Call service → Format response.

**Rules:**
- NEVER touch database directly
- NEVER contain business logic (if/else business rules)
- ALWAYS validate input with Zod
- ALWAYS return standardized API response
- ALWAYS wrap in try/catch → handleError

```typescript
// backend/modules/listing/listing.controller.ts
import { NextRequest } from 'next/server';
import { listingService } from './listing.service';
import { createListingSchema, updateListingSchema, listingQuerySchema } from './listing.validator';
import { apiSuccess } from '@backend/utils/apiResponse';
import { handleError } from '@backend/middleware/errorHandler.middleware';
import type { AuthUser } from '@backend/modules/auth/auth.types';

export const listingController = {

  // GET /api/v1/listings
  async getAll(req: NextRequest) {
    try {
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);
      const query = listingQuerySchema.parse(searchParams);
      const result = await listingService.getListings(query);
      return apiSuccess(result.data, result.meta);
    } catch (error) {
      return handleError(error);
    }
  },

  // GET /api/v1/listings/:id
  async getById(id: string) {
    try {
      const listing = await listingService.getListingById(id);
      return apiSuccess(listing);
    } catch (error) {
      return handleError(error);
    }
  },

  // POST /api/v1/listings
  async create(req: NextRequest, user: AuthUser) {
    try {
      const body = createListingSchema.parse(await req.json());
      const listing = await listingService.createListing(user.id, body);
      return apiSuccess(listing, null, 201);
    } catch (error) {
      return handleError(error);
    }
  },

  // PUT /api/v1/listings/:id
  async update(req: NextRequest, id: string, user: AuthUser) {
    try {
      const body = updateListingSchema.parse(await req.json());
      const listing = await listingService.updateListing(id, user.id, body);
      return apiSuccess(listing);
    } catch (error) {
      return handleError(error);
    }
  },

  // DELETE /api/v1/listings/:id
  async delete(id: string, user: AuthUser) {
    try {
      await listingService.deleteListing(id, user.id);
      return apiSuccess(null, null, 204);
    } catch (error) {
      return handleError(error);
    }
  },
};
```

---

### Layer 5: Service (`backend/modules/*/listing.service.ts`)

**Purpose:** ALL business logic. Rules, limits, orchestration, transformations.

**Rules:**
- This is where the brain of the application lives
- CAN call multiple repositories (e.g., listing + city + user)
- CAN call other services (e.g., notificationService)
- NEVER import Prisma directly — always go through repository
- NEVER handle HTTP request/response objects
- Throw custom errors for business rule violations

```typescript
// backend/modules/listing/listing.service.ts
import { listingRepository } from './listing.repository';
import { cityService } from '../city/city.service';
import { userService } from '../user/user.service';
import { NotFoundError, ForbiddenError, LimitError } from '@backend/utils/errors';
import { sanitizeHtml } from '@backend/utils/sanitize';
import { FREE_LISTING_LIMIT } from '@shared/constants/config';
import type { CreateListingInput, UpdateListingInput, ListingQuery } from './listing.validator';

export const listingService = {

  // ── Get all listings with filters ──
  async getListings(query: ListingQuery) {
    // Business rule: if city specified, it must be active
    if (query.citySlug) {
      const city = await cityService.getActiveCityBySlug(query.citySlug);
      if (!city) throw new NotFoundError('City not available yet');
      query.cityId = city.id;
    }

    // Business rule: price range validation
    if (query.minPrice && query.maxPrice && query.minPrice > query.maxPrice) {
      throw new ValidationError('Min price cannot be greater than max price');
    }

    const { listings, total } = await listingRepository.findMany(query);

    return {
      data: listings,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  // ── Get single listing ──
  async getListingById(id: string) {
    const listing = await listingRepository.findById(id);
    if (!listing) throw new NotFoundError('Listing not found');
    if (!listing.isActive) throw new NotFoundError('Listing not found');

    // Business rule: increment view count
    await listingRepository.incrementViews(id);

    return listing;
  },

  // ── Create listing ──
  async createListing(userId: string, data: CreateListingInput) {
    // Business rule: free users max 5 listings
    const userListingCount = await listingRepository.countByUser(userId);
    const user = await userService.getUserById(userId);
    
    if (!user.isPremium && userListingCount >= FREE_LISTING_LIMIT) {
      throw new LimitError(
        `Free accounts can create max ${FREE_LISTING_LIMIT} listings. Upgrade to premium.`
      );
    }

    // Business rule: city must be active
    const city = await cityService.getActiveCityById(data.cityId);
    if (!city) throw new NotFoundError('City not available');

    // Security: sanitize user content
    const sanitizedData = {
      ...data,
      title: sanitizeHtml(data.title),
      description: sanitizeHtml(data.description),
      slug: generateSlug(data.title),
    };

    return listingRepository.create({ ...sanitizedData, userId });
  },

  // ── Update listing ──
  async updateListing(id: string, userId: string, data: UpdateListingInput) {
    const listing = await listingRepository.findById(id);
    if (!listing) throw new NotFoundError('Listing not found');

    // Business rule: only owner can edit
    if (listing.userId !== userId) {
      throw new ForbiddenError('You can only edit your own listings');
    }

    // Security: sanitize if title/description changed
    const sanitizedData = { ...data };
    if (data.title) sanitizedData.title = sanitizeHtml(data.title);
    if (data.description) sanitizedData.description = sanitizeHtml(data.description);

    return listingRepository.update(id, sanitizedData);
  },

  // ── Delete listing (soft delete) ──
  async deleteListing(id: string, userId: string) {
    const listing = await listingRepository.findById(id);
    if (!listing) throw new NotFoundError('Listing not found');

    // Business rule: only owner or admin can delete
    if (listing.userId !== userId) {
      throw new ForbiddenError('You can only delete your own listings');
    }

    // Soft delete — never hard delete user data
    return listingRepository.softDelete(id);
  },
};
```

---

### Layer 6: Repository (`backend/modules/*/listing.repository.ts`)

**Purpose:** Database queries ONLY. Prisma operations. Nothing else.

**Rules:**
- ONLY Prisma queries — findMany, findUnique, create, update, delete
- NEVER contain if/else business logic
- NEVER transform data for API response
- ALWAYS use `select` on relations (never expose full user data)
- ALWAYS filter `deletedAt: null` for soft-deleted records
- ALWAYS add proper `include` / `select` for relations

```typescript
// backend/modules/listing/listing.repository.ts
import { prisma } from '@backend/lib/prisma';
import type { ListingQuery, CreateListingInput } from './listing.validator';

export const listingRepository = {

  async findMany(query: ListingQuery) {
    const where = {
      isActive: true,
      deletedAt: null,
      ...(query.cityId && { cityId: query.cityId }),
      ...(query.categorySlug && { category: { slug: query.categorySlug } }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(query.minPrice && { price: { gte: query.minPrice } }),
      ...(query.maxPrice && { price: { lte: query.maxPrice } }),
    };

    const orderBy = {
      newest: { createdAt: 'desc' as const },
      price_asc: { price: 'asc' as const },
      price_desc: { price: 'desc' as const },
      rating: { avgRating: 'desc' as const },
    }[query.sortBy];

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          subCategory: { select: { id: true, name: true, slug: true } },
          city: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, avatar: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return { listings, total };
  },

  async findById(id: string) {
    return prisma.listing.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        subCategory: true,
        city: true,
        user: { select: { id: true, name: true, avatar: true, phone: true } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    });
  },

  async create(data: CreateListingInput & { userId: string; slug: string }) {
    return prisma.listing.create({
      data,
      include: { category: true, city: true },
    });
  },

  async update(id: string, data: Partial<CreateListingInput>) {
    return prisma.listing.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  },

  async softDelete(id: string) {
    return prisma.listing.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  },

  async countByUser(userId: string) {
    return prisma.listing.count({
      where: { userId, isActive: true, deletedAt: null },
    });
  },

  async incrementViews(id: string) {
    return prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  },
};
```

---

### Layer 7: Model (`prisma/schema.prisma` + `listing.types.ts`)

**Purpose:** Database structure (Prisma) + TypeScript interfaces.

**Rules:**
- Prisma schema = single source of truth for database structure
- `listing.types.ts` = additional TypeScript types NOT generated by Prisma
- ALWAYS add `createdAt`, `updatedAt`, `deletedAt` to every model
- ALWAYS add indexes on frequently filtered/sorted columns
- ALWAYS use enums for fixed-value fields
- ALWAYS use `@@map("table_name")` for clean SQL table names

```typescript
// backend/modules/listing/listing.types.ts
// Types that Prisma doesn't generate — API response shapes, computed fields, etc.

export interface ListingWithMeta {
  id: string;
  title: string;
  slug: string;
  price: number;
  priceType: PriceType;
  photos: string[];
  category: { id: string; name: string; icon: string };
  city: { id: string; name: string };
  user: { id: string; name: string; avatar: string | null };
  reviewCount: number;
  avgRating: number | null;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface ListingDetail extends ListingWithMeta {
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  contactPhone: string;
  contactWhatsApp: string | null;
  reviews: ReviewWithUser[];
  bookmarkCount: number;
  viewCount: number;
}
```

---

### Layer 8: Utils (`backend/utils/`)

**Purpose:** Shared helpers used across all modules.

```typescript
// backend/utils/apiResponse.ts
import { NextResponse } from 'next/server';

export function apiSuccess(data: any, meta?: any, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  }, { status });
}

// backend/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class LimitError extends AppError {
  constructor(message = 'Limit exceeded') {
    super(message, 429, 'LIMIT_EXCEEDED');
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}

// backend/utils/pagination.ts
export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

// backend/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] }); // Strip ALL HTML
}

// backend/utils/slug.ts
import { nanoid } from 'nanoid';

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`; // e.g., "cozy-pg-in-ranchi-a8x3k2"
}
```

---

### 🆕 How to Add a New Module (Guide for Future Developers)

When you need to add a new feature (e.g., "reviews"), follow these steps exactly:

#### Step 1: Create Backend Module

```
backend/modules/review/
├── review.controller.ts     ← Copy listing.controller.ts as template
├── review.service.ts        ← Business logic for reviews
├── review.repository.ts     ← Prisma queries for reviews
├── review.validator.ts      ← Zod schemas for review input
├── review.types.ts          ← TypeScript interfaces
└── index.ts                 ← Export controller
```

#### Step 2: Add Prisma Model

```prisma
// Add to prisma/schema.prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5
  comment   String   @db.Text
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([listingId])
  @@index([userId])
  @@unique([userId, listingId]) // One review per user per listing
  @@map("reviews")
}
```

```bash
# Run migration
npx prisma migrate dev --name add_reviews_table
```

#### Step 3: Create API Route

```typescript
// app/api/v1/listings/[id]/reviews/route.ts
import { reviewController } from '@backend/modules/review';

export async function GET(req, { params }) {
  return reviewController.getByListing(params.id);
}

export async function POST(req, { params }) {
  return withAuth(req, (user) =>
    reviewController.create(req, params.id, user)
  );
}
```

#### Step 4: Create Frontend Module

```
frontend/modules/review/
├── components/
│   ├── ReviewList.tsx
│   ├── ReviewCard.tsx
│   └── WriteReview.tsx
├── hooks/
│   └── useReviews.ts
└── index.ts
```

#### Step 5: Test

```bash
# Test API manually
curl http://localhost:3000/api/v1/listings/xxx/reviews

# Run tests
npm test -- --filter review
```

**That's it. 5 steps. Same pattern every time.**

---

### ❌ What Goes Where — Quick Reference

| Question | Answer |
|---|---|
| "Where do I validate input?" | `validator.ts` (Zod schema) → used in `controller.ts` |
| "Where do I check if user is logged in?" | `auth.middleware.ts` → applied in `route.ts` |
| "Where do I check if user owns this resource?" | `service.ts` (business rule) |
| "Where do I write the Prisma query?" | `repository.ts` ONLY |
| "Where do I format the API response?" | `controller.ts` → `apiSuccess()` / `handleError()` |
| "Where do I add business rules?" | `service.ts` ALWAYS |
| "Where do I add a new table?" | `prisma/schema.prisma` → `npx prisma migrate dev` |
| "Where do I add a new API endpoint?" | `app/api/v1/...` (route) → controller → service → repo |
| "Where do I add shared types?" | `shared/types/` |
| "Where do I add constants/enums?" | `shared/constants/` |
| "Where do I add reusable UI?" | `frontend/ui/components/` |
| "Where do I add page-specific UI?" | `frontend/modules/<feature>/components/` |
| "Where do I handle errors?" | `errorHandler.middleware.ts` (centralized) |
| "Where do I add rate limiting?" | `rateLimit.middleware.ts` → apply in `route.ts` |
| "Where do I log things?" | `logger.ts` → `logger.info()`, `logger.error()` |

---

## 📊 Logging Standards

### What to Log

```typescript
import { logger } from '@backend/lib/logger';

// ✅ Log these
logger.info('Listing created', { listingId, userId, city });
logger.warn('Rate limit approaching', { ip, remaining: 5 });
logger.error('Database connection failed', { error: err.message, stack: err.stack });

// ❌ NEVER log these
logger.info('Password:', password);           // ❌ Sensitive data
logger.info('Token:', jwt);                   // ❌ Auth tokens
logger.info('Full user:', JSON.stringify(user)); // ❌ PII without masking
```

### Log Levels

| Level | When to Use |
|---|---|
| `error` | Something broke — needs immediate attention |
| `warn` | Something suspicious — might need attention soon |
| `info` | Normal operation — important business events |
| `debug` | Development only — never in production |

---

## 🧪 Testing Standards

### What to Test

| Layer | Test Type | What |
|---|---|---|
| **Validator** | Unit test | Schema accepts valid, rejects invalid input |
| **Service** | Unit test (mock repo) | Business rules work correctly |
| **Repository** | Integration test | Prisma queries return correct data |
| **Controller** | Integration test | Full request → response flow |
| **API Route** | E2E test | HTTP request → correct response |
| **Frontend hooks** | Unit test | Correct API calls, state updates |
| **UI components** | Component test | Renders correctly with props |

### Test File Location

```
backend/modules/listing/
├── listing.service.ts
├── listing.service.test.ts      ← Tests next to source file
├── listing.repository.ts
├── listing.repository.test.ts
```

---

## 🚀 Deployment Checklist

- [ ] All environment variables set in production
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Seed data loaded (categories, cities)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured for production domains only
- [ ] Error logging connected (Sentry / Pino → Logtail)
- [ ] SSL/HTTPS enabled
- [ ] `.env.local` NOT committed to git
- [ ] `node_modules/` NOT committed to git
- [ ] Build passes without errors (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint warnings (`npx eslint .`)

---

## 🌐 Next.js Frontend Standards

### Server Components First

```typescript
// ✅ DEFAULT — Server Component (no "use client", zero JS sent to browser)
export default function CategoryPage() {
  return <div>...</div>;
}

// ✅ Only add "use client" when you NEED interactivity
"use client";
export default function SearchBar() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ❌ NEVER add "use client" to pages, layouts, or static content
```

### Data Fetching — TanStack Query ONLY

```typescript
// ✅ CORRECT — TanStack Query: cached, deduped, auto-refetch
export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => api.listings.getAll(filters),
    staleTime: 5 * 60 * 1000,     // Cache 5 min
    placeholderData: keepPreviousData, // No layout shift on filter change
  });
}

// ❌ NEVER — useEffect + useState for data fetching
useEffect(() => {
  fetch('/api/listings').then(r => r.json()).then(setData);
}, []);
```

### Client State — Zustand with Selectors

```typescript
// ✅ CORRECT — Granular selector, only re-renders when city changes
const selectedCity = useCityStore(state => state.selectedCity);

// ❌ WRONG — Re-renders on ANY store change
const { selectedCity, cities, isLoading } = useCityStore();
```

### Forms — React Hook Form + Zod

```typescript
// ✅ CORRECT — Uncontrolled form, Zod validation, zero re-renders
const form = useForm<CreateListingInput>({
  resolver: zodResolver(createListingSchema),
});

// ❌ NEVER — Controlled inputs with useState (re-renders on every keystroke)
const [title, setTitle] = useState('');
const [price, setPrice] = useState('');
```

### Component Rules

```typescript
// ✅ CORRECT — Props interface, React.memo for list items, descriptive name
interface ListingCardProps {
  listing: Listing;
  onBookmark?: (id: string) => void;
}

export const ListingCard = React.memo(function ListingCard({ 
  listing, 
  onBookmark 
}: ListingCardProps) {
  return (/* UI only, no business logic */);
});

// ❌ WRONG — No types, inline logic, anonymous export
export default ({ data }: any) => {
  const isExpired = new Date(data.expiry) < new Date(); // business logic in UI!
  return <div>{isExpired ? 'Expired' : data.title}</div>;
};
```

### CSS / Styling Rules

```typescript
// ✅ Use Tailwind utility classes
<div className="flex items-center gap-4 rounded-xl bg-white/10 backdrop-blur-xl p-4">

// ✅ Use cn() helper for conditional classes (from shadcn)
<button className={cn("px-4 py-2 rounded-lg", isActive && "bg-primary text-white")}>

// ❌ NEVER use inline styles
<div style={{ display: 'flex', marginTop: 20 }}>

// ❌ NEVER use CSS modules or plain CSS files
import styles from './listing.module.css';
```

---

## ⚙️ Next.js Backend Standards

### Controller — Parse, Validate, Delegate

```typescript
// ✅ CORRECT Controller
export const listingController = {
  async getAll(req: NextRequest) {
    try {
      // 1. Extract & validate input
      const query = listingQuerySchema.parse(
        Object.fromEntries(req.nextUrl.searchParams)
      );
      
      // 2. Delegate to service
      const result = await listingService.getListings(query);
      
      // 3. Return standardized response
      return apiSuccess(result.data, result.meta);
    } catch (error) {
      return apiError(error);
    }
  },
};

// ❌ WRONG — Controller doing business logic or DB queries
export const listingController = {
  async getAll(req: NextRequest) {
    const listings = await prisma.listing.findMany(); // ❌ Direct DB access
    const filtered = listings.filter(l => l.isActive); // ❌ Business logic
    return NextResponse.json(filtered);
  },
};
```

### Service — ALL Business Logic Here

```typescript
// ✅ CORRECT Service
export const listingService = {
  async createListing(userId: string, data: CreateListingInput) {
    // Business rule: check limits
    const count = await listingRepository.countByUser(userId);
    if (count >= FREE_LISTING_LIMIT) {
      throw new ForbiddenError('Upgrade to premium for more listings');
    }
    
    // Business rule: sanitize content
    const sanitizedData = {
      ...data,
      title: sanitizeHtml(data.title),
      description: sanitizeHtml(data.description),
    };
    
    // Delegate to repository
    return listingRepository.create({ ...sanitizedData, userId });
  },
};
```

### Repository — Prisma Queries ONLY

```typescript
// ✅ CORRECT Repository
export const listingRepository = {
  async findMany(query: ListingDBQuery) {
    return prisma.listing.findMany({
      where: {
        cityId: query.cityId,
        isActive: true,
        ...(query.categoryId && { categoryId: query.categoryId }),
      },
      include: {
        category: true,
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  },
};

// ❌ WRONG — Business logic in repository
async findMany(query) {
  const listings = await prisma.listing.findMany();
  return listings.filter(l => l.price < 5000); // ❌ Filtering in repo
}
```

### API Response Format — ALWAYS Standardized

```json
// Success
{
  "success": true,
  "data": { },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "price", "message": "Must be positive" }]
  }
}
```

### Error Handling — Custom Error Classes

```typescript
// ✅ Use custom errors, never throw raw strings
throw new NotFoundError('Listing not found');
throw new ValidationError('Price must be positive');
throw new ForbiddenError('Not authorized');
throw new ConflictError('Listing already exists');

// ❌ NEVER throw raw strings or generic errors
throw new Error('something went wrong');
throw 'not found';
```

---

## 🐦 Flutter Standards

### BLoC Pattern — ALWAYS

```dart
// ✅ CORRECT — BLoC with Equatable, buildWhen
class ListingBloc extends Bloc<ListingEvent, ListingState> {
  final ListingRepository _repository;
  
  ListingBloc(this._repository) : super(const ListingState.initial()) {
    on<LoadListings>(_onLoadListings);
  }
  
  Future<void> _onLoadListings(LoadListings event, Emitter<ListingState> emit) async {
    emit(state.copyWith(status: ListingStatus.loading));
    try {
      final listings = await _repository.getListings(event.filters);
      emit(state.copyWith(status: ListingStatus.loaded, listings: listings));
    } catch (e) {
      emit(state.copyWith(status: ListingStatus.error, error: e.toString()));
    }
  }
}

// ❌ NEVER use setState
setState(() {
  _listings = newListings;
  _isLoading = false;
});
```

### Widget Performance Rules

```dart
// ✅ Use const constructors EVERYWHERE possible
const SizedBox(height: 16),
const Icon(Icons.star, color: Colors.amber),
const Padding(padding: EdgeInsets.all(16), child: Text('Hello')),

// ✅ BlocBuilder with buildWhen — rebuild ONLY when needed
BlocBuilder<ListingBloc, ListingState>(
  buildWhen: (prev, curr) => prev.listings != curr.listings,
  builder: (context, state) => ListingGrid(listings: state.listings),
)

// ✅ ListView.builder — ALWAYS for lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListingCard(listing: items[index]),
)

// ❌ NEVER build all items at once
ListView(children: items.map((i) => ListingCard(listing: i)).toList())

// ✅ RepaintBoundary for expensive widgets
RepaintBoundary(child: GoogleMap(...))
RepaintBoundary(child: ListingGallery(...))

// ✅ CachedNetworkImage — ALWAYS for network images
CachedNetworkImage(
  imageUrl: listing.imageUrl,
  placeholder: (_, __) => const ShimmerPlaceholder(),
  errorWidget: (_, __, ___) => const Icon(Icons.error),
)

// ❌ NEVER use Image.network directly
Image.network(url) // No caching, re-downloads every time
```

### Dart Code Style

```dart
// ✅ Use freezed for all models — immutable, copyWith, equality
@freezed
class Listing with _$Listing {
  const factory Listing({
    required String id,
    required String title,
    required double price,
    required String imageUrl,
    @Default(false) bool isFeatured,
  }) = _Listing;

  factory Listing.fromJson(Map<String, dynamic> json) => _$ListingFromJson(json);
}

// ❌ NEVER use mutable classes with manual equals/hashCode
class Listing {
  String id;
  String title;
  // ...manual boilerplate...
}
```

---

## 🗄️ Database & Prisma Standards

### Schema Rules

```prisma
// ✅ CORRECT — Proper naming, indexes, soft delete, timestamps
model Listing {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(200)
  slug        String   @unique
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  priceType   PriceType
  
  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  cityId      String
  city        City     @relation(fields: [cityId], references: [id])
  
  // Status
  isActive    Boolean  @default(true)
  isVerified  Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  
  // Soft delete
  deletedAt   DateTime?
  
  // Timestamps — ALWAYS include
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Indexes — ALWAYS add for filtered/sorted columns
  @@index([cityId, categoryId, isActive])
  @@index([userId])
  @@index([createdAt])
  @@index([slug])
  
  @@map("listings")
}
```

### Query Rules

```typescript
// ✅ ALWAYS select only needed fields for relations
include: {
  user: { select: { id: true, name: true, avatar: true } }, // Only needed fields
}

// ❌ NEVER include full relation without selecting
include: { user: true } // Fetches password hash, email, everything!

// ✅ Use transactions for multi-table operations
await prisma.$transaction([
  prisma.listing.update({ where: { id }, data: { isActive: false } }),
  prisma.notification.create({ data: { userId, message: 'Listing deactivated' } }),
]);

// ✅ Prevent N+1 — Use include/select, never loop queries
// ❌ NEVER
for (const listing of listings) {
  const user = await prisma.user.findUnique({ where: { id: listing.userId } });
}
```

### Migration Rules

```bash
# ✅ ALWAYS create migration with descriptive name
npx prisma migrate dev --name add_listing_featured_flag

# ✅ ALWAYS review generated SQL before applying
# ✅ NEVER edit migration files after they are applied
# ✅ ALWAYS seed required data (categories, cities) in seed.ts
```

---

## 🔒 Security Standards

### Input Validation — EVERY Endpoint

```typescript
// ✅ Validate with Zod — strict schemas, no extra fields
const createListingSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000).trim(),
  price: z.number().positive().max(10000000),
  categoryId: z.string().cuid(),
  cityId: z.string().cuid(),
  photos: z.array(z.string().url()).max(10),
}).strict(); // .strict() rejects unknown fields

// ❌ NEVER trust client input without validation
const { title, price } = await req.json(); // Raw, unvalidated!
```

### Authentication & Authorization

```typescript
// ✅ Check auth on EVERY protected endpoint
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return apiError(new UnauthorizedError());
  
  // Check role
  if (session.user.role !== 'PROVIDER') {
    return apiError(new ForbiddenError('Only providers can create listings'));
  }
  
  return listingController.create(req, session.user);
}
```

### SQL Injection Prevention

```typescript
// ✅ Prisma handles parameterization automatically
await prisma.listing.findMany({ where: { title: { contains: userInput } } });

// ❌ NEVER use raw SQL with string concatenation
await prisma.$queryRaw`SELECT * FROM listings WHERE title = '${userInput}'`;

// ✅ If raw SQL needed, use parameterized queries
await prisma.$queryRaw`SELECT * FROM listings WHERE title = ${userInput}`;
```

### XSS Prevention

```typescript
// ✅ Sanitize all user-generated HTML content before storing
import DOMPurify from 'isomorphic-dompurify';
const cleanDescription = DOMPurify.sanitize(input.description);

// ✅ React auto-escapes JSX by default — don't bypass it
<p>{listing.description}</p>  // ✅ Safe

// ❌ NEVER use dangerouslySetInnerHTML with unsanitized content
<div dangerouslySetInnerHTML={{ __html: listing.description }} />  // ❌ XSS risk
```

### Security Headers & CORS

```typescript
// next.config.ts — ALWAYS set security headers
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];
```

### Rate Limiting — Protect ALL API Routes

```typescript
// ✅ Rate limit by IP and by user
const rateLimiter = new RateLimiterMemory({
  points: 100,       // 100 requests
  duration: 60,      // per 60 seconds
});

// Stricter for auth endpoints
const authRateLimiter = new RateLimiterMemory({
  points: 5,         // 5 attempts
  duration: 300,     // per 5 minutes
});
```

### Environment Variables

```bash
# ✅ NEVER commit secrets to git
# ✅ ALWAYS use .env.local (gitignored)
# ✅ ALWAYS validate env vars at startup with Zod

DATABASE_URL="postgresql://..."    # .env.local ONLY
NEXTAUTH_SECRET="..."              # .env.local ONLY
GOOGLE_MAPS_API_KEY="..."         # .env.local ONLY
```

---

## ⚡ Performance Checklist

### Web (Next.js)

- [ ] Server Components by default (no unnecessary `"use client"`)
- [ ] TanStack Query for all data fetching (with `staleTime`)
- [ ] Zustand selectors (not full store subscriptions)
- [ ] `React.memo` on list item components (ListingCard, CategoryCard)
- [ ] `next/dynamic` for heavy components (maps, charts, modals)
- [ ] `next/image` for all images (auto WebP, lazy loading, sizing)
- [ ] `@tanstack/react-virtual` for lists with 100+ items
- [ ] Skeleton loading states (not spinners)
- [ ] `content-visibility: auto` on off-screen sections
- [ ] No layout shifts (set explicit width/height on images)
- [ ] Prefetch critical routes with `<Link prefetch>`

### Flutter

- [ ] `const` constructors everywhere possible
- [ ] `BlocBuilder` with `buildWhen` (never rebuild unnecessarily)
- [ ] `Equatable` on all BLoC states and events
- [ ] `ListView.builder` / `SliverList` (never `ListView(children: [])`)
- [ ] `CachedNetworkImage` for all network images
- [ ] `RepaintBoundary` on maps, galleries, animations
- [ ] `AutomaticKeepAliveClientMixin` on tab pages
- [ ] Profile mode testing (`flutter run --profile`)
- [ ] Shader warm-up on splash screen
- [ ] Image compression before upload (max 1MB, WebP)
- [ ] Pagination (20 items per page, infinite scroll)

---

## 🔀 Git Workflow

### Branch Naming

```
feature/listing-create-page
feature/auth-otp-login
fix/listing-card-image-overflow
refactor/backend-error-handling
chore/update-dependencies
```

### Commit Messages — Conventional Commits

```
feat(listing): add create listing form with image upload
fix(auth): handle expired OTP error gracefully
refactor(backend): extract pagination helper to utils
style(ui): adjust listing card spacing on mobile
chore(deps): update next.js to 16.3.1
docs(readme): add setup instructions
perf(listing): add database index on cityId + categoryId
security(auth): add rate limiting to login endpoint
```

### PR Rules

- [ ] Every PR has a clear description of what and why
- [ ] No PRs with 500+ lines (split into smaller PRs)
- [ ] All tests pass before merging
- [ ] No `console.log` or `print()` left in code
- [ ] No commented-out code
- [ ] No hardcoded values (use constants or env vars)

---

## ✅ Code Review Checklist

Before merging ANY code, verify:

### Functionality
- [ ] Does it work as intended?
- [ ] Does it break any existing functionality?
- [ ] Edge cases handled? (empty state, error state, loading state)

### Architecture
- [ ] Follows module structure? (right file in right folder)
- [ ] No business logic in frontend?
- [ ] No direct DB access in controller?
- [ ] Import rules respected?

### Security
- [ ] Input validated with Zod?
- [ ] Auth checked on protected endpoints?
- [ ] No sensitive data in API response (password, tokens)?
- [ ] No secrets hardcoded?

### Performance
- [ ] No unnecessary re-renders?
- [ ] Images optimized?
- [ ] Queries have proper indexes?
- [ ] Pagination used for lists?

### Code Quality
- [ ] TypeScript types complete (no `any`)?
- [ ] Error handling in place?
- [ ] No `console.log` / `print()` in production code?
- [ ] Comments only where logic is non-obvious?

---

## 📝 File Naming Conventions

### Next.js (TypeScript)

```
Components:     PascalCase.tsx       → ListingCard.tsx, HeroSection.tsx
Hooks:          camelCase.ts         → useListings.ts, useAuth.ts
Controllers:    kebab.controller.ts  → listing.controller.ts
Services:       kebab.service.ts     → listing.service.ts
Repositories:   kebab.repository.ts  → listing.repository.ts
Validators:     kebab.validator.ts   → listing.validator.ts
Types:          kebab.types.ts       → listing.types.ts
Stores:         kebab.store.ts       → city.store.ts
Constants:      camelCase.ts         → categories.ts, config.ts
```

### Flutter (Dart)

```
Screens:        snake_case.dart      → listing_detail_screen.dart
Widgets:        snake_case.dart      → listing_card.dart
BLoCs:          snake_case.dart      → listing_bloc.dart
Models:         snake_case.dart      → listing_model.dart
Repositories:   snake_case.dart      → listing_repository.dart
```

---

## 🚫 NEVER Do List

| ❌ Never | ✅ Instead |
|---|---|
| `any` type | Proper TypeScript types |
| `console.log` in production | Use `pino` logger with levels |
| `setState` in Flutter | Use BLoC |
| `useEffect` for data fetching | Use TanStack Query |
| Inline styles | Tailwind classes |
| String concatenation in SQL | Prisma parameterized queries |
| `var` in TypeScript | `const` or `let` |
| Magic numbers | Named constants |
| Commented-out code | Delete it (git has history) |
| `// TODO` without ticket/issue | Create a GitHub issue instead |
| `catch (e) {}` (empty catch) | Log error, throw custom error |
| Direct `fetch()` in components | API service layer + TanStack Query |
| `!important` in CSS | Fix specificity properly |
| Storing passwords in plain text | bcrypt hash |
| JWT in localStorage | httpOnly secure cookies |
| `SELECT *` mentality | Select only needed fields |
| Mutating state directly | Immutable updates (spread, copyWith) |

---

## 🏗️ System Design Principles

### Follow 12-Factor App Methodology
1. **Codebase** — One codebase in git, many deploys
2. **Dependencies** — Explicitly declare (package.json, pubspec.yaml)
3. **Config** — Store in environment variables
4. **Backing services** — Treat DB, storage as attached resources
5. **Build, release, run** — Strict separation
6. **Processes** — Stateless, share-nothing
7. **Port binding** — Export via port
8. **Concurrency** — Scale via process model
9. **Disposability** — Fast startup, graceful shutdown
10. **Dev/prod parity** — Keep environments similar
11. **Logs** — Treat as event streams
12. **Admin processes** — Run as one-off processes

### SOLID Principles
- **S** — Single Responsibility (one module = one purpose)
- **O** — Open/Closed (extend, don't modify)
- **L** — Liskov Substitution (subtypes must be substitutable)
- **I** — Interface Segregation (small, focused interfaces)
- **D** — Dependency Inversion (depend on abstractions)

### Also Follow
- **DRY** — Don't Repeat Yourself (but don't over-abstract early)
- **KISS** — Keep It Simple, Stupid
- **YAGNI** — You Ain't Gonna Need It (don't build speculative features)
