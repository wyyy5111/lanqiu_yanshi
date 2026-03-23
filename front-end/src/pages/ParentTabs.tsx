import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, Brain, Flame, ShieldAlert } from 'lucide-react';
import { AnglePanel } from '@/components/AnglePanel';
import { MetricsBar } from '@/components/MetricsBar';
import { ProfileCard } from '@/components/ProfileCard';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportCallout } from '@/components/ReportCallout';
import { RoleTabsLayout } from '@/components/RoleTabsLayout';
import { TrendCharts } from '@/components/TrendCharts';
import { VideoPlayerWithOverlay } from '@/components/VideoPlayerWithOverlay';
import { useTheme } from '@/components/theme-provider';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePoseSequence } from '@/hooks/usePoseSequence';
import { getProfileByRole, getTrainingSessions } from '@/lib/api';
import { formatMinutes } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { TrainingSession } from '@/types';
import { useRef, useEffect } from 'react';

const POSE_SEQUENCE_URL = '/poses/dribble_sequence.json';

const FALLBACK_SHOOTING = Array.from({ length: 12 }, (_, index) => ({
  label: `第${index + 1}次`,
  value: Number((64 + Math.sin(index / 2) * 6 + index * 1.5).toFixed(2)),
}));

const FALLBACK_VELOCITY = Array.from({ length: 12 }, (_, index) => ({
  label: `第${index + 1}段`,
  value: Number((26 + Math.cos(index / 1.8) * 4 + ((index % 3) - 1) * 1.8).toFixed(2)),
}));

function ParentBasketballTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const sessionsQuery = useAsyncData(() => getTrainingSessions(), []);
  const focus: TrainingSession | undefined = sessionsQuery.data?.[0];
  const { videoRef, sourceSize, isLoading: poseLoading, error: poseError, currentMetrics } = usePoseSequence(POSE_SEQUENCE_URL);
  const overlayStatus = poseError
    ? `姿态数据加载失败 · ${poseError}`
    : poseLoading
      ? '姿态数据加载中...'
      : '示例回放中 · 可逐帧查看骨架与角度';
  const forcedVideoUrl = '/videos/c62c073f-57f4-401b-be54-986fcd22a7c8_output.mp4';
  const flowRef = useRef<HTMLDivElement>(null);
  const focusPoints = focus?.points ?? [];
  const shootingLine = focusPoints.length
    ? focusPoints.map((point, index) => ({ label: `第${index + 1}次`, value: point.shootingAccuracy }))
    : FALLBACK_SHOOTING;
  const velocityLine = focusPoints.length
    ? focusPoints.map((point, index) => ({ label: `第${index + 1}段`, value: point.verticalVelocity }))
    : FALLBACK_VELOCITY;

  // 滚动进入后激活流线与卡片揭示
  useEffect(() => {
    const node = flowRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.classList.add('is-activated');
      else node.classList.remove('is-activated');
    }, { threshold: 0.15 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div className="space-y-8" id="parent-basketball-report">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute left-[4%] top-[12%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.12),transparent_60%)] blur-[80px]" />
      <div className="pointer-events-none absolute right-[6%] top-[20%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.1),transparent_62%)] blur-[72px]" />

      {/* 视频播放器和统计卡片区域 */}
      <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
        {/* Video Player with Tech Frame */}
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] shadow-2xl">
          <div className="absolute inset-0 rounded-[var(--radius-xl)] border-2 border-[var(--border-soft)] pointer-events-none z-10" />
          <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-[radial-gradient(circle_at_top_right,rgba(255,222,48,0.08),transparent_40%)] pointer-events-none" />
          <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.12),transparent_60%)] blur-[48px] pointer-events-none" />
          <div className="absolute right-[10%] bottom-[15%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.1),transparent_62%)] blur-[52px] pointer-events-none" />
          <VideoPlayerWithOverlay
            keypoints={[]}
            className="rounded-[var(--radius-xl)]"
            videoUrl={forcedVideoUrl}
            videoRef={videoRef}
            sourceSize={sourceSize}
            overlayFooter={<span className="text-xs text-[var(--text-2)]">{overlayStatus}</span>}
          />
        </div>

        {/* Metrics Sidebar with Tech Styling */}
        <div className="flowline-stage space-y-4" data-keep ref={flowRef}>
          {/* 命中率卡片 */}
          <div
            className={cn(
              'metric-tile micro-tile group relative overflow-hidden rounded-[var(--radius-lg)] border p-5 transition-all duration-[var(--duration-fast)]',
              isLight
                ? 'border-[var(--border-soft)] bg-white/80 hover:border-[var(--accent)]/40 hover:bg-white/95'
                : 'border-[var(--border-soft)] bg-white/[0.05] hover:border-[var(--accent)]/40 hover:bg-white/[0.08]'
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,222,48,0.1),transparent_40%)]" />
            <div className="pointer-events-none absolute right-[-8%] top-[-8%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.08),transparent_60%)] blur-[40px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,222,48,0.6),transparent)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  <Activity className="h-3.5 w-3.5 text-[var(--accent)]" />
                  本周命中率
                </div>
                <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_10px_rgba(0,255,148,0.6)]" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="gradient-text text-4xl font-bold">
                  {focus ? focus.points[focus.points.length - 1].shootingAccuracy.toFixed(1) : '75'}
                </span>
                <span className="text-lg text-[var(--text-3)]">%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +5.6%
                </span>
                <span className="text-xs text-[var(--text-3)]">较上周提升</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,222,48,0.8),transparent)] opacity-60 transition-opacity group-hover:opacity-100" />
          </div>

          {/* 运球稳定指数卡片 */}
          <div
            className={cn(
              'metric-tile micro-tile group relative overflow-hidden rounded-[var(--radius-lg)] border p-5 transition-all duration-[var(--duration-fast)]',
              isLight
                ? 'border-[var(--border-soft)] bg-white/80 hover:border-[var(--accent-cyan)]/40 hover:bg-white/95'
                : 'border-[var(--border-soft)] bg-white/[0.05] hover:border-[var(--accent-cyan)]/40 hover:bg-white/[0.08]'
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.08),transparent_40%)]" />
            <div className="pointer-events-none absolute right-[-6%] top-[-6%] h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.1),transparent_60%)] blur-[36px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,245,255,0.6),transparent)]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  <Brain className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                  运球稳定指数
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-[var(--accent-cyan)]">
                  {focus ? (focus.points.reduce((acc, item) => acc + item.dribbleFrequency, 0) / focus.points.length).toFixed(2) : '2.2'}
                </span>
                <span className="text-lg text-[var(--text-3)]">次/秒</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +3.1%
                </span>
                <span className="text-xs text-[var(--text-3)]">核心控制更稳</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(0,245,255,0.8),transparent)] opacity-60 transition-opacity group-hover:opacity-100" />
          </div>

          {/* 防摔倒预警卡片 */}
          <div
            className={cn(
              'metric-tile micro-tile group relative overflow-hidden rounded-[var(--radius-lg)] border p-5 transition-all duration-[var(--duration-fast)]',
              isLight
                ? 'border-[var(--warning)]/30 bg-white/80 hover:bg-white/95'
                : 'border-[var(--warning)]/30 bg-white/[0.05] hover:bg-white/[0.08]'
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,149,0,0.08),transparent_40%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,149,0,0.6),transparent)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[var(--warning)]/10 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
                  <ShieldAlert className="h-5 w-5 text-[var(--warning)]" />
                </div>
                <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--warning)]">
                  安全预警
                </div>
              </div>
              <p className="text-sm leading-6 text-[var(--text-2)]">
                当监测到重心高度突降或躯干倾角超阈值时，训练界面会<span className="font-semibold text-[var(--warning)]">闪烁并播放提醒音</span>，协助及时纠正落地动作。
              </p>
            </div>
          </div>
        </div>
      </div>

      {focus ? (
        <AnglePanel
          angles={[
            { id: 'wrist', label: '腕关节角', value: currentMetrics.right_elbow_angle || currentMetrics.left_elbow_angle || 0, threshold: 52, description: '出手阶段保持 50° 左右的锁定姿态' },
            { id: 'elbow', label: '肘部角度', value: currentMetrics.right_elbow_angle || currentMetrics.left_elbow_angle || 0, threshold: 82, description: '肘部抬升充分，配合肩部发力' },
            { id: 'shoulder', label: '肩关节', value: currentMetrics.right_shoulder_angle || currentMetrics.left_shoulder_angle || 0, threshold: 90, description: '肩部展臂顺滑，注意放松肩颈' },
            { id: 'knee', label: '膝关节', value: currentMetrics.right_knee_angle || currentMetrics.left_knee_angle || 0, threshold: 110, description: '蹬地蓄力充分，保持髋膝同向' },
          ]}
        />
      ) : null}

      <MetricsBar
        items={[
          { id: 'frequency', label: '运球频率', value: 2, unit: '次/秒', trend: 'stable' },
          { id: 'lean', label: '身体前倾', value: (currentMetrics.body_lean ?? 0) * 100, unit: 'cm', trend: 'stable' },
          { id: 'knee', label: '膝盖弯曲', value: currentMetrics.knee_flexion ?? 120, unit: '°', trend: 'stable' },
        ]}
      />

      <TrendCharts
        lineCardSubtitle="逐次训练表现曲线"
        barCardSubtitle="与阶段平均的柱状对比"
        tabs={[
          {
            key: 'shooting',
            label: '命中率趋势',
            unit: '%',
            line: shootingLine,
            bar: shootingLine.map(point => ({ ...point, value: Number(point.value.toFixed(2)) })),
            metricLabel: '命中率',
            summary: '命中率稳步提升，可继续强化核心稳定与随球手腕控制。',
            accentColor: 'var(--c-shoot)',
          },
          {
            key: 'velocity',
            label: '纵向速度对比',
            unit: 'cm/s',
            line: velocityLine,
            bar: velocityLine.map((point) => ({ ...point, value: Number(Math.max(point.value, 0).toFixed(2)) })),
            metricLabel: '纵向速度',
            summary: '纵向速度维持在 24~33cm/s，结合爆发力训练可进一步提升弹跳质量。',
            accentColor: 'var(--c-dribble)',
          },
        ]}
      />

      <div className="mt-12">
        <ReportCallout
          accent="gold"
          icon={<Flame className="h-6 w-6" />}
          title="个性化建议"
          description="加入 3 组原地高抬腿配合随球跳投，注意落地缓冲"
          actions={
            <ReportBuilder
              targetId="parent-basketball-report"
              fileName="篮球训练矫正报告.pdf"
              title="篮球动作矫正训练报告"
            />
          }
        />
      </div>
    </div>
  );
}

function ParentProfileTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const profileQuery = useAsyncData(() => getProfileByRole('parent'), []);

  const suggestions = [
    '肩颈开合拉伸每日 3 组，每组 30 秒，并配合胸椎旋转动作。',
    '投篮训练前加入 5 组无球交叉步起跳，巩固动力链。',
    '晚间进行 10 分钟核心激活（平板支撑、桥式），稳定骨盆与腰椎。',
  ];

  const metricSnapshots = [
    { label: '体态异常', value: '9', unit: '次/月', trend: '下降 21.4%', color: 'var(--warning)' },
    { label: '累计时长', value: formatMinutes(186), unit: '', trend: '持续训练', color: 'var(--accent-cyan)' },
    { label: '命中率', value: '78', unit: '%', trend: '提升 7.8%', color: 'var(--accent)' },
    { label: '运球稳定性', value: '92', unit: '分', trend: '提升 6.2%', color: 'var(--accent-rose)' },
  ];

  return (
    <div className="space-y-8" id="parent-profile-report">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute left-[6%] top-[18%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.1),transparent_60%)] blur-[72px]" />
      <div className="pointer-events-none absolute right-[8%] top-[28%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.1),transparent_62%)] blur-[64px]" />

      {profileQuery.data ? <ProfileCard profile={profileQuery.data} /> : null}

      {/* Main Stats Section */}
      <div
        className={cn(
          'glass-prism-panel tech-grid-surface relative overflow-hidden rounded-[var(--radius-xl)] border p-5 md:p-6',
          isLight
            ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.82))]'
            : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]'
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,222,48,0.06),transparent_30%)]" />
        <div className="pointer-events-none absolute right-[-8%] top-[-20%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.08),transparent_60%)] blur-[80px]" />
        <div className="pointer-events-none absolute left-[-4%] bottom-[-15%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.08),transparent_62%)] blur-[72px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,222,48,0.5),transparent)]" />

        <div className="relative z-10 grid gap-5 xl:grid-cols-[1.14fr_0.86fr]">
          {/* Metrics Grid */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(255,222,48,0.6)]" />
                  关键指标
                </div>
                <h2 className="mt-3 text-2xl font-bold text-[var(--text-1)]">核心成长矩阵</h2>
              </div>
              <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_10px_rgba(0,255,148,0.6)] animate-pulse" />
                Live
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {metricSnapshots.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    'metric-tile micro-tile group relative overflow-hidden rounded-[var(--radius-lg)] border p-4 transition-all duration-[var(--duration-fast)]',
                    isLight
                      ? 'border-[var(--border-soft)] bg-white/75 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:bg-white/90'
                      : 'border-[var(--border-soft)] bg-white/[0.04] hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:bg-white/[0.07]'
                  )}
                >
                  <div className="absolute inset-y-0 left-0 w-[2.5px] bg-[linear-gradient(180deg,transparent,rgba(255,222,48,0.2),rgba(255,222,48,0.95),rgba(255,222,48,0.2))]" />
                  <div className="absolute right-[-12%] top-[-12%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,222,48,0.08),transparent_60%)] blur-[36px]" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">{item.label}</p>
                      <div className="mt-2.5 flex items-end gap-2">
                        <span className="text-[1.8rem] font-bold leading-none text-[var(--text-1)] [font-family:var(--font-data)]" style={{ color: item.color }}>{item.value}</span>
                        {item.unit ? <span className="pb-1 text-sm text-[var(--text-3)]">{item.unit}</span> : null}
                      </div>
                    </div>
                    <span className="holo-chip rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--success)]">
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions Panel */}
          <div
            className={cn(
              'relative overflow-hidden rounded-[var(--radius-lg)] border p-5',
              isLight
                ? 'border-[var(--border-soft)] bg-white/80'
                : 'border-[var(--border-soft)] bg-white/[0.05]'
            )}
          >
            <div className="pointer-events-none absolute right-4 top-4">
              <div className="tech-orbit h-24 w-24">
                <span className="tech-orbit-dot" style={{ top: '16%', left: '16%' }} />
                <span className="tech-orbit-dot" style={{ right: '18%', top: '22%', animationDelay: '0.4s' }} />
                <div className="tech-orbit-core h-12 w-12 border border-[var(--border-soft)] bg-[radial-gradient(circle,rgba(255,245,217,0.18),rgba(255,255,255,0.04))]">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-[var(--accent)] [font-family:var(--font-data)]">7/30</span>
                </div>
              </div>
            </div>

            <div className="max-w-[16rem]">
              <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                <Brain className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                个性化建议
              </div>
              <h2 className="mt-3 text-xl font-bold text-[var(--text-1)]">7/30 天训练路径</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">根据成长档案与训练波动，输出下一阶段的动作优化重点。</p>
            </div>

            <div className="tech-rail mt-5 space-y-3 pl-6">
              {suggestions.map((item, index) => (
                <div key={item} className="relative">
                  <span className={cn(
                    'absolute -left-6 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold',
                    isLight
                      ? 'border-[var(--border-soft)] bg-white text-[var(--accent)]'
                      : 'border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]'
                  )}>
                    {index + 1}
                  </span>
                  <div className={cn(
                    'rounded-[var(--radius-md)] border px-4 py-3.5 text-sm leading-6',
                    isLight
                      ? 'border-[var(--border-soft)] bg-white/70 text-[var(--text-2)]'
                      : 'border-[var(--border-soft)] bg-white/[0.03] text-[var(--text-2)]'
                  )}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TrendCharts
        lineCardSubtitle="命中率与速度随训练次数的细腻走势"
        barCardSubtitle="将每次训练与阶段平均进行金色对比"
        tabs={[
          {
            key: 'quarter',
            label: '季度进步率',
            metricLabel: '进步率',
            unit: '%',
            line: [
              { label: 'Q1', value: 12.00 },
              { label: 'Q2', value: 18.00 },
              { label: 'Q3', value: 23.00 },
              { label: 'Q4', value: 29.00 },
            ],
            bar: [
              { label: 'Q1', value: 10.00 },
              { label: 'Q2', value: 16.00 },
              { label: 'Q3', value: 20.00 },
              { label: 'Q4', value: 24.00 },
            ],
            summary: '连续三个季度保持正向增长，可继续加强力量与柔韧结合训练。',
            accentColor: 'var(--c-shoot)',
          },
          {
            key: 'focus',
            label: '专项训练完成度',
            metricLabel: '完成度',
            unit: '%',
            line: [
              { label: '姿态矫正', value: 86.00 },
              { label: '投篮动作', value: 78.00 },
              { label: '运球稳定', value: 82.00 },
              { label: '防守移动', value: 75.00 },
            ],
            bar: [
              { label: '姿态矫正', value: 90.00 },
              { label: '投篮动作', value: 74.00 },
              { label: '运球稳定', value: 85.00 },
              { label: '防守移动', value: 70.00 },
            ],
            summary: '防守移动完成度偏低，建议加入低位滑步与折返跑训练。',
            accentColor: 'var(--c-defense)',
          },
        ]}
      />

      <div className="mt-12">
        <ReportCallout
          accent="gold"
          title="导出成长档案"
          description="获取完整的个人矫正成长档案 PDF，方便分享与留存。"
          actions={
            <ReportBuilder
              targetId="parent-profile-report"
              fileName="个人成长档案报告.pdf"
              title="个人矫正成长档案"
            />
          }
          className="sm:items-center"
        />
      </div>
    </div>
  );
}

const PARENT_TABS = [
  { key: 'basketball', label: '篮球动作', path: '/parent/basketball', icon: <Activity className="h-5 w-5" /> },
  { key: 'profile', label: '成长档案', path: '/parent/profile', icon: <Brain className="h-5 w-5" /> },
];

export default function ParentTabs() {
  const location = useLocation();
  const activeKey = PARENT_TABS.find((tab) => location.pathname.startsWith(tab.path))?.key ?? 'basketball';

  return (
    <RoleTabsLayout
      tabs={PARENT_TABS}
      activeKey={activeKey}
      title="篮球动作分析 · 家长同步"
      subtitle="训练数据采集 · 成长追踪 · 个性化建议"
    >
      <Routes>
        <Route path="basketball" element={<ParentBasketballTab />} />
        <Route path="profile" element={<ParentProfileTab />} />
        <Route path="" element={<Navigate to="basketball" replace />} />
        <Route path="*" element={<Navigate to="basketball" replace />} />
      </Routes>
    </RoleTabsLayout>
  );
}
