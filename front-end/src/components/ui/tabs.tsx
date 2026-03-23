import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex h-auto items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.04] p-1.5 text-[var(--text-3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl', className)}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn('inline-flex min-w-[6rem] items-center justify-center whitespace-nowrap rounded-full border border-transparent px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:border-[rgba(255,217,126,0.26)] data-[state=active]:bg-[linear-gradient(135deg,rgba(255,248,226,0.12),rgba(255,248,226,0.04))] data-[state=active]:text-[var(--accent-soft)] data-[state=active]:shadow-[0_12px_26px_rgba(0,0,0,0.22),0_0_20px_rgba(245,201,92,0.08)] hover:text-[var(--text-1)]', className)}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('mt-6 focus-visible:outline-none', className)}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
