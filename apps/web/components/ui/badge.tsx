import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-caption font-semibold uppercase tracking-wider ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground ring-border',
        accent: 'bg-accent-muted text-accent-foreground ring-accent/25',
        success: 'bg-success-muted text-success ring-success/35',
        warning: 'bg-warning-muted text-warning ring-warning/35',
        destructive: 'bg-destructive/10 text-destructive ring-destructive/35',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
