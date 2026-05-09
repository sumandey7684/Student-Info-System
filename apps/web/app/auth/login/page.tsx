'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const response = await apiClient.post('/auth/login', values);
    const accessToken = response.data.data?.accessToken ?? response.data.accessToken;
    setSession(accessToken, 'ADMIN');
    router.push('/dashboard');
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} className="w-full rounded border p-2" placeholder="Email" />
        <input
          {...register('password')}
          type="password"
          className="w-full rounded border p-2"
          placeholder="Password"
        />
        <button className="rounded bg-slate-900 px-4 py-2 text-white dark:bg-slate-200 dark:text-slate-900">
          Login
        </button>
      </form>
    </main>
  );
}
