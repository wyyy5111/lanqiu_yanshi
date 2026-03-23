import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[18px] border text-sm font-semibold tracking-[0.01em] transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(255,217,126,0.42)] bg-[linear-gradient(135deg,rgba(255,248,226,0.2),rgba(255,248,226,0.02)),linear-gradient(135deg,#705018,#f0c661,#8f661d)] text-[#170f05] shadow-[0_18px_36px_rgba(0,0,0,0.24),0_0_28px_rgba(245,201,92,0.18)] hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(0,0,0,0.28),0_0_38px_rgba(245,201,92,0.24)]',
        outline:
          'border-white/10 bg-white/[0.04] text-[var(--text-1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl hover:border-[rgba(255,217,126,0.28)] hover:bg-white/[0.08] hover:text-[var(--accent-soft)]',
        subtle:
          'border-white/8 bg-white/[0.07] text-[var(--text-1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.1] hover:border-[rgba(255,217,126,0.18)]',
        ghost:
          'border-transparent bg-transparent text-[var(--text-2)] hover:border-white/8 hover:bg-white/[0.06] hover:text-[var(--text-1)]',
        destructive:
          'border-[rgba(239,100,97,0.4)] bg-[linear-gradient(135deg,#5d1111,#ef6461)] text-white shadow-[0_16px_28px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(0,0,0,0.24)]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-2xl px-4 text-[13px]',
        lg: 'h-12 rounded-[20px] px-6 text-base',
        icon: 'h-10 w-10 rounded-[18px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
