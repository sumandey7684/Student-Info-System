'use client';

import { GraduationCap, CalendarClock, NotebookPen } from 'lucide-react';
import { routes } from '@/lib/routes';
import {
  PageContainer,
  PageTransition,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { KpiStatCard } from '@/components/dashboard/kpi-stat';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OperationalActivityRadar } from '@/features/dashboard/activity-feed';

export default function TeachersOverviewPage() {
  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Operations', href: routes.dashboard.root },
          { label: 'Teaching ops', href: routes.dashboard.teachers },
        ]}
        title="Instructional nucleus"
        description="Coordinate attendance integrity, formative cadence, and operational cadence clarity."
        actions={<Badge variant="accent">Workload balanced</Badge>}
      />
      <PageTransition>
        <PageContainer className="space-y-12">
          <section className="grid gap-xl md:grid-cols-3">
            <KpiStatCard
              label="Teaching hours this week"
              value="2,148"
              trend={{ dir: 'up', label: '+6%' }}
              icon={GraduationCap}
            />
            <KpiStatCard
              label="Timetabled coverage"
              value="94.9%"
              trend={{ dir: 'up', label: 'Room conflicts ↓42%' }}
              icon={CalendarClock}
            />
            <KpiStatCard
              label="Assignments reviewed"
              value="682"
              subtitle="Average turnaround 06h · 14m"
              trend={{ dir: 'up', label: 'SLAs met' }}
              icon={NotebookPen}
            />
          </section>
          <Separator />
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle>Operational feed</CardTitle>
              <CardDescription>
                Feeds remain synthetic pending backend realtime dispatch.
              </CardDescription>
            </CardHeader>
            <div className="px-12 pb-12 pt-8">
              <OperationalActivityRadar
                rows={[
                  {
                    id: 'tch-01',
                    title: 'Duty roster',
                    subtitle: 'Morning gate coverage locked with biometric confirmation.',
                    importance: 'medium',
                  },
                  {
                    id: 'tch-02',
                    title: 'Observatory pass',
                    subtitle: 'Coach rotation ensures consistent observational fidelity.',
                    importance: 'low',
                  },
                ]}
              />
            </div>
          </Card>
        </PageContainer>
      </PageTransition>
    </>
  );
}
