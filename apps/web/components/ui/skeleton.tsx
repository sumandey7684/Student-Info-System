import { cn } from '@/lib/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative isolate overflow-hidden rounded-md bg-muted', className)}
      aria-busy
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 -left-full flex w-[60%] -skew-x-[12deg] animate-shimmer bg-gradient-to-r from-transparent via-card/85 to-transparent" />
    </div>
  );
}
