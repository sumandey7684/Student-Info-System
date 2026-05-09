'use client';

import Link from 'next/link';
import { useUiStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';

const linksByRole: Record<string, { href: string; label: string }[]> = {
  ADMIN: [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/students', label: 'Students' },
    { href: '/dashboard/teachers', label: 'Teachers' },
    { href: '/dashboard/finance', label: 'Finance' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/audit-logs', label: 'Audit Logs' },
  ],
  TEACHER: [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/students', label: 'Students' },
  ],
  STUDENT: [{ href: '/dashboard', label: 'Overview' }],
};

export function Sidebar() {
  const role = useUiStore((s) => s.role);
  const authRole = useAuthStore((s) => s.role) ?? role;
  const links = linksByRole[authRole] ?? linksByRole.ADMIN;
  return (
    <aside className="w-64 border-r border-slate-200 p-4 dark:border-slate-800">
      <h2 className="mb-4 text-lg font-semibold">SIS - {authRole}</h2>
      <nav className="space-y-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
