import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import type { UserRole } from '@/types';

const DEMO_ACCOUNTS: Array<{ username: string; password: string; role: UserRole; name: string; description: string }> = [
  {
    username: 'parent001',
    password: '123456',
    role: 'parent',
    name: '家长体验账号',
    description: '查看篮球动作矫正与成长档案',
  },
  {
    username: 'coach001',
    password: '123456',
    role: 'coach',
    name: '教练体验账号',
    description: '训练监测、球队档案与计划消息',
  },
];

const PLATFORM_PILLARS = [
  ['01', '多角色联动', '家长与教练共享同一训练进度与动作反馈'],
  ['02', '动作量化', '视频回放、角度、速度与命中率同步呈现'],
  ['03', '报告闭环', '训练建议与成长档案持续沉淀'],
] as const;

const PLATFORM_FEATURES = ['动作识别', '趋势分析', '报告归档'] as const;
const HERO_SIGNAL_CARDS = [
  ['动作采样', '1280', '帧'],
  ['命中提升', '7.8', '%'],
  ['协同模块', '03', '项'],
] as const;
const HERO_FLOW_STEPS = [
  ['A1', '骨架识别', '33 个关键点实时提取'],
  ['B2', '动作评估', '角度、速度与节奏联动分析'],
  ['C3', '结果同步', '家长端与教练端即时共享'],
] as const;
const HERO_STREAMS = [
  ['姿态校准', 86],
  ['轨迹捕捉', 92],
  ['报告归档', 78],
] as const;
const HERO_WAVE_BARS = [34, 58, 76, 48, 90, 64, 82, 54] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [username, setUsername] = useState('parent001');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    if (user) {
      const redirect = user.role === 'parent' ? '/parent/basketball' : '/coach/training';
      navigate(redirect, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.classList.add('is-activated');
      else node.classList.remove('is-activated');
    }, { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message ?? '登录失败，请检查账号密码');
      return;
    }
    const matched = DEMO_ACCOUNTS.find((item) => item.username === username);
    if (matched) {
      const redirect = matched.role === 'parent' ? '/parent/basketball' : '/coach/training';
      navigate(redirect, { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-hidden px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={cn('absolute left-[4%] top-[6%] h-[380px] w-[380px] rounded-full blur-[110px]', isLight ? 'bg-gold-500/14' : 'bg-gold-400/12')} />
        <div className={cn('absolute bottom-[0%] right-[4%] h-[480px] w-[480px] rounded-full blur-[140px]', isLight ? 'bg-gold-400/12' : 'bg-gold-600/10')} />
        <div className="absolute right-[14%] top-[8%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.15),transparent_62%)] blur-[100px]" />
        <div className="absolute left-[18%] bottom-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.14),transparent_62%)] blur-[100px]" />
        <div className={cn('absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border', isLight ? 'border-gold-600/8' : 'border-gold-400/6')} />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.6),rgba(99,220,255,0.35),rgba(255,119,215,0.35),transparent)]" />
      </div>

      <div className="grid w-full max-w-[1380px] items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-5">
        <section
          ref={heroRef}
          className={cn(
            'hero-luxury tech-grid-surface flowline-stage iridescent-shell energy-frame grid min-h-[540px] gap-5 rounded-[var(--radius-xl)] border px-4 py-5 md:px-7 md:py-6 xl:min-h-[660px] xl:px-8 xl:py-7 2xl:min-h-[700px]',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.82))] shadow-[var(--shadow-strong)]'
              : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[var(--shadow-strong)]',
          )}
        >
          <div className="pointer-events-none absolute left-[-6%] top-[10%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.14),transparent_60%)] blur-[72px]" />
          <div className="pointer-events-none absolute right-[8%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.12),transparent_62%)] blur-[64px]" />
          <div className="pointer-events-none absolute bottom-[10%] left-[30%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(245,201,92,0.12),transparent_60%)] blur-[64px]" />
          <div className="pointer-events-none absolute inset-x-[10%] top-[44%] h-px bg-[linear-gradient(90deg,transparent,rgba(99,220,255,0.2),rgba(255,217,126,0.4),rgba(255,119,215,0.2),transparent)]" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={cn(
                'holo-chip inline-flex items-center gap-3 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em]',
                isLight ? 'border-[var(--border-soft)] bg-white/75' : 'border-[var(--border-soft)] bg-white/[0.05]',
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_12px_rgba(245,201,92,0.7)]" />
              青少年篮球训练监测系统
            </div>
            <div
              className={cn(
                'holo-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em]',
                isLight ? 'border-[var(--border-soft)] bg-gold-400/8' : 'border-[var(--border-soft)] bg-gold-400/6',
              )}
            >
              实时训练监测平台
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_300px] xl:items-start">
            <div className="space-y-5 xl:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--text-3)]">
                智能动作识别与训练评估
              </p>
              <h1 className="max-w-4xl text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[0.94] tracking-[-0.03em]">
                <span className="gradient-text block">多角色协同的</span>
                <span className="mt-1.5 block text-[var(--text-1)]">篮球动作矫正系统</span>
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--text-2)] md:text-base">
                面向青少年篮球专项训练的综合平台，整合动作分析、趋势追踪与报告管理，
                <span className="gradient-text font-semibold">让训练结果、成长档案与角色协同形成闭环</span>。
              </p>

              <div className="flex flex-wrap gap-2">
                {PLATFORM_FEATURES.map((feature) => (
                  <span
                    key={feature}
                    className={cn(
                      'holo-chip rounded-full border px-3.5 py-1.5 text-sm font-medium',
                      isLight
                        ? 'border-[var(--border-soft)] bg-white/72 text-[var(--text-1)]'
                        : 'border-[var(--border-soft)] bg-white/[0.05] text-[var(--text-2)]',
                    )}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'tech-grid-surface glass-prism-panel energy-frame overflow-hidden rounded-[var(--radius-lg)] border px-4 py-4',
                isLight
                  ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,233,210,0.8))] shadow-[var(--shadow-soft)]'
                  : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]',
              )}
            >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">实时监测总览</p>
                    <p className="mt-1 text-xs text-[var(--text-2)]">训练数据与协同状态统一显示在同一舞台</p>
                  </div>
                  <span className={cn('holo-chip rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]', isLight ? 'border-[var(--border-soft)] bg-gold-400/8 text-[var(--accent-deep)]' : 'border-[var(--border-soft)] bg-gold-400/6 text-[var(--accent-soft)]')}>
                    Overview
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {HERO_SIGNAL_CARDS.map(([label, value, unit]) => (
                      <div
                        key={label}
                        className={cn(
                          'metric-tile micro-tile relative overflow-hidden rounded-[var(--radius-md)] border px-3.5 py-3.5',
                          isLight
                            ? 'border-[var(--border-soft)] bg-white/76'
                            : 'border-[var(--border-soft)] bg-black/20',
                        )}
                      >
                        <div className="absolute left-0 top-0 h-full w-[2.5px] bg-[linear-gradient(180deg,rgba(255,217,126,0.2),rgba(255,217,126,0.95),rgba(255,217,126,0.15))]" />
                        <p className="pl-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">{label}</p>
                        <div className="mt-2.5 flex items-end gap-1 pl-2">
                          <strong className="gradient-text text-[1.6rem] font-bold leading-none [font-family:var(--font-data)]">{value}</strong>
                          <span className="pb-0.5 text-xs text-[var(--text-3)]">{unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 lg:grid-cols-2">
                    {PLATFORM_PILLARS.map(([index, heading, text], pillarIndex) => (
                      <div
                        key={heading}
                        className={cn(
                          'metric-tile micro-tile relative overflow-hidden rounded-[var(--radius-md)] border px-3.5 py-3.5',
                          pillarIndex === 2 && 'lg:col-span-2',
                          isLight
                            ? 'border-[var(--border-soft)] bg-white/72'
                            : 'border-[var(--border-soft)] bg-white/[0.04]',
                        )}
                      >
                        <p className="text-[10px] font-bold tracking-[0.26em] text-[var(--text-3)] [font-family:var(--font-data)]">{index}</p>
                        <p className="mt-2.5 text-base font-semibold text-[var(--text-1)]">{heading}</p>
                        <p className="mt-1.5 text-xs leading-6 text-[var(--text-2)]">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    className={cn(
                      'glass-prism-panel micro-tile rounded-[var(--radius-md)] border px-3.5 py-3.5',
                      isLight ? 'border-[var(--border-soft)] bg-white/70' : 'border-[var(--border-soft)] bg-white/[0.04]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">训练监测矩阵</p>
                        <p className="mt-1 text-xs text-[var(--text-2)]">多源数据同步写入分析链路</p>
                      </div>
                      <span className={cn('holo-chip rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]', isLight ? 'border-[var(--border-soft)] bg-gold-400/8 text-[var(--accent-deep)]' : 'border-[var(--border-soft)] bg-gold-400/6 text-[var(--accent-soft)]')}>
                        Matrix
                      </span>
                    </div>

                    <div className="mt-3.5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_140px] lg:items-end">
                      <div className="grid gap-2">
                        {HERO_FLOW_STEPS.map(([code, title, text]) => (
                          <div
                            key={code}
                            className={cn(
                              'micro-tile flex items-start gap-2.5 rounded-[var(--radius-sm)] border px-2.5 py-2.5',
                              isLight ? 'border-[var(--border-soft)] bg-white/74' : 'border-[var(--border-soft)] bg-black/20',
                            )}
                          >
                            <span className={cn('holo-chip inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] border text-[10px] font-bold [font-family:var(--font-data)]', isLight ? 'border-[var(--border-soft)] bg-gold-400/8 text-[var(--accent-deep)]' : 'border-[var(--border-soft)] bg-gold-400/6 text-[var(--accent-soft)]')}>
                              {code}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-[var(--text-1)]">{title}</p>
                              <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-2)]">{text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="metric-tile micro-tile flex h-[120px] items-end justify-between gap-1 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-white/[0.04] px-2.5 py-2">
                        {HERO_WAVE_BARS.map((height, index) => (
                          <span
                            key={index}
                            className="w-full rounded-full bg-[linear-gradient(180deg,rgba(255,240,176,0.9),rgba(99,220,255,0.7),rgba(255,119,215,0.55),rgba(139,100,23,0.94))] shadow-[0_0_10px_rgba(245,201,92,0.16),0_0_14px_rgba(99,220,255,0.14)]"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            <div
              className={cn(
                'tech-grid-surface glass-prism-panel energy-frame relative self-start overflow-hidden rounded-[var(--radius-lg)] border px-4 py-4',
                isLight
                  ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,233,210,0.84))] shadow-[var(--shadow-soft)]'
                  : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[var(--shadow-strong)]',
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.6),transparent)]" />
              <div className="pointer-events-none absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.16),transparent_62%)] blur-[42px]" />
              <div className="pointer-events-none absolute right-[10%] bottom-[10%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.14),transparent_62%)] blur-[46px]" />
              <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--text-3)]">
                <span>训练工作流</span>
                <span className={cn('[font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>24H</span>
              </div>

              <div className="relative mt-3.5 flex items-center justify-center">
                <div className="tech-orbit h-[200px] w-[200px]">
                  <span className="tech-orbit-dot" style={{ top: '18%', left: '10%' }} />
                  <span className="tech-orbit-dot" style={{ top: '20%', right: '12%', animationDelay: '0.5s' }} />
                  <span className="tech-orbit-dot" style={{ bottom: '18%', left: '16%', animationDelay: '1s' }} />
                  <span className="tech-orbit-dot" style={{ bottom: '14%', right: '18%', animationDelay: '1.4s' }} />

                  <div
                    className={cn(
                      'tech-orbit-core h-[96px] w-[96px] border text-center',
                      isLight
                        ? 'border-[var(--border-soft)] bg-[radial-gradient(circle,rgba(255,250,241,0.98),rgba(243,229,198,0.8))] text-[var(--accent-deep)]'
                        : 'border-[var(--border-soft)] bg-[radial-gradient(circle,rgba(255,245,217,0.16),rgba(255,255,255,0.04))] text-[var(--accent-soft)]',
                    )}
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em]">实时协同</span>
                    <strong className="mt-0.5 text-[1.2rem] font-bold [font-family:var(--font-data)]">AI</strong>
                  </div>

                  {[
                    { label: '动作采集', style: { left: '-2px', top: '34px' } },
                    { label: '指标解析', style: { right: '-6px', top: '84px' } },
                    { label: '结果归档', style: { left: '14px', bottom: '22px' } },
                  ].map((item) => (
                    <span
                      key={item.label}
                      style={item.style}
                      className={cn(
                        'holo-chip absolute rounded-full border px-2.5 py-1 text-[10px] font-medium',
                        isLight
                          ? 'border-[var(--border-soft)] bg-white/80 text-[var(--text-1)]'
                          : 'border-[var(--border-soft)] bg-black/20 text-[var(--text-2)]',
                      )}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2">
                <div className={cn('metric-tile micro-tile rounded-[var(--radius-sm)] border px-2.5 py-2.5', isLight ? 'border-[var(--border-soft)] bg-white/70' : 'border-[var(--border-soft)] bg-white/[0.05]')}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">回放标注</p>
                  <p className="mt-1.5 gradient-text text-[1.3rem] font-bold leading-none [font-family:var(--font-data)]">24</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-3)]">帧 / 秒</p>
                </div>
                <div className={cn('metric-tile micro-tile rounded-[var(--radius-sm)] border px-2.5 py-2.5', isLight ? 'border-[var(--border-soft)] bg-white/70' : 'border-[var(--border-soft)] bg-white/[0.05]')}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">链路延迟</p>
                  <p className="mt-1.5 gradient-text text-[1.3rem] font-bold leading-none [font-family:var(--font-data)]">18</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-3)]">ms</p>
                </div>
              </div>

              <div className={cn('glass-prism-panel micro-tile mt-2.5 rounded-[var(--radius-md)] border px-3.5 py-3.5', isLight ? 'border-[var(--border-soft)] bg-white/66' : 'border-[var(--border-soft)] bg-white/[0.04]')}>
                <div className="flex items-center justify-between gap-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">统一流程</p>
                  <span className={cn('holo-chip rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]', isLight ? 'border-[var(--border-soft)] bg-gold-400/8 text-[var(--accent-deep)]' : 'border-[var(--border-soft)] bg-gold-400/6 text-[var(--accent-soft)]')}>
                    Sync
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-2)]">
                  视频、动作指标与成长报告在同一界面闭环联动，形成清晰可追踪的训练控制链。
                </p>
                <div className="mt-3 space-y-2">
                  {HERO_STREAMS.map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-[var(--text-3)]">
                        <span>{label}</span>
                        <span className={cn('[font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                          {value}%
                        </span>
                      </div>
                      <div className={cn('h-1.5 rounded-full', isLight ? 'bg-[rgba(121,86,25,0.08)]' : 'bg-white/[0.06]')}>
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#8b6417,#f0c661,#fff0b0)] shadow-[0_0_14px_rgba(245,201,92,0.2)]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card
          className={cn(
            'glass-luxury tech-grid-surface glass-prism-panel energy-frame min-h-[540px] rounded-[var(--radius-xl)] xl:min-h-[680px] 2xl:min-h-[720px]',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,234,212,0.92))] shadow-[var(--shadow-strong)]'
              : 'border-[var(--border-soft)] shadow-[var(--shadow-strong)]',
          )}
        >
          <div className="flex h-full flex-col px-5 py-5 md:px-6 md:py-6">
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-gold-400/20 bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#170f05] shadow-[var(--shadow-soft)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-3)]">统一身份接入</p>
                  <CardTitle className="text-[1.6rem] font-bold text-[var(--text-1)] md:text-[1.75rem]">统一身份登录</CardTitle>
                  <p className="max-w-xs text-xs leading-6 text-[var(--text-2)]">
                    家长与教练使用同一入口登录，验证通过后自动进入对应工作区。
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <div
                  className={cn(
                    'holo-chip rounded-full border px-2.5 py-1.5',
                    isLight ? 'border-[var(--border-soft)] bg-white/86' : 'border-[var(--border-soft)] bg-white/[0.05]',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                    <span className={cn('text-xs font-semibold', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                      {theme === 'dark' ? '深色' : '浅色'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-5 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.45),transparent)]" />

            <div className="flex flex-col gap-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2.5">
                  <Label htmlFor="username" className="text-xs font-semibold tracking-[0.06em] text-[var(--text-2)]">
                    账号
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="请输入账号"
                    className="h-11 px-4 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-xs font-semibold tracking-[0.06em] text-[var(--text-2)]">
                    密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="请输入密码"
                    className="h-11 px-4 text-sm"
                    required
                  />
                </div>

                {error ? (
                  <div className={cn('rounded-[var(--radius-md)] border px-3.5 py-3', 'border-[var(--danger)]/30 bg-[var(--danger)]/10')}>
                    <p className="text-xs text-[var(--danger)]">{error}</p>
                  </div>
                ) : null}

                <Button type="submit" className="btn-neon h-12 w-full rounded-[var(--radius-md)] text-sm" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      登录中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      立即登录
                    </span>
                  )}
                </Button>
              </form>

              <div className={cn('glass-prism-panel micro-tile rounded-[var(--radius-lg)] border px-3.5 py-3.5', isLight ? 'border-[var(--border-soft)] bg-white/82' : 'border-[var(--border-soft)] bg-white/[0.04]')}>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">快速登录</p>
                    <h2 className="mt-1.5 text-base font-bold text-[var(--text-1)]">选择演示账号</h2>
                  </div>
                  <p className="max-w-[9rem] text-right text-[11px] leading-5 text-[var(--text-3)]">
                    点击卡片自动填充账号密码
                  </p>
                </div>

                <div className="mt-3 grid gap-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <button
                      key={account.username}
                      type="button"
                      onClick={() => {
                        setUsername(account.username);
                        setPassword(account.password);
                      }}
                      className={cn(
                        'group metric-tile micro-tile relative overflow-hidden rounded-[var(--radius-md)] border px-3.5 py-3.5 text-left transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5',
                        isLight
                          ? 'border-[var(--border-soft)] bg-white/74 hover:border-gold-500/24 hover:bg-white/92 hover:shadow-[var(--shadow-soft)]'
                          : 'border-[var(--border-soft)] bg-white/[0.05] hover:border-gold-400/24 hover:bg-white/[0.07] hover:shadow-[var(--shadow-soft)]',
                      )}
                    >
                      <div className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(255,217,126,0.9),transparent)] opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100" />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-[var(--text-1)]">{account.name}</p>
                            <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-2)]">{account.description}</p>
                          </div>
                          <span className={cn('holo-chip rounded-full border px-2 py-0.5 text-[10px] font-semibold', isLight ? 'border-[var(--border-soft)] bg-gold-400/8 text-[var(--accent-deep)]' : 'border-[var(--border-soft)] bg-gold-400/6 text-[var(--accent-soft)]')}>
                            {account.role === 'parent' ? '家长端' : '教练端'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[var(--text-3)]">
                          <span>
                            账号{' '}
                            <span className={cn('font-semibold [font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                              {account.username}
                            </span>
                          </span>
                          <span>
                            密码{' '}
                            <span className={cn('font-semibold [font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                              {account.password}
                            </span>
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={cn('glass-prism-panel micro-tile rounded-[var(--radius-md)] border px-3.5 py-3 text-xs leading-6 text-[var(--text-2)]', isLight ? 'border-[var(--border-soft)] bg-white/74' : 'border-[var(--border-soft)] bg-white/[0.04]')}>
                验证通过后自动进入对应角色工作区，所有训练数据与成长档案按身份权限展示。
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
