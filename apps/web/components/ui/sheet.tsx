'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;

type SheetSide = 'left' | 'right';

function SheetOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px]', className)}
      {...props}
    />
  );
}

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: SheetSide;
  }
>(function SheetContent({ className, side = 'left', children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 h-full overflow-y-auto border-border bg-background p-6 shadow-lg outline-none',
          side === 'left'
            ? 'inset-y-0 left-0 w-[min(100%,288px)] border-r rounded-r-xl'
            : 'inset-y-0 right-0 w-[min(100%,320px)] border-l rounded-l-xl',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">Panel</DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

SheetContent.displayName = 'SheetContent';

function SheetClose({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      type="button"
      aria-label="Close panel"
      className={cn(
        'absolute right-4 top-4 inline-flex rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <X className="size-5" aria-hidden />
    </DialogPrimitive.Close>
  );
}

export { Sheet, SheetClose, SheetContent, SheetTrigger };
