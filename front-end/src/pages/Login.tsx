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
        <div className={cn('absolute left-[4%] top-[6%] h-[420px] w-[420px] rounded-full blur-[120px]', isLight ? 'bg-gold-500/18' : 'bg-gold-400/14')} />
        <div className={cn('absolute bottom-[0%] right-[4%] h-[520px] w-[520px] rounded-full blur-[150px]', isLight ? 'bg-gold-400/16' : 'bg-gold-600/12')} />
        <div className={cn('absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border', isLight ? 'border-gold-600/10' : 'border-gold-400/8')} />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.65),transparent)]" />
      </div>

      <div className="grid w-full max-w-[1380px] items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
        <section
          ref={heroRef}
          className={cn(
            'hero-luxury tech-grid-surface flowline-stage grid min-h-[580px] gap-6 rounded-[40px] border px-5 py-6 md:px-8 md:py-7 xl:min-h-[700px] xl:px-10 xl:py-8 2xl:min-h-[740px]',
            isLight
              ? 'border-[rgba(126,91,24,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,233,210,0.8))] shadow-[0_24px_58px_rgba(121,86,25,0.12)]'
              : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] shadow-[0_30px_90px_rgba(0,0,0,0.42)]',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              className={cn(
                'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-3)]',
                isLight ? 'border-[rgba(126,91,24,0.16)] bg-white/72' : 'border-white/10 bg-white/[0.04]',
              )}
            >
              <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_14px_rgba(245,201,92,0.7)]" />
              青少年篮球训练监测系统
            </div>
            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-2)]',
                isLight ? 'border-gold-500/18 bg-gold-400/12' : 'border-gold-400/15 bg-gold-400/8',
              )}
            >
              实时训练监测平台
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_320px] xl:items-start">
            <div className="space-y-6 xl:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[var(--text-3)]">
                智能动作识别与训练评估
              </p>
              <h1 className="max-w-4xl text-[clamp(2.35rem,3.95vw,4rem)] font-bold leading-[0.92] tracking-[-0.04em]">
                <span className="gradient-text block">多角色协同的</span>
                <span className="mt-2 block text-[var(--text-1)]">篮球动作矫正系统</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--text-2)] md:text-lg">
                面向青少年篮球专项训练的综合平台，整合动作分析、趋势追踪与报告管理，
                <span className="gradient-text font-semibold">让训练结果、成长档案与角色协同形成闭环</span>。
              </p>

              <div className="flex flex-wrap gap-2.5">
                {PLATFORM_FEATURES.map((feature) => (
                  <span
                    key={feature}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium',
                      isLight
                        ? 'border-[rgba(126,91,24,0.14)] bg-white/70 text-[var(--text-1)]'
                        : 'border-white/10 bg-white/[0.04] text-[var(--text-2)]',
                    )}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'tech-grid-surface overflow-hidden rounded-[30px] border px-5 py-5',
                isLight
                  ? 'border-[rgba(126,91,24,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,233,210,0.78))] shadow-[0_20px_40px_rgba(121,86,25,0.1)]'
                  : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))]',
              )}
            >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">实时监测总览</p>
                    <p className="mt-1 text-sm text-[var(--text-2)]">训练数据与协同状态统一显示在同一舞台</p>
                  </div>
                  <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]', isLight ? 'border-gold-500/16 bg-gold-400/10 text-[var(--accent-deep)]' : 'border-gold-400/16 bg-gold-400/8 text-[var(--accent-soft)]')}>
                    Overview
                  </span>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {HERO_SIGNAL_CARDS.map(([label, value, unit]) => (
                      <div
                        key={label}
                        className={cn(
                          'relative overflow-hidden rounded-[22px] border px-4 py-4',
                          isLight
                            ? 'border-[rgba(126,91,24,0.12)] bg-white/74'
                            : 'border-white/8 bg-black/20',
                        )}
                      >
                        <div className="absolute left-0 top-0 h-full w-[3px] bg-[linear-gradient(180deg,rgba(255,217,126,0.18),rgba(255,217,126,0.95),rgba(255,217,126,0.12))]" />
                        <p className="pl-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">{label}</p>
                        <div className="mt-3 flex items-end gap-1.5 pl-2">
                          <strong className="gradient-text text-[1.8rem] font-bold leading-none [font-family:var(--font-data)]">{value}</strong>
                          <span className="pb-1 text-sm text-[var(--text-3)]">{unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {PLATFORM_PILLARS.map(([index, heading, text], pillarIndex) => (
                      <div
                        key={heading}
                        className={cn(
                          'relative overflow-hidden rounded-[22px] border px-4 py-4',
                          pillarIndex === 2 && 'lg:col-span-2',
                          isLight
                            ? 'border-[rgba(126,91,24,0.12)] bg-white/70'
                            : 'border-white/8 bg-white/[0.03]',
                        )}
                      >
                        <p className="text-[11px] font-bold tracking-[0.28em] text-[var(--text-3)] [font-family:var(--font-data)]">{index}</p>
                        <p className="mt-3 text-lg font-semibold text-[var(--text-1)]">{heading}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-2)]">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    className={cn(
                      'rounded-[24px] border px-4 py-4',
                      isLight ? 'border-[rgba(126,91,24,0.12)] bg-white/68' : 'border-white/8 bg-white/[0.03]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">训练监测矩阵</p>
                        <p className="mt-1 text-sm text-[var(--text-2)]">多源数据同步写入分析链路</p>
                      </div>
                      <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]', isLight ? 'border-gold-500/16 bg-gold-400/10 text-[var(--accent-deep)]' : 'border-gold-400/16 bg-gold-400/8 text-[var(--accent-soft)]')}>
                        Matrix
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-end">
                      <div className="grid gap-3">
                        {HERO_FLOW_STEPS.map(([code, title, text]) => (
                          <div
                            key={code}
                            className={cn(
                              'flex items-start gap-3 rounded-[18px] border px-3 py-3',
                              isLight ? 'border-[rgba(126,91,24,0.12)] bg-white/72' : 'border-white/8 bg-black/20',
                            )}
                          >
                            <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border text-[11px] font-bold [font-family:var(--font-data)]', isLight ? 'border-gold-500/16 bg-gold-400/10 text-[var(--accent-deep)]' : 'border-gold-400/16 bg-gold-400/8 text-[var(--accent-soft)]')}>
                              {code}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-[var(--text-1)]">{title}</p>
                              <p className="mt-1 text-xs leading-6 text-[var(--text-2)]">{text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex h-[132px] items-end justify-between gap-1.5 rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3">
                        {HERO_WAVE_BARS.map((height, index) => (
                          <span
                            key={index}
                            className="w-full rounded-full bg-[linear-gradient(180deg,rgba(255,240,176,0.9),rgba(240,198,97,0.68),rgba(139,100,23,0.96))] shadow-[0_0_16px_rgba(245,201,92,0.18)]"
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
                'tech-grid-surface relative self-start overflow-hidden rounded-[30px] border px-5 py-5',
                isLight
                  ? 'border-[rgba(126,91,24,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,233,210,0.82))] shadow-[0_20px_44px_rgba(121,86,25,0.1)]'
                  : 'border-gold-400/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_64px_rgba(0,0,0,0.3)]',
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.65),transparent)]" />
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-3)]">
                <span>训练工作流</span>
                <span className={cn('[font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>24H</span>
              </div>

              <div className="relative mt-4 flex items-center justify-center">
                <div className="tech-orbit h-[220px] w-[220px]">
                  <span className="tech-orbit-dot" style={{ top: '18%', left: '10%' }} />
                  <span className="tech-orbit-dot" style={{ top: '20%', right: '12%', animationDelay: '0.5s' }} />
                  <span className="tech-orbit-dot" style={{ bottom: '18%', left: '16%', animationDelay: '1s' }} />
                  <span className="tech-orbit-dot" style={{ bottom: '14%', right: '18%', animationDelay: '1.4s' }} />

                  <div
                    className={cn(
                      'tech-orbit-core h-[108px] w-[108px] border text-center',
                      isLight
                        ? 'border-[rgba(126,91,24,0.18)] bg-[radial-gradient(circle,rgba(255,250,241,0.98),rgba(243,229,198,0.78))] text-[var(--accent-deep)]'
                        : 'border-gold-400/18 bg-[radial-gradient(circle,rgba(255,245,217,0.18),rgba(255,255,255,0.04))] text-[var(--accent-soft)]',
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">实时协同</span>
                    <strong className="mt-1 text-[1.35rem] font-bold [font-family:var(--font-data)]">AI</strong>
                  </div>

                  {[
                    { label: '动作采集', style: { left: '-4px', top: '38px' } },
                    { label: '指标解析', style: { right: '-8px', top: '92px' } },
                    { label: '结果归档', style: { left: '16px', bottom: '26px' } },
                  ].map((item) => (
                    <span
                      key={item.label}
                      style={item.style}
                      className={cn(
                        'absolute rounded-full border px-3 py-1.5 text-[11px] font-medium',
                        isLight
                          ? 'border-[rgba(126,91,24,0.12)] bg-white/78 text-[var(--text-1)]'
                          : 'border-white/10 bg-black/20 text-[var(--text-2)]',
                      )}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className={cn('rounded-[18px] border px-3 py-3', isLight ? 'border-[rgba(126,91,24,0.12)] bg-white/68' : 'border-white/8 bg-white/[0.04]')}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">回放标注</p>
                  <p className="mt-2 gradient-text text-[1.45rem] font-bold leading-none [font-family:var(--font-data)]">24</p>
                  <p className="mt-1 text-xs text-[var(--text-3)]">帧 / 秒</p>
                </div>
                <div className={cn('rounded-[18px] border px-3 py-3', isLight ? 'border-[rgba(126,91,24,0.12)] bg-white/68' : 'border-white/8 bg-white/[0.04]')}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">链路延迟</p>
                  <p className="mt-2 gradient-text text-[1.45rem] font-bold leading-none [font-family:var(--font-data)]">18</p>
                  <p className="mt-1 text-xs text-[var(--text-3)]">ms</p>
                </div>
              </div>

              <div className={cn('mt-3 rounded-[20px] border px-4 py-4', isLight ? 'border-[rgba(126,91,24,0.12)] bg-white/64' : 'border-white/8 bg-white/[0.03]')}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">统一流程</p>
                  <span className={cn('rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]', isLight ? 'border-gold-500/16 bg-gold-400/10 text-[var(--accent-deep)]' : 'border-gold-400/16 bg-gold-400/8 text-[var(--accent-soft)]')}>
                    Sync
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">
                  视频、动作指标与成长报告在同一界面闭环联动，形成清晰可追踪的训练控制链。
                </p>
                <div className="mt-4 space-y-2.5">
                  {HERO_STREAMS.map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[var(--text-3)]">
                        <span>{label}</span>
                        <span className={cn('[font-family:var(--font-data)]', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                          {value}%
                        </span>
                      </div>
                      <div className={cn('h-2 rounded-full', isLight ? 'bg-[rgba(121,86,25,0.08)]' : 'bg-white/[0.06]')}>
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#8b6417,#f0c661,#fff0b0)] shadow-[0_0_18px_rgba(245,201,92,0.22)]"
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
            'glass-luxury tech-grid-surface min-h-[580px] rounded-[40px] xl:min-h-[720px] 2xl:min-h-[760px]',
            isLight
              ? 'border-[rgba(126,91,24,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,234,212,0.9))] shadow-[0_24px_56px_rgba(121,86,25,0.12)]'
              : 'border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.44)]',
          )}
        >
          <div className="flex h-full flex-col px-6 py-6 md:px-8 md:py-7">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-gold-400/20 bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#170f05] shadow-[0_18px_36px_rgba(0,0,0,0.22),0_0_24px_rgba(245,201,92,0.16)]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">统一身份接入</p>
                  <CardTitle className="text-[1.8rem] font-bold text-[var(--text-1)] md:text-[1.95rem]">统一身份登录</CardTitle>
                  <p className="max-w-xs text-sm leading-7 text-[var(--text-2)]">
                    家长与教练使用同一入口登录，验证通过后自动进入对应工作区。
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <div
                  className={cn(
                    'rounded-full border px-3 py-2',
                    isLight ? 'border-[rgba(126,91,24,0.14)] bg-white/84' : 'border-white/8 bg-white/[0.04]',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                    <span className={cn('text-sm font-semibold', isLight ? 'text-[var(--accent-deep)]' : 'text-[var(--accent-soft)]')}>
                      {theme === 'dark' ? '深色' : '浅色'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.48),transparent)]" />

            <div className="flex flex-col gap-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-sm font-semibold tracking-[0.08em] text-[var(--text-2)]">
                    账号
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="请输入账号"
                    className="h-[3.35rem] px-5 text-[15px]"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold tracking-[0.08em] text-[var(--text-2)]">
                    密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="请输入密码"
                    className="h-[3.35rem] px-5 text-[15px]"
                    required
                  />
                </div>

                {error ? (
                  <div className="rounded-[20px] border border-[rgba(239,100,97,0.26)] bg-[rgba(239,100,97,0.1)] px-4 py-3.5">
                    <p className="text-sm text-[#c84f48] dark:text-[#ffb2af]">{error}</p>
                  </div>
                ) : null}

                <Button type="submit" className="btn-neon h-[3.4rem] w-full rounded-[20px] text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      登录中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      立即登录
                    </span>
                  )}
                </Button>
              </form>

              <div className={cn('rounded-[26px] border px-4 py-4', isLight ? 'border-[rgba(126,91,24,0.14)] bg-white/80' : 'border-white/8 bg-white/[0.03]')}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">快速登录</p>
                    <h2 className="mt-2 text-lg font-bold text-[var(--text-1)]">选择演示账号</h2>
                  </div>
                  <p className="max-w-[10rem] text-right text-xs leading-6 text-[var(--text-3)]">
                    点击卡片自动填充账号密码
                  </p>
                </div>

                <div className="mt-4 grid gap-2.5">
                  {DEMO_ACCOUNTS.map((account) => (
                    <button
                      key={account.username}
                      type="button"
                      onClick={() => {
                        setUsername(account.username);
                        setPassword(account.password);
                      }}
                      className={cn(
                        'group relative overflow-hidden rounded-[22px] border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5',
                        isLight
                          ? 'border-[rgba(126,91,24,0.14)] bg-white/72 hover:border-gold-500/28 hover:bg-white/90 hover:shadow-[0_14px_30px_rgba(121,86,25,0.1)]'
                          : 'border-white/8 bg-white/[0.04] hover:border-gold-400/28 hover:bg-white/[0.06] hover:shadow-[0_16px_32px_rgba(0,0,0,0.24),0_0_22px_rgba(245,201,92,0.12)]',
                      )}
                    >
                      <div className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(255,217,126,0.9),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-1)]">{account.name}</p>
                            <p className="mt-1 text-xs leading-6 text-[var(--text-2)]">{account.description}</p>
                          </div>
                          <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-semibold', isLight ? 'border-gold-500/16 bg-gold-400/10 text-[var(--accent-deep)]' : 'border-gold-400/16 bg-gold-400/8 text-[var(--accent-soft)]')}>
                            {account.role === 'parent' ? '家长端' : '教练端'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-3)]">
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

              <div className={cn('rounded-[22px] border px-4 py-4 text-sm leading-7 text-[var(--text-2)]', isLight ? 'border-[rgba(126,91,24,0.14)] bg-white/72' : 'border-white/8 bg-white/[0.03]')}>
                验证通过后自动进入对应角色工作区，所有训练数据与成长档案按身份权限展示。
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
