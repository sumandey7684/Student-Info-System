'use client';

import * as React from 'react';
import { ClipboardCheck, Cpu, Landmark, Layers3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePrefersReducedMotion } from '@/lib/hooks/use-media-query';

export type SyntheticActivityEvent = {
  id: string;
  title: string;
  subtitle: string;
  importance: 'low' | 'medium' | 'high';
};

const FALLBACK_FEED: SyntheticActivityEvent[] = [
  {
    id: '1',
    title: 'Compliance desk',
    subtitle: 'MFA uplift scheduled for privileged operators',
    importance: 'high',
  },
  {
    id: '2',
    title: 'Finance ledger',
    subtitle: 'Stripe intents reconciling nightly buckets',
    importance: 'medium',
  },
  {
    id: '3',
    title: 'Instructional telemetry',
    subtitle: 'Attendance variance dampened versus prior cohorts',
    importance: 'low',
  },
];

const ICONS: Record<SyntheticActivityEvent['importance'], LucideIcon> = {
  high: ClipboardCheck,
  medium: Landmark,
  low: Layers3,
};

const BADGE: Record<
  SyntheticActivityEvent['importance'],
  React.ComponentProps<typeof Badge>['variant']
> = {
  high: 'destructive',
  medium: 'warning',
  low: 'default',
};

export function OperationalActivityRadar({
  rows = FALLBACK_FEED,
}: {
  rows?: SyntheticActivityEvent[];
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
    >
      <ol className="space-y-3">
        {rows.map((row, idx) => {
          const Icon = ICONS[row.importance];
          return (
            <motion.li
              key={row.id}
              className="rounded-xl border border-border bg-muted/50 p-4 shadow-xs"
              transition={{
                duration: reduceMotion ? 0 : 0.2,
                delay: reduceMotion ? 0 : idx * 0.04,
              }}
              initial={{ opacity: 0.2, y: reduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent shadow-inner ring-1 ring-accent/35">
                  <Icon aria-hidden className="size-5 shrink-0" />
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-subtitle tracking-tight text-foreground">{row.title}</p>
                    <Badge variant={BADGE[row.importance]}>{row.importance}</Badge>
                  </div>
                  <p className="text-caption leading-relaxed text-muted-foreground">
                    {row.subtitle}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
      <Separator className="my-6 bg-border/80" />
      <div className="flex gap-3 text-muted-foreground">
        <Cpu className="mt-1 size-4 shrink-0 opacity-85" aria-hidden />
        <p className="text-caption font-semibold uppercase tracking-[0.25em]">
          Stream placeholders until SSE / push wiring lands — UX affordances are production-ready
          today.
        </p>
      </div>
    </motion.div>
  );
}
