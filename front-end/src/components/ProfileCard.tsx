import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StudentProfile } from '@/types';
import { cn } from '@/lib/utils';

export function ProfileCard({ profile, extra }: { profile: StudentProfile; extra?: React.ReactNode }) {
  const roleCopy = {
    parent: {
      specialty: '课堂体态矫正感知强 · 上肢灵活度佳',
      goal: '课堂保持颈肩直立，巩固核心稳定性，并提升下肢对称受力。',
    },
    teacher: {
      specialty: '体态教学经验丰富 · 班级管理节奏稳',
      goal: '构建课堂矫正闭环，保持家校沟通顺畅，并优化异常干预策略。',
    },
    coach: {
      specialty: '动作分解到位 · 训练节奏掌控力强',
      goal: '稳定运动员核心姿态，提升专项力量输出，降低伤病风险。',
    },
  } as const;

  const copy = roleCopy[profile.role] ?? {
    specialty: '体态控制良好 · 具备持续进步潜力',
    goal: '保持姿态稳定与动作协同，逐步提高专项表现。',
  };

  return (
    <Card className="u-card-glass overflow-hidden">
      <CardHeader className="flex flex-col gap-6 md:flex-row md:items-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="avatar-anim h-20 w-20 rounded-[24px] object-cover"
          />
        ) : (
          <div className="avatar-anim flex h-20 w-20 items-center justify-center rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-2)] text-2xl font-semibold text-[var(--accent)]">
            {profile.name?.at(0)}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">
              {profile.role === 'coach' ? '教练档案' : '学生档案'}
            </p>
            <CardTitle className="text-2xl md:text-3xl text-[var(--text-1)]">{profile.name}</CardTitle>
          </div>
          <p className="text-sm text-[var(--text-2)]">
            {profile.role === 'parent' ? '学生档案' : '篮球教练'} · {profile.className ?? profile.teamName ?? '教研组'}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">年龄</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-1)] [font-family:var(--font-data)]">{profile.age}</p>
            </div>
            <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">身高</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-1)] [font-family:var(--font-data)]">{profile.height}cm</p>
            </div>
            <div className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">体重</p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-1)] [font-family:var(--font-data)]">{profile.weight}kg</p>
            </div>
          </div>
        </div>
        {extra ? (
          <div className="max-w-xs rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 text-[var(--text-2)]">
            {extra}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4 border-t border-[var(--border-soft)] pt-6 text-sm leading-7 text-[var(--text-2)] md:grid-cols-2">
        <div className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">特长概览</p>
          <p className="mt-3 text-sm">{profile.role === 'coach' ? '训练特长' : '运动特长'}：{copy.specialty}</p>
        </div>
        <div className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">矫正目标</p>
          <p className="mt-3 text-sm">矫正目标：{copy.goal}</p>
        </div>
      </CardContent>
    </Card>
  );
}
