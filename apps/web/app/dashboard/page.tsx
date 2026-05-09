import { Sidebar } from '@/components/layout/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const stats = [
  { label: 'Total Students', value: '1,284' },
  { label: 'Teachers', value: '132' },
  { label: 'Attendance', value: '93.8%' },
  { label: 'Pending Fees', value: '$24,180' },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <ThemeToggle />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <section key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
