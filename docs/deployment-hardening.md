# Deployment Hardening Notes

## Containers

- API and Web Dockerfiles are multi-stage and run as non-root users.
- Compose includes health checks for Postgres, Redis, API, and Web.
- Dependency startup order is based on health status, not only service start.

## Runtime Probes

- Liveness: `/api/v1/health/live`
- Readiness: `/api/v1/health/ready`
- Metrics: `/api/v1/metrics`

## Nginx

- Adds baseline security headers:
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`

## Incident Recovery

- If API fails readiness:
  1. check DB/Redis health
  2. inspect migration status
  3. verify JWT/COOKIE secrets are present
- If webhook ingestion fails:
  1. verify Stripe webhook secret
  2. reprocess missed events via Stripe dashboard replay
