import { Sidebar } from '@/components/layout/sidebar';

export default function FinancePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-4 text-2xl font-bold">Finance & Payments</h1>
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Stripe integration, invoices, overdue fee analytics, and reconciliation workflows go here.
          </p>
        </section>
      </main>
    </div>
  );
}
