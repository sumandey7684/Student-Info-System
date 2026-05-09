# Frontend Architecture

## Layers

```
app/
  ├─ (marketing/home)
  └─ dashboard/*        # route segments behind shared layout wrapper
features/
  ├─ analytics/
  └─ dashboard/         # feature-specific presentation logic
components/
  ├─ command/           # ⌘ palette + global infra
  ├─ dashboard/         # KPI + hero chrome
  ├─ data-table/        # TanStack primitives (enterprise-grade grid)
  ├─ design-system/     # typography + scaffolding atoms
  ├─ layout/            # shell, protected shell, sidebar re-exports
  ├─ providers/         # AppProviders merges QueryClient, themes, Tooltip, toaster
  └─ ui/                # radix-backed primitives styled with Tailwind tokens
```

## Data & Contracts

`lib/api.ts` remains the Axios surface (CSRF-aware, refresh interception + Sonner surfaced session expiry cues). Frontend keeps DTO interpretations local to feature modules (e.g. `features/analytics/analytics-studio.tsx`).

TanStack Query clients live in `QueryProvider`; defaults bias toward SSR-friendly dashboards (45s staleness).

## Routing

`lib/routes.ts` exposes typed literals matching Next `typedRoutes` expectations; command palette consumes the same catalogue to eliminate drift between navigation hotspots.

## Performance & Motion

Charts load lazily when beneficial (`finance` Revenue trend, forthcoming backend widgets). Animations funnel through reduced-motion guarded Framer primitives to avoid regressions against accessibility SLAs.

## Extension Checklist

1. Add semantic tokens alongside CSS vars + Tailwind mappings.
2. Reuse `/components/design-system/page-shell.tsx` scaffolding for dashboards.
3. Prefer `EnterpriseDataTable` patterns for grids (column meta labels power visibility toggles).
