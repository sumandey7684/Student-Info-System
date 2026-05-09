'use client';

import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { EnterpriseDataTable } from '@/components/data-table/enterprise-data-table';
import {
  PageContainer,
  PageTransition,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { apiClient } from '@/lib/api';
import { routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type AuditRow = {
  action: string;
  resource: string;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<AuditRow>();

export default function AuditLogsPage() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await apiClient.get<{ data?: { items?: AuditRow[] } }>('/audit-logs');
      return response.data.data?.items ?? [];
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('action', {
        meta: { label: 'Action' },
        header: () => <span>Codex</span>,
        cell: (cell) => (
          <span className="font-semibold text-foreground">{cell.renderValue<string>()}</span>
        ),
      }),
      columnHelper.accessor('resource', {
        meta: { label: 'Coverage' },
        header: () => <span>Coverage realm</span>,
        cell: (cell) => <Badge variant="accent">{cell.renderValue<string>()}</Badge>,
      }),
      columnHelper.accessor('status', {
        meta: { label: 'Status' },
        header: () => <span>Signal fidelity</span>,
        cell: (cell) => {
          const normalized = cell.renderValue<string>().toUpperCase();
          const palette =
            normalized.includes('SUCCESS') || normalized.includes('OK') ? 'success' : 'destructive';
          return <Badge variant={palette}>{cell.renderValue<string>()}</Badge>;
        },
      }),
      columnHelper.accessor('createdAt', {
        meta: { label: 'Timestamp' },
        header: () => <span>Ingress</span>,
        cell: (cell) => (
          <time
            dateTime={cell.renderValue<string>()}
            className="font-mono text-caption uppercase tracking-[0.2em] tabular-nums"
          >
            {new Date(cell.renderValue<string>()).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
              hour12: true,
            })}
          </time>
        ),
      }),
    ],
    [],
  );

  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Operations', href: routes.dashboard.root },
          { label: 'Evidence ledger', href: routes.dashboard.auditLogs },
        ]}
        title="Audit sentinel"
        description="Immutable chronological surfacing awaiting backend federation — ergonomics mimic Stripe dispute workflows."
        actions={
          <Button type="button" variant="outline" disabled={isPending} onClick={() => refetch()}>
            Re-pull ledger
          </Button>
        }
      />

      <PageTransition>
        <PageContainer className="space-y-14">
          <EnterpriseDataTable<AuditRow>
            columns={columns}
            data={data ?? []}
            isLoading={isPending}
            emptyTitle="No audit entries yet"
            emptyDescription="When API surfaces records, searchable grid activates immediately."
          />
        </PageContainer>
      </PageTransition>
    </>
  );
}
