/** Back-compat re-export for `@/components/layout/sidebar`; prefer importing from `dashboard-shell` directly when adding new layouts. */
export {
  Sidebar,
  DashboardShell,
  WorkspaceActionsDropdown,
  linksForRole,
} from '@/components/layout/dashboard-shell';
export type { SidebarLinkSpec } from '@/components/layout/dashboard-shell';
