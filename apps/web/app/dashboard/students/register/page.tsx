'use client';

import type * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { PageContainer, StickyDashboardHeader } from '@/components/design-system/page-shell';
import { toast } from 'sonner';

const schema = z.object({
  fullName: z.string().min(3, 'Legal name fidelity required'),
  email: z.string().email('Operational inbox demanded'),
  gradeLevel: z.string().min(1, 'Cohort labeling essential'),
});

type StudentFormValues = z.infer<typeof schema>;

export default function StudentRegistrationPage() {
  const form = useForm<StudentFormValues>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit((payload) => {
    toast.success('Profile captured locally', {
      description: 'Backend intake unchanged — wiring remains a front-end scaffold.',
    });
    form.reset(payload);
  });

  return (
    <>
      <StickyDashboardHeader
        breadcrumbs={[
          { label: 'Learners intelligence', href: routes.dashboard.students },
          { label: 'Adaptive intake wizard', href: routes.dashboard.studentsRegister },
        ]}
        title="Guided registration console"
        description="Multi-factor friendly layout · mirrors enterprise SaaS form stacks."
      />
      <PageContainer className="max-w-xl pb-36">
        <Card className="border-border shadow-xl">
          <CardHeader className="gap-14 space-y-xl">
            <Badge variant="accent" className="w-fit uppercase tracking-[0.25em]">
              Front-end guardrails only · API pending
            </Badge>
            <div>
              <p className="text-caption font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Capture dossier identity
              </p>
              <Separator className="my-14" />
              <h2 className="text-display-md font-semibold tracking-tight">
                Scholar profile intelligence
              </h2>
            </div>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-11">
              <div className="space-y-xl">
                <Label htmlFor="fullname">Legal identity</Label>
                <Input
                  id="fullname"
                  aria-invalid={!!form.formState.errors.fullName}
                  invalid={!!form.formState.errors.fullName}
                  {...form.register('fullName')}
                />
                <FieldError>{form.formState.errors.fullName?.message}</FieldError>
              </div>

              <div className="space-y-xl">
                <Label htmlFor="emailguardian">Guardian communication inbox</Label>
                <Input
                  id="emailguardian"
                  type="email"
                  {...form.register('email')}
                  invalid={!!form.formState.errors.email}
                  aria-invalid={!!form.formState.errors.email}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </div>

              <div className="space-y-xl">
                <Label htmlFor="gradeLayer">Admission ladder</Label>
                <Input
                  id="gradeLayer"
                  {...form.register('gradeLevel')}
                  invalid={!!form.formState.errors.gradeLevel}
                />
                <FieldError>{form.formState.errors.gradeLevel?.message}</FieldError>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-14">
              <Button
                type="submit"
                className="uppercase tracking-[0.38em]"
                disabled={form.formState.isSubmitting}
              >
                Stage dossier (front-end sandbox)
              </Button>
              <Button
                type="reset"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => form.reset()}
              >
                Discard draft
              </Button>
              <Link
                href={routes.dashboard.students}
                prefetch
                className="text-caption underline-offset-[0.45rem]"
                title="Discard navigation"
              >
                Return grid
              </Link>
            </CardFooter>
          </form>
        </Card>
      </PageContainer>
    </>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-caption uppercase tracking-[0.25em] text-destructive">
      {children}
    </p>
  );
}
