import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ACCENT_ICON_STYLES: Record<string, string> = {
  orange: 'bg-[linear-gradient(135deg,#8e4b14,#f29a52)] text-[#160d05]',
  purple: 'bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#160d05]',
  cyan: 'bg-[linear-gradient(135deg,#8e6720,#f3d07a)] text-[#160d05]',
  lime: 'bg-[linear-gradient(135deg,#7d6226,#ecd6a1)] text-[#160d05]',
  gold: 'bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#160d05]',
};

const ACCENT_STRIPES: Record<string, string> = {
  orange: 'from-transparent via-orange-300/80 to-transparent',
  purple: 'from-transparent via-gold-300/80 to-transparent',
  cyan: 'from-transparent via-gold-200/80 to-transparent',
  lime: 'from-transparent via-[#ead8a2] to-transparent',
  gold: 'from-transparent via-gold-300/90 to-transparent',
};

export type ReportCalloutProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  accent?: 'orange' | 'purple' | 'cyan' | 'lime' | 'gold';
  className?: string;
};

export function ReportCallout({
  icon,
  title,
  description,
  meta,
  actions,
  accent = 'purple',
  className,
}: ReportCalloutProps) {
  const iconContainer = ACCENT_ICON_STYLES[accent] ?? ACCENT_ICON_STYLES.purple;
  const accentStripe = ACCENT_STRIPES[accent] ?? ACCENT_STRIPES.purple;

  return (
    <div
      className={cn(
        'u-card-glass relative overflow-hidden rounded-[30px] p-5',
        'flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:flex-nowrap',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,rgba(255,217,126,0.95),rgba(255,217,126,0.08))]" />
      <div className="pointer-events-none absolute right-[-8%] top-[-24%] h-36 w-36 rounded-full bg-gold-300/12 blur-[60px]" />
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {icon ? (
          <div
            className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] shadow-[0_16px_30px_rgba(0,0,0,0.22)] transition-transform duration-300',
              iconContainer,
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="space-y-1 text-[var(--text-2)]">
          <p className="text-lg font-semibold text-[var(--text-1)]">{title}</p>
          {description ? <div className="text-sm leading-relaxed text-[var(--text-2)]">{description}</div> : null}
          {meta ? <div className="text-xs text-[var(--text-3)]">{meta}</div> : null}
        </div>
      </div>
      {actions ? <div className="flex-shrink-0 sm:w-full sm:flex sm:justify-start lg:w-auto lg:flex-none">{actions}</div> : null}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r opacity-90',
          accentStripe,
        )}
      />
    </div>
  );
}
