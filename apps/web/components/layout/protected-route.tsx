'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { routes } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!token) router.replace(routes.login);
  }, [token, router]);

  if (!token) {
    return (
      <div
        className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center px-page pt-[12vh]"
        aria-busy="true"
      >
        <motion.div
          layout
          className="w-full rounded-xl border border-border bg-muted/55 p-page shadow-inner"
        >
          <p className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
            Encrypting handshake…
          </p>
          <p className="mt-4 text-display-md font-semibold text-foreground">
            Validating SSO context
          </p>
          <div className="mt-10 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" aria-hidden />
            <Skeleton className="h-3 w-[88%]" aria-hidden />
            <Skeleton className="h-3 w-[72%]" aria-hidden />
            <Skeleton className="h-3 w-[94%]" aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => router.replace(routes.login)}
            className="mt-10 w-full rounded-lg border border-input bg-background py-3 text-caption font-semibold uppercase tracking-wide hover:bg-muted"
          >
            Return to authentication
          </button>
          <p className="mt-6 text-caption text-muted-foreground">
            Need help? Visit the{' '}
            <Link href={routes.home} className="text-accent underline-offset-4 hover:underline">
              product overview
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
