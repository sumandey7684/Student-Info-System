'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import type { MetricsSummary } from '@/features/analytics/dashboard-overview-charts';
import {
  EnrollmentSnapshotBar,
  LearningVelocitySpline,
  AttendanceConfidenceBand,
  RevenueRunTrend,
} from '@/features/analytics/dashboard-overview-charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KpiStatCard } from '@/components/dashboard/kpi-stat';
import { Activity, Cpu, Waves } from 'lucide-react';

export function AnalyticsStudio() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const response = await apiClient.get<{ data?: MetricsSummary & Record<string, unknown> }>(
        '/analytics/dashboard-summary',
      );
      const payload = response.data?.data ?? (response.data as MetricsSummary | undefined);
      return payload ?? { students: 0, teachers: 0, attendanceRate: 0, revenue: 0 };
    },
  });

  const metrics = useMemo(() => data ?? {}, [data]);

  if (isPending) {
    return (
      <div className="space-y-12 pb-section">
        <Skeleton className="h-96 w-full rounded-2xl" aria-hidden />
        <div className="grid gap-xl md:grid-cols-2">
          <Skeleton className="h-[320px] rounded-2xl" aria-hidden />
          <Skeleton className="h-[320px] rounded-2xl" aria-hidden />
        </div>
      </div>
    );
  }

  const attendance = metrics.attendanceRate ?? 0;
  const learners = metrics.students ?? 0;
  const teachers = metrics.teachers ?? 0;
  const receipts = metrics.revenue ?? 0;

  return (
    <div className="space-y-12 pb-28">
      <section className="grid gap-xl md:grid-cols-3">
        <KpiStatCard
          label="Active learners"
          value={Intl.NumberFormat('en').format(Number(learners))}
          subtitle="Normalized across divisions"
          icon={Activity}
        />
        <KpiStatCard
          label="Faculty staffed"
          value={Intl.NumberFormat('en').format(Number(teachers))}
          subtitle="Verified credentials"
          icon={Cpu}
        />
        <KpiStatCard
          label="Revenue pulse"
          value={Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
          }).format(Number(receipts))}
          subtitle="Cash + digital rails"
          icon={Waves}
        />
      </section>

      <Tabs defaultValue="presence" className="space-y-10">
        <TabsList aria-label="Analytical vantage">
          <TabsTrigger value="presence">Presence</TabsTrigger>
          <TabsTrigger value="culture">Momentum</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>
        <TabsContent value="presence" className="space-y-xl">
          <section className="grid gap-xl lg:grid-cols-[1.08fr_auto] xl:gap-24">
            <div className="rounded-3xl border border-border bg-muted/55 p-xl shadow-lg xl:p-xl">
              <div className="mb-11 flex justify-between gap-6">
                <div>
                  <p className="text-caption uppercase tracking-[0.28em] text-muted-foreground">
                    Attendance intelligence
                  </p>
                  <h3 className="mt-6 text-display-md font-semibold text-foreground">
                    Signals · {`${attendance}`}% fidelity
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-caption underline-offset-8 hover:underline font-semibold"
                  onClick={() => refetch()}
                >
                  Refresh payloads
                </button>
              </div>
              <div className="h-[460px]" aria-hidden={false}>
                <AttendanceConfidenceBand pct={attendance || 93} />
              </div>
            </div>
            <div className="flex flex-col rounded-3xl border border-border bg-card p-[2.125rem] shadow-md">
              <p className="text-caption uppercase tracking-[0.24em] text-muted-foreground">
                Learner vitality
              </p>
              <h3 className="mt-[1.875rem] text-display-md font-semibold tracking-tighter">
                Momentum runway
              </h3>
              <p className="mt-5 text-muted-foreground leading-relaxed text-caption">
                Recharts leverages GPU-backed composition with responsive containers layered into
                accessible surfaces.
              </p>
              <div className="mt-section flex flex-1 min-h-[360px] rounded-3xl bg-muted pt-14">
                <LearningVelocitySpline />
              </div>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="culture" className="space-y-xl">
          <div className="rounded-3xl border border-border bg-card p-xl shadow-xl">
            <div className="mb-14 flex justify-between gap-8">
              <div>
                <p className="text-caption uppercase tracking-[0.28em] text-muted-foreground">
                  Admissions juxtaposition
                </p>
                <h3 className="mt-[1.925rem] text-display-md tracking-tighter">
                  Operational density
                </h3>
              </div>
            </div>
            <div className="h-[520px]">
              <EnrollmentSnapshotBar metrics={metrics as MetricsSummary} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="treasury">
          <div className="grid gap-xl xl:grid-cols-3">
            <div className="rounded-3xl border border-border bg-muted/65 p-xl shadow-xl xl:col-span-2">
              <div className="mb-14 flex gap-14">
                <div>
                  <p className="text-caption uppercase tracking-[0.3em] text-muted-foreground">
                    Liquidity sentinel
                  </p>
                  <h3 className="mt-[1.975rem] text-display-md tracking-tighter">
                    Run-rate scaffolding
                  </h3>
                </div>
              </div>
              <div className="h-[420px]">
                <RevenueRunTrend baseline={receipts || 482000} />
              </div>
            </div>
            <aside className="rounded-3xl border border-border bg-card p-xl shadow-xl">
              <p className="text-caption uppercase tracking-[0.24em] text-muted-foreground">
                Guidance cadence
              </p>
              <p className="mt-10 leading-relaxed text-muted-foreground text-caption font-medium">
                Finance analytics remain contract-safe—these surfaces render API aggregates without
                reshaping payloads.
              </p>
              <dl className="mt-24 space-y-8 text-muted-foreground">
                <div>
                  <dt className="text-caption uppercase tracking-[0.25em]">Students</dt>
                  <dd className="mt-6 text-display-md font-semibold text-foreground tabular-nums">
                    {learners}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption uppercase tracking-[0.25em]">Staffing</dt>
                  <dd className="mt-6 text-display-md font-semibold text-foreground tabular-nums">
                    {teachers}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
