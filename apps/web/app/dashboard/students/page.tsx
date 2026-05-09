'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnterpriseDataTable } from '@/components/data-table/enterprise-data-table';
import {
  PageContainer,
  PageTransition,
  StickyDashboardHeader,
} from '@/components/design-system/page-shell';
import { routes } from '@/lib/routes';

type StudentRow = {
  regNo: string;
  name: string;
  grade: string;
  attendance: string;
};

const SEED_ROWS: StudentRow[] = [
  { regNo: 'SIS-2026-001', name: 'Alice Johnson', grade: 'Grade 10', attendance: '94.2%' },
  { regNo: 'SIS-2026-002', name: 'Bob Singh', grade: 'Grade 09', attendance: '89.7%' },
  { regNo: 'SIS-2026-003', name: 'Clara Martins', grade: 'Grade 11', attendance: '97.9%' },
  { regNo: 'SIS-2026-004', name: 'Diego Ramos', grade: 'Grade 12', attendance: '93.7%' },
  { regNo: 'SIS-2026-005', name: 'Elsa Müller', grade: 'Grade 08', attendance: '98.9%' },
  { regNo: 'SIS-2026-006', name: 'Noah Ibrahim', grade: 'Grade 12', attendance: '87.9%' },
  { regNo: 'SIS-2026-007', name: 'Priya Nair', grade: 'Grade 07', attendance: '95.9%' },
  { regNo: 'SIS-2026-008', name: 'Quincy Lee', grade: 'Grade 09', attendance: '91.1%' },
  { regNo: 'SIS-2026-009', name: 'Rafi Cohen', grade: 'Grade 06', attendance: '99.9%' },
  { regNo: 'SIS-2026-010', name: 'Sofi Andersson', grade: 'Grade 07', attendance: '93.9%' },
  { regNo: 'SIS-2026-011', name: 'Theo Alvarez', grade: 'Grade 11', attendance: '94.9%' },
  { regNo: 'SIS-2026-012', name: 'Umi Tanaka', grade: 'Grade 06', attendance: '90.9%' },
];

const helper = createColumnHelper<StudentRow>();

export default function StudentsPage() {
  const columns = useMemo(
    () => [
      helper.accessor('regNo', {
        meta: { label: 'Reg no' },
        header: () => (
          <span className="whitespace-normal text-caption uppercase tracking-wide text-muted-foreground">
            Registration
          </span>
        ),
        cell: (cell) => (
          <span className="font-mono text-caption tabular-nums">{cell.renderValue<string>()}</span>
        ),
      }),
      helper.accessor('name', {
        meta: { label: 'Scholar name' },
        header: () => <span>Nominal guardian file</span>,
        cell: (cell) => (
          <span className="font-semibold text-foreground">{cell.renderValue<string>()}</span>
        ),
      }),
      helper.accessor('grade', {
        meta: { label: 'Cohort' },
        header: () => <span>Cohort ladder</span>,
        cell: (cell) => <Badge variant="accent">{cell.renderValue<string>()}</Badge>,
      }),
      helper.accessor('attendance', {
        meta: { label: 'Presence' },
        header: () => <span>Fidelity</span>,
        cell: (cell) => <span className="tabular-nums">{cell.renderValue<string>()}</span>,
      }),
    ],
    [],
  );

  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Operations', href: routes.dashboard.root },
          { label: 'Learners intelligence', href: routes.dashboard.students },
        ]}
        title="Student intelligence grid"
        description="Enterprise dataset grid with tactile affordances engineered for disciplined operators."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={routes.dashboard.studentsRegister}>Guided onboarding</Link>
            </Button>
            <Button type="button" variant="outline" disabled>
              Create dossier (API gated)
            </Button>
          </>
        }
      />

      <PageTransition>
        <PageContainer className="space-y-11">
          <EnterpriseDataTable<StudentRow>
            columns={columns}
            data={SEED_ROWS}
            searchable
            tableCaption="Active learners · synthetic dataset until API wires into grid"
            initialPageSize={8}
          />
          <footer className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed bg-muted p-gutter">
            <p className="text-caption uppercase tracking-[0.3em] text-muted-foreground">
              Ready for SSR pagination
            </p>
            <Button variant="outline" disabled>
              Connect API filters
            </Button>
          </footer>
        </PageContainer>
      </PageTransition>
    </>
  );
}
