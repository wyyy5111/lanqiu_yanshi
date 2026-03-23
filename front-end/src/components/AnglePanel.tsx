import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Angle = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  threshold: number;
  description?: string;
  reverse?: boolean;
};

type AnglePanelProps = {
  angles: Angle[];
  className?: string;
};

export function AnglePanel({ angles, className }: AnglePanelProps) {
  return (
    <div className={cn('grid gap-5 md:grid-cols-2', className)}>
      {angles.map((angle, index) => {
        const isNormal = angle.reverse ? angle.value <= angle.threshold : angle.value >= angle.threshold;
        return (
          <Card 
            key={angle.id} 
            className={cn(
              'glass-card glass-prism-panel relative overflow-hidden border-white/8 transition-transform duration-300 hover:-translate-y-1',
              !isNormal && 'border-[rgba(242,141,69,0.3)]'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              'absolute right-0 top-0 h-28 w-28 rounded-bl-[32px] opacity-80',
              isNormal ? 'bg-[radial-gradient(circle_at_top_right,rgba(255,217,126,0.22),transparent_66%)]' : 'bg-[radial-gradient(circle_at_top_right,rgba(242,141,69,0.22),transparent_66%)]'
            )} />

            <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-[16px] border',
                  isNormal 
                    ? 'border-gold-400/20 bg-gold-400/12 text-[var(--accent-soft)] shadow-[0_0_24px_rgba(245,201,92,0.12)]'
                    : 'border-[rgba(242,141,69,0.26)] bg-[rgba(242,141,69,0.14)] text-[#ffbb87]'
                )}>
                  <svg className="h-6 w-6 text-[var(--text-1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isNormal ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-[var(--text-1)]">{angle.label}</CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">关节监测</p>
                </div>
              </div>
              <Badge 
                variant={isNormal ? 'success' : 'danger'}
                className={cn(
                  'px-3 py-1.5'
                )}
              >
                {isNormal ? '规范' : '需优化'}
              </Badge>
            </CardHeader>

            <CardContent className="flex items-start justify-between pt-2 relative z-10">
              <div className="space-y-2">
                <p className={cn('text-4xl font-bold [font-family:var(--font-data)]', isNormal ? 'gradient-text' : 'text-[#ffbb87]')}>
                  {angle.value.toFixed(1)}
                  <span className="ml-1 text-xl text-[var(--text-3)]">{angle.unit ?? '°'}</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <span className={cn('inline-block h-1.5 w-1.5 rounded-full', isNormal ? 'bg-gold-400' : 'bg-[#ffbb87]')} />
                  阈值 {angle.threshold.toFixed(1)} {angle.unit ?? '°'}
                </p>
                <div className="h-1.5 rounded-full bg-white/8">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      isNormal
                        ? 'bg-[linear-gradient(90deg,#63dcff,#f5c95c,#ff77d7)]'
                        : 'bg-[linear-gradient(90deg,rgba(242,141,69,0.86),rgba(255,187,135,0.74))]',
                    )}
                    style={{ width: `${Math.min(100, Math.max(18, (angle.value / Math.max(angle.threshold, 1)) * 62))}%` }}
                  />
                </div>
              </div>
              {angle.description ? (
                <div className="max-w-[14rem] text-right">
                  <p className="text-sm leading-6 text-[var(--text-2)]">
                    {angle.description}
                  </p>
                </div>
              ) : null}
            </CardContent>

            <div className={cn(
              'absolute bottom-0 left-0 right-0 h-px opacity-80',
              isNormal 
                ? 'bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.85),transparent)]' 
                : 'bg-[linear-gradient(90deg,transparent,rgba(242,141,69,0.85),transparent)]'
            )} />
          </Card>
        );
      })}
    </div>
  );
}
