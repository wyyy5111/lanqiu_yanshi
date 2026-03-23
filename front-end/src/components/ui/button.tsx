import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border text-sm font-semibold tracking-[0.01em] transition-all duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)] disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(255,217,126,0.4)] bg-[linear-gradient(120deg,rgba(255,255,255,0.32),rgba(255,255,255,0.06)_32%,transparent_52%),linear-gradient(135deg,#6e5013,#f0c661_28%,#67ddff_52%,#a27eff_72%,#ff7bd7_86%,#8b6417)] text-[#170f05] shadow-[0_14px_28px_rgba(0,0,0,0.2),0_0_20px_rgba(245,201,92,0.14),0_0_26px_rgba(99,220,255,0.08),0_0_30px_rgba(255,119,215,0.08)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(0,0,0,0.24),0_0_28px_rgba(245,201,92,0.18),0_0_34px_rgba(99,220,255,0.12),0_0_38px_rgba(255,119,215,0.12)] active:translate-y-0 active:shadow-[0_10px_20px_rgba(0,0,0,0.18)]',
        outline:
          'border-[rgba(255,255,255,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04)),linear-gradient(135deg,rgba(99,220,255,0.08),rgba(255,119,215,0.06),rgba(245,201,92,0.06))] text-[var(--text-1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.1)] backdrop-blur-xl hover:border-[rgba(255,217,126,0.32)] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06)),linear-gradient(135deg,rgba(99,220,255,0.12),rgba(255,119,215,0.08),rgba(245,201,92,0.1))] hover:text-[var(--accent-soft)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_24px_rgba(0,0,0,0.12)] active:translate-y-0 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_12px_rgba(0,0,0,0.08)]',
        subtle:
          'border-[rgba(255,255,255,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04)),linear-gradient(135deg,rgba(99,220,255,0.06),rgba(255,119,215,0.05),rgba(245,201,92,0.06))] text-[var(--text-1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06)),linear-gradient(135deg,rgba(99,220,255,0.1),rgba(255,119,215,0.08),rgba(245,201,92,0.08))] hover:border-[rgba(255,217,126,0.22)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        ghost:
          'border-transparent bg-transparent text-[var(--text-2)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-1)] active:bg-[rgba(255,255,255,0.08)]',
        destructive:
          'border-[rgba(216,85,83,0.5)] bg-[linear-gradient(135deg,#6d1515,#d85553)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(0,0,0,0.22)] active:translate-y-0 active:shadow-[0_8px_16px_rgba(0,0,0,0.14)]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
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
