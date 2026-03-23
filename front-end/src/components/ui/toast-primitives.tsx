'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

const toastVariantStyles: Record<ToastVariant, string> = {
  default:
    'border-white/10 bg-[rgba(10,10,14,0.92)] text-[var(--text-1)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]',
  destructive:
    'border-[rgba(239,100,97,0.28)] bg-[rgba(40,12,14,0.94)] text-[#ffb2af] shadow-[0_18px_42px_rgba(0,0,0,0.35)]',
  success:
    'border-gold-400/22 bg-[rgba(25,20,10,0.94)] text-[var(--accent-soft)] shadow-[0_18px_42px_rgba(0,0,0,0.35)]',
  warning:
    'border-[rgba(242,141,69,0.26)] bg-[rgba(44,25,8,0.94)] text-[#ffcf7d] shadow-[0_18px_42px_rgba(0,0,0,0.35)]',
  info:
    'border-white/10 bg-[rgba(10,10,14,0.92)] text-[var(--text-1)] shadow-[0_18px_42px_rgba(0,0,0,0.35)]',
};

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Viewport>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 p-4 sm:top-auto sm:left-auto sm:right-6 sm:bottom-6 sm:translate-x-0',
        className,
      )}
      {...props}
    />
  ),
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & { variant?: ToastVariant }
>(
  ({ className, variant = 'default', ...props }, ref) => (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-[24px] border p-4 pr-6 transition-all u-surface-light dark:u-surface-dark',
        toastVariantStyles[variant],
        className,
      )}
      data-variant={variant}
      {...props}
    />
  ),
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
  ),
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Description>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Description ref={ref} className={cn('text-sm text-[var(--text-3)]', className)} {...props} />
  ),
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastClose = ToastPrimitives.Close;

export type { ToastVariant };
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose };
