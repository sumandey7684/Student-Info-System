'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
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

export default function SessionExpiredPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-xl flex-col justify-center px-page py-page xl:py-gutter">
      <Badge variant="destructive" className="uppercase tracking-[0.25em]">
        Credential sunset
      </Badge>
      <Card className="mt-14 border-border shadow-xl">
        <CardHeader className="space-y-5">
          <CardTitle>Signed-off by policy</CardTitle>
          <CardDescription>
            Idle timeout, revocation, or anomaly controls cleared your cryptographic material.
            Frontend stays calm while backend enforces sovereignty.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-caption uppercase tracking-[0.25em]">
          Re-authenticate gracefully — SSR guards already redirect stray requests.
        </CardContent>
        <CardFooter className="justify-between gap-8">
          <Button onClick={() => router.replace(routes.login)} variant="destructive">
            Renew session
          </Button>
          <Link
            href="/"
            className="inline-flex items-center gap-xl text-accent hover:underline underline-offset-[0.45rem]"
          >
            Marketing overview · <LogIn aria-hidden />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
