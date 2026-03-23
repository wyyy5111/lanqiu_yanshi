import { useState } from 'react';
import { ArrowLeft, Brain, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoUpload } from '@/components/VideoUpload';
import { LiveMetricsDisplay } from '@/components/LiveMetricsDisplay';
import { TrainingReportComponent } from '@/components/TrainingReport';
import { StudentSelector } from '@/components/StudentSelector';
import { useToast } from '@/components/ui/use-toast';
import { getAnalysisResult, getVideoUrl, analyzeWithAI, generateTrainingReport, sendReportToParent } from '@/lib/api';
import type { MetricsFrame, AIAnalysisResponse } from '@/lib/api';

const METRIC_LABELS = {
  dribble_frequency: '运球频率(次/秒)',
  center_of_mass: '重心高度(cm)',
  left_wrist_angle: '左腕角度',
  right_wrist_angle: '右腕角度',
  left_elbow_angle: '左肘角度',
  right_elbow_angle: '右肘角度',
  left_shoulder_angle: '左肩角度',
  right_shoulder_angle: '右肩角度',
  left_knee_angle: '左膝角度',
  right_knee_angle: '右膝角度',
};

export function Dribbling() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsFrame[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string; name: string; parentId: string} | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [sendingReport, setSendingReport] = useState(false);

  const handleUploadComplete = async (completedTaskId: string) => {
    setTaskId(completedTaskId);

    try {
      // 获取分析结果
      const result = await getAnalysisResult(completedTaskId);
      setMetricsData(result.metrics);

      // 设置视频URL
      setVideoUrl(getVideoUrl(completedTaskId));

      // 自动进行AI分析
      await performAIAnalysis(result.metrics);
    } catch (error) {
      console.error('获取分析结果失败:', error);
    }
  };

  const performAIAnalysis = async (metrics: MetricsFrame[]) => {
    if (metrics.length === 0) return;

    setAnalyzing(true);
    try {
      const analysisResult = await analyzeWithAI({
        trainingType: 'dribbling',
        metrics: metrics,
        videoSummary: '运球动作分析视频'
      });
      setAiAnalysis(analysisResult);
    } catch (error) {
      console.error('AI分析失败:', error);
      toast({
        title: 'AI分析失败',
        description: 'AI分析服务暂时不可用，已使用模拟数据',
        variant: 'destructive',
      });
      // API不可用时显示错误提示
      setAiAnalysis({
        summary: 'AI分析服务暂时不可用，请稍后重试或联系技术支持。',
        suggestions: ['请检查网络连接或联系管理员'],
        improvementAreas: ['AI服务暂时不可用'],
        strengths: ['请稍后重试'],
        overallScore: 0
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendReportToParent = async () => {
    if (!selectedStudent || !aiAnalysis) {
      toast({
        title: '请选择学员',
        description: '请先选择要发送报告的学员',
        variant: 'destructive',
      });
      return;
    }

    setSendingReport(true);
    try {
      // 如果还没有生成报告，先生成
      let currentReportId = reportId;
      if (!currentReportId) {
        const report = await generateTrainingReport(
          selectedStudent.id,
          selectedStudent.name,
          'dribbling',
          aiAnalysis,
          metricsData
        );
        currentReportId = report.id;
        setReportId(currentReportId);
      }

      // 发送报告到家长端
      await sendReportToParent(currentReportId, selectedStudent.parentId);
      
      toast({
        title: '发送成功',
        description: `训练报告已成功发送到${selectedStudent.name}的家长`,
      });
    } catch (error) {
      console.error('发送报告失败:', error);
      toast({
        title: '发送失败',
        description: '发送报告到家长端失败，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setSendingReport(false);
    }
  };

  return (
    <div className="space-y-6 u-dribbling-container relative">
      {/* 运球节奏装饰层 */}
      <div className="u-dribbling-rhythm-board">
        <div className="u-beat-particles"></div>
      </div>
      <div className="u-rhythm-pulse" />

      {/* 金色粒子装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-gold-400/60 animate-float" style={{animationDelay: '0s', animationDuration: '4s'}} />
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-gold-500/40 animate-float" style={{animationDelay: '1s', animationDuration: '5s'}} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 rounded-full bg-gold-400/50 animate-float" style={{animationDelay: '2s', animationDuration: '6s'}} />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-gold-300/30 animate-float" style={{animationDelay: '0.5s', animationDuration: '4.5s'}} />
      </div>

      {/* 金色光晕背景 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-gold-500/10 via-gold-400/5 to-transparent blur-3xl animate-glow-pulse pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/coach/training')}
          className="gap-2 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 hover:bg-gold-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        <h1 className="text-2xl font-bold gradient-text">运球训练分析</h1>
      </div>

      <div className="glass-luxury is-dribble p-6 rounded-2xl border-2 border-gold-500/30 shadow-gold-glow relative z-10">
        <h2 className="mb-2 text-lg font-semibold text-[var(--text-1)]">分析指标</h2>
        <p className="mb-3 text-sm opacity-80 text-[var(--text-2)]">
          本页面将分析以下运球相关指标：
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(METRIC_LABELS).map((label) => (
            <div key={label} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-gold-500/50" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {!taskId ? (
        <VideoUpload onUploadComplete={handleUploadComplete} trainingType="dribbling" />
      ) : (
        <div className="space-y-6 relative z-10">
          {/* AI分析状态显示 */}
          {analyzing && (
            <div className="bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-500/30 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
              <Brain className="w-5 h-5 text-gold-600 dark:text-gold-400 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gold-700 dark:text-gold-300">AI正在分析视频...</p>
                <p className="text-xs text-gold-600/70 dark:text-gold-400/70">这可能需要几秒钟时间</p>
              </div>
            </div>
          )}

          {/* AI分析结果和学员选择 */}
          {aiAnalysis && !showReport && (
            <div className="space-y-4">
              <div className="glass-luxury is-dribble u-ai-card-enter p-6 rounded-2xl border-2 border-gold-500/30 shadow-gold-glow relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 font-medium text-[var(--text-1)]">
                    <Brain className="w-5 h-5 text-gold-500" />
                    AI智能分析结果
                  </h3>
                  <div className="u-progress-ring relative">
                    <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl -z-10 animate-glow-pulse" />
                    <svg>
                      <circle
                        className="u-progress-ring-bg"
                        cx="40"
                        cy="40"
                        r="40"
                      />
                      <circle
                        className="u-progress-ring-progress"
                        cx="40"
                        cy="40"
                        r="40"
                        style={{
                          strokeDashoffset: 251.2 - (251.2 * aiAnalysis.overallScore) / 100
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-[var(--text-1)]">{aiAnalysis.overallScore}</span>
                    </div>
                  </div>
                </div>

                <div className="u-ionic-separator" />

                <div className="u-four-color-grid mb-4">
                  <div className="u-color-tag tag-strength">
                    <h4 className="mb-1 text-sm font-medium text-[var(--text-1)]">优势表现</h4>
                    <p className="text-xs opacity-80 text-[var(--text-2)]">{aiAnalysis.strengths?.[0] || '运球节奏稳定'}</p>
                  </div>
                  <div className="u-color-tag tag-improve">
                    <h4 className="mb-1 text-sm font-medium text-[var(--text-1)]">改进要点</h4>
                    <p className="text-xs opacity-80 text-[var(--text-2)]">{aiAnalysis.improvementAreas?.[0] || '重心控制'}</p>
                  </div>
                  <div className="u-color-tag tag-suggest">
                    <h4 className="mb-1 text-sm font-medium text-[var(--text-1)]">训练建议</h4>
                    <p className="text-xs opacity-80 text-[var(--text-2)]">{aiAnalysis.suggestions?.[0] || '加强基础练习'}</p>
                  </div>
                  <div className="u-color-tag tag-risk">
                    <h4 className="mb-1 text-sm font-medium text-[var(--text-1)]">总结</h4>
                    <p className="text-xs opacity-80 text-[var(--text-2)]">{aiAnalysis.summary}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowReport(true)}
                  size="sm"
                  className="w-full btn-neon u-ripple"
                >
                  查看详细报告
                </Button>
              </div>

              {/* 学员选择和发送报告 */}
              <div className="glass-luxury is-dribble p-6 rounded-2xl border-2 border-gold-500/20">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-[var(--text-1)]">
                  <Send className="w-5 h-5 text-gold-500" />
                  发送训练报告到家长端
                </h3>
                <div className="space-y-4">
                  <div className="focus-ring-gradient">
                    <StudentSelector
                      value={selectedStudent?.id}
                      onValueChange={(_, student) => setSelectedStudent(student)}
                      placeholder="选择学员"
                      className="input-glass"
                    />
                  </div>
                  {selectedStudent && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-500/20">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-[var(--text-1)] text-sm font-bold shadow-lg shadow-gold-500/30">
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--accent-soft)]">{selectedStudent.name}</p>
                        <p className="text-xs text-[var(--text-3)]">已选择学员</p>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleSendReportToParent}
                    disabled={!selectedStudent || sendingReport}
                    className="w-full gap-2 btn-neon u-ripple"
                  >
                    <Send className="w-4 h-4" />
                    {sendingReport ? '发送中...' : '发送到家长端'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 实时指标显示 */}
          <LiveMetricsDisplay
            videoUrl={videoUrl}
            metricsData={metricsData}
            metricLabels={METRIC_LABELS}
            trainingType="dribbling"
          />

          {/* 训练报告 */}
          {showReport && aiAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-1)]">训练报告</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReport(false)}
                >
                  返回分析
                </Button>
              </div>
              <TrainingReportComponent
                trainingType="dribbling"
                metrics={metricsData}
                aiAnalysis={aiAnalysis}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
