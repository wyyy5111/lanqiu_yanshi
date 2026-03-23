import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[rgba(255,217,126,0.16)] bg-[rgba(255,217,126,0.08)] text-[var(--accent-soft)]',
        outline: 'border-white/10 bg-white/[0.04] text-[var(--text-2)]',
        success: 'border-[rgba(217,198,132,0.24)] bg-[rgba(217,198,132,0.12)] text-[#ead8a2]',
        warning: 'border-[rgba(242,141,69,0.26)] bg-[rgba(242,141,69,0.12)] text-[#ffbb87]',
        danger: 'border-[rgba(239,100,97,0.26)] bg-[rgba(239,100,97,0.12)] text-[#ffb2af]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
