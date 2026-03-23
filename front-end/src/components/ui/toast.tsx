// import { Cross2Icon } from '@radix-ui/react-icons';
import * as React from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast-primitives';
import { cn } from '@/lib/utils';

type ToastProps = React.ComponentProps<typeof Toast>;

type ToastActionElement = React.ReactNode;

const ToastAction = ({ className, ...props }: React.ComponentProps<typeof ToastClose>) => (
  <ToastClose
    className={cn(
      'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-medium text-[var(--text-2)] transition-colors hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    toast-close=""
    {...props}
  />
);
ToastAction.displayName = ToastClose.displayName;

export { ToastAction, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription };
export type { ToastProps, ToastActionElement };
