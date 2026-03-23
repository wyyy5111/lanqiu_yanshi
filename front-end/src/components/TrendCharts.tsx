import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  Legend,
} from 'recharts';
import { chartTheme } from '@/chart/theme';
import { animateLinePath, getBarState, toPercentNumber, useMountLineAnimation } from '@/chart/utils';

type TrendDatum = {
  label: string;
  value: number | string | null | undefined;
};

type TrendTab = {
  key: string;
  label: string;
  unit?: string;
  line: TrendDatum[];
  bar?: TrendDatum[];
  summary?: string;
  metricLabel?: string;
  accentColor?: string;
  accentSoftColor?: string;
  accentBackground?: string;
};

type PieSlice = {
  name: string;
  value: number;
};

type TrendChartsProps = {
  tabs: TrendTab[];
  pie?: PieSlice[];
  className?: string;
  palette?: string[];
  lineCardSubtitle?: string;
  barCardTitle?: string;
  barCardSubtitle?: string;
  barMetricLabel?: string;
  lineMetricLabel?: string;
};

// 优化：多样化且美观的配色方案（遵循全局主题变量）
const COLORS = [
  'var(--chart-accent-1)',
  'var(--chart-accent-2)',
  'var(--chart-accent-3)',
  'var(--chart-accent-4)',
  'var(--chart-accent-5)',
  'var(--chart-accent-6)',
];

const BAR_PALETTE = [
  'var(--chart-accent-1)',
  'var(--chart-accent-2)',
  'var(--chart-accent-3)',
  'var(--chart-accent-4)',
  'var(--chart-accent-5)',
  'var(--chart-accent-6)',
];

const WHITE_COLOR_PATTERNS = [
  /^#f{3}$/i,
  /^#f{6}$/i,
  /^#ffffff$/i,
  /^rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)$/i,
  /^rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(1(\.0+)?|0?\.9+)\s*\)$/i,
  /^white$/i,
  /^transparent$/i,
  /^currentcolor$/i,
];

const isWhiteLikeColor = (value?: string | null) => {
  if (!value) return false;
  const normalized = value.trim();
  return WHITE_COLOR_PATTERNS.some((pattern) => pattern.test(normalized));
};

const QUARTER_LABELS: Record<string, string> = {
  Q1: '第一季度',
  Q2: '第二季度',
  Q3: '第三季度',
  Q4: '第四季度',
};

const formatXAxisLabel = (value: string | number) => {
  const normalized = String(value);
  return QUARTER_LABELS[normalized] ?? normalized;
};

const sanitizeValue = (raw: TrendDatum['value'], treatAsPercent: boolean): number => {
  if (treatAsPercent) {
    const percentValue = toPercentNumber(raw);
    if (percentValue != null) {
      const normalized = percentValue <= 1 ? percentValue * 100 : percentValue; // 0–1 小数统一转 0–100
      return Number(normalized.toFixed(2));
    }
  }
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Number(raw.toFixed(2));
  }
  if (raw == null) {
    return 0;
  }
  if (typeof raw === 'string') {
    const numeric = Number.parseFloat(raw.replace(/,/g, '.').replace(/[^0-9.+-]/g, ''));
    if (Number.isFinite(numeric)) {
      return Number(numeric.toFixed(2));
    }
  }
  const fallback = toPercentNumber(raw);
  return fallback != null ? Number(fallback.toFixed(2)) : 0;
};

const normalizeDataset = (dataset: TrendDatum[], treatAsPercent: boolean): { label: string; value: number }[] =>
  dataset.map((point, index) => ({
    label: ensureLabel(point.label, index),
    value: sanitizeValue(point.value, treatAsPercent),
  }));

// 用折线基线平滑填充柱状图的 0/空值，避免“空柱”
function fillBarData(
  lineData: { label: string; value: number }[],
  barData: { label: string; value: number; __mock?: boolean }[],
  treatAsPercent: boolean,
) {
  const lineMap = new Map<string, number>();
  lineData.forEach((p) => lineMap.set(p.label, p.value));

  return barData.map((p, idx) => {
    const v = Number(p.value);
    const isZeroOrNaN = !Number.isFinite(v) || v <= 0;
    if (!isZeroOrNaN) return p;

    const baseline = lineMap.has(p.label) ? lineMap.get(p.label)! : lineData[idx]?.value ?? 0;
    if (!Number.isFinite(baseline) || baseline <= 0) return p;

    const factor = 0.80 + Math.random() * 0.15; // 80%~95%
    let fillValue = Number((baseline * factor).toFixed(2));
    if (treatAsPercent) fillValue = Math.max(1, Math.min(100, Math.round(fillValue)));
    return { ...p, value: fillValue };
  });
}

