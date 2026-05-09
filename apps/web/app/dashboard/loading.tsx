import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-xl px-page pb-page pt-page text-muted-foreground" aria-busy="true">
      <div className="space-y-xl">
        <Skeleton className="h-56 w-full max-w-xl rounded-xl" />
        <div className="grid gap-xl md:grid-cols-[2fr_1fr_minmax(260px,_1fr)]">
          <Skeleton className="h-[260px]" />
          <Skeleton className="h-[260px]" />
          <Skeleton className="h-[260px]" />
        </div>
      </div>
    </div>
  );
}
