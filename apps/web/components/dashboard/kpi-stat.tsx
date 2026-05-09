'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { usePrefersReducedMotion } from '@/lib/hooks/use-media-query';

export type Trend = { dir: 'up' | 'down'; label: string };

export function KpiStatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: Trend;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -1 }}
      transition={{ duration: 0.14 }}
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-display-md font-semibold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {subtitle ? (
            <p className="text-caption font-medium text-muted-foreground">{subtitle}</p>
          ) : null}
          {trend ? (
            <p
              className={cn(
                'inline-flex items-center gap-1 text-caption font-semibold',
                trend.dir === 'up' ? 'text-success' : 'text-destructive',
              )}
            >
              {trend.dir === 'up' ? '↑' : '↓'} {trend.label}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent ring-1 ring-accent/20">
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
