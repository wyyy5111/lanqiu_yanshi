import * as React from 'react';
import { cn } from '@/lib/utils';

type BasketballKeypoint = {
  x: number;
  y: number;
  confidence: number;
  name: string;
};

const skeletonPairs: Array<[string, string]> = [
  ['鼻尖', '颈部'],
  ['颈部', '右肩'],
  ['颈部', '左肩'],
  ['右肩', '右肘'],
  ['右肘', '右腕'],
  ['左肩', '左肘'],
  ['左肘', '左腕'],
  ['右肩', '右髋'],
  ['左肩', '左髋'],
  ['右髋', '右膝'],
  ['右膝', '右踝'],
  ['左髋', '左膝'],
  ['左膝', '左踝'],
  ['脊柱', '骨盆'],
];

type VideoPlayerWithOverlayProps = {
  keypoints: BasketballKeypoint[];
  className?: string;
  videoUrl?: string;
  poster?: string;
  dark?: boolean;
  overlayFooter?: React.ReactNode;
  overlayContent?: React.ReactNode;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  sourceSize?: { width: number; height: number };
};

export function VideoPlayerWithOverlay({
  keypoints,
  className,
  videoUrl,
  poster,
  overlayFooter,
  overlayContent,
  videoRef,
  sourceSize,
}: VideoPlayerWithOverlayProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 3;
    context.strokeStyle = '#1f4ab8';
    context.fillStyle = '#1f4ab8';

    const sourceWidth = sourceSize?.width ?? canvas.width;
    const sourceHeight = sourceSize?.height ?? canvas.height;
    if (!sourceWidth || !sourceHeight) return;

    const scaleX = canvas.width / sourceWidth;
    const scaleY = canvas.height / sourceHeight;

    const scaledKeypoints = keypoints.map((kp) => ({
      ...kp,
      x: kp.x * scaleX,
      y: kp.y * scaleY,
    }));

    const getPoint = (name: string) => scaledKeypoints.find((kp) => kp.name === name);

    skeletonPairs.forEach(([startName, endName]) => {
      const start = getPoint(startName);
      const end = getPoint(endName);
      if (!start || !end) return;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    });

    scaledKeypoints.forEach((point) => {
      if (point.confidence < 0.4) return;
      context.beginPath();
      context.globalAlpha = 0.9;
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
  }, [keypoints, sourceSize]);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[16/9] overflow-hidden rounded-[32px] border border-white/8 bg-black shadow-[0_28px_70px_rgba(0,0,0,0.4)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[32px] border border-gold-400/18" />
      <div className="pointer-events-none absolute inset-x-5 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,126,0.8),transparent)]" />
      {videoUrl ? (
        <video
          src={videoUrl}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          ref={videoRef}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,217,126,0.08),transparent_30%),linear-gradient(135deg,#0a0a0c,#141417)]">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-6 py-4 text-center text-sm text-[var(--text-2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="font-semibold">视频回放中</p>
            <p className="mt-1 text-xs opacity-70">无摄像头接入，当前载入最近一次录制的姿态骨架</p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
      {overlayContent ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex h-full items-start justify-end p-4 pointer-events-auto">{overlayContent}</div>
        </div>
      ) : null}
      {overlayFooter ? (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-[22px] border border-white/10 bg-[rgba(5,5,7,0.76)] px-4 py-3 text-xs text-[var(--text-1)] backdrop-blur-xl">
          {overlayFooter}
        </div>
      ) : null}
    </div>
  );
}
