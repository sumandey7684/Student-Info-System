'use client';

import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/sidebar';
import { DataTable } from '@/components/data-table/data-table';
import { apiClient } from '@/lib/api';

type AuditRow = {
  action: string;
  resource: string;
  status: string;
  createdAt: string;
};

const columnHelper = createColumnHelper<AuditRow>();

export default function AuditLogsPage() {
  const { data } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await apiClient.get('/audit-logs');
      return response.data.data?.items ?? [];
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('action', { header: 'Action' }),
      columnHelper.accessor('resource', { header: 'Resource' }),
      columnHelper.accessor('status', { header: 'Status' }),
      columnHelper.accessor('createdAt', { header: 'Timestamp' }),
    ],
    [],
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-4 text-2xl font-bold">Audit Logs</h1>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <DataTable columns={columns} data={data ?? []} />
        </div>
      </main>
    </div>
  );
}
