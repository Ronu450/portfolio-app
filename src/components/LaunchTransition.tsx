import { useEffect, useState } from "react";
import { Sparkles, Terminal, Radio } from "lucide-react";

interface LaunchTransitionProps {
  onComplete?: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING 3D PERSPECTIVE CANVASES...",
  "COMPILING ENTERPRISE MICROSERVICES TOPOLOGY...",
  "CALIBRATING MULTI-CLOUD ETL PIPELINE GRAPH...",
  "ESTABLISHING OAUTH 2.0 ZERO-TRUST MESH...",
  "CONFIGURING DUBLIN NODE BEACON [53.3° N, 6.2° W]...",
  "ALL SYSTEMS OPERATIONAL. LAUNCHING PORTFOLIO...",
];

export function LaunchTransition({ onComplete }: LaunchTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 280; // Ultra-fast snappy sequence

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Smooth cubic ease out
      const easedProgress = Math.round(
        (1 - Math.pow(1 - rawProgress, 3)) * 100
      );

      setProgress(easedProgress);

      // Cycle logs smoothly
      const currentLogIdx = Math.min(
        BOOT_LOGS.length - 1,
        Math.floor(rawProgress * BOOT_LOGS.length)
      );
      setLogIndex(currentLogIdx);

      if (rawProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        // Trigger immediate smooth curtain exit
        setIsExiting(true);
        if (onComplete) onComplete();
        setTimeout(() => {
          setIsFinished(true);
        }, 250);
      }
    };

    const animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  if (isFinished) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between pointer-events-auto select-none transition-all duration-300 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Website booting sequence"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Half Curtain */}
      <div
        className={`absolute top-0 inset-x-0 h-1/2 bg-[#20252B] border-b border-[#353E48] transition-transform duration-300 ease-out z-10 ${
          isExiting ? "-translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Bottom Half Curtain */}
      <div
        className={`absolute bottom-0 inset-x-0 h-1/2 bg-[#20252B] border-t border-[#353E48] transition-transform duration-300 ease-out z-10 ${
          isExiting ? "translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Preloader Center Stage Content */}
      <div className="relative z-20 m-auto max-w-lg w-full px-6 text-center space-y-6">
        {/* Logo Monogram */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#426A8C]/30 via-[#5B86A9]/20 to-[#8EAEC9]/20 border-2 border-[#426A8C]/40 flex items-center justify-center shadow-[0_0_30px_rgba(66,106,140,0.25)] group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#426A8C] via-[#5B86A9] to-[#426A8C] blur-md opacity-40 animate-pulse" />
          <span className="relative z-10 font-mono font-black text-2xl text-white tracking-widest">
            RS
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#426A8C] animate-ping" />
        </div>

        {/* Title & Role */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] font-mono font-bold text-primary tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SYSTEM INITIALIZATION // V2.6</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ronu Skariah
          </h1>
          <p className="text-xs sm:text-sm font-mono text-muted-foreground">
            Senior Full Stack Engineer • Systems Architect • Dublin, IE
          </p>
        </div>

        {/* Luminous Numeric Progress Bar */}
        <div className="space-y-2 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-xs font-mono text-primary font-bold">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>BOOTING PLATFORM</span>
            </span>
            <span className="text-base text-white">{progress}%</span>
          </div>

          {/* Progress Track */}
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-primary/30 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#426A8C] via-[#5B86A9] to-[#8EAEC9] transition-all duration-75 relative shadow-[0_0_10px_rgba(66,106,140,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[1px]" />
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Log Ticker */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-[11px] font-mono text-muted-foreground/80 tracking-wide flex items-center gap-2 animate-pulse">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{BOOT_LOGS[logIndex]}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
