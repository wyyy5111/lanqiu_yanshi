import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CalendarRange, ClipboardCheck, Megaphone, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProfileCard } from '@/components/ProfileCard';
import { ReportBuilder } from '@/components/ReportBuilder';
import { RoleTabsLayout } from '@/components/RoleTabsLayout';
import { TrendCharts } from '@/components/TrendCharts';
import { useTheme } from '@/components/theme-provider';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getTeamOverview } from '@/lib/api';
import { formatPercent } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { TeamMemberSnapshot, TrendPoint } from '@/types';
import { TrainingSelection } from './coach/TrainingSelection';
import { Dribbling } from './coach/Dribbling';
import { Defense } from './coach/Defense';
import { Shooting } from './coach/Shooting';

const sanitizePointValue = (value: number | string): number => Number(Number(value).toFixed(2));

const normalizeTrendPoints = (points: TrendPoint[]): TrendPoint[] =>
  points.map((point) => ({ label: point.label, value: sanitizePointValue(point.value) }));

const buildMonthlyBaseline = (points: TrendPoint[]): TrendPoint[] => {
  const normalized = normalizeTrendPoints(points);
  return normalized.map((point, index) => {
    if (index === 0) {
      const baseline = point.value > 1 ? Math.max(point.value - Math.max(point.value * 0.08, 3.2), 0) : point.value * 0.92;
      return { label: point.label, value: sanitizePointValue(baseline) };
    }
    const prev = normalized[index - 1];
    const baseline = (point.value + prev.value) / 2;
    return { label: point.label, value: sanitizePointValue(baseline) };
  });
};

const FALLBACK_MONTHLY_PROGRESS: TrendPoint[] = normalizeTrendPoints([
  { label: '1月', value: 62.00 },
  { label: '2月', value: 68.00 },
  { label: '3月', value: 74.00 },
  { label: '4月', value: 81.00 },
]);

// 训练监测改为训练选择页面
function CoachTrainingTab() {
  return (
    <Routes>
      <Route path="/" element={<TrainingSelection />} />
      <Route path="dribbling" element={<Dribbling />} />
      <Route path="defense" element={<Defense />} />
      <Route path="shooting" element={<Shooting />} />
      <Route path="*" element={<Navigate to="/coach/training" replace />} />
    </Routes>
  );
}



function CoachTeamTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const teamQuery = useAsyncData(() => getTeamOverview(), []);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('锋线');
  const [members, setMembers] = useState<TeamMemberSnapshot[]>([]);

  useEffect(() => {
    if (teamQuery.data) {
      setMembers(teamQuery.data.members);
    }
  }, [teamQuery.data]);

  const monthlyProgressLine = useMemo(
    () => normalizeTrendPoints(teamQuery.data?.monthlyProgress ?? FALLBACK_MONTHLY_PROGRESS),
    [teamQuery.data?.monthlyProgress]
  );

  const monthlyProgressBaseline = useMemo(
    () => buildMonthlyBaseline(teamQuery.data?.monthlyProgress ?? FALLBACK_MONTHLY_PROGRESS),
    [teamQuery.data?.monthlyProgress]
  );



  const handleAdd = () => {
    if (!newName.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: 'member-' + (prev.length + 1), name: newName, progress: 70, specialization: newRole, riskLevel: '中' },
    ]);
    setNewName('');
  };

  return (
    <div className="space-y-6" id="coach-team-report">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute left-[5%] top-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.12),transparent_60%)] blur-[60px]" />
      <div className="pointer-events-none absolute right-[8%] top-[28%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.1),transparent_62%)] blur-[56px]" />

      {teamQuery.data ? (
        <ProfileCard
          profile={{
            id: 'coach-profile',
            name: '张衡教练',
            age: 35,
            height: 182,
            weight: 78,
            role: 'coach',
            teamName: teamQuery.data.name,
            avatar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=facearea&w=120&h=120&q=60',
          }}
          extra={'球队进步率 ' + formatPercent(teamQuery.data.progressRate, 1) + ' · 动作规范度 ' + formatPercent(teamQuery.data.complianceScore, 1)}
        />
      ) : null}

      {/* Team Member Management Card */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,222,48,0.08),transparent_30%)]" />
        <div className="pointer-events-none absolute left-[4%] top-[8%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.08),transparent_64%)] blur-[48px]" />
        <div className="pointer-events-none absolute right-[6%] bottom-[12%] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.08),transparent_64%)] blur-[44px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,222,48,0.5),transparent)]" />

        <div
          className={cn(
            'glass-prism-panel relative z-10 overflow-hidden rounded-[var(--radius-lg)] border p-5',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.82))]'
              : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(255,222,48,0.6)]" />
                队员档案
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-2.5">
              <Label htmlFor="member-name" className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-3)]">队员姓名</Label>
              <Input id="member-name" value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="请输入" className="h-11" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="member-role" className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-3)]">专项位置</Label>
              <Input id="member-role" value={newRole} onChange={(event) => setNewRole(event.target.value)} className="h-11" />
            </div>
            <div className="flex items-end">
              <Button className="btn-neon h-11 w-full text-sm font-semibold" onClick={handleAdd}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加队员
              </Button>
            </div>
          </div>

          <ScrollArea className="mt-5 h-56 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-white/[0.03] p-4">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--text-3)]">
                <tr>
                  <th className="py-2.5 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em]">队员</th>
                  <th className="py-2.5 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em]">专项</th>
                  <th className="py-2.5 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em]">规范度</th>
                  <th className="py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em]">风险等级</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-2)]">
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-medium text-[var(--text-1)]">{member.name}</td>
                    <td className="py-3 pr-4">
                      <span className="holo-chip rounded-full border border-[var(--border-soft)] bg-white/[0.04] px-2.5 py-1 text-xs">
                        {member.specialization}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="gradient-text font-semibold [font-family:var(--font-data)]">{member.progress.toFixed(1)}%</span>
                    </td>
                    <td className="py-3">
                      <span className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-semibold',
                        member.riskLevel === '高' ? 'border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)]' :
                        member.riskLevel === '中' ? 'border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]' :
                        'border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]'
                      )}>
                        {member.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>

      <TrendCharts
        lineCardSubtitle="团队动作规范度随月度变化曲线"
        barCardSubtitle="与上月平均值的柱状对比"
        tabs={[
          {
            key: 'progress',
            label: '月度规范度',
            unit: '%',
            line: monthlyProgressLine,
            bar: monthlyProgressBaseline,
            metricLabel: '动作规范度',
            summary: '规范度逐月上升，防守协同和投篮节奏持续改善。',
            accentColor: 'var(--c-dribble)',
          },
        ]}
      />

      {/* Report Builder */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-soft)] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,222,48,0.06),transparent_40%)]" />
        <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.08),transparent_60%)] blur-[32px]" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">一键导出</p>
            <p className="mt-1 text-sm text-[var(--text-2)]">生成球队档案报告 PDF</p>
          </div>
          <ReportBuilder targetId="coach-team-report" fileName="球队档案报告.pdf" title="球队动作规范度对比报告" />
        </div>
      </div>
    </div>
  );
}

