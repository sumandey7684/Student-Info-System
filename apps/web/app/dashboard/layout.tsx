import { ProtectedRoute } from '@/components/layout/protected-route';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell title="Operational workspace">{children}</DashboardShell>
    </ProtectedRoute>
  );
}