const ensureLabel = (rawLabel: string | undefined, index: number) => {
  const trimmed = rawLabel?.toString().trim();
  return trimmed && trimmed.length > 0 ? trimmed : `数据${index + 1}`;
};

export function TrendCharts({
  tabs,
  pie,
  className,
  palette = COLORS,
  lineCardSubtitle,
  barCardTitle = '柱状对比',
  barCardSubtitle = '数据走势一目了然',
  barMetricLabel = '数据项',
  lineMetricLabel = '数据项',
}: TrendChartsProps) {
  const stableTabs = useMemo(() => tabs ?? [], [tabs]);
  if (!stableTabs.length) return null;

  const defaultValue = stableTabs[0].key;
  const [activeTab, setActiveTab] = useState(defaultValue);
  const chartRootRef = useRef<HTMLDivElement>(null);
  const animate = useMountLineAnimation(1800);
  const tabsSignature = useMemo(
    () =>
      JSON.stringify(
        stableTabs.map((tabItem) => ({ key: tabItem.key, line: tabItem.line, bar: tabItem.bar })),
      ),
    [stableTabs],
  );

  useEffect(() => {
    if (!stableTabs.some((tabItem) => tabItem.key === activeTab)) {
      setActiveTab(defaultValue);
    }
  }, [activeTab, defaultValue, stableTabs]);

  const mockEnabled = useMemo(() => {
    if (typeof window === 'undefined') {
      return Boolean(import.meta.env.VITE_ENABLE_CHART_MOCK);
    }
    const params = new URLSearchParams(window.location.search);
    return Boolean(import.meta.env.VITE_ENABLE_CHART_MOCK) || params.get('mock') === '1';
  }, []);

  useEffect(() => {
    if (!chartRootRef.current) return;
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = !reduceMotion && animate;
    const paths = chartRootRef.current.querySelectorAll('path.recharts-line-curve');
    paths.forEach((node) => animateLinePath(shouldAnimate)(node as SVGPathElement));
  }, [animate, tabsSignature]);

  const handleTabChange = (value: string) => setActiveTab(value);

  return (
    <div ref={chartRootRef} className={cn('w-full', className)}>
      <Tabs value={activeTab ?? defaultValue} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <TabsList>
            {stableTabs.map((tabItem) => (
              <TabsTrigger key={tabItem.key} value={tabItem.key}>
                {tabItem.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {stableTabs.map((tab) => {
          const accentCandidate = tab.accentColor?.trim() ?? '';
          const accent = accentCandidate && !isWhiteLikeColor(accentCandidate) ? accentCandidate : chartTheme.accentFallback;
          const accentSoft = tab.accentSoftColor ?? `color-mix(in oklab, ${accent} 32%, transparent)`;
          const accentBg = tab.accentBackground ?? `radial-gradient(120% 120% at 18% 10%, ${accentSoft} 0%, transparent 62%)`;
          const chartVars: CSSProperties = {
            '--chart-accent': accent,
            '--chart-accent-soft': accentSoft,
          } as CSSProperties;
          const treatAsPercent = (tab.unit ?? '').includes('%');
          const lineGradientId = `lineGradient-${tab.key}`;
          const barGradientId = `barGradient-${tab.key}`;

          const lineSource = Array.isArray(tab.line) ? tab.line : [];
          const normalizedLine = normalizeDataset(lineSource, treatAsPercent);

          const rawBarSource = (Array.isArray(tab.bar) && tab.bar.length ? tab.bar : lineSource) ?? [];
          const { hasAnyData, data: rawBarState } = getBarState(rawBarSource, 'value', mockEnabled);
          const normalizedBarData = rawBarState.map((item, index) => {
            const baseLabel = (item as TrendDatum).label ?? (item as unknown as { name?: string }).name;
            const value = sanitizeValue((item as TrendDatum).value, treatAsPercent);
            return {
              label: ensureLabel(baseLabel, index),
              value,
              __mock: (item as unknown as { __mock?: boolean }).__mock ?? false,
            };
          });

          const filledBarData = fillBarData(normalizedLine, normalizedBarData, treatAsPercent);

          const showMockWatermark = !hasAnyData && mockEnabled && filledBarData.length > 0;
          const lineData = normalizedLine.length
            ? normalizedLine
            : filledBarData.map(({ label, value }) => ({ label, value }));
          const finalLineData = lineData.length ? lineData : [{ label: '暂无数据', value: 0 }];
          const barChartData = filledBarData.length ? filledBarData : [{ label: '暂无数据', value: 0 }];

          // 合并为对比柱数据：current（命中率/折线值） vs avg（阶段平均/柱值）
          const lineMap = new Map<string, number>(finalLineData.map((d) => [d.label, d.value]));
          const avgMap = new Map<string, number>(barChartData.map((d) => [d.label, d.value]));
          const mergedLabels = Array.from(new Set<string>([...lineMap.keys(), ...avgMap.keys()]));
          const compareBarData = mergedLabels.map((label) => ({
            label,
            current: lineMap.get(label) ?? 0,
            avg: avgMap.get(label) ?? 0,
          }));
          const hasAnyCompareData = compareBarData.some((d) => (Number.isFinite(d.current) && d.current > 0) || (Number.isFinite(d.avg) && d.avg > 0));

          const formatYAxisTick = (value: number) => (treatAsPercent ? `${value}%` : `${value}`);
          const formatTooltipValue = (value: number) => {
            if (Number.isNaN(value)) return '-';
            if (treatAsPercent) return `${value.toFixed(1)}%`;
            if (tab.unit) return `${value.toFixed(1)}${tab.unit}`;
            return value.toFixed(1);
          };
          const latestPoint = finalLineData[finalLineData.length - 1] ?? { label: '暂无数据', value: 0 };
          const peakPoint = finalLineData.reduce(
            (currentPeak, point) => (point.value > currentPeak.value ? point : currentPeak),
            latestPoint,
          );
          const averageValue = finalLineData.length
            ? finalLineData.reduce((sum, point) => sum + point.value, 0) / finalLineData.length
            : 0;
          const previousPoint = finalLineData.length > 1 ? finalLineData[finalLineData.length - 2] : latestPoint;
          const deltaValue = latestPoint.value - previousPoint.value;
          const formatMetricValue = (value: number) => {
            if (Number.isNaN(value)) return '--';
            if (treatAsPercent) return `${value.toFixed(1)}%`;
            return tab.unit ? `${value.toFixed(1)} ${tab.unit}` : value.toFixed(1);
          };
          const summaryCards = [
            { id: 'latest', label: '最新值', value: formatMetricValue(latestPoint.value), detail: formatXAxisLabel(latestPoint.label) },
            { id: 'peak', label: '峰值', value: formatMetricValue(peakPoint.value), detail: formatXAxisLabel(peakPoint.label) },
            { id: 'avg', label: '平均值', value: formatMetricValue(averageValue), detail: '全阶段均值' },
          ];

          const barMax = Math.max(0, ...compareBarData.map((d) => Math.max(d.current || 0, d.avg || 0)));
          const barDomain: [number, number | ((value: number) => number)] = [
            0,
            () => {
              const baseline = Math.max(1, Math.ceil((barMax || 0) * 1.2));
              return treatAsPercent ? Math.min(100, baseline) : baseline;
            },
          ];
          const maxLineValue = Math.max(...finalLineData.map((item) => item.value));
          const lineDomain: [number, number | ((value: number) => number)] = treatAsPercent
            ? [0, Math.max(100, Math.ceil((Number.isFinite(maxLineValue) ? maxLineValue : 0) / 5) * 5)]
            : [0, (dataMax: number) => Math.max(1, Math.ceil((dataMax || 0) * 1.1))];

          const lineChartKey = `${tab.key}-line-${finalLineData
            .map((item) => `${item.label}:${item.value}`)
            .join('|')}`;
          const barChartKey = `${tab.key}-bar-compare-${compareBarData
            .map((item) => `${item.label}:${item.current}-${item.avg}`)
            .join('|')}`;

          return (
            <TabsContent key={tab.key} value={tab.key} style={chartVars}>
              <section
                className="glass-prism-panel tech-grid-surface relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-soft)] p-4 md:p-5 xl:p-6"
                style={{ backgroundImage: `${accentBg}, linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))` }}
              >
                <div className="pointer-events-none absolute left-[-6%] top-[8%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.14),transparent_64%)] blur-[72px]" />
                <div className="pointer-events-none absolute right-[-4%] top-[10%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.12),transparent_64%)] blur-[76px]" />
                <div className="pointer-events-none absolute bottom-[-10%] left-[24%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(245,201,92,0.12),transparent_64%)] blur-[68px]" />
                <div className="relative z-10 space-y-4 md:space-y-5">
                  <div className="flex flex-col gap-3 md:gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)] backdrop-blur-xl">
                        <span className="h-2 w-2 rounded-full bg-[var(--chart-accent)] shadow-[0_0_14px_var(--chart-accent)]" />
                        {tab.metricLabel ?? lineMetricLabel}
                      </div>
                      <div>
                        <h4 className="text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold text-[var(--chart-text)]">{tab.label}</h4>
                        <p className="mt-0.5 text-xs text-[var(--text-2)] md:text-sm">{lineCardSubtitle ?? '训练走势与阶段对比已进入同一可视化舞台'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <div className="rounded-full border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-2)]">
                        {deltaValue >= 0 ? '上扬' : '回调'}
                        <span className="ml-1.5 font-semibold text-[var(--chart-accent)]">
                          {deltaValue >= 0 ? '+' : ''}
                          {formatMetricValue(deltaValue).replace(/\s/g, '')}
                        </span>
                      </div>
                      {tab.unit ? (
                        <div className="rounded-full border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-2)]">
                          单位：{tab.unit}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 md:gap-5">
                    {/* Summary Cards Row - Full Width */}
                    <div className="grid gap-2 md:grid-cols-3">
                      {summaryCards.map((card) => (
                        <div key={card.id} className="glass-prism-panel relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-3.5 py-3 md:px-4 md:py-3.5">
                          <div className="absolute inset-y-0 left-0 w-[2.5px] bg-[linear-gradient(180deg,rgba(99,220,255,0.12),rgba(255,217,126,0.92),rgba(255,119,215,0.18))]" />
                          <p className="pl-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">{card.label}</p>
                          <p className="pl-2 pt-2 text-[1.25rem] font-bold leading-none text-[var(--chart-text)] [font-family:var(--font-data)] md:text-[1.4rem]">
                            {card.value}
                          </p>
                          <p className="pl-2 pt-1.5 text-[10px] text-[var(--text-3)]">{card.detail}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts Row - Line Chart and Bar Chart Side by Side */}
                    <div className="grid gap-4 md:gap-5 xl:grid-cols-[1fr_1fr] xl:items-start">
                      {/* Line Chart - Left Side */}
                      <div className="u-card-glass glass-prism-panel chart-panel relative overflow-hidden rounded-[var(--radius-lg)] p-4 md:p-5">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_34%)]" />
                        <div className="pointer-events-none absolute inset-x-0 top-[18%] h-px opacity-60 blur-[1px] animate-[beamSweep_7s_linear_infinite]" style={{ background: 'var(--line-spectrum)' }} />
                        <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 md:mb-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)] md:text-xs">趋势主屏</p>
                            <p className="mt-1 text-[11px] text-[var(--text-2)] md:text-sm">逐次训练曲线与高光峰值同步显示</p>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-2)] md:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--chart-accent)] shadow-[0_0_12px_var(--chart-accent)]" />
                            最新 {formatXAxisLabel(latestPoint.label)}
                          </div>
                        </div>
                        <div className="relative h-[18rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--chart-grid)] bg-[var(--chart-panel)] p-3 md:h-[22rem] md:p-4">
                          <div className="absolute inset-0 rounded-[var(--radius-md)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--chart-accent)_10%,transparent),transparent_62%)]" aria-hidden />
                          <div className="absolute inset-y-4 left-4 w-px bg-[linear-gradient(180deg,transparent,var(--chart-grid),transparent)]" aria-hidden />
                          <div className="relative h-full w-full" data-chart-line-root="true">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart key={lineChartKey} data={finalLineData} margin={{ top: 10, right: 20, bottom: 30, left: 8 }}>
                                <defs>
                                  <linearGradient id={lineGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--chart-accent)" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                <XAxis
                                  dataKey="label"
                                  stroke="var(--chart-muted)"
                                  tickLine={false}
                                  axisLine={false}
                                  interval={0}
                                  height={40}
                                  tickMargin={10}
                                  angle={-20}
                                  textAnchor="end"
                                  tick={{ fontSize: 11, fill: 'var(--chart-muted)' }}
                                  tickFormatter={formatXAxisLabel}
                                />
                                <YAxis
                                  stroke="var(--chart-muted)"
                                  tickLine={false}
                                  axisLine={false}
                                  fontSize={11}
                                  width={52}
                                  tick={{ fill: 'var(--chart-muted)' }}
                                  domain={lineDomain}
                                  allowDecimals={!treatAsPercent}
                                  tickFormatter={formatYAxisTick}
                                />
                                <Tooltip
                                  wrapperStyle={{ outline: 'none' }}
                                  contentStyle={{
                                    borderRadius: 16,
                                    border: '1px solid var(--chart-grid)',
                                    background: 'var(--chart-bg)',
                                    color: 'var(--chart-text)',
                                    boxShadow: '0 10px 24px rgba(10, 11, 16, 0.24)',
                                  }}
                                  labelFormatter={formatXAxisLabel}
                                  formatter={(value: number) => [formatTooltipValue(Number(value)), tab.metricLabel ?? lineMetricLabel]}
                                />
                                <Area type="monotone" dataKey="value" stroke="none" fill={`url(#${lineGradientId})`} isAnimationActive={false} />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke={accent}
                                  strokeWidth={chartTheme.lineWidth}
                                  dot={{
                                    r: chartTheme.dotR,
                                    fill: accent,
                                    stroke: chartTheme.dotStroke,
                                    strokeWidth: 2,
                                    style: {
                                      filter: 'drop-shadow(0 0 6px var(--chart-point-shadow))',
                                    },
                                  }}
                                  activeDot={{
                                    r: chartTheme.activeDotR,
                                    fill: accent,
                                    stroke: chartTheme.activeDotStroke,
                                    strokeWidth: 3,
                                    style: {
                                      filter: 'drop-shadow(0 0 10px var(--chart-point-shadow))',
                                    },
                                  }}
                                  connectNulls
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Bar Chart - Right Side */}
                      <div className="u-card-glass glass-prism-panel chart-panel relative overflow-hidden rounded-[var(--radius-lg)] p-4 md:p-5">
                        <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 md:mb-4">
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--chart-text)] md:text-base">
                              {barCardTitle}
                              <span className="ml-1.5 text-xs font-semibold text-[var(--chart-accent)] md:text-sm">{tab.metricLabel ?? barMetricLabel}</span>
                            </h4>
                            {barCardSubtitle ? <p className="text-[10px] text-[var(--text-3)] md:text-xs">{barCardSubtitle}</p> : null}
                          </div>
                          <div className="rounded-full border border-[var(--chart-grid)] bg-[var(--chart-panel)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-2)] md:text-xs">
                            阶段基线对照
                          </div>
                        </div>
                        <div className="u-chart relative h-[18rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--chart-grid)] bg-[var(--chart-panel)] p-3 md:h-[22rem] md:p-4">
                          <div className="absolute inset-0 rounded-[var(--radius-md)] bg-gradient-to-tr from-[var(--chart-accent)]/10 via-transparent to-transparent" aria-hidden />
                          <div className="pointer-events-none absolute inset-x-0 top-[24%] h-px opacity-60 blur-[1px] animate-[beamSweep_8s_linear_infinite]" style={{ background: 'var(--line-spectrum)' }} />
                          <div className="relative h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart key={barChartKey} data={compareBarData} margin={{ top: 20, right: 20, bottom: 28, left: 6 }} barGap={6} barCategoryGap={14}>
                                <defs>
                                  <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-accent)" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                <XAxis
                                  dataKey="label"
                                  stroke="var(--chart-muted)"
                                  tickLine={false}
                                  axisLine={false}
                                  interval={0}
                                  height={64}
                                  tickMargin={12}
                                  angle={-18}
                                  textAnchor="end"
                                  tick={{ fontSize: 10, fill: 'var(--chart-muted)' }}
                                  tickFormatter={formatXAxisLabel}
                                />
                                <YAxis
                                  stroke="var(--chart-muted)"
                                  tickLine={false}
                                  axisLine={false}
                                  fontSize={10}
                                  width={52}
                                  tick={{ fill: 'var(--chart-muted)' }}
                                  domain={barDomain}
                                  allowDecimals={!treatAsPercent}
                                  tickFormatter={formatYAxisTick}
                                />
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: 16,
                                    border: '1px solid var(--chart-grid)',
                                    background: 'var(--chart-bg)',
                                    color: 'var(--chart-text)',
                                    boxShadow: '0 14px 32px rgba(10, 11, 16, 0.24)',
                                  }}
                                  wrapperStyle={{ outline: 'none' }}
                                  labelClassName="text-[10px] font-medium"
                                  labelFormatter={formatXAxisLabel}
                                  formatter={(value: number, name: string) => [formatTooltipValue(Number(value)), name]}
                                />
                                <Legend verticalAlign="top" height={24} />
                                {hasAnyCompareData || showMockWatermark ? (
                                  <>
                                    <Bar dataKey="current" name={tab.metricLabel ?? '命中率'} radius={chartTheme.barRadius} barSize={16} maxBarSize={48} fill="var(--chart-accent-1)" minPointSize={3} isAnimationActive={false}>
                                      {compareBarData.map((_, index) => (
                                        <Cell key={`bar-current-${tab.key}-${index}`} fill={BAR_PALETTE[index % BAR_PALETTE.length]} />
                                      ))}
                                    </Bar>
                                    <Bar dataKey="avg" name="阶段平均" radius={chartTheme.barRadius} barSize={16} maxBarSize={48} fill="var(--chart-accent-4)" opacity={0.9} minPointSize={3} isAnimationActive={false} />
                                    {showMockWatermark ? (
                                      <text x="95%" y="14" textAnchor="end" opacity="0.45" fontSize="12" fill="var(--chart-muted)">
                                        MOCK
                                      </text>
                                    ) : null}
                                  </>
                                ) : (
                                  <foreignObject x="0" y="0" width="100%" height="100%">
                                    <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: 0.8 }}>
                                      <div className="chart-skeleton">No data / 暂无数据</div>
                                    </div>
                                  </foreignObject>
                                )}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Text */}
                    {tab.summary ? (
                      <p className="glass-prism-panel rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-white/[0.04] p-3.5 text-sm leading-relaxed text-[var(--text-2)]">
                        {tab.summary}
                      </p>
                    ) : null}
                  </div>

                  {pie ? (
                    <div className="u-card-glass glass-prism-panel rounded-[var(--radius-lg)] border border-[var(--border-soft)] p-4 md:p-5">
                      <h4 className="text-sm font-semibold text-[var(--chart-text)]">比例分布</h4>
                      <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-[180px_1fr] md:items-center">
                        <div className="h-36 md:h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={36} outerRadius={58} paddingAngle={3}>
                                {pie.map((entry, index) => (
                                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  borderRadius: 14,
                                  border: '1px solid var(--chart-grid)',
                                  background: 'var(--chart-bg)',
                                  color: 'var(--chart-text)',
                                  boxShadow: '0 8px 20px rgba(10, 11, 16, 0.2)',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <ul className="grid gap-1.5 text-xs text-[var(--text-2)] md:text-sm">
                          {pie.map((slice, index) => (
                            <li key={slice.name} className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-white/[0.03] px-3 py-2 md:px-4 md:py-2.5">
                              <span className="flex items-center gap-2">
                                <svg className="h-2.5 w-2.5 md:h-3 md:w-3" viewBox="0 0 8 8" aria-hidden="true">
                                  <circle cx="4" cy="4" r="4" fill={palette[index % palette.length]} />
                                </svg>
                                {slice.name}
                              </span>
                              <span className="font-semibold text-[var(--chart-text)] [font-family:var(--font-data)]">{slice.value.toFixed(1)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            </TabsContent>
          );
      })}
    </Tabs>
  </div>
  );
}
