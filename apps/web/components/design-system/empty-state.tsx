import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export function EmptyState({
  icon: IconNode,
  title,
  description,
  action,
  className,
}: {
  icon?: Icon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center px-8 py-16 text-center', className)}
    >
      {IconNode ? (
        <div className="mb-6 flex size-14 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground shadow-xs">
          <IconNode className="size-7 shrink-0" aria-hidden />
        </div>
      ) : null}
      <p className="text-headline font-semibold tracking-tight text-foreground">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-caption text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}
