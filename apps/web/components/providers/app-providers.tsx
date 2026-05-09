'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/components/providers/query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
      </QueryProvider>
      <Toaster
        richColors
        closeButton
        position="bottom-right"
        toastOptions={{
          duration: 4_600,
          classNames: {
            toast: '!rounded-lg !border-border !shadow-md !font-sans !text-caption',
          },
        }}
      />
    </ThemeProvider>
  );
}
