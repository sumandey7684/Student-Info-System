'use client';

import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[100vh] max-w-xl flex-col justify-center px-page py-page">
      <Badge variant="warning" className="mb-[1rem] uppercase tracking-[0.25em]">
        Recovery scaffolding
      </Badge>
      <Card className="border-border shadow-md">
        <CardHeader className="space-y-4">
          <p className="text-caption font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Reset credential
          </p>
          <div className="space-y-xl">
            <p className="text-display-md font-semibold tracking-tight">Guided resets land soon.</p>
            <p className="text-muted-foreground leading-relaxed text-caption">
              Wire transactional email workflows without disturbing core auth API shape—this
              scaffold mirrors enterprise SaaS copy blocks.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-caption leading-relaxed text-muted-foreground">
            Until backend OTP surfaces, route operators through helpdesk playbook or temporary
            manual unlock tooling.
          </p>
        </CardContent>
        <CardFooter className="justify-between gap-10">
          <Button asChild variant="outline">
            <Link href={routes.login}>Back to ingress</Link>
          </Button>
          <button
            type="button"
            className="text-caption uppercase tracking-[0.25em] text-muted-foreground"
            disabled
          >
            Request manual unlock (ops only)
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
