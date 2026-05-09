import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Student Information Centre</h1>
      <p className="text-slate-600 dark:text-slate-300">
        Enterprise-ready SIS with role-based dashboards and modular architecture.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white dark:bg-slate-200 dark:text-slate-900"
      >
        Open Dashboard
      </Link>
    </main>
  );
}
