import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-caption font-semibold uppercase tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:active:translate-y-[0.5px]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:opacity-[0.97]',
        secondary: 'bg-muted text-foreground hover:bg-muted/80',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted/70',
        ghost: 'text-foreground hover:bg-muted',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:opacity-[0.94]',
        subtle: 'bg-accent-muted text-accent-foreground hover:bg-accent-muted/80',
        link: 'text-accent underline-offset-4 hover:underline px-0 h-auto font-medium tracking-normal normal-case shadow-none bg-transparent hover:bg-transparent',
      },
      size: {
        sm: 'h-8 px-3 text-caption',
        default: 'h-9 px-4',
        lg: 'h-10 px-5 text-caption',
        icon: 'size-9 p-0 shrink-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as never}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
