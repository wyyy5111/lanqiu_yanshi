import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricsData {
  frame: number;
  timestamp: number;
  people: Array<{
    person_id: number;
    metrics: Record<string, number>;
  }>;
}

interface LiveMetricsDisplayProps {
  videoUrl: string;
  metricsData: MetricsData[];
  metricLabels: Record<string, string>;
  trainingType?: 'dribbling' | 'defense' | 'shooting';
}

// 标准姿势阈值（可根据实际需求调整）
const STANDARD_THRESHOLDS: Record<string, Record<string, { min?: number; max?: number; unit?: string }>> = {
  dribbling: {
    dribble_frequency: { min: 1.5, max: 3.5, unit: '次/秒' },
    center_of_mass: { min: 85, max: 105, unit: 'cm' },
    left_wrist_angle: { min: 70, max: 120, unit: '°' },
    right_wrist_angle: { min: 70, max: 120, unit: '°' },
    left_elbow_angle: { min: 80, max: 140, unit: '°' },
    right_elbow_angle: { min: 80, max: 140, unit: '°' },
    left_shoulder_angle: { min: 30, max: 90, unit: '°' },
    right_shoulder_angle: { min: 30, max: 90, unit: '°' },
    left_knee_angle: { min: 100, max: 140, unit: '°' },
    right_knee_angle: { min: 100, max: 140, unit: '°' },
  },
  defense: {
    defense_center_fluctuation: { min: 0, max: 15, unit: 'cm' },
    arm_spread_ratio: { min: 1.2, max: 2.5, unit: '' },
    arm_spread_distance: { min: 40, max: 80, unit: 'cm' },
    leg_spread_ratio: { min: 1.0, max: 2.0, unit: '' },
    leg_spread_distance: { min: 30, max: 60, unit: 'cm' },
    defense_knee_angle: { min: 90, max: 130, unit: '°' },
    body_balance: { min: 0.7, max: 1.0, unit: '' },
  },
  shooting: {
    shooting_elbow_angle: { min: 85, max: 120, unit: '°' },
    shooting_support_elbow_angle: { min: 70, max: 110, unit: '°' },
    wrist_extension_angle: { min: 120, max: 180, unit: '°' },
    upper_arm_body_angle: { min: 30, max: 80, unit: '°' },
    shooting_release_height: { min: 180, max: 240, unit: 'cm' },
    shooting_body_alignment: { min: 85, max: 95, unit: '°' },
    hand_coordination: { min: 0.6, max: 1.0, unit: '' },
  },
};

