# SIS Enterprise Architecture Blueprint

## Target Feature Modules

### Backend Modules (`apps/api/src/modules`)

- `auth`: register/login, MFA, password reset, OAuth2, session management
- `users`: user lifecycle, role assignment, profile administration
- `students`: enrollment, profile, records, attendance, timetable, exams, fees
- `teachers`: attendance, grades, assignments, class timetable
- `parents`: linked child monitoring, notifications, fee overview
- `communication`: announcements, messaging, push/email notifications
- `exams`: scheduling, marks entry, GPA/CGPA, report cards
- `analytics`: KPIs, reporting, export PDF/Excel
- `payments`: Stripe integration, invoices, reconciliations
- `library`: catalog, issue/return, overdue fines
- `hostel`: room allocation, occupancy tracking
- `transport`: routes, student assignment, bus monitoring

### Frontend Route Modules (`apps/web/app/dashboard`)

- `/admin/*`
- `/student/*`
- `/teacher/*`
- `/parent/*`
- Shared routes:
  - `/dashboard/notifications`
  - `/dashboard/settings`
  - `/dashboard/reports`

## Clean Architecture Layers (Backend)

For each module:

1. `controller` (HTTP entry)
2. `dto` (request/response contracts)
3. `service` (application logic)
4. `domain` (entities/value objects)
5. `repository` (data access abstraction)
6. `infrastructure` (Prisma adapters, external providers)

Cross-cutting:

- Guards (`JwtAuthGuard`, `RolesGuard`)
- Interceptors (response, logging, caching)
- Filters (global exception handling)
- Middleware (request-id, audit context)

## API Design Conventions

- Versioning: `/api/v1`
- Pagination query shape:
  - `?page=1&limit=20&search=alice&sortBy=createdAt&order=desc`
- Success response:
  - `{ success: true, data: ..., meta?: ... }`
- Error response:
  - `{ success: false, timestamp, error }`

## Security Baseline

- JWT access + refresh token rotation
- MFA for privileged roles
- OAuth2 SSO support (Google/Microsoft)
- Rate limiting on auth and public endpoints
- Password hashing (`argon2`)
- Audit logging for admin actions
