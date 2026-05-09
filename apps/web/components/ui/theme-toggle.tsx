'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!mounted}>
        <button
          type="button"
          className={cn(
            'relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card shadow-xs outline-none ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
            className,
          )}
          aria-haspopup="menu"
          aria-label="Theme settings"
        >
          <Sun
            className="size-4 shrink-0 dark:hidden motion-safe:transition-transform"
            aria-hidden
          />
          <Moon
            className="hidden size-4 shrink-0 dark:inline motion-safe:transition-transform"
            aria-hidden
          />
          <span className="sr-only">Change theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 size-4 opacity-65" aria-hidden /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 size-4 opacity-65" aria-hidden /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="mr-2 size-4 opacity-65" aria-hidden /> System sync
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
