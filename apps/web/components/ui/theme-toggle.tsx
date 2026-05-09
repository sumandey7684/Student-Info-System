'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/store/ui-store';

export function ThemeToggle() {
  const { theme, setTheme } = useUiStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      type="button"
      className="rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
