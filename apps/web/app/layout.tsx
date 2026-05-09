import './globals.css';
import * as React from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/providers/app-providers';
import { cn } from '@/lib/utils/cn';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.variable, jetbrainsMono.variable)}>
      <body className="min-h-[100vh] bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
