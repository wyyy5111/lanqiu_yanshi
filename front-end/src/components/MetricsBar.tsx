import type { ReactNode } from 'react';
import { ArrowBigDown, ArrowUp, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

type MetricTrend = 'up' | 'down' | 'stable';

type MetricItem = {
  id: string;
  label: string;
  unit: string;
  value: number;
  trend?: MetricTrend;
  highlight?: boolean;
};

type MetricsBarProps = {
  items: MetricItem[];
  className?: string;
};

const ICONS: Record<MetricTrend, ReactNode> = {
  up: <ArrowUp className="h-4 w-4 text-[var(--accent-soft)]" />,
  down: <ArrowBigDown className="h-4 w-4 text-[#ffbb87]" />,
  stable: <CircleDot className="h-4 w-4 text-[var(--text-3)]" />,
};

export function MetricsBar({ items, className }: MetricsBarProps) {
  return (
    <div className={cn('u-card-glass grid gap-3 p-4 md:grid-cols-3', className)}>
      {items.map((item) => {
        const trend: MetricTrend = item.trend ?? 'stable';
        const trendLabel = trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定';
        return (
          <div
            key={item.id}
            className={cn(
              'relative flex items-center justify-between overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm',
              item.highlight && 'border-gold-400/18 bg-gold-400/8',
            )}
          >
            <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,rgba(255,217,126,0.9),rgba(255,217,126,0.2))]" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text-1)] [font-family:var(--font-data)]">
                {item.value.toFixed(1)} {item.unit}
              </p>
            </div>
            <div className="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1.5">
              <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-2)]">
              {ICONS[trend]}
              <span>{trendLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
