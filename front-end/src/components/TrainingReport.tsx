import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentSelector } from '@/components/StudentSelector';
import {
  type AIAnalysisResponse,
  type TrainingReport,
  generateTrainingReport,
  sendReportToParent,
  type MetricsFrame
} from '@/lib/api';
import {
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Star
} from 'lucide-react';

interface TrainingReportProps {
  trainingType: 'shooting' | 'dribbling' | 'defense';
  metrics: MetricsFrame[];
  aiAnalysis: AIAnalysisResponse;
}

interface Student {
  id: string;
  name: string;
  parentId: string;
}

export function TrainingReportComponent({
  trainingType,
  metrics,
  aiAnalysis
}: TrainingReportProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<TrainingReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);

  const getTrainingTypeLabel = () => {
    switch (trainingType) {
      case 'shooting': return '投篮训练';
      case 'dribbling': return '运球训练';
      case 'defense': return '防守训练';
      default: return '训练';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[var(--accent-soft)]';
    if (score >= 60) return 'text-[#ffcf7d]';
    return 'text-[#ffb2af]';
  };

  const handleGenerateReport = async () => {
    if (!selectedStudent) return;

    setGenerating(true);
    try {
      const newReport = await generateTrainingReport(
        selectedStudent.id,
        selectedStudent.name,
        trainingType,
        aiAnalysis,
        metrics
      );
      setReport(newReport);
      setSendStatus(null);
    } catch (error) {
      console.error('生成报告失败:', error);
      setSendStatus({ success: false, message: '报告生成服务暂时不可用，请稍后重试' });
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToParent = async () => {
    if (!report || !selectedStudent) return;

    setSending(true);
    try {
      const result = await sendReportToParent(report.id, selectedStudent.parentId);
      setSendStatus(result);
      if (result.success) {
        setReport({ ...report, sentToParent: true });
      }
    } catch (error) {
      console.error('发送报告失败:', error);
      setSendStatus({ success: false, message: '发送失败，请稍后重试' });
    } finally {
      setSending(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const reportContent = `
${getTrainingTypeLabel()}报告
学员: ${report.studentName}
生成时间: ${new Date(report.timestamp).toLocaleString()}

总体评分: ${report.analysisResult.overallScore}分

分析总结:
${report.analysisResult.summary}

优势方面:
${report.analysisResult.strengths.map(s => `• ${s}`).join('\n')}

需要改进:
${report.analysisResult.improvementAreas.map(a => `• ${a}`).join('\n')}

训练建议:
${report.analysisResult.suggestions.map(s => `• ${s}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getTrainingTypeLabel()}_${report.studentName}_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="u-card-glass relative overflow-hidden">
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#170f05] shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
              <Target className="w-5 h-5" />
            </div>
            <span className="gradient-text">选择学员</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <StudentSelector
            value={selectedStudent?.id}
            onValueChange={(_, student) => setSelectedStudent(student)}
            placeholder="请选择要生成报告的学员"
            className="input-glass"
          />
        </CardContent>
      </Card>

      <Card className="u-card-glass relative overflow-hidden">
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3 text-lg font-semibold text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#7a5614,#f0c661)] text-[#170f05] shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
                <Star className="w-5 h-5" />
              </div>
              <span className="gradient-text">AI智能分析结果</span>
            </span>
            <Badge variant="outline" className={`text-sm font-bold ${getScoreColor(aiAnalysis.overallScore)} border-current bg-current/10`}>
              {aiAnalysis.overallScore}分
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <h4 className="mb-3 text-base font-semibold text-white">分析总结</h4>
            <p className="text-sm leading-relaxed text-[var(--text-2)]">{aiAnalysis.summary}</p>
          </div>

          <div className="u-sep-aurora" />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
                <TrendingUp className="w-5 h-5" />
                优势方面
              </h4>
              <ul className="space-y-2">
                {aiAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/18 text-xs font-bold text-[var(--accent-soft)]">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
                <TrendingDown className="w-5 h-5" />
                需要改进
              </h4>
              <ul className="space-y-2">
                {aiAnalysis.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(242,141,69,0.16)] text-xs font-bold text-[#ffbb87]">!</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <h4 className="mb-3 text-base font-semibold text-white">训练建议</h4>
            <ul className="space-y-2">
              {aiAnalysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/18 text-xs font-bold text-[var(--accent-soft)]">{index + 1}</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="u-card-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-px bg-[linear-gradient(180deg,transparent,rgba(255,217,126,0.9),transparent)]" />
        <CardContent className="relative z-10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedStudent || generating}
              className="btn-neon h-12 rounded-full px-6"
            >
              {generating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  生成中...
                </>
              ) : (
                '生成训练报告'
              )}
            </Button>

            {report && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadReport}
                  className="h-12 rounded-full px-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载报告
                </Button>

                <Button
                  onClick={handleSendToParent}
                  disabled={sending || report.sentToParent}
                  className="btn-neon h-12 rounded-full px-4"
                >
                  {sending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      发送中...
                    </>
                  ) : report.sentToParent ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      已发送
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      发送给家长
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {sendStatus && (
            <div className={`mt-6 flex items-center gap-3 rounded-2xl border-2 p-4 ${
              sendStatus.success
                ? 'border-gold-400/20 bg-gold-400/8 text-[var(--accent-soft)]'
                : 'border-[rgba(239,100,97,0.26)] bg-[rgba(239,100,97,0.1)] text-[#ffb2af]'
            }`}>
              {sendStatus.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{sendStatus.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