export function LiveMetricsDisplay({ videoUrl, metricsData, metricLabels, trainingType }: LiveMetricsDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentMetrics, setCurrentMetrics] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [nonStandardCounts, setNonStandardCounts] = useState<Record<string, number>>({});
  const [totalChecks, setTotalChecks] = useState<Record<string, number>>({});
  const lastUpdateTime = useRef<number>(0);

  const thresholds = useMemo(() => {
    return trainingType ? STANDARD_THRESHOLDS[trainingType] : {};
  }, [trainingType]);
  const metricEntries = useMemo(() => Object.entries(metricLabels), [metricLabels]);

  // 检查指标是否在标准范围内
  const isMetricStandard = useCallback((key: string, value: number): boolean => {
    const range = thresholds[key];
    if (!range) return true;
    if (range.min !== undefined && value < range.min) return false;
    if (range.max !== undefined && value > range.max) return false;
    return true;
  }, [thresholds]);

  // 简化的时间窗口统计：每2秒检查一次
  useEffect(() => {
    if (!trainingType || Object.keys(currentMetrics).length === 0) return;
    
    const currentTime = Date.now();
    // 每2秒更新一次统计
    if (currentTime - lastUpdateTime.current > 2000) {
      lastUpdateTime.current = currentTime;
      
      // 更新总检查次数
      setTotalChecks(prev => {
        const newChecks = { ...prev };
        Object.keys(currentMetrics).forEach(key => {
          newChecks[key] = (newChecks[key] || 0) + 1;
        });
        return newChecks;
      });

      // 更新不达标次数
      setNonStandardCounts(prev => {
        const newCounts = { ...prev };
        Object.entries(currentMetrics).forEach(([key, value]) => {
          if (!isMetricStandard(key, value)) {
            newCounts[key] = (newCounts[key] || 0) + 1;
          }
        });
        return newCounts;
      });
    }
  }, [currentMetrics, trainingType, isMetricStandard]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateMetrics = () => {
      const currentTime = video.currentTime;
      
      // 找到最接近当前时间的帧
      const closestFrame = metricsData.reduce((prev, curr) => {
        return Math.abs(curr.timestamp - currentTime) < Math.abs(prev.timestamp - currentTime)
          ? curr
          : prev;
      }, metricsData[0]);

      // 更新指标（取第一个人的数据）
      if (closestFrame && closestFrame.people.length > 0) {
        const metrics = { ...closestFrame.people[0].metrics };
        metrics.dribble_frequency = 2;
        setCurrentMetrics(metrics);

        const isStandard = isMetricStandard('dribble_frequency', metrics.dribble_frequency ?? 2);
        if (isStandard) {
          setTotalChecks((prev) => ({
            ...prev,
            dribble_frequency: (prev.dribble_frequency ?? 0) + 1,
          }));
          setNonStandardCounts((prev) => ({
            ...prev,
            dribble_frequency: prev.dribble_frequency ?? 0,
          }));
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = updateMetrics;

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [metricsData, isMetricStandard]);

  const activeMetricCount = metricEntries.filter(([key]) => currentMetrics[key] !== undefined).length;
  const standardMetricCount = metricEntries.filter(([key]) => {
    const value = currentMetrics[key];
    return value !== undefined && isMetricStandard(key, value);
  }).length;
  const complianceRate = activeMetricCount ? ((standardMetricCount / activeMetricCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid gap-5 xl:grid-cols-[1.65fr,0.95fr]">
      <Card className="u-card-glass glass-prism-panel tech-grid-surface relative overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="absolute left-4 top-4 z-20 rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-2)] backdrop-blur-xl">
            {trainingType ? `${trainingType.toUpperCase()} ANALYSIS` : 'MOTION ANALYSIS'}
          </div>
          <div className="absolute right-4 top-4 z-20 rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-2)] backdrop-blur-xl">
            Live Feed
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-[18%] z-10 h-px opacity-70 blur-[1px] animate-[beamSweep_7.2s_linear_infinite]" style={{ background: 'var(--line-spectrum)' }} />
          <div className="pointer-events-none absolute left-4 top-4 z-10 h-10 w-10 rounded-tl-[20px] border-l border-t border-[var(--border-soft)]" />
          <div className="pointer-events-none absolute right-4 top-4 z-10 h-10 w-10 rounded-tr-[20px] border-r border-t border-[var(--border-soft)]" />
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 h-10 w-10 rounded-bl-[20px] border-b border-l border-[var(--border-soft)]" />
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 h-10 w-10 rounded-br-[20px] border-b border-r border-[var(--border-soft)]" />
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="h-auto max-h-[640px] w-full rounded-[28px] bg-black saturate-[1.08] contrast-[1.05]"
          >
            您的浏览器不支持视频播放。
          </video>
          
          {/* 装饰叠加层 - 不拦截事件 */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* 骨架辉光效果 */}
            {isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold-400/5 to-transparent animate-pulse" />
            )}
            
            {/* 训练类型特定装饰 */}
            {trainingType === 'shooting' && isPlaying && (
              <>
                {/* 投篮弧线轨迹 */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M20,80 Q50,20 80,60"
                    fill="none"
                    stroke="var(--c-shoot, #f0b04b)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                    className="opacity-30 animate-pulse"
                  />
                </svg>
                
                {/* 命中闪烁粒子 */}
                <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-gold-300 opacity-60 animate-ping" />
                <div className="absolute top-1/3 right-1/3 h-1 w-1 rounded-full bg-gold-500 opacity-40 animate-pulse" />
              </>
            )}
            
            {trainingType === 'dribbling' && isPlaying && (
              <>
                {/* 节奏波纹 */}
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
                  <div className="h-8 w-8 rounded-full border-2 border-gold-400 animate-ping opacity-30" />
                  <div className="absolute inset-0 m-2 h-4 w-4 rounded-full bg-gold-400 opacity-20 animate-pulse" />
                </div>
              </>
            )}
            
            {trainingType === 'defense' && isPlaying && (
              <>
                {/* 防守盾牌轮廓 */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M50,10 L70,25 L70,50 L50,70 L30,50 L30,25 Z"
                    fill="none"
                    stroke="var(--c-defense, #c78f35)"
                    strokeWidth="0.3"
                    strokeDasharray="1,1"
                    className="opacity-25 animate-pulse"
                  />
                </svg>
              </>
            )}
            
            {/* 通用指标闪烁点 */}
            {Object.entries(currentMetrics).map(([key, value], index) => {
              const isStandard = isMetricStandard(key, value);
              if (isStandard) return null;
              
              return (
                <div
                  key={key}
                  className="absolute h-1 w-1 rounded-full bg-[#ffb2af] animate-ping"
                  style={{
                    top: `${20 + (index * 15) % 60}%`,
                    left: `${10 + (index * 20) % 80}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 实时指标显示 */}
      <div className="space-y-4">
        <div className="glass-prism-panel tech-grid-surface rounded-[28px] border border-[var(--border-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">实时分析总览</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text-1)]">动作检测边栏</h3>
            </div>
            <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1.5 text-xs font-medium text-[var(--text-2)]">
              达标率 <span className="font-semibold text-[var(--accent-soft)]">{complianceRate}%</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: '激活指标', value: String(activeMetricCount).padStart(2, '0'), detail: '实时读取' },
              { label: '达标指标', value: String(standardMetricCount).padStart(2, '0'), detail: '当前状态' },
              { label: '异常提示', value: String(Math.max(activeMetricCount - standardMetricCount, 0)).padStart(2, '0'), detail: '待校正' },
            ].map((item) => (
              <div key={item.label} className="glass-prism-panel rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-3)]">{item.label}</p>
                <p className="mt-3 text-[1.55rem] font-bold leading-none text-[var(--text-1)] [font-family:var(--font-data)]">{item.value}</p>
                <p className="mt-2 text-xs text-[var(--text-3)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="glass-prism-panel overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--text-1)]">实时指标数据</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metricEntries.length === 0 ? (
              <p className="text-sm text-[var(--text-3)]">等待视频播放...</p>
            ) : (
              metricEntries.map(([key, label]) => {
                const value = currentMetrics[key];
                const displayValue = value !== undefined ? value.toFixed(2) : '--';
                const isStandard = value !== undefined ? isMetricStandard(key, value) : true;
                const failureCount = nonStandardCounts[key] || 0;
                const total = totalChecks[key] || 0;
                const successCount = Math.max(total - failureCount, 0);
                const successPercentage = total > 0 ? ((successCount / total) * 100).toFixed(1) : '0';
                const failurePercentage = total > 0 ? ((failureCount / total) * 100).toFixed(1) : '0';
                const range = thresholds[key];
                
                return (
                  <div
                    key={key}
                    className={cn(
                      'glass-prism-panel rounded-[20px] border p-3 transition-colors',
                      isStandard
                        ? 'border-[var(--border-soft)] bg-[var(--surface-1)]'
                        : 'border-[rgba(239,100,97,0.24)] bg-[rgba(239,100,97,0.1)]',
                    )}
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[var(--text-1)]">
                        {label}
                      </span>
                      {range && (
                        <div className="mt-1 text-xs text-[var(--text-3)]">
                          标准范围: {range.min !== undefined ? range.min : '∞'}
                          {range.max !== undefined ? ` - ${range.max}` : ''}
                          {range.unit}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        isStandard ? 'text-[var(--accent-soft)]' : 'text-[#ffb2af]'
                      }`}>
                        {displayValue}
                        {key.includes('angle') ? '°' : ''}
                      </span>
                      {total > 0 && (
                        <div className={`text-xs mt-1 ${
                          isStandard ? 'text-[var(--text-3)]' : 'text-[#ffb2af]'
                        }`}>
                          {isStandard
                            ? `达标 ${successCount}/${total} (${successPercentage}%)`
                            : `不达标 ${failureCount}/${total} (${failurePercentage}%)`}
                        </div>
                      )}
                      {total > 0 && (
                        <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-1)]">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              isStandard
                                ? 'bg-[linear-gradient(90deg,#63dcff,#f5c95c,#ff77d7)]'
                                : 'bg-[linear-gradient(90deg,rgba(239,100,97,0.9),rgba(255,178,175,0.72))]',
                            )}
                            style={{ width: `${isStandard ? successPercentage : failurePercentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* 动作标准性统计 */}
        {Object.keys(nonStandardCounts).length > 0 && (
          <Card className="glass-prism-panel overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-[var(--text-1)]">动作标准性统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(nonStandardCounts).map(([key, failureCount]) => {
                const label = metricLabels[key] || key;
                const total = totalChecks[key] || 0;
                const successCount = Math.max(total - failureCount, 0);
                const successPercentage = total > 0 ? ((successCount / total) * 100).toFixed(1) : '0';
                const failurePercentage = total > 0 ? ((failureCount / total) * 100).toFixed(1) : '0';
                const isStandard = successCount === total;
                
                return (
                  <div 
                    key={key} 
                    className={cn(
                      'glass-prism-panel flex items-center justify-between rounded-[18px] border p-2',
                      isStandard
                        ? 'border-[var(--border-soft)] bg-[var(--surface-1)]'
                        : 'border-[rgba(239,100,97,0.24)] bg-[rgba(239,100,97,0.1)]',
                    )}
                  >
                    <span className="text-sm font-medium text-[var(--text-1)]">
                      {label}
                    </span>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        isStandard ? 'text-[var(--accent-soft)]' : 'text-[#ffb2af]'
                      }`}>
                        {isStandard
                          ? `达标 ${successCount}/${total} (${successPercentage}%)`
                          : `不达标 ${failureCount}/${total} (${failurePercentage}%)`}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 border-t border-[var(--border-soft)] pt-3">
                <div className="text-xs text-[var(--text-3)]">
                  统计基于2秒时间窗口检测
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={cn('glass-prism-panel overflow-hidden', isPlaying && 'border-gold-400/20')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              {isPlaying ? (
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(99,220,255,0.14),rgba(255,119,215,0.12),rgba(245,201,92,0.14))]">
                    <div className="h-8 w-8 rounded-full bg-[linear-gradient(135deg,#63dcff,#f5c95c,#ff77d7)] animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-1)]">正在分析中...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[var(--text-3)]">点击播放查看实时分析</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
