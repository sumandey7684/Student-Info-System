# Component cookbook (`@sis/web`)

## Page chrome

Use `StickyDashboardHeader` + `PageContainer` + optional `PageTransition` from `components/design-system/page-shell.tsx`:

```tsx
<StickyDashboardHeader breadcrumbs={[...]} title="..." description="..." actions={<Button />} />
<PageTransition>
  <PageContainer className="space-y-14">{children}</PageContainer>
</PageTransition>
```

## Enterprise table

Prefer `EnterpriseDataTable` (`components/data-table/enterprise-data-table.tsx`) over ad-hoc tables. Columns are defined with TanStack helpers; omit explicit `ColumnDef<Row, unknown>` annotations so accessors keep their inferred TValue (the table props allow mixed column generics similarly to `components/data-table/data-table.tsx`).

Set `toolbarExtra`, `bulkActionsSlot`, `onExportCsv`, and `enableRowSelection` per screen requirements.

## Analytics

Wrap heavy charts in `dynamic(..., { ssr: false, loading: skeleton })` at the route/feature boundary (see `finance` dashboard). Compose small chart surfaces from `features/analytics/dashboard-overview-charts.tsx`.

## Global affordances

- Command palette: `components/command/command-menu.tsx` (toggle via ⌘K / Ctrl+K or `ui-store` flag).
- Toasts: `import { toast } from 'sonner'` (mounted in `components/providers/app-providers.tsx`).
- Themes: `ThemeToggle`, token source `app/globals.css`.

## Routes

Central path literals live in `lib/routes.ts` — use them in links and command menus to avoid divergence.
