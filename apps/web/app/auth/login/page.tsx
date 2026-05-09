'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { routes } from '@/lib/routes';
import type { AxiosError } from 'axios';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
  email: z.string().email('Enter an institutional inbox'),
  password: z.string().min(8, 'Minimum 8 cryptographic characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = form.handleSubmit(async (values, event) => {
    event?.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.get('/auth/csrf-token');
      const response = await apiClient.post('/auth/login', values);
      const token = response.data.data?.accessToken ?? response.data.accessToken;

      const roleGuess =
        typeof response?.data?.data?.roles?.[0] === 'string'
          ? response?.data?.data.roles[0]?.toUpperCase()
          : '';

      const normalizedRole = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'].includes(roleGuess)
        ? roleGuess
        : 'ADMIN'; // Fallback until JWT parsing surfaces roles client-side.

      setSession(token, normalizedRole);
      toast.success('Welcome back.', { description: 'Session minted securely.' });
      router.push('/dashboard');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message;

      toast.error('Authentication stalled', {
        description: message ?? 'Check credentials · confirm campus VPN allowances.',
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="mx-auto grid min-h-[100vh] max-w-6xl items-center px-page lg:grid-cols-2 lg:gap-16">
      <motion.div
        layout
        className="mb-24 hidden lg:block lg:mr-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Badge variant="accent" className="mb-14">
          Institutional grade
        </Badge>
        <h1 className="text-display-lg font-semibold tracking-tighter text-balance leading-tight">
          Student Information Atlas — governance ready from day negative one.
        </h1>
        <p className="mt-[1.8rem] text-body text-muted-foreground">
          Harmonize enrollment, fiduciary discipline, biometric attendance fidelity, MFA
          enforcement, realtime analytics choreography, immutable audit fidelity.
        </p>
        <Separator className="my-16" />
        <ul className="space-y-[1.675rem] text-caption uppercase tracking-[0.25em] text-muted-foreground">
          <li>• Zero‑trust SSO posture scaffolding</li>
          <li>• Observable finance · Stripe aligned</li>
          <li>• Motion tuned for readability + reduced-motion parity</li>
        </ul>
      </motion.div>

      <motion.section initial={{ opacity: 0.3, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-4">
            <p className="text-caption font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Secure ingress
            </p>
            <div className="space-y-[0.775rem]">
              <p className="text-display-md font-semibold tracking-tight">Authenticate</p>
              <p className="text-muted-foreground leading-relaxed text-caption">
                CSRF guarded · refresh cookies · brute-force sentinel aware.
              </p>
            </div>
          </CardHeader>

          <form onSubmit={onSubmit}>
            <CardContent className="space-y-xl">
              <div className="space-y-xl">
                <div className="space-y-xl">
                  <Label htmlFor="email">Corporate email address</Label>
                  <Input
                    id="email"
                    {...form.register('email')}
                    aria-invalid={!!form.formState.errors.email}
                    autoComplete="email"
                    spellCheck={false}
                    invalid={!!form.formState.errors.email}
                  />
                  {form.formState.errors.email ? (
                    <p
                      className="text-caption uppercase tracking-[0.2em] font-semibold text-destructive"
                      role="alert"
                    >
                      {form.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-xl">
                  <Label htmlFor="password">Cryptographic passphrase</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    autoComplete="current-password"
                    invalid={!!form.formState.errors.password}
                  />
                  {form.formState.errors.password ? (
                    <p className="text-caption uppercase tracking-[0.2em] font-semibold text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6">
              <Button
                type="submit"
                className="w-full uppercase tracking-[0.25em]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden /> Minting bearer session
                  </>
                ) : (
                  'Continue securely'
                )}
              </Button>
              <div className="flex flex-wrap gap-5 text-muted-foreground justify-center lg:justify-between text-caption uppercase tracking-[0.25em]">
                <Link href={routes.forgotPassword} className="hover:text-accent">
                  Forgot passphrase
                </Link>
                <Link href={routes.mfaSetup} className="hover:text-accent">
                  MFA playbook
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.section>
    </div>
  );
}
