import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Props {
  label: string;
  value?: number | string;
  unit?: string;
  trend?: { direction: 'up' | 'down'; value: number };
  caption?: string;
  className?: string;
}

export function StatisticCard({ label, value, unit, trend, caption, className }: Props) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={`u-card-glass u-kpi-card ${className ?? ''}`}>
      <div className="u-kpi-badge"></div>

      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">{label}</p>
          {caption ? <p className="mt-2 text-xs text-[var(--text-3)]">{caption}</p> : null}
        </div>
        {trend ? (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${trend.direction === 'up' ? 'border-[rgba(217,198,132,0.22)] bg-[rgba(217,198,132,0.12)] text-[var(--accent-soft)]' : 'border-[rgba(239,100,97,0.22)] bg-[rgba(239,100,97,0.1)] text-[#ffb2af]'}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trend.value}%
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="flex items-end gap-3">
        <p className="u-kpi-value gradient-text text-[clamp(2.45rem,4vw,3.6rem)] font-bold tracking-tight">{value ?? '-'}</p>
        {unit ? (
          <span className="mb-2 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
            {unit}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
