import * as React from 'react';
import { cn } from '@/lib/utils/cn';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    suffix?: React.ReactNode;
    invalid?: boolean;
  }
>(function Input({ className, type = 'text', suffix, invalid, ...props }, ref) {
  return (
    <div className="relative flex w-full">
      <input
        type={type}
        className={cn(
          'h-10 w-full rounded-lg border bg-card px-3 py-2 text-body text-foreground shadow-xs transition-colors placeholder:text-muted-foreground hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55',
          invalid ? 'border-destructive' : 'border-input',
          suffix ? 'pr-10' : '',
          className,
        )}
        ref={ref}
        aria-invalid={invalid || undefined}
        {...props}
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
