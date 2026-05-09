# Phase 2.1 Security Hardening

## Authentication Security

- Access token remains short-lived and returned in response body.
- Refresh token is issued as signed `HttpOnly` cookie (`refresh_token`), `SameSite=Strict`, secure in production.
- CSRF uses double-submit cookie strategy (`csrf_token` + `x-csrf-token` header).
- Refresh token reuse detection revokes all sessions for affected user.
- Session anomaly checks compare stored IP and current IP during refresh.
- Failed login attempts are tracked in Redis with temporary account lockout.

## API Hardening

- Helmet enabled with CSP.
- Payload sanitization middleware strips dangerous keys and XSS vectors (`<`, `>`).
- Global request tracing provides request IDs for audit correlation.
- Sensitive routes (`auth`, `payments`) emit audit records.

## Password Security

- Password reset checks prevent recent password reuse.
- Password history hashes are retained in Redis with TTL.

## Recommendations

- Move password history to persistent DB table for strict compliance regimes.
- Terminate TLS at proxy and enforce HSTS.
- Add WAF/IP reputation if exposed publicly.
