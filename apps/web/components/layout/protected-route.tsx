'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!token) router.replace('/auth/login');
  }, [token, router]);

  if (!token) return <p className="p-6 text-sm text-slate-500">Checking session...</p>;
  return <>{children}</>;
}
