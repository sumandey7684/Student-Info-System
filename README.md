# Student Information Centre (Enterprise SIS)

Production-grade full-stack Student Information System using Next.js 15 + NestJS + PostgreSQL (Prisma) with Docker-first deployment.

## Tech Stack

- Frontend: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Zustand, Axios
- Backend: NestJS, REST APIs, JWT auth, RBAC-ready modules, Swagger, WebSocket gateway
- Data: PostgreSQL + Prisma ORM, migrations, seed scripts, indexed relational schema
- Infra: Docker Compose, Nginx reverse proxy, environment-based configuration, GitHub Actions CI
- Quality: Jest test scaffolding, lint/format, Husky + lint-staged hooks

## Monorepo Structure

```text
student-info-centre/
  apps/
    api/                    # NestJS backend
      src/
        common/             # filters, guards, interceptors, decorators
        modules/
          auth/
          users/
          students/
          notifications/
      prisma/
        schema.prisma
        seed.ts
    web/                    # Next.js frontend
      app/
      components/
      lib/
      store/
  infra/nginx/default.conf
  .github/workflows/ci.yml
  docker-compose.yml
  .env.example
```

## Backend Architecture (NestJS)

- Modular feature-based design (`auth`, `students`, `users`, `notifications`)
- Global `ValidationPipe` with DTO validation (`class-validator`)
- Global exception filter + response transform interceptor
- JWT auth service scaffold with login/register endpoints
- Swagger docs at `/docs`
- Rate limiting via `@nestjs/throttler`
- WebSocket notification gateway for real-time alerts

### Example API Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users`
- `GET /api/v1/students`

## Frontend Architecture (Next.js 15)

- App Router layout with dashboard entry pages
- Role-aware sidebar using Zustand state store
- Axios API client abstraction in `lib/api.ts`
- Tailwind-based responsive dashboard cards (admin sample)
- Foundation to plug in Shadcn UI and Framer Motion components

### Dashboard Targets by Role

- Admin: user/student/teacher management, analytics, settings
- Student: attendance, grades, timetable, fee status
- Teacher: attendance marking, grade submission, assignments
- Parent: child progress, notifications, fees

## Database Schema (Prisma)

Implemented models:

- `User` with role enum (`ADMIN`, `TEACHER`, `STUDENT`, `PARENT`)
- `Student`, `Teacher`, `Parent` as role-specific profiles
- `Attendance`, `Grade`, `Fee` with key business indexes

Indexes/constraints included:

- unique email/registration/invoice
- role and date lookup indexes
- composite uniqueness (`Attendance.studentId + date`)

## Authentication Flow

1. User registers via `POST /auth/register`.
2. User logs in via `POST /auth/login`.
3. Backend issues JWT access token.
4. Frontend stores token (recommended: HTTP-only secure cookie).
5. Protected endpoints use guards (next step: implement `JwtAuthGuard` + `RolesGuard`).

## DevOps and Environments

- `.env.example` contains baseline config for:
  - `development`
  - `staging`
  - `production`
- Docker Compose services:
  - `postgres`, `redis`, `api`, `web`, `nginx`
- CI pipeline: install, lint, test, build

## Getting Started

1. Install:
   - `pnpm install`
2. Prepare env:
   - copy `.env.example` to `.env`
3. Start containers:
   - `docker compose up --build`
4. For local development (without containerized app runtime):
   - `pnpm --filter @sis/api dev`
   - `pnpm --filter @sis/web dev`

## Prisma Commands

- Generate client: `pnpm --filter @sis/api prisma:generate`
- Run migrations: `pnpm --filter @sis/api prisma:migrate`
- Seed DB: `pnpm --filter @sis/api prisma:seed`

## Testing

- Unit tests: `pnpm test`
- Integration/E2E:
  - NestJS e2e (recommended next step under `apps/api/test`)
  - Playwright e2e for `apps/web` (recommended next step under `apps/web/tests`)

## Production Best Practices Implemented

- Feature-modular architecture and clear boundaries
- Strict TypeScript across backend/frontend
- Global validation and standardized API responses
- Centralized exception handling
- API documentation with Swagger
- DB indexes and explicit relations for performance/scalability
- Dockerized deployment and reverse proxy ingress

## Next Implementation Phases

1. Complete RBAC guards/decorators + policy layer.
2. Add OAuth2 providers (Google/Microsoft), refresh tokens, MFA (TOTP), password reset.
3. Expand all requested modules (library, hostel, transport, payments/Stripe).
4. Add charting, advanced tables, filtering/pagination/search components.
5. Add caching abstractions with Redis and CQRS-ready service patterns.
6. Harden security (helmet, CSP, audit logs, secrets manager, SSO).

## Phase 2 (Implemented in this iteration)

### Authentication and Session Security

- Access + refresh token architecture with refresh rotation
- Session persistence and revocation via Prisma + Redis
- Forgot/reset password token lifecycle
- Email verification token lifecycle
- MFA setup/enable/disable scaffolding with TOTP + backup codes + QR generation
- JWT strategy and guard for protected APIs

### Advanced Authorization

- Role hierarchy schema with enterprise roles:
  - `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `ACCOUNTANT`, `LIBRARIAN`
- Permission entities and role-permission mapping tables
- `@RequirePermissions()` decorator + `PermissionsGuard`
- Redis-backed permission cache service
- Super admin override support

### Shared Infrastructure

- Global Prisma module
- Global Redis module + cache helpers
- Request tracing middleware with request-id
- Shared query DTO (`page`, `limit`, `search`, `sortBy`, `order`)
- Query utilities for pagination/sorting
- Audit log module and APIs

### New Enterprise Modules

- CRUD foundations:
  - `students`, `teachers`, `parents`
  - `departments`, `subjects`, `courses`, `classes`
- Payments module (Stripe-intent style API + webhook-ready endpoint + summary API)
- Analytics module with dashboard KPI summary and Redis caching
- Media module with signed-upload orchestration and metadata persistence
- Queue module using BullMQ for background email/notification jobs

### Frontend Enterprise Additions

- React Query provider
- Protected route wrapper
- Auth session store
- Login page
- Reusable TanStack data table
- Analytics dashboard page (chart-ready)
- Audit log viewer page

## Security Notes

- Set `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`, `STRIPE_WEBHOOK_SECRET` in production.
- Enforce HTTPS and secure cookies at reverse proxy/load balancer.
- Replace local/signed-upload mock URL with S3 pre-signed implementation in production media pipeline.

## Phase 2.1 Hardening (Current)

- CSRF middleware + secure refresh cookie auth flow
- Helmet + CSP + payload sanitization middleware
- Redis lockout and brute-force throttling on auth
- Refresh token reuse detection + revoke-all-sessions support
- Stripe SDK integration with webhook signature verification and refund workflow
- S3/local provider abstraction for signed upload URLs
- Queue hardening with dead-letter queue and dedicated worker entrypoint
- Health/readiness probes and Prometheus metrics endpoint
- Multi-stage non-root Docker runtime + compose health checks
