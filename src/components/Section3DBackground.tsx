import { useEffect, useRef } from "react";
import { RisingLinesBackground } from "./AmbientBackgrounds";
import { ThinkingDots } from "./ThinkingDots";

export type SectionBackgroundId =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "education"
  | "credentials"
  | "stories"
  | "gallery"
  | "contact";

interface Section3DBackgroundProps {
  sectionId: SectionBackgroundId;
  active?: boolean;
}

export function Section3DBackground({
  sectionId,
  active = false,
}: Section3DBackgroundProps) {
  if (sectionId === "experience") {
    return (
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-0 overflow-hidden ${
          active ? "opacity-85" : "opacity-70"
        }`}
        aria-hidden="true"
      >
        <ThinkingDots />
      </div>
    );
  }

  if (sectionId === "about") {
    return (
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-0 overflow-hidden ${
          active ? "opacity-85" : "opacity-70"
        }`}
        aria-hidden="true"
      >
        <RisingLinesBackground />
      </div>
    );
  }

  return (
    <ArchitecturalCanvasBackground sectionId={sectionId} active={active} />
  );
}

interface ParticleMote {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  pulseSpeed: number;
}

function ArchitecturalCanvasBackground({
  sectionId,
  active = false,
}: Section3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isVisible = true;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible || !active) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animFrameId = 0;

    const startLoop = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      const loop = () => {
        if (!isVisible) return;
        time += 0.016;
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
        render();
        animFrameId = requestAnimationFrame(loop);
      };
      animFrameId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(canvas);

    let time = 0;

    // Sophisticated restrained palette using Muted Blue & Slate Gray
    const themeConfig = {
      home: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "grid",
      },
      about: {
        glowColor: "82, 96, 109", // Slate Gray
        beamColor: "rgba(82, 96, 109, 0.06)",
        moteColor: "130, 144, 157",
        lineColor: "rgba(82, 96, 109, 0.05)",
        perspectiveType: "rings",
      },
      skills: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "matrix",
      },
      experience: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "vault",
      },
      education: {
        glowColor: "82, 96, 109", // Slate Gray
        beamColor: "rgba(82, 96, 109, 0.06)",
        moteColor: "130, 144, 157",
        lineColor: "rgba(82, 96, 109, 0.05)",
        perspectiveType: "arches",
      },
      credentials: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "spotlights",
      },
      stories: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "pipeline",
      },
      gallery: {
        glowColor: "82, 96, 109", // Slate Gray
        beamColor: "rgba(82, 96, 109, 0.06)",
        moteColor: "130, 144, 157",
        lineColor: "rgba(82, 96, 109, 0.05)",
        perspectiveType: "colonnade",
      },
      contact: {
        glowColor: "66, 106, 140", // Muted Blue
        beamColor: "rgba(66, 106, 140, 0.07)",
        moteColor: "115, 145, 172",
        lineColor: "rgba(66, 106, 140, 0.06)",
        perspectiveType: "radar",
      },
    };

    const cfg = themeConfig[sectionId] || themeConfig.home;

    // Gentle atmospheric drifting dust motes (Low Opacity, Non-Distracting)
    const motes: ParticleMote[] = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.2 - 0.05,
      alpha: Math.random() * 0.15 + 0.05,
      pulseSpeed: Math.random() * 0.8 + 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouse.x * 80;
      const cy = height * 0.32 + mouse.y * 50;

      // 1. OVERHEAD VOLUMETRIC LIGHT BEAM (Museum Atrium Grade)
      const grad = ctx.createRadialGradient(
        cx,
        cy - 90,
        25,
        cx,
        height * 0.7,
        width * 0.65
      );
      grad.addColorStop(0, cfg.beamColor);
      grad.addColorStop(0.35, `rgba(${cfg.glowColor}, 0.06)`);
      grad.addColorStop(0.75, `rgba(${cfg.glowColor}, 0.015)`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D ARCHITECTURAL PERSPECTIVE (Atmospheric Depth Lines)
      ctx.strokeStyle = cfg.lineColor;
      ctx.lineWidth = 1.3;

      if (cfg.perspectiveType === "colonnade") {
        // Grand vaulted colonnade ribs receding to horizon
        for (let i = -7; i <= 7; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(width / 2 + i * (width * 0.13), height);
          ctx.stroke();
        }
        for (let a = 1; a <= 4; a++) {
          const archY = cy + a * 75;
          ctx.beginPath();
          ctx.arc(cx, archY, a * 70, Math.PI, 0);
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "vault") {
        // Enterprise cathedral ribs & horizontal tiers
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy - 30);
          ctx.lineTo(width / 2 + i * (width * 0.14), height);
          ctx.stroke();
        }
        for (let t = 1; t <= 4; t++) {
          const y = cy + t * 90;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "grid") {
        // Cyber horizon grid
        for (let i = -8; i <= 8; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(width / 2 + i * (width * 0.12), height);
          ctx.stroke();
        }
        for (let j = 1; j <= 6; j++) {
          const y = cy + (j * j * (height - cy)) / 38;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "rings") {
        // Concentric cosmic orbital rings with rotational drift
        for (let r = 1; r <= 5; r++) {
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy + 40,
            r * 75,
            r * 32,
            time * 0.08,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "matrix") {
        // Matrix floor grid + vertical light streams
        for (let i = -8; i <= 8; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy + 20);
          ctx.lineTo(width / 2 + i * (width * 0.13), height);
          ctx.stroke();
        }
        for (let j = 1; j <= 5; j++) {
          const y = cy + 20 + (j * j * (height - cy - 20)) / 30;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        // Rising subtle matrix data rays
        for (let m = 0; m < 5; m++) {
          const colX = width * (0.16 + m * 0.17) + Math.sin(time + m) * 12;
          const colY = ((time * 70 + m * 150) % height);
          const streamGrad = ctx.createLinearGradient(colX, colY - 70, colX, colY);
          streamGrad.addColorStop(0, "transparent");
          streamGrad.addColorStop(1, "rgba(74, 222, 128, 0.45)");
          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(colX, colY - 70);
          ctx.lineTo(colX, colY);
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "pipeline") {
        // 3D Perspective ETL Pipeline Rails with flowing glowing photon data packets
        for (let i = -5; i <= 5; i++) {
          const startX = cx + i * 35;
          const endX = width / 2 + i * (width * 0.15);
          ctx.strokeStyle = cfg.lineColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(startX, cy);
          ctx.lineTo(endX, height);
          ctx.stroke();

          // Flowing data packets along each rail
          for (let p = 0; p < 2; p++) {
            const progress = ((time * 0.35 + i * 0.15 + p * 0.5) % 1);
            const px = startX + (endX - startX) * progress;
            const py = cy + (height - cy) * progress;
            const pSize = 1.5 + progress * 3.2;
            const pAlpha = Math.sin(progress * Math.PI) * 0.9;

            ctx.fillStyle = `rgba(34, 211, 238, ${pAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (cfg.perspectiveType === "spotlights") {
        // Crossing exhibition spotlights & floor perspective
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy - 60);
          ctx.lineTo(width / 2 + i * (width * 0.15), height);
          ctx.stroke();
        }
      } else if (cfg.perspectiveType === "radar") {
        // Concentric radar sweep rings
        for (let w = 1; w <= 3; w++) {
          const radius = ((w * 85 + time * 55) % 360) + 20;
          const alpha = Math.max(0, 1 - radius / 360) * 0.35;
          ctx.strokeStyle = `rgba(${cfg.glowColor}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(cx, cy + 30, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Crosshair
        ctx.strokeStyle = `rgba(${cfg.glowColor}, 0.15)`;
        ctx.beginPath();
        ctx.moveTo(cx - 120, cy + 30);
        ctx.lineTo(cx + 120, cy + 30);
        ctx.moveTo(cx, cy - 90);
        ctx.lineTo(cx, cy + 150);
        ctx.stroke();
      } else {
        // Classical rotunda arches
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy - 40);
          ctx.lineTo(width / 2 + i * (width * 0.14), height);
          ctx.stroke();
        }
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath();
          ctx.arc(cx, cy + 40, k * 100, Math.PI, 0);
          ctx.stroke();
        }
      }

      // 3. FLOATING LUMINOUS DUST MOTES (Atmospheric Halo Glow)
      motes.forEach((mote) => {
        mote.x += mote.speedX;
        mote.y += mote.speedY;

        if (mote.y < 0) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }
        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;

        const pulse = Math.sin(time * mote.pulseSpeed) * 0.2 + mote.alpha;
        const currentAlpha = Math.max(0.08, pulse * (active ? 1.4 : 1.15));

        // Outer ambient glow halo
        const halo = ctx.createRadialGradient(
          mote.x,
          mote.y,
          0,
          mote.x,
          mote.y,
          mote.size * 2.8
        );
        halo.addColorStop(0, `rgba(${cfg.moteColor}, ${currentAlpha})`);
        halo.addColorStop(1, "transparent");

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spark core
        ctx.fillStyle = `rgba(${cfg.moteColor}, ${Math.min(1, currentAlpha * 1.5)})`;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Initial start if visible
    startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sectionId, active]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-0 ${
        active ? "opacity-100" : "opacity-90"
      }`}
      aria-hidden="true"
    />
  );
}
