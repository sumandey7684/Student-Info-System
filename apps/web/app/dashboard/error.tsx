'use client';

import Link from 'next/link';
import { ErrorState } from '@/components/design-system/error-state';
import { routes } from '@/lib/routes';
import { PageContainer } from '@/components/design-system/page-shell';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer className="py-page xl:pb-page">
      <ErrorState
        title="Dashboard surface degraded"
        description={error.message ?? 'Boundary captured an unexpected anomaly.'}
        retry={reset}
      />
      <Link
        href={routes.dashboard.root}
        className="mt-24 block font-semibold text-accent underline-offset-[0.5rem]"
        prefetch
      >
        Return Overview
      </Link>
      {error.digest ? (
        <span className="mt-24 block font-mono text-caption text-muted-foreground">
          Fingerprint {error.digest}
        </span>
      ) : null}
    </PageContainer>
  );
}
