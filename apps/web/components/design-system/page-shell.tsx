'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, type Transition } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Route } from 'next';
import { cn } from '@/lib/utils/cn';
import { usePrefersReducedMotion } from '@/lib/hooks/use-media-query';

export type BreadcrumbItem = { label: string; href?: Route };

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1480px] px-4 pb-10 pt-6 sm:px-6 lg:px-10', className)}
    >
      {children}
    </div>
  );
}

export function StickyDashboardHeader({
  breadcrumbs,
  title,
  description,
  actions,
}: {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-start justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <div className="min-w-0 flex-1">
          {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
          <h1 className="truncate text-display-md font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-[56ch] text-body text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-2 flex flex-wrap items-center gap-1 text-caption font-medium uppercase tracking-wider text-muted-foreground"
    >
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-1">
            {idx > 0 ? (
              <ChevronRight className="size-3.5 shrink-0 text-border" aria-hidden />
            ) : null}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const spring: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.22, 0.73, 0.24, 0.94] };

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0.001, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
