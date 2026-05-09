# Frontend Design System (`apps/web`)

## Tokens

Semantic tokens ship as CSS variables in `app/globals.css` and mirror into Tailwind via `tailwind.config.ts`.

- Typography: semantic keys (`display-lg/md`, `headline`, `subtitle`, `body`, `caption`) layered with Geist-aligned Inter sans + mono stack from `app/layout.tsx`.
- Spacing: utility keys (`xs` → `page`, plus `section` / `page` rhythm) keep consistent SaaS grids.
- Elevation / shadow: layered `shadow-xs/sm/md/lg` mapped to calibrated alpha stacks for light/dark parity.
- Color: foreground/background/card/muted/accent/success/destructive/warning palettes tuned for readability.
- Radius: hierarchical radii `--radius-*` unify cards, dialogs, badges, segmented controls.

## Layout Primitives (`components/design-system`)

- `PageContainer` establishes max width + gutters.
- `StickyDashboardHeader` pairs breadcrumbs + title + contextual actions (`WorkspaceActionsDropdown`).
- `PageTransition` centralizes restrained Framer Motion + reduced-motion branching.
- `EmptyState`, `ErrorState` deliver consistent conversational UI.

## Global UX

- `CommandMenu`: `⌘/Ctrl + K` palette (`cmdk` + radix dialog scaffold) bound to centralized routes.
- Notifications center shell pre-wires dropdown affordances awaiting backend payloads.
- `next-themes` powers theme fidelity; `ThemeToggle` cycles light/dark/system with accessible menus.
- Toast stack via `sonner` (`AppProviders`).

Refer to `/docs/frontend/frontend-architecture.md` for module boundaries and extension guidance.
