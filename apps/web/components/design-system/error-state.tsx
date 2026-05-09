import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

export function ErrorState({
  title = 'Something went wrong',
  description,
  retry,
  className,
}: {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-4 rounded-xl border border-destructive/25 bg-card px-8 py-10 text-center',
        className,
      )}
    >
      <div
        className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
        aria-hidden
      >
        <AlertTriangle className="size-6 shrink-0" />
      </div>
      <div>
        <p className="text-headline font-semibold tracking-tight text-foreground">{title}</p>
        {description ? (
          <p className="mt-1 text-caption text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {retry ? (
        <Button type="button" variant="secondary" size="sm" onClick={retry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
