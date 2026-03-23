import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useAuthStore } from '@/store/auth';

type TabItem = {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
  accent?: boolean;
};

type RoleTabsLayoutProps = {
  tabs: TabItem[];
  activeKey: string;
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function RoleTabsLayout({ tabs, activeKey, children, title, subtitle }: RoleTabsLayoutProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col pb-28 md:pb-10">
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[30rem]',
          isLight
            ? 'bg-[radial-gradient(circle_at_top,rgba(210,150,42,0.15),transparent_58%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,217,126,0.15),transparent_60%)]',
        )}
      />
      <div className="pointer-events-none absolute left-[-8%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.14),transparent_62%)] blur-[80px]" />
      <div className="pointer-events-none absolute right-[-10%] top-[16%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.12),transparent_62%)] blur-[88px]" />
      <div className="pointer-events-none absolute bottom-[8%] left-[18%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(245,201,92,0.1),transparent_62%)] blur-[88px]" />

      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8 md:pt-6 lg:px-10">
        <div
          className={cn(
            'tech-grid-surface iridescent-shell energy-frame relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[var(--radius-xl)] border backdrop-blur-2xl',
            isLight
              ? 'border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(246,235,212,0.84))] shadow-[var(--shadow-strong)]'
              : 'border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(10,10,14,0.88),rgba(22,18,11,0.72))] shadow-[var(--shadow-strong)]',
          )}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.7),transparent)]" />
          <div
            className={cn(
              'pointer-events-none absolute right-[-6%] top-[-18%] h-56 w-56 rounded-full blur-[72px]',
              isLight ? 'bg-gold-400/16' : 'bg-gold-400/10',
            )}
          />
          <div className="pointer-events-none absolute left-[10%] top-[-14%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.12),transparent_64%)] blur-[64px]" />
          <div className="pointer-events-none absolute bottom-[-20%] right-[18%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.1),transparent_64%)] blur-[64px]" />
          <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(255,217,126,0.14),transparent)] xl:block" />
          <div className="relative z-10 grid gap-5 px-5 py-5 md:px-7 md:py-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="space-y-3">
              <div
                className={cn(
                  'holo-chip inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em]',
                  isLight ? 'border-[var(--border-soft)] bg-white/75 text-[var(--text-2)]' : 'border-[var(--border-soft)] bg-white/[0.05] text-[var(--text-3)]',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_12px_rgba(245,201,92,0.6)]" />
                青少年篮球训练监测系统
              </div>
              <div className="space-y-1.5">
                <h1 className="max-w-4xl text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[0.96] tracking-[-0.03em] text-[var(--text-1)]">
                  <span className="gradient-text">{title}</span>
                </h1>
                {subtitle ? (
                  <p className="max-w-3xl text-sm leading-6 text-[var(--text-2)] md:text-base">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 xl:items-end">
              <nav
                aria-label="主导航"
                className={cn(
                  'holo-chip hidden items-center gap-1.5 rounded-[var(--radius-md)] border p-1.5 md:flex',
                  isLight
                    ? 'border-[var(--border-soft)] bg-white/75 shadow-[var(--shadow-soft)]'
                    : 'border-[var(--border-soft)] bg-white/[0.05] backdrop-blur-xl',
                )}
              >
                {tabs.map((tab) => (
                  <Link
                    key={tab.key}
                    to={tab.path}
                    aria-current={activeKey === tab.key ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-[var(--radius-sm)] border px-4 py-2.5 text-sm font-semibold transition-all duration-[var(--duration-fast)]',
                      activeKey === tab.key
                        ? 'border-[var(--border-strong)] bg-[linear-gradient(120deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05)),linear-gradient(135deg,rgba(99,220,255,0.16),rgba(255,119,215,0.12),rgba(245,201,92,0.16))] text-[var(--accent-soft)] shadow-[0_12px_24px_rgba(0,0,0,0.14),0_0_18px_rgba(245,201,92,0.1)]'
                        : isLight
                          ? 'border-transparent text-[var(--text-2)] hover:border-[var(--border-soft)] hover:bg-[rgba(126,91,24,0.05)] hover:text-[var(--text-1)]'
                          : 'border-transparent text-[var(--text-3)] hover:border-[var(--border-soft)] hover:bg-white/[0.05] hover:text-[var(--text-1)]',
                    )}
                  >
                    <span className={cn('h-5 w-5 transition-transform duration-[var(--duration-fast)]', activeKey === tab.key ? 'scale-110' : 'group-hover:scale-105')}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </Link>
                ))}
              </nav>

              <Button
                aria-label="退出登录"
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className={cn('rounded-full px-4', isLight && 'bg-white/80')}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-8 pt-5 md:px-7 md:pt-7 lg:px-9">
          <div
            className={cn(
              'tech-grid-surface iridescent-shell energy-frame relative overflow-hidden rounded-[var(--radius-xl)] border p-4 md:p-6 lg:p-7',
              isLight
                ? 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,236,216,0.8))] shadow-[var(--shadow-strong)]'
                : 'border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[var(--shadow-strong)]',
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,217,126,0.06),transparent_26%)]" />
            <div className="pointer-events-none absolute left-[-8%] top-[4%] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(99,220,255,0.1),transparent_64%)] blur-[68px]" />
            <div className="pointer-events-none absolute right-[-6%] bottom-[8%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,119,215,0.1),transparent_64%)] blur-[72px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,217,126,0.1),transparent)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[24%] bg-[radial-gradient(circle_at_center,rgba(255,217,126,0.05),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,217,126,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,126,0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(circle_at_center,black_12%,transparent_78%)]" />
            <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 rounded-tl-[20px] border-l border-t border-gold-400/24" />
            <div className="pointer-events-none absolute right-5 top-5 h-10 w-10 rounded-tr-[20px] border-r border-t border-gold-400/24" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-10 w-10 rounded-bl-[20px] border-b border-l border-gold-400/18" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 rounded-br-[20px] border-b border-r border-gold-400/18" />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </main>

      <nav
        aria-label="移动端导航"
        className={cn(
          'fixed bottom-3 left-3 right-3 z-40 rounded-[var(--radius-lg)] border p-1.5 shadow-[var(--shadow-strong)] backdrop-blur-2xl md:hidden',
          isLight
            ? 'border-[var(--border-soft)] bg-[rgba(255,250,240,0.92)]'
            : 'border-[var(--border-soft)] bg-[rgba(8,8,10,0.85)]',
        )}
      >
        <div className="flex items-center justify-around gap-1.5">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              aria-current={activeKey === tab.key ? 'page' : undefined}
              className={cn(
                'group flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-2.5 text-[11px] font-semibold transition-all duration-[var(--duration-fast)]',
                activeKey === tab.key
                  ? isLight
                    ? 'bg-[rgba(126,91,24,0.08)] text-[var(--accent-deep)]'
                    : 'bg-white/[0.08] text-[var(--accent-soft)]'
                  : isLight
                    ? 'text-[var(--text-3)] hover:bg-[rgba(126,91,24,0.05)] hover:text-[var(--text-1)]'
                    : 'text-[var(--text-3)] hover:bg-white/[0.04] hover:text-[var(--text-1)]',
              )}
            >
              <span className={cn('relative h-5 w-5 transition-transform duration-[var(--duration-fast)]', activeKey === tab.key && 'scale-110')}>
                {tab.icon}
                {activeKey === tab.key && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(245,201,92,0.7)]" />
                )}
              </span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
