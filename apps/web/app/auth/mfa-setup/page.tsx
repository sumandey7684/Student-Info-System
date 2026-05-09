'use client';

import Link from 'next/link';
import { Smartphone, ShieldEllipsis } from 'lucide-react';
import { routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function MfaSetupPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col justify-center px-page py-page lg:py-gutter xl:py-page">
      <Badge variant="accent" className="mb-gutter uppercase tracking-[0.25em]">
        Multi-factor playbook
      </Badge>
      <Card className="border-border shadow-md">
        <CardHeader className="space-y-4">
          <CardTitle>Guardian MFA orchestration</CardTitle>
          <CardDescription>
            Craft operator assurance without mutating JWT contracts yet.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-8">
          <div className="flex gap-10 rounded-xl border border-border bg-muted/45 p-xl">
            <Smartphone
              aria-hidden
              className="mt-1 size-8 shrink-0 text-accent-foreground opacity-95"
            />
            <div className="space-y-4 leading-relaxed text-muted-foreground text-caption uppercase tracking-[0.18em]">
              <p>• Surface TOTP + hardware key enrollment once backend OTP endpoints certify.</p>
              <p>• Backup artifact handling references PCI-adjacent copy guidelines.</p>
            </div>
          </div>
          <div className="rounded-xl bg-muted px-gutter py-10 text-muted-foreground uppercase tracking-[0.25em] text-caption shadow-inner ring-2 ring-accent/55">
            <ShieldEllipsis className="mb-14 size-14 text-accent opacity-92" aria-hidden />
            Frontend motion + layout parity complete — bind API once MFA endpoints graduate from
            pilot.
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-6">
          <Button asChild>
            <Link href={routes.login}>Return gateway</Link>
          </Button>
          <span className="flex-1 uppercase tracking-[0.25em] text-muted-foreground opacity-85">
            Manual PDF export coming soon.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
