'use client';

import { Bell } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';

const SAMPLE: readonly { id: string; title: string }[] = [];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="block px-3 pb-3 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

export function NotificationCenter({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Notifications inbox"
          variant="outline"
          size="icon"
          type="button"
          className={cn('relative', className)}
        >
          <Bell aria-hidden className="size-4 shrink-0" />
          {SAMPLE.length ? (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent text-caption font-semibold leading-none text-primary-foreground shadow-sm ring-2 ring-background">
              {SAMPLE.length}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(340px,calc(100vw-48px))] rounded-xl">
        <Eyebrow>Notifications · activity stream</Eyebrow>
        <DropdownMenuSeparator />
        {!SAMPLE.length ? (
          <div className="px-6 py-12 text-caption text-muted-foreground">
            <p className="font-semibold text-foreground">All clear</p>
            <p className="mt-2">
              Hydrate realtime events from backend webhooks once available—this inbox is wired for
              SSE / push updates.
            </p>
          </div>
        ) : (
          SAMPLE.map((notice) => (
            <DropdownMenuItem key={notice.id}>{notice.title}</DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
