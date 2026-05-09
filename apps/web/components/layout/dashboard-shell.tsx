'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import {
  BarChart4,
  BookOpenCheck,
  FileKey2,
  LayoutDashboard,
  Menu,
  Plus,
  School,
  Search,
  Shield,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { UiRole } from '@/store/ui-store';
import { useUiStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { NotificationCenter } from '@/components/layout/notification-center';
import { CommandMenu } from '@/components/command/command-menu';

export type SidebarLinkSpec = {
  title: string;
  href: Route;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function normalizeDashboardRole(remote: string | null | undefined, fallback: UiRole): UiRole {
  const candidate = remote?.toUpperCase();
  if (
    candidate === 'ADMIN' ||
    candidate === 'TEACHER' ||
    candidate === 'STUDENT' ||
    candidate === 'PARENT'
  )
    return candidate;
  return fallback;
}

export const linksForRole = (role: UiRole): SidebarLinkSpec[] => {
  const admin: SidebarLinkSpec[] = [
    { title: 'Overview', href: routes.dashboard.root, icon: LayoutDashboard },
    { title: 'Students', href: routes.dashboard.students, icon: BookOpenCheck },
    { title: 'Teachers', href: routes.dashboard.teachers, icon: School },
    { title: 'Finance', href: routes.dashboard.finance, icon: WalletCards },
    { title: 'Analytics', href: routes.dashboard.analytics, icon: BarChart4 },
    { title: 'Audit Logs', href: routes.dashboard.auditLogs, icon: Shield },
  ];
  if (role === 'TEACHER') return [admin[0], admin[1]];
  if (role === 'STUDENT') return [admin[0]];
  return admin;
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const uiFallback = useUiStore((s) => s.role);
  const jwtRole = useAuthStore((s) => s.role);
  const role = normalizeDashboardRole(jwtRole, uiFallback);

  const links = React.useMemo(() => linksForRole(role), [role]);

  return (
    <nav className="flex flex-col gap-1" aria-label="Primary dashboard navigation">
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          pathname === link.href ||
          (link.href !== routes.dashboard.root && pathname.startsWith(link.href));

        return (
          <Link key={link.href} href={link.href} prefetch onClick={() => onNavigate?.()}>
            <span
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-caption font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-accent-muted text-accent-foreground ring-1 ring-accent/18'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              <span>{link.title}</span>
              {active ? (
                <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <Link
      href={routes.dashboard.root}
      className="mb-10 flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-border">
        <Sparkles aria-hidden className="size-5" />
      </div>
      <div className="leading-tight">
        <div className="text-caption font-bold uppercase tracking-widest text-muted-foreground">
          SIS Atlas
        </div>
        <div className="text-subtitle text-foreground">Control Center</div>
      </div>
    </Link>
  );
}

export function SidebarBrandInline() {
  return <SidebarBrand />;
}

/** Desktop sidebar */
export function Sidebar() {
  return (
    <aside
      className={cn(
        'hidden min-h-screen w-[264px] shrink-0 flex-col gap-12 border-r border-border bg-background/94 px-4 py-6 backdrop-blur-lg supports-[backdrop-filter]:bg-background/85 lg:flex lg:sticky lg:top-0',
      )}
    >
      <SidebarBrand />
      <NavLinks />
      <div className="mt-auto space-y-4">
        <Separator />
        <Button asChild variant="secondary" size="sm" className="w-full justify-start gap-3">
          <Link href={routes.dashboard.studentsRegister}>
            <Plus aria-hidden /> New admission
          </Link>
        </Button>
      </div>
    </aside>
  );
}

function DashboardHeaderDesktop() {
  const setPalette = useUiStore((s) => s.setCommandPaletteOpen);
  const desktop = useMediaQuery('(min-width:1024px)');
  if (!desktop) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/78 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <div className="flex flex-wrap items-center gap-4 px-gutter py-4">
        <button
          type="button"
          onClick={() => setPalette(true)}
          className="flex min-h-10 min-w-[280px] max-w-[520px] flex-1 items-center rounded-lg border border-border bg-muted/45 px-4 py-2 text-left transition-colors hover:border-accent/35 hover:bg-muted"
        >
          <Search aria-hidden className="mr-3 size-4 shrink-0 text-muted-foreground" />
          <span className="text-caption uppercase tracking-[0.2em] text-muted-foreground">
            Quick nav
          </span>
          <kbd className="ml-auto rounded border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const setPalette = useUiStore((s) => s.setCommandPaletteOpen);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap gap-3 px-page py-page">
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu aria-hidden />
            </Button>
          </SheetTrigger>
          <button
            type="button"
            aria-label="Open command palette"
            onClick={() => setPalette(true)}
            className="flex min-h-10 flex-1 items-center gap-3 rounded-lg border border-border bg-muted/45 px-page text-left text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <Search aria-hidden className="size-4 shrink-0" />
            <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Jump anywhere
            </span>
            <kbd className="ml-auto rounded border border-border px-2 py-0.5 font-mono text-caption">
              ⌘ K
            </kbd>
          </button>
        </div>
        <SheetContent side="left" className="p-5">
          <SheetClose />
          <SidebarBrand />
          <Separator className="my-6" />
          <NavLinks onNavigate={() => setOpen(false)} />
          <Separator className="my-8" />
          <Button asChild variant="outline" size="sm" className="w-full gap-3">
            <Link href={routes.dashboard.studentsRegister} onClick={() => setOpen(false)}>
              Guided intake workflow <FileKey2 aria-hidden className="size-4 shrink-0" />
            </Link>
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function DashboardShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-muted/30 dark:bg-muted/35">
      <CommandMenu />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <DashboardHeaderDesktop />
        <motion.div layout className="flex-1 px-4 sm:px-6 lg:px-8" aria-busy={false}>
          {title ? <span className="sr-only">{title}</span> : null}
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function WorkspaceActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="font-semibold uppercase tracking-wide">
          Workspace
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.dashboard.finance}>Finance board</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.dashboard.auditLogs}>Audit explorer</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
