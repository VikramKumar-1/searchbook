---
name: searchbook-coding-standards
description: >-
  MANDATORY: Read this skill BEFORE writing ANY code in SearchBook project.
  Contains complete backend architecture (Controller, Service, Repository, Validator, Middleware, Model),
  frontend standards (TanStack Query, Zustand, React Hook Form, shadcn/ui),
  Flutter standards (BLoC, Freezed, Dio), database rules, security standards,
  performance optimization, and step-by-step guide to add new modules.
  Activate this skill whenever you need to create, modify, or review any code.
---

# SearchBook Coding Standards (Detailed Reference)

> **This skill contains the complete, detailed coding standards for SearchBook.**
> The concise version is in `AGENTS.md` (auto-loaded). This skill has full code examples and patterns.

## How to Use

When you need to write code for SearchBook, read the full detailed reference:

**File:** `CODING_STANDARDS.md` (project root)

```
Read the file at: CODING_STANDARDS.md
```

This file contains:
1. **10 Golden Rules** — Top rules every line of code must follow
2. **Architecture Rules** — Folder responsibility, import rules, module structure
3. **Backend Architecture Deep Dive** — Complete request lifecycle with 8 layers:
   - Layer 1: Route (app/api/) — HTTP bridge
   - Layer 2: Middleware — Auth, role, rate limiting
   - Layer 3: Validator — Zod schemas with type inference
   - Layer 4: Controller — Parse, validate, delegate
   - Layer 5: Service — ALL business logic
   - Layer 6: Repository — Prisma queries ONLY
   - Layer 7: Model — Prisma schema + TypeScript types
   - Layer 8: Utils — API response, errors, pagination, sanitize
4. **How to Add a New Module** — 5-step guide for future developers
5. **"What Goes Where" Quick Reference** — 15 common questions answered
6. **Next.js Frontend Standards** — Server Components, TanStack Query, Zustand, React Hook Form
7. **Flutter Standards** — BLoC, Freezed, const widgets, CachedNetworkImage
8. **Database & Prisma Standards** — Indexes, N+1 prevention, soft deletes, transactions
9. **Security Standards** — Zod validation, XSS, SQL injection, rate limiting, headers
10. **Performance Checklist** — Web + Flutter optimization rules
11. **Logging Standards** — What to log, what never to log
12. **Testing Standards** — What to test per layer
13. **Deployment Checklist** — Production readiness
14. **Git Workflow** — Branch naming, conventional commits
15. **File Naming Conventions** — TypeScript + Dart
16. **NEVER Do List** — 17 anti-patterns with correct alternatives
17. **System Design Principles** — 12-Factor App, SOLID, DRY, KISS, YAGNI

## Before Writing Any Code

1. Read `CODING_STANDARDS.md` fully
2. Identify which module your code belongs to
3. Follow the exact layer pattern (Route → Controller → Service → Repository)
4. Use the code examples as templates
5. Never break existing functionality
