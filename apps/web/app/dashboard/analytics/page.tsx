'use client';

import {
  PageTransition,
  PageContainer,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { AnalyticsStudio } from '@/features/analytics/analytics-studio';
import { routes } from '@/lib/routes';

export default function AnalyticsPage() {
  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Operations', href: routes.dashboard.root },
          { label: 'Analytics studio', href: routes.dashboard.analytics },
        ]}
        title="Analytical vantage"
        description="Layered KPI storytelling with lazy chart bundles, tactile motion, enterprise tone."
      />
      <PageTransition>
        <PageContainer>
          <AnalyticsStudio />
        </PageContainer>
      </PageTransition>
    </>
  );
}
