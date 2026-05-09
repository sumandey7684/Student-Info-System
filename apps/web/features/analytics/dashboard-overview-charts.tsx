'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

export type MetricsSummary = {
  students?: number | null;
  teachers?: number | null;
  attendanceRate?: number | null;
  revenue?: number | null;
};

export function EnrollmentSnapshotBar({ metrics }: { metrics: MetricsSummary }) {
  const data = [
    { metric: 'Learners', score: metrics.students ?? 0 },
    { metric: 'Teachers', score: metrics.teachers ?? 0 },
    { metric: 'Attendance %', score: Number(metrics.attendanceRate ?? 0) },
    { metric: 'Revenue', score: metrics.revenue ?? 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart margin={{ left: -6 }} barGap={12} barCategoryGap={10} data={data}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 14"
          opacity={0.25}
          stroke="var(--muted-foreground)"
          strokeLinecap="round"
        />
        <XAxis
          dataKey="metric"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fill: 'var(--muted-foreground)',
            style: { fontVariantNumeric: 'tabular-nums' },
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={{ strokeDasharray: '5 26' }}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <Tooltip
          content={<ToolSurface />}
          wrapperStyle={{ fontSize: '12px' }}
          cursor={{ fill: 'rgba(99,102,241,0.08)' }}
        />
        <Legend
          align="center"
          verticalAlign="top"
          wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)' }}
          formatter={() => 'Operational pulse · KPI stack'}
        />
        <Bar
          dataKey="score"
          radius={[14, 14, 0, 0]}
          fill="currentColor"
          className="text-accent opacity-92"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LearningVelocitySpline() {
  const data = Array.from({ length: 16 }).map((_, idx) => ({
    sprint: `S${idx + 1}`,
    engagement: Number((Math.cos(idx / 2.85) * 34 + idx * 1.4 + 64).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ bottom: -4 }}>
        <defs>
          <linearGradient id="sisSpline" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(129,140,248,0.35)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </linearGradient>
        </defs>
        <CartesianGrid opacity={0.25} stroke="var(--muted-foreground)" strokeDasharray="3 18" />
        <XAxis
          dataKey="sprint"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          domain={[44, 'auto']}
          width={32}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <Tooltip content={<ToolSurface />} wrapperStyle={{ fontSize: '12px' }} />
        <Area
          type="monotone"
          strokeWidth={0}
          dataKey="engagement"
          fill="url(#sisSpline)"
          stroke="none"
        />
        <Line
          type="monotone"
          dataKey="engagement"
          strokeWidth={3}
          stroke="#818cf8"
          dot={{ r: 2.5 }}
          name="Momentum"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AttendanceConfidenceBand({ pct }: { pct: number }) {
  const safe = Number.isFinite(pct) ? pct : 0;
  const data = Array.from({ length: 12 }).map((_, idx) => ({
    cohort: `Cohort ${idx + 1}`,
    present: Number((safe + (idx % 3 === 0 ? 2.55 : idx % 5 === 0 ? -5.95 : idx / 42)).toFixed(2)),
    goal: Number((safe + idx / 52).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ bottom: -6 }}>
        <defs>
          <linearGradient id="presentTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.45)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.02)" />
          </linearGradient>
          <linearGradient id="goalTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.45)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </linearGradient>
        </defs>
        <CartesianGrid
          opacity={0.25}
          stroke="var(--muted-foreground)"
          strokeDasharray="6 26"
          strokeLinecap="round"
        />
        <XAxis
          tickLine={false}
          dataKey="cohort"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <YAxis
          domain={[Math.max(safe - 18, 0), 'auto']}
          width={42}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ToolSurface />} wrapperStyle={{ fontSize: '12px' }} />
        <Legend
          align="center"
          verticalAlign="top"
          wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)' }}
        />
        <Area
          type="natural"
          strokeLinecap="round"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#presentTone)"
          dataKey="present"
          name="Present"
        />
        <Area
          type="natural"
          strokeDasharray="4 6"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#goalTone)"
          dataKey="goal"
          dot={false}
          name="Operational target"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueRunTrend({ baseline }: { baseline: number }) {
  const sanitized = Number.isFinite(baseline) ? baseline / 54000 + 3.2 : 3.9;
  const data = Array.from({ length: 11 }).map((_, idx) => ({
    ledger: `${idx + 1}`,
    runRate: Number((sanitized + Math.sin(idx) * (sanitized / 10)).toFixed(3)),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid
          opacity={0.25}
          stroke="var(--muted-foreground)"
          strokeDasharray="3 26"
          horizontal
          vertical
          strokeLinecap="round"
        />
        <XAxis dataKey="ledger" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip content={<ToolSurface />} />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="runRate"
          stroke="var(--success)"
          dot={{ r: 1.7 }}
          strokeLinecap="round"
          name="Liquidity runway"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ToolSurface({ active, label, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 text-caption shadow-xl">
      {label !== undefined ? <div className="mb-3 text-muted-foreground">{label}</div> : null}
      <ul className="space-y-3">
        {payload.map((row) => (
          <li key={String(row.dataKey)} className="flex justify-between gap-8">
            <span className="text-muted-foreground">{row.name}</span>
            <span className="font-semibold text-foreground">
              {typeof row.value === 'number'
                ? row.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : String(row.value ?? '—')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
