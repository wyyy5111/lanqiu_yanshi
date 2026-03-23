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
          'pointer-events-none absolute inset-x-0 top-0 h-[34rem]',
          isLight
            ? 'bg-[radial-gradient(circle_at_top,rgba(210,150,42,0.18),transparent_58%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,217,126,0.18),transparent_60%)]',
        )}
      />

      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8 md:pt-6 lg:px-10">
        <div
          className={cn(
            'tech-grid-surface relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[34px] border backdrop-blur-2xl',
            isLight
              ? 'border-[rgba(126,91,24,0.14)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(246,235,212,0.82))] shadow-[0_20px_44px_rgba(121,86,25,0.12)]'
              : 'border-white/6 bg-[linear-gradient(135deg,rgba(10,10,14,0.82),rgba(22,18,11,0.68))] shadow-[0_24px_60px_rgba(0,0,0,0.32)]',
          )}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.8),transparent)]" />
          <div
            className={cn(
              'pointer-events-none absolute right-[-6%] top-[-18%] h-64 w-64 rounded-full blur-[80px]',
              isLight ? 'bg-gold-400/18' : 'bg-gold-400/12',
            )}
          />
          <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(255,217,126,0.16),transparent)] xl:block" />
          <div className="relative z-10 grid gap-6 px-5 py-6 md:px-8 md:py-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="space-y-4">
              <div
                className={cn(
                  'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-3)]',
                  isLight ? 'border-[rgba(126,91,24,0.16)] bg-white/70' : 'border-white/10 bg-white/[0.04]',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_14px_rgba(245,201,92,0.6)]" />
                青少年篮球训练监测系统
              </div>
              <div className="space-y-2">
                <h1 className="max-w-4xl text-[clamp(2.35rem,4vw,4.4rem)] font-bold leading-[0.96] tracking-[-0.03em] text-[var(--text-1)]">
                  <span className="gradient-text">{title}</span>
                </h1>
                {subtitle ? (
                  <p className="max-w-3xl text-sm leading-6 text-[var(--text-2)] md:text-base">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <nav
                className={cn(
                  'hidden items-center gap-2 rounded-full border p-1.5 md:flex',
                  isLight
                    ? 'border-[rgba(126,91,24,0.14)] bg-white/72 shadow-[0_14px_28px_rgba(121,86,25,0.08)]'
                    : 'border-white/8 bg-white/[0.04] backdrop-blur-xl',
                )}
              >
                {tabs.map((tab) => (
                  <Link
                    key={tab.key}
                    to={tab.path}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                      activeKey === tab.key
                        ? 'border-[rgba(255,217,126,0.28)] bg-[linear-gradient(135deg,rgba(255,248,226,0.2),rgba(255,248,226,0.06))] text-[var(--accent-soft)] shadow-[0_14px_28px_rgba(0,0,0,0.16),0_0_20px_rgba(245,201,92,0.1)]'
                        : isLight
                          ? 'border-transparent text-[var(--text-2)] hover:border-[rgba(126,91,24,0.12)] hover:bg-[rgba(126,91,24,0.05)] hover:text-[var(--text-1)]'
                          : 'border-transparent text-[var(--text-3)] hover:border-white/8 hover:bg-white/[0.05] hover:text-[var(--text-1)]',
                    )}
                  >
                    <span className={cn('h-5 w-5 transition-transform duration-300', activeKey === tab.key ? 'scale-110' : 'group-hover:scale-110')}>
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
                className={cn('rounded-full px-4', isLight && 'bg-white/76')}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-[1500px] px-5 pb-10 pt-6 md:px-8 md:pt-8 lg:px-10">
          <div
            className={cn(
              'tech-grid-surface relative overflow-hidden rounded-[40px] border p-5 md:p-7 lg:p-8',
              isLight
                ? 'border-[rgba(126,91,24,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,236,216,0.78))] shadow-[0_24px_64px_rgba(121,86,25,0.12)]'
                : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_24px_80px_rgba(0,0,0,0.36)]',
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,217,126,0.08),transparent_26%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,217,126,0.12),transparent)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[28%] bg-[radial-gradient(circle_at_center,rgba(255,217,126,0.06),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,217,126,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,126,0.08)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(circle_at_center,black_15%,transparent_80%)]" />
            <div className="pointer-events-none absolute left-6 top-6 h-12 w-12 rounded-tl-[24px] border-l border-t border-gold-400/28" />
            <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 rounded-tr-[24px] border-r border-t border-gold-400/28" />
            <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 rounded-bl-[24px] border-b border-l border-gold-400/20" />
            <div className="pointer-events-none absolute bottom-6 right-6 h-12 w-12 rounded-br-[24px] border-b border-r border-gold-400/20" />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </main>

      <nav
        className={cn(
          'fixed bottom-4 left-4 right-4 z-40 rounded-[28px] border p-2 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl md:hidden',
          isLight
            ? 'border-[rgba(126,91,24,0.14)] bg-[rgba(255,248,236,0.88)]'
            : 'border-white/10 bg-[rgba(8,8,10,0.8)]',
        )}
      >
        <div className="flex items-center justify-around gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              className={cn(
                'group flex min-w-0 flex-1 flex-col items-center gap-2 rounded-[20px] px-2 py-3 text-xs font-semibold transition-all duration-300',
                activeKey === tab.key
                  ? isLight
                    ? 'bg-[rgba(126,91,24,0.06)] text-[var(--accent-soft)]'
                    : 'bg-white/[0.06] text-[var(--accent-soft)]'
                  : isLight
                    ? 'text-[var(--text-3)] hover:bg-[rgba(126,91,24,0.05)] hover:text-[var(--text-1)]'
                    : 'text-[var(--text-3)] hover:bg-white/[0.04] hover:text-[var(--text-1)]',
              )}
            >
              <span className={cn('relative h-6 w-6 transition-transform duration-300', activeKey === tab.key && 'scale-110')}>
                {tab.icon}
                {activeKey === tab.key && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-400 shadow-[0_0_14px_rgba(245,201,92,0.7)]" />
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
