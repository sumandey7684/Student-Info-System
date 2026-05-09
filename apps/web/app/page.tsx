'use client';

import Link from 'next/link';
import { ArrowRightCircle, Cpu, Landmark, Layers3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const pillars = [
  {
    icon: Cpu,
    title: 'Composable intelligence',
    subtitle: 'Command palette parity with Linear / Stripe guardrails baked in.',
  },
  {
    icon: Landmark,
    title: 'Fiduciary transparency',
    subtitle: 'Revenue charts lazy-load respecting bundle budgets.',
  },
  {
    icon: Layers3,
    title: 'Unified operational shell',
    subtitle: 'Motion tuned for ergonomics whilst honoring reduced-motion users.',
  },
];

export default function HomePage() {
  return (
    <div className="relative isolate mx-auto flex min-h-[100vh] max-w-[1400px] flex-col gap-16 px-page py-page xl:gap-36">
      <div className="flex items-center gap-12">
        <Badge variant="accent" className="uppercase tracking-[0.42em]">
          Student‑info‑centre
        </Badge>
        <Separator
          orientation="vertical"
          decorative
          className="hidden h-[2.675rem] sm:block lg:h-[4.0625rem]"
        />
        <p className="hidden text-muted-foreground lg:block xl:text-caption font-semibold uppercase tracking-[0.26em]">
          Enterprise dashboards · audited motion · operational chrome
        </p>
        <div className="ml-auto hidden items-center gap-5 sm:flex xl:gap-14">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            type="button"
            asChild
            className="font-semibold uppercase tracking-[0.3em]"
          >
            <Link href={routes.dashboard.root}>Operational shell</Link>
          </Button>
        </div>
      </div>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="mt-12 max-w-[32ch] text-display-lg font-semibold tracking-tighter text-pretty xl:mt-[2.975rem]">
          Student Information Centre — composed for uncompromising operations teams.
        </h1>
        <p className="mt-11 max-w-3xl text-body text-muted-foreground">
          Harmonize biometric attendance, fiduciary clarity, realtime analytics choreography,
          cryptographic identity trust, tactile motion, all without mutating hardened backend
          contracts presently shipping.
        </p>
        <div className="mt-28 flex flex-wrap gap-xl">
          <Button size="lg" asChild className="uppercase tracking-[0.3em]">
            <Link href={routes.login}>
              Enter secure workspace{' '}
              <ArrowRightCircle
                aria-hidden
                className="ml-3 inline size-[1.0625rem] align-text-bottom opacity-92"
              />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            disabled
            className="uppercase tracking-[0.38em]"
            title="Marketing waitlist scaffolding"
          >
            Investor overview (soon)
          </Button>
        </div>
      </motion.main>

      <section className="grid gap-xl md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <motion.article
              key={pillar.title}
              className="rounded-3xl border border-border bg-card p-[2rem] shadow-md"
              layout
            >
              <Icon
                aria-hidden
                className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-accent-muted text-accent shadow-inner ring-1 ring-accent/25"
              />
              <h3 className="font-headline">{pillar.title}</h3>
              <p className="mt-14 text-muted-foreground">{pillar.subtitle}</p>
            </motion.article>
          );
        })}
      </section>

      <footer className="mt-auto pb-gutter pt-page text-muted-foreground text-caption uppercase tracking-[0.28em]">
        © Atlas Control Systems Lab · Telemetry crafted for conscientious CIO partners.
      </footer>
      <motion.div
        aria-hidden
        layout
        className="pointer-events-none absolute inset-[12%_-10%_-12%_-10%] -z-[1] blur-[148px]"
        initial={{ opacity: 0 }}
      >
        <div className="aspect-[35/43] rounded-[420px] bg-gradient-to-tr from-accent/45 via-accent/12 to-muted/58 dark:opacity-92" />
      </motion.div>
    </div>
  );
}
