'use client';

import Link from 'next/link';
import { Users, ClipboardList, Layers3, BellRing } from 'lucide-react';
import { routes } from '@/lib/routes';
import { WorkspaceActionsDropdown } from '@/components/layout/dashboard-shell';
import {
  PageContainer,
  PageTransition,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { KpiStatCard } from '@/components/dashboard/kpi-stat';
import { OperationalActivityRadar } from '@/features/dashboard/activity-feed';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const statsSeed = [
  {
    label: 'Total students',
    value: '1,284',
    trend: '+3.9% QoQ',
    icon: Users,
    trendDir: 'up' as const,
  },
  {
    label: 'Teachers online',
    value: '132',
    trend: '+6 ready-to-handoff',
    icon: ClipboardList,
    trendDir: 'up' as const,
  },
  {
    label: 'Attendance index',
    value: '93.8%',
    trend: '+1.12 pts WoW',
    icon: Layers3,
    trendDir: 'up' as const,
  },
  {
    label: 'Pending fees',
    value: '$24.2k',
    trend: 'Stripe sync healthy',
    icon: BellRing,
    trendDir: 'up' as const,
  },
];

export default function DashboardOverviewPage() {
  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Home', href: routes.home },
          { label: 'Operations', href: routes.dashboard.root },
        ]}
        title="Operational command"
        description="Enterprise-grade vantage point engineered for disciplined leadership teams."
        actions={
          <>
            <WorkspaceActionsDropdown />
            <Button asChild size="lg">
              <Link href={routes.dashboard.students}>Open student roster</Link>
            </Button>
          </>
        }
      />

      <PageTransition>
        <PageContainer className="space-y-11">
          <section className="grid gap-section md:grid-cols-2 xl:grid-cols-4">
            {statsSeed.map((stat) => (
              <KpiStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                trend={{ dir: stat.trendDir, label: stat.trend }}
                subtitle={
                  stat.label === 'Attendance index'
                    ? 'Telemetry blended across faculties'
                    : undefined
                }
              />
            ))}
          </section>

          <section className="grid gap-xl lg:grid-cols-[2fr_auto] xl:gap-14">
            <Card className="border-border shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>Orchestration focus</CardTitle>
                  <Badge variant="accent">Signal mode</Badge>
                </div>
                <CardDescription>
                  Harmonize onboarding, guardianship, accreditation, finance, analytics, and
                  auditing into a single tempered surface. Each tile links to hardened operational
                  flows without breaking backend contracts you already enforced.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-section py-12">
                <OperationalActivityRadar />
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between gap-4">
                <p className="text-caption text-muted-foreground uppercase tracking-[0.3em]">
                  Microinteractions
                </p>
                <Button asChild variant="ghost">
                  <Link href={routes.dashboard.auditLogs}>Review audit deltas</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-xl">
              <Card className="border-dashed shadow-inner">
                <CardHeader className="space-y-2">
                  <CardTitle>Rolling objectives</CardTitle>
                  <CardDescription>
                    Operational guardrails for your cross-functional councils.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <Bullet
                    text="Maintain enrollment velocity parity with regional forecasts."
                    meta="Admissions guild"
                  />
                  <Bullet
                    text="Elevate biometric attendance rigor campus-wide."
                    meta="Teaching council"
                  />
                  <Bullet
                    text="Keep settlement latency under 12 business hours."
                    meta="Finance nucleus"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Operational tempo</CardTitle>
                  <CardDescription>
                    Adaptive density tuned between 1366px and curved ultrawide canvases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-muted-foreground">
                  <Bullet
                    text="Responsive chrome + tactile motion affordances, honoring reduced-motion users."
                    meta="Inclusive by default"
                  />
                  <Bullet
                    text="Command palette ⌘K aligns with Stripe / Linear mental models."
                    meta="Shortcuts"
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </PageContainer>
      </PageTransition>
    </>
  );
}

function Bullet({ text, meta }: { text: string; meta?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-section">
      {meta ? (
        <p className="text-caption uppercase tracking-[0.25em] text-muted-foreground">{meta}</p>
      ) : null}
      <p className="mt-1 text-caption text-muted-foreground">{text}</p>
    </div>
  );
}
