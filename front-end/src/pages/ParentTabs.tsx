import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, Brain, Flame, ShieldAlert } from 'lucide-react';
import { AnglePanel } from '@/components/AnglePanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsBar } from '@/components/MetricsBar';
import { ProfileCard } from '@/components/ProfileCard';
import { ReportBuilder } from '@/components/ReportBuilder';
import { ReportCallout } from '@/components/ReportCallout';
import { RoleTabsLayout } from '@/components/RoleTabsLayout';
import { TrendCharts } from '@/components/TrendCharts';
import { VideoPlayerWithOverlay } from '@/components/VideoPlayerWithOverlay';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePoseSequence } from '@/hooks/usePoseSequence';
import { getProfileByRole, getTrainingSessions } from '@/lib/api';
import { formatMinutes } from '@/utils/format';
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
      {/* 视频播放器和统计卡片区域 */}
      <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <VideoPlayerWithOverlay
            keypoints={[]}
            className="rounded-3xl"
            videoUrl={forcedVideoUrl}
            videoRef={videoRef}
            sourceSize={sourceSize}
            overlayFooter={<span className="text-xs text-[var(--text-2)]">{overlayStatus}</span>}
          />
          {/* 视频装饰边框 - 奢华金色 */}
          <div className="absolute inset-0 rounded-3xl border-2 border-gold-500/30 pointer-events-none" />
        </div>

        <div className="flowline-stage space-y-4" data-keep ref={flowRef}>
          {/* 命中率卡片 - 奢华金色效果 */}
          <div className="glass-luxury p-5 relative overflow-hidden group animate-slide-up">
            <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-gold-500/20 to-transparent rounded-bl-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-2)]">本周命中率</span>
                <Activity className="h-5 w-5 text-gold-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gold-500">
                  {focus ? focus.points[focus.points.length - 1].shootingAccuracy.toFixed(1) : '75'}
                </span>
                <span className="text-lg text-[var(--text-3)]">%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-soft)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +5.6%
                </span>
                <span className="text-xs text-[var(--text-3)]">较上周提升</span>
              </div>
            </div>
            {/* 装饰线条 - 金色渐变 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* 运球稳定指数卡片 */}
          <div className="glass-luxury p-5 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-gold-600/20 to-transparent rounded-bl-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-2)]">运球稳定指数</span>
                <Brain className="h-5 w-5 text-gold-600" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gold-600">
                  {focus ? (focus.points.reduce((acc, item) => acc + item.dribbleFrequency, 0) / focus.points.length).toFixed(2) : '2.2'}
                </span>
                <span className="text-lg text-[var(--text-3)]">次/秒</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-soft)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +3.1%
                </span>
                <span className="text-xs text-[var(--text-3)]">核心控制更稳</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* 防摔倒预警卡片 - 奢华金色警示 */}
          <Card className="glass-luxury border-2 border-gold-600/30 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-lg shadow-gold-500/30">
                  <ShieldAlert className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-base font-bold text-gold-500">防摔倒预警</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm leading-6 text-[var(--text-2)]">
                当监测到重心高度突降或躯干倾角超阈值时，训练界面会<span className="font-semibold text-gold-400">闪烁并播放提醒音</span>，协助及时纠正落地动作。
              </p>
            </CardContent>
          </Card>
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
  const profileQuery = useAsyncData(() => getProfileByRole('parent'), []);

  const suggestions = [
    '肩颈开合拉伸每日 3 组，每组 30 秒，并配合胸椎旋转动作。',
    '投篮训练前加入 5 组无球交叉步起跳，巩固动力链。',
    '晚间进行 10 分钟核心激活（平板支撑、桥式），稳定骨盆与腰椎。',
  ];

  const metricSnapshots = [
    { label: '体态异常', value: '9', unit: '次/月', trend: '下降 21.4%' },
    { label: '累计时长', value: formatMinutes(186), unit: '', trend: '持续训练' },
    { label: '命中率', value: '78', unit: '%', trend: '提升 7.8%' },
    { label: '运球稳定性', value: '92', unit: '分', trend: '提升 6.2%' },
  ];

  return (
    <div className="space-y-8" id="parent-profile-report">
      {profileQuery.data ? <ProfileCard profile={profileQuery.data} /> : null}

      <section className="glass-luxury tech-grid-surface overflow-hidden rounded-[34px] p-5 md:p-6">
        <div className="pointer-events-none absolute right-[-8%] top-[-20%] h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="grid gap-5 xl:grid-cols-[1.14fr_0.86fr]">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-3)]">关键指标纵览</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--text-1)]">核心成长矩阵</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/16 bg-gold-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_12px_rgba(245,201,92,0.65)]" />
                Live
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {metricSnapshots.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-[26px] border border-white/8 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/24"
                >
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-[linear-gradient(180deg,rgba(255,217,126,0.12),rgba(255,217,126,0.95),rgba(255,217,126,0.16))]" />
                  <div className="absolute right-[-18px] top-[-18px] h-20 w-20 rounded-full bg-gold-400/8 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">{item.label}</p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="gradient-text text-[2rem] font-bold leading-none [font-family:var(--font-data)]">{item.value}</span>
                        {item.unit ? <span className="pb-1 text-sm text-[var(--text-3)]">{item.unit}</span> : null}
                      </div>
                    </div>
                    <span className="rounded-full border border-gold-400/14 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold text-[var(--text-2)]">
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.04] p-5">
            <div className="pointer-events-none absolute right-5 top-4">
              <div className="tech-orbit h-24 w-24">
                <span className="tech-orbit-dot" style={{ top: '16%', left: '16%' }} />
                <span className="tech-orbit-dot" style={{ right: '18%', top: '22%', animationDelay: '0.4s' }} />
                <div className="tech-orbit-core h-12 w-12 border border-gold-400/18 bg-[radial-gradient(circle,rgba(255,245,217,0.18),rgba(255,255,255,0.04))] text-[var(--accent-soft)]">
                  <span className="text-[10px] font-bold tracking-[0.16em] [font-family:var(--font-data)]">7/30</span>
                </div>
              </div>
            </div>

            <div className="max-w-[16rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-3)]">个性化建议</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text-1)]">7/30 天训练路径</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">根据成长档案与训练波动，输出下一阶段的动作优化重点。</p>
            </div>

            <div className="tech-rail mt-6 space-y-3 pl-8">
              {suggestions.map((item, index) => (
                <div key={item} className="relative">
                  <span className="absolute -left-8 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/18 bg-[rgba(255,217,126,0.14)] text-[11px] font-bold text-[var(--accent-soft)]">
                    {index + 1}
                  </span>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-[var(--text-2)]">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
