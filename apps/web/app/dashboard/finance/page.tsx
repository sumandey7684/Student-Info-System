'use client';

import { Wallet2, Landmark, Receipt } from 'lucide-react';
import dynamic from 'next/dynamic';
import { routes } from '@/lib/routes';
import {
  PageContainer,
  PageTransition,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { KpiStatCard } from '@/components/dashboard/kpi-stat';
import { Separator } from '@/components/ui/separator';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LazyRevenueTrend = dynamic(
  () =>
    import('@/features/analytics/dashboard-overview-charts').then((mod) => {
      function RevenueTrendLazy(props: { baseline: number }) {
        return (
          <div className="size-full">
            <mod.RevenueRunTrend {...props} />
          </div>
        );
      }
      return { default: RevenueTrendLazy };
    }),
  {
    loading: () => (
      <div
        className="h-[300px] w-full animate-pulse rounded-xl border border-border bg-muted/65"
        aria-hidden
      />
    ),
    ssr: false,
  },
);

export default function FinancePage() {
  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Operations', href: routes.dashboard.root },
          { label: 'Finance grid', href: routes.dashboard.finance },
        ]}
        title="Revenue fidelity board"
        description="Stripe intents, ACH clearing, arrears choreography, reconciliation."
        actions={
          <button
            type="button"
            className="rounded-lg border border-input px-page py-page text-caption font-semibold uppercase tracking-[0.2em]"
            disabled
          >
            Settlement sync (wired server-side soon)
          </button>
        }
      />
      <PageTransition>
        <PageContainer className="space-y-12">
          <section className="grid gap-section md:grid-cols-3">
            <KpiStatCard
              label="Collected MTD"
              value="$428k"
              subtitle="Rolling 31-day aperture"
              trend={{ dir: 'up', label: 'ACH healthy' }}
              icon={Wallet2}
            />
            <KpiStatCard
              label="Overdue guardians"
              value="37"
              subtitle="Median age 06d"
              trend={{ dir: 'down', label: '-9 cases' }}
              icon={Receipt}
            />
            <KpiStatCard
              label="Reconciliation SLA"
              value="94%"
              subtitle="Median completion 06h · 14m"
              trend={{ dir: 'up', label: '+3.9%' }}
              icon={Landmark}
            />
          </section>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>Liquidity pulse</CardTitle>
              <CardDescription>
                Visualization lazy-loads bundle-safely · keeps first paint luminous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full rounded-xl border border-border bg-muted/30 p-6">
                <LazyRevenueTrend baseline={482000} />
              </div>
            </CardContent>
          </Card>
          <p className="rounded-xl border border-dashed px-gutter py-10 text-caption text-muted-foreground">
            Deep-link payouts to banking cores once treasury APIs land — scaffold is ready
            server-side routing agnosticly.
          </p>
        </PageContainer>
      </PageTransition>
    </>
  );
}
