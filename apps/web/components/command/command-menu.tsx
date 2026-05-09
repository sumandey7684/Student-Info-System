'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import {
  BookOpenCheck,
  ClipboardList,
  LineChart,
  LogIn,
  School,
  Shield,
  WalletCards,
} from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils/cn';

const navLinks: { icon: typeof School; title: string; href: Route; keywords: string }[] = [
  { icon: School, title: 'Dashboard Overview', href: routes.dashboard.root, keywords: 'home main' },
  {
    icon: BookOpenCheck,
    title: 'Students',
    href: routes.dashboard.students,
    keywords: 'learners roster',
  },
  { icon: School, title: 'Teachers', href: routes.dashboard.teachers, keywords: 'faculty staff' },
  {
    icon: WalletCards,
    title: 'Finance',
    href: routes.dashboard.finance,
    keywords: 'billing payments invoices',
  },
  {
    icon: LineChart,
    title: 'Analytics',
    href: routes.dashboard.analytics,
    keywords: 'reports insights kpi charts',
  },
  {
    icon: Shield,
    title: 'Audit Logs',
    href: routes.dashboard.auditLogs,
    keywords: 'compliance trails security events',
  },
  { icon: LogIn, title: 'Authentication', href: routes.login, keywords: 'sign in session' },
  {
    icon: ClipboardList,
    title: 'Student intake',
    href: routes.dashboard.studentsRegister,
    keywords: 'admissions onboarding form',
  },
];

export function CommandMenu() {
  const router = useRouter();
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const isPalette = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey);
      if (isPalette) {
        e.preventDefault();
        const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore.getState();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') {
        useUiStore.getState().setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Command.Dialog
      label="Quick navigation"
      open={open}
      onOpenChange={setOpen}
      overlayClassName="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
      contentClassName={cn(
        'fixed left-1/2 top-[12%] z-[61] w-[min(92vw,560px)] -translate-x-1/2 rounded-xl border border-border bg-card p-0 shadow-lg outline-none',
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Command palette · Quick nav
        </p>
        <Command.Input
          placeholder="Search pages…"
          className="mt-2 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-body outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto px-2 py-2">
        <Command.Empty className="px-3 py-6 text-caption text-muted-foreground">
          Nothing matched that query.
        </Command.Empty>

        <Command.Group
          heading="Navigate"
          className="[&_[cmdk-group-heading]]:select-none [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          {navLinks.map(({ href, title, keywords, icon: Icon }) => (
            <Command.Item
              key={href}
              value={`${title} ${keywords}`}
              onSelect={() => {
                setOpen(false);
                router.push(href);
              }}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-body text-foreground data-[disabled=true]:pointer-events-none',
                'data-[selected=true]:bg-accent-muted data-[selected=true]:text-accent-foreground',
              )}
            >
              <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
              <span>{title}</span>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
      <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-caption text-muted-foreground">
        <span>
          Navigate with <kbd className="rounded border border-border px-1 font-mono">↑</kbd>{' '}
          <kbd className="rounded border border-border px-1 font-mono">↓</kbd> · Confirm with{' '}
          <kbd className="rounded border border-border px-1 font-mono">Enter</kbd>
        </span>
        <span className="font-mono">⌘K</span>
      </footer>
    </Command.Dialog>
  );
}