function CoachPlanTab() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [schedule, setSchedule] = useState([
    { id: 'plan-1', date: '周二 18:30', content: '投篮节奏强化 + 核心稳定训练' },
    { id: 'plan-2', date: '周四 18:30', content: '防守滑步 + 低位卡位练习' },
    { id: 'plan-3', date: '周六 09:00', content: '分组对抗赛 + 标注关键动作' },
  ]);
  const [message, setMessage] = useState('本周训练侧重投篮出手定型，请保持核心收紧。');
  const [enableReminder, setEnableReminder] = useState(true);
  const [latestFeedback, setLatestFeedback] = useState<string[]>([]);

  const handleAddPlan = () => {
    setSchedule((prev) => [...prev, { id: 'plan-' + (prev.length + 1), date: '待定', content: '自定义训练计划' }]);
  };

  // 设置默认反馈信息
  useEffect(() => {
    const feedbackList = [
      '后卫组：防守滑步配合提升 12%，期待下次强化对抗',
      '内线组：篮板卡位时机更准确，但落地缓冲仍需提醒',
      '全队：体能储备充足，注意训练后拉伸恢复'
    ];
    setLatestFeedback(feedbackList);
  }, []);

  return (
    <div className="space-y-6" id="coach-plan-report">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute right-[6%] top-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.1),transparent_60%)] blur-[60px]" />
      <div className="pointer-events-none absolute left-[8%] top-[32%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.1),transparent_62%)] blur-[56px]" />

      {/* Training Schedule Card */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.06),transparent_30%)]" />
        <div className="pointer-events-none absolute right-[4%] top-[8%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.08),transparent_64%)] blur-[48px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,245,255,0.5),transparent)]" />

        <div
          className={cn(
            'glass-prism-panel relative z-10 overflow-hidden rounded-[var(--radius-lg)] border p-5',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.82))]'
              : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
                <svg className="h-3.5 w-3.5 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                训练日程
              </div>
            </div>
            <Button className="btn-neon h-9 text-xs font-semibold" onClick={handleAddPlan}>
              <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加计划
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {schedule.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'metric-tile micro-tile group relative overflow-hidden rounded-[var(--radius-md)] border px-4 py-3.5 transition-all duration-[var(--duration-fast)]',
                  isLight
                    ? 'border-[var(--border-soft)] bg-white/70 hover:border-[var(--accent)]/30 hover:bg-white/90'
                    : 'border-[var(--border-soft)] bg-white/[0.04] hover:border-[var(--accent)]/30 hover:bg-white/[0.06]'
                )}
              >
                <div className="absolute inset-y-0 left-0 w-[2.5px] bg-[linear-gradient(180deg,rgba(0,245,255,0.2),rgba(0,245,255,0.8),rgba(0,245,255,0.2))]" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">日程 {index + 1}</p>
                    <p className="mt-1.5 font-semibold text-[var(--text-1)]">{item.date}</p>
                    <p className="mt-1 text-xs text-[var(--text-2)]">{item.content}</p>
                  </div>
                  <span className="holo-chip rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-cyan)]">
                    待执行
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder & Messages Card */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,26,198,0.06),transparent_30%)]" />
        <div className="pointer-events-none absolute left-[4%] bottom-[8%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,222,48,0.08),transparent_64%)] blur-[48px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,26,198,0.5),transparent)]" />

        <div
          className={cn(
            'glass-prism-panel relative z-10 overflow-hidden rounded-[var(--radius-lg)] border p-5',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.82))]'
              : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="holo-chip inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
                <Megaphone className="h-3.5 w-3.5 text-[var(--accent-rose)]" />
                训练提醒
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-3)]">开启提醒</span>
              <Switch checked={enableReminder} onCheckedChange={setEnableReminder} aria-label="开启训练提醒" />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Message Input */}
            <div className={cn(
              'rounded-[var(--radius-md)] border p-4',
              isLight
                ? 'border-[var(--border-soft)] bg-white/70'
                : 'border-[var(--border-soft)] bg-white/[0.04]'
            )}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">推送内容</p>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="mt-2 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="mt-3 flex justify-end">
                <Button className="btn-neon h-9 text-xs font-semibold" onClick={() => {}}>
                  <Megaphone className="mr-1.5 h-3.5 w-3.5" />
                  发送到队员端
                </Button>
              </div>
            </div>

            {/* Feedback List */}
            <div className={cn(
              'rounded-[var(--radius-md)] border p-4',
              isLight
                ? 'border-[var(--border-soft)] bg-white/70'
                : 'border-[var(--border-soft)] bg-white/[0.04]'
            )}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">最新反馈</p>
              <ul className="mt-3 space-y-2">
                {latestFeedback.length > 0 ? (
                  latestFeedback.map((feedback, index) => (
                    <li
                      key={index}
                      className={cn(
                        'flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-white/[0.02] px-3 py-2.5 text-sm',
                        isLight ? 'text-[var(--text-2)]' : 'text-[var(--text-2)]'
                      )}
                    >
                      <span className="holo-chip mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 text-[10px] font-bold text-[var(--success)]">
                        {index + 1}
                      </span>
                      <span>{feedback}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-3)]">暂无反馈数据</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <TrendCharts
        lineCardSubtitle="每周提醒响应率变化趋势"
        barCardSubtitle="与平均响应率的柱状对比"
        tabs={[
          {
            key: 'reminder',
            label: '提醒响应率',
            unit: '%',
            line: [
              { label: '第1周', value: 72.00 },
              { label: '第2周', value: 78.00 },
              { label: '第3周', value: 85.00 },
              { label: '第4周', value: 91.00 },
            ],
            bar: [
              { label: '第1周', value: 68.00 },
              { label: '第2周', value: 74.00 },
              { label: '第3周', value: 80.00 },
              { label: '第4周', value: 86.00 },
            ],
            metricLabel: '响应率',
            summary: '提醒响应率持续提升，可继续推送针对性训练目标。',
            accentColor: 'var(--c-shoot)',
          },
        ]}
      />

      {/* Report Builder */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-soft)] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,222,48,0.06),transparent_40%)]" />
        <div className="absolute left-4 top-4 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(255,26,198,0.08),transparent_60%)] blur-[32px]" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">一键导出</p>
            <p className="mt-1 text-sm text-[var(--text-2)]">生成训练计划报告 PDF</p>
          </div>
          <ReportBuilder targetId="coach-plan-report" fileName="训练计划与提醒.pdf" title="训练计划与提醒执行报告" />
        </div>
      </div>
    </div>
  );
}

const COACH_TABS = [
  { key: 'training', label: '训练分析', path: '/coach/training', icon: <ClipboardCheck className="h-5 w-5" /> },
  { key: 'team', label: '球队档案', path: '/coach/team', icon: <Users2 className="h-5 w-5" /> },
  { key: 'plan', label: '训练计划', path: '/coach/plan', icon: <CalendarRange className="h-5 w-5" /> },
];

export default function CoachTabs() {
  const location = useLocation();
  const activeKey = COACH_TABS.find((tab) => location.pathname.startsWith(tab.path))?.key ?? 'training';

  return (
    <RoleTabsLayout
      tabs={COACH_TABS}
      activeKey={activeKey}
      title="动作矫正监测 · 教练视角"
      subtitle="训练分析 · 球队档案 · 计划消息"
    >
      <Routes>
        <Route path="training/*" element={<CoachTrainingTab />} />
        <Route path="team" element={<CoachTeamTab />} />
        <Route path="plan" element={<CoachPlanTab />} />
        <Route path="" element={<Navigate to="training" replace />} />
        <Route path="*" element={<Navigate to="training" replace />} />
      </Routes>
    </RoleTabsLayout>
  );
}
