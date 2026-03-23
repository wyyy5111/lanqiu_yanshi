import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex h-auto items-center justify-center gap-1 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04)),linear-gradient(135deg,rgba(99,220,255,0.06),rgba(255,119,215,0.05),rgba(245,201,92,0.06))] p-1.5 text-[var(--text-3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_rgba(0,0,0,0.1)] backdrop-blur-xl', className)}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn('inline-flex min-w-[5rem] items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] border border-transparent px-4 py-2.5 text-sm font-semibold transition-all duration-[var(--duration-fast)] data-[state=active]:border-[var(--border-strong)] data-[state=active]:bg-[linear-gradient(125deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06)),linear-gradient(135deg,rgba(99,220,255,0.14),rgba(255,119,215,0.12),rgba(245,201,92,0.14))] data-[state=active]:text-[var(--accent-soft)] data-[state=active]:shadow-[0_10px_24px_rgba(0,0,0,0.18),0_0_18px_rgba(245,201,92,0.1)] data-[state=active]:ring-1 data-[state=active]:ring-[var(--border-strong)] hover:text-[var(--text-1)] hover:data-[state=active]:text-[var(--text-1)]', className)}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]', className)}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
