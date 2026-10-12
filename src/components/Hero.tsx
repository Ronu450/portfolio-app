import {
  ArrowDown,
  MapPin,
  Code,
  Palette,
  Zap,
  ShieldCheck,
  QrCode,
  Sparkles,
  Hand,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import profileFull from "../assets/profile-full.png";
import { smoothScrollToSection } from "../utils/smoothScroll";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Helper component for Animmaster-style 3D split character animations
function SplitCharText({
  text,
  className = "",
  staggerDelay = 0.03,
  hoverable = true,
}: {
  text: string;
  className?: string;
  staggerDelay?: number;
  hoverable?: boolean;
}) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, index) => {
        if (char === " ") {
          return <span key={index} className="inline-block">&nbsp;</span>;
        }
        return (
          <span
            key={index}
            className={`inline-block transition-transform duration-200 ${
              hoverable
                ? "hover:-translate-y-1 hover:scale-125 hover:rotate-3 hover:text-primary cursor-default"
                : ""
            }`}
            style={{
              animation: `char-roll-in 0.65s cubic-bezier(0.2, 0.85, 0.35, 1.15) ${
                index * staggerDelay
              }s backwards`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeRole, setActiveRole] = useState("Full Stack Engineer");
  const [isDragging, setIsDragging] = useState(false);

  // Scramble states for ID Card
  const [idNameScramble, setIdNameScramble] = useState("Ronu Skariah");
  const [idCodeScramble, setIdCodeScramble] = useState("RS-2048-SEC");
  const [idOrgScramble, setIdOrgScramble] = useState(
    "Fintech (Dublin)",
  );
  const [idAuthScramble, setIdAuthScramble] = useState("8829-4109-7721");

  const cardRef = useRef<HTMLDivElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const glareBackRef = useRef<HTMLDivElement>(null);

  // Dynamic Physics State for Drag, Swing, and Pendulum Bounce
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  });
  const animFrameRef = useRef<number | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef<number>(0);

  // Cyber Decrypt utility
  const runScramble = useCallback(
    (
      targetText: string,
      setter: (val: string) => void,
      speed = 25,
      step = 1 / 2,
    ) => {
      const length = targetText.length;
      let iteration = 0;
      const interval = setInterval(() => {
        setter(
          targetText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return targetText[index];
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );

        if (iteration >= length) {
          clearInterval(interval);
          setter(targetText);
        }
        iteration += step;
      }, speed);
    },
    [],
  );

  // Handle Role Selection
  const handleSelectRole = (role: string) => {
    setActiveRole(role);
  };

  // Flip Card with dynamic reverse side decryption
  const handleFlipCard = (flipState: boolean) => {
    setIsFlipped(flipState);
    if (flipState) {
      setTimeout(() => {
        runScramble("Fintech (Dublin)", setIdOrgScramble, 22, 1 / 2);
        runScramble("8829-4109-7721", setIdAuthScramble, 20, 1 / 3);
      }, 250);
    } else {
      setTimeout(() => {
        runScramble("Ronu Skariah", setIdNameScramble, 25, 1 / 2);
        runScramble("RS-2048-SEC", setIdCodeScramble, 22, 1 / 2);
      }, 250);
    }
  };

  // Natural Pendulum Bounce & Oscillation Loop (Damped harmonic oscillator)
  const runSpringBounce = useCallback((initialVx = 0, initialVy = 0) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (initialVx !== 0 || initialVy !== 0) {
      posRef.current.vx = initialVx;
      posRef.current.vy = initialVy;
    }

    const k = 0.078; // Spring restoration
    const damping = 0.918; // Atmospheric pendulum resistance

    const step = () => {
      const state = posRef.current;

      const ax = -k * state.x;
      const ay = -k * state.y;

      state.vx = (state.vx + ax) * damping;
      state.vy = (state.vy + ay) * damping;

      state.x += state.vx;
      state.y += state.vy;

      const card = cardRef.current;
      const lanyard = lanyardRef.current;

      // Inverse Kinematics for Lanyard Strap & Card Top
      const dx = state.x;
      const dy = Math.max(20, state.y + 95);
      const angleRad = Math.atan2(dx, dy);
      const angleDeg = angleRad * (180 / Math.PI);
      const currentDist = Math.hypot(dx, dy);
      const scaleY = currentDist / 95;

      // Card swings in the exact same direction as lanyard with natural inertia
      const cardAngle = angleDeg + state.vx * 0.35;
      const rotY = state.x * 0.16 + state.vx * 0.4;
      const rotX = -state.y * 0.16 - state.vy * 0.4;

      if (card) {
        card.style.transform = `perspective(1200px) translate3d(${state.x}px, ${state.y}px, 50px) rotateZ(${cardAngle}deg) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }
      if (lanyard) {
        lanyard.style.transform = `translateX(-50%) translateZ(20px) rotateZ(${angleDeg}deg) scaleY(${scaleY})`;
      }

      // Stop condition when oscillator reaches resting equilibrium
      if (
        Math.abs(state.x) < 0.2 &&
        Math.abs(state.vx) < 0.2 &&
        Math.abs(state.y) < 0.2 &&
        Math.abs(state.vy) < 0.2
      ) {
        state.x = 0;
        state.y = 0;
        state.vx = 0;
        state.vy = 0;
        if (card) {
          card.style.transform =
            "perspective(1200px) translate3d(0, 0, 0) rotateZ(0deg) rotateY(0deg) rotateX(0deg)";
        }
        if (lanyard) {
          lanyard.style.transform =
            "translateX(-50%) translateZ(20px) rotateZ(0deg) scaleY(1)";
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Quick Nudge Action to bounce the badge
  const triggerNudge = () => {
    posRef.current.x = -65;
    posRef.current.y = 25;
    runSpringBounce(18, -6);
  };

  // Drag & Pointer Physics
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX - posRef.current.x,
      y: clientY - posRef.current.y,
    };
    lastMousePosRef.current = { x: clientX, y: clientY };
    lastMoveTimeRef.current = Date.now();
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (dragStartRef.current) {
      // Actively dragging the badge
      const rawX = clientX - dragStartRef.current.x;
      const rawY = clientY - dragStartRef.current.y;

      const clampedX = Math.max(-190, Math.min(190, rawX));
      const clampedY = Math.max(-110, Math.min(160, rawY));

      const now = Date.now();
      const dt = Math.max(1, now - lastMoveTimeRef.current);
      const vx = ((clientX - lastMousePosRef.current.x) / dt) * 12;
      const vy = ((clientY - lastMousePosRef.current.y) / dt) * 12;

      lastMousePosRef.current = { x: clientX, y: clientY };
      lastMoveTimeRef.current = now;

      posRef.current = {
        x: clampedX,
        y: clampedY,
        vx,
        vy,
      };

      const card = cardRef.current;
      const lanyard = lanyardRef.current;

      // Inverse Kinematics for Lanyard Strap & Card Top
      const dx = clampedX;
      const dy = Math.max(20, clampedY + 95);
      const angleRad = Math.atan2(dx, dy);
      const angleDeg = angleRad * (180 / Math.PI);
      const currentDist = Math.hypot(dx, dy);
      const scaleY = currentDist / 95;

      const cardAngle = angleDeg;
      const rotY = clampedX * 0.16;
      const rotX = -clampedY * 0.16;

      if (card) {
        card.style.transform = `perspective(1200px) translate3d(${clampedX}px, ${clampedY}px, 50px) rotateZ(${cardAngle}deg) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }
      if (lanyard) {
        lanyard.style.transform = `translateX(-50%) translateZ(20px) rotateZ(${angleDeg}deg) scaleY(${scaleY})`;
      }
    } else {
      // Natural 3D Hover tilt when not dragging
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
      const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

      const rotateX = normY * -12;
      const rotateY = normX * 14;
      const swayZ = normX * 4.5;

      card.style.transform = `perspective(1200px) translate3d(0, 0, 0) rotateZ(${swayZ}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;

      if (lanyardRef.current) {
        lanyardRef.current.style.transform = `translateX(-50%) translateZ(20px) rotateZ(${swayZ}deg) scaleY(1)`;
      }

      const activeGlare = isFlipped ? glareBackRef.current : glareRef.current;
      if (activeGlare) {
        activeGlare.style.opacity = "0.65";
        activeGlare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4), transparent 60%)`;
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    const card = cardRef.current;
    const lanyard = lanyardRef.current;
    if (card) {
      card.style.transform =
        "perspective(1200px) translate3d(0, 0, 0) rotateZ(0deg) rotateY(0deg) rotateX(0deg)";
    }
    if (lanyard) {
      lanyard.style.transform =
        "translateX(-50%) translateZ(20px) rotateZ(0deg) scaleY(1)";
    }
    const glare1 = glareRef.current;
    const glare2 = glareBackRef.current;
    if (glare1) glare1.style.opacity = "0";
    if (glare2) glare2.style.opacity = "0";
  };

  const handlePointerUp = () => {
    if (dragStartRef.current) {
      dragStartRef.current = null;
      setIsDragging(false);
      runSpringBounce();
    }
  };

  // Window-level release listener so pointer release outside element is caught
  useEffect(() => {
    const onWindowPointerUp = () => {
      if (dragStartRef.current) {
        dragStartRef.current = null;
        setIsDragging(false);
        runSpringBounce();
      }
    };
    window.addEventListener("mouseup", onWindowPointerUp);
    window.addEventListener("touchend", onWindowPointerUp);
    return () => {
      window.removeEventListener("mouseup", onWindowPointerUp);
      window.removeEventListener("touchend", onWindowPointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [runSpringBounce]);

  // Preference checks
  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const updateVideoPreference = () =>
      setCanPlayVideo(!motionPreference.matches && !compactViewport.matches);

    updateVideoPreference();
    motionPreference.addEventListener("change", updateVideoPreference);
    compactViewport.addEventListener("change", updateVideoPreference);
    return () => {
      motionPreference.removeEventListener("change", updateVideoPreference);
      compactViewport.removeEventListener("change", updateVideoPreference);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent text-foreground transition-colors duration-300">
      <style>{`
        /* ANIMMASTER TEXT ANIMATION SUITE */
        @keyframes char-roll-in {
          0% {
            opacity: 0;
            transform: translateY(22px) rotateX(-90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        /* Continuous Shiny Liquid Shimmer */
        @keyframes liquid-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .shiny-liquid-text {
          background: linear-gradient(
            90deg,
            var(--foreground) 0%,
            var(--primary) 35%,
            #6B8BA6 65%,
            var(--foreground) 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: liquid-shimmer 7s linear infinite;
        }

        /* 3D Flowing Background Marquee */
        .hero-flow-stage {
          position: absolute;
          inset: -40px -100px;
          overflow: hidden;
          pointer-events: none;
          perspective: 900px;
          perspective-origin: 50% 50%;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 28px;
          opacity: 0.18;
          transform: rotateX(18deg) rotateZ(-7deg) scale(1.18);
        }

        .dark .hero-flow-stage {
          opacity: 0.14;
        }

        @keyframes flow-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes flow-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .hero-flow-row {
          display: flex;
          white-space: nowrap;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1;
          user-select: none;
        }

        .flow-row-1 {
          animation: flow-left 30s linear infinite;
          font-size: clamp(3rem, 6vw, 5.5rem);
          -webkit-text-stroke: 1px var(--primary);
          color: var(--primary);
          opacity: 0.25;
        }

        .flow-row-2 {
          animation: flow-right 34s linear infinite;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          color: var(--foreground);
          opacity: 0.28;
        }

        .flow-row-3 {
          animation: flow-left 26s linear infinite;
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          -webkit-text-stroke: 1px var(--primary);
          color: var(--primary);
          opacity: 0.25;
        }

        /* 3D Subtle Foil Effect */
        .holo-shimmer {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(66, 106, 140, 0.15) 25%,
            rgba(82, 96, 109, 0.18) 50%,
            rgba(127, 156, 181, 0.15) 75%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 200%;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .glare-overlay {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
          mix-blend-mode: color-dodge;
          z-index: 30;
        }

        /* 3D ID Card Physics */
        .id-3d-scene {
          perspective: 1200px;
          transform-style: preserve-3d;
          position: relative;
          user-select: none;
        }

        .id-3d-card-body {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: 50% 0%;
          will-change: transform;
        }

        .id-3d-flipper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .id-3d-card-body.flipped .id-3d-flipper {
          transform: rotateY(180deg);
        }

        .id-3d-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          border-radius: 28px;
          overflow: hidden;
        }

        /* 3D Depth Planes */
        .depth-photo {
          transform: translateZ(28px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
        }

        .depth-text {
          transform: translateZ(40px);
        }

        .depth-badge {
          transform: translateZ(52px);
        }

        /* Physical Lanyard & Clip with Synchronous Pivot Alignment */
        .id-3d-lanyard {
          position: absolute;
          left: 50%;
          top: -115px;
          width: 14px;
          height: 95px;
          transform: translateX(-50%) translateZ(20px);
          background: linear-gradient(
            90deg,
            #1e293b 0%,
            var(--primary) 30%,
            var(--primary) 70%,
            #1e293b 100%
          );
          border-radius: 4px 4px 2px 2px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
          z-index: 10;
          transform-origin: 50% 0%;
          will-change: transform;
          pointer-events: none;
        }

        .id-3d-lanyard::before {
          content: "";
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 8px;
          background: #334155;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .id-3d-clip {
          position: absolute;
          left: 50%;
          top: -18px;
          width: 34px;
          height: 24px;
          transform: translateX(-50%) translateZ(25px);
          background: linear-gradient(180deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
          z-index: 25;
          pointer-events: none;
        }

        .id-3d-clip::before {
          content: "";
          position: absolute;
          top: -9px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 11px;
          border: 2.5px solid #cbd5e1;
          border-radius: 50% 50% 0 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .id-3d-clip::after {
          content: "";
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 3px;
          background: #1e293b;
          border-radius: 2px;
        }

        /* Animmaster Kinetic Button Text Rolling Effect */
        .btn-kinetic {
          overflow: hidden;
          position: relative;
        }
        .btn-kinetic span {
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.2, 0.85, 0.35, 1.15);
        }
        .btn-kinetic:hover span {
          transform: translateY(-2px) scale(1.04);
        }
      `}</style>

      {/* 1. 3D FLOWING BACKGROUND TEXT STREAM */}
      <div className="hero-flow-stage" aria-hidden="true">
        <div className="hero-flow-row flow-row-1">
          <span>
            FULL STACK ENGINEER ✦ SPRING BOOT ✦ REACT ✦ PYTHON ✦ HIGH-VOLUME
            APIS ✦ DUBLIN ✦ KERALA ✦ FULL STACK ENGINEER ✦ SPRING BOOT ✦ REACT ✦
            PYTHON ✦
          </span>
        </div>
        <div className="hero-flow-row flow-row-2">
          <span>
            ARCHITECTING SCALABLE SYSTEMS ✦ OAUTH 2.0 ✦ AWS EC2 ✦ AZURE OPENAI
            ✦ AIRFLOW ✦ ARCHITECTING SCALABLE SYSTEMS ✦ OAUTH 2.0 ✦ AWS EC2 ✦
          </span>
        </div>
        <div className="hero-flow-row flow-row-3">
          <span>
            RONU SKARIAH ✦ BANK OF AMERICA ✦ INFOSYS ✦ DATA ANALYTICS ✦ COMPUTER
            SCIENCE ✦ RONU SKARIAH ✦ BANK OF AMERICA ✦ INFOSYS ✦
          </span>
        </div>
      </div>

      {/* Background Video Support - Crisper and clearly visible in both light & dark modes */}
      <video
        autoPlay={canPlayVideo}
        loop
        muted
        playsInline
        preload={canPlayVideo ? "metadata" : "none"}
        poster={profileFull}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-[3px] opacity-65 dark:opacity-45 pointer-events-none z-[2] transition-opacity duration-500"
      >
        {canPlayVideo && <source src="/videos/my-video.mp4" type="video/mp4" />}
      </video>

      {/* Balanced Cinematic Gradient Mask allowing video & flowing text to shine through */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/35 to-background/80 dark:from-background/90 dark:via-background/60 dark:to-background/95 pointer-events-none z-[3] transition-colors duration-500" />

      {/* Main Foreground Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 sm:py-24 md:py-32">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          {/* Left Column: Text & Info Content */}
          <div className="w-full md:col-span-7 text-left space-y-6 sm:space-y-7">
            {/* Location Pill */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary shadow-sm hover:bg-primary/15 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <SplitCharText
                  text="From Kottayam, Kerala • Based in Dublin"
                  hoverable={false}
                  staggerDelay={0.015}
                />
              </div>
            </div>

            {/* Headline with 3D Split Character Stagger & Liquid Shimmer */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                <SplitCharText
                  text="Hi, I'm"
                  className="block text-muted-foreground"
                  staggerDelay={0.04}
                />
                <span className="shiny-liquid-text block">
                  <SplitCharText text="Ronu Skariah" staggerDelay={0.035} />
                </span>
              </h1>
            </div>

            {/* Kinetic Decrypt Role Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { role: "Full Stack Engineer", icon: Code },
                  { role: "Product Designer", icon: Palette },
                  { role: "Creative Thinker", icon: Zap },
                ].map(({ role, icon: IconComponent }, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectRole(role)}
                    className={`group px-3.5 py-2 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                      activeRole === role
                        ? "bg-primary text-primary-foreground border-primary shadow-primary/20 scale-105"
                        : "bg-card border-border hover:border-primary/50 text-foreground hover:-translate-y-0.5"
                    }`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 transition-transform ${
                        activeRole === role
                          ? "rotate-12"
                          : "text-primary group-hover:rotate-12"
                      }`}
                    />
                    <SplitCharText
                      text={role}
                      staggerDelay={0.015}
                      hoverable={false}
                    />
                  </button>
                ))}
              </div>

            </div>

            {/* Action Buttons with Kinetic Text */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => smoothScrollToSection("contact", 1350)}
                className="btn-kinetic px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Get in Touch →</span>
              </button>
              <button
                onClick={() => smoothScrollToSection("experience", 1350)}
                className="btn-kinetic px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-card border border-border hover:border-primary/40 text-foreground font-semibold text-sm sm:text-base hover:bg-muted/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>View Experience</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D INTERACTIVE TANGIBLE CORPORATE ID CARD */}
          <div className="w-full md:col-span-5 flex flex-col items-center lg:items-end justify-center py-6">
            <div
              className={`id-3d-scene w-full max-w-[310px] sm:max-w-[340px] aspect-[4/5.5] ${
                isDragging ? "cursor-grabbing touch-none select-none" : "cursor-grab touch-pan-y"
              }`}
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                if (touch) handlePointerDown(touch.clientX, touch.clientY);
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                if (touch) handlePointerMove(touch.clientX, touch.clientY);
              }}
              onTouchEnd={handlePointerUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Physical Lanyard anchored from top */}
              <div className="id-3d-lanyard" ref={lanyardRef} />

              {/* 3D Card Body with top-center pivot origin */}
              <div
                className={`id-3d-card-body ${isFlipped ? "flipped" : ""}`}
                ref={cardRef}
              >
                {/* Metallic Clip clamped directly to card badge slot */}
                <div className="id-3d-clip" ref={clipRef} />

                <div className="id-3d-flipper">
                  {/* FRONT FACE: Corporate Badge */}
                  <div className="id-3d-face bg-gradient-to-br from-[#2D353E] via-[#20252B] to-[#181C21] text-[#FAFAFA] border border-[#426A8C]/30 shadow-2xl p-6 flex flex-col justify-between">
                    <div className="glare-overlay" ref={glareRef} />
                    <div className="absolute inset-0 holo-shimmer opacity-30" />

                    {/* Top Row: Badge Header & Holographic Seal */}
                    <div className="relative z-10 flex items-center justify-between depth-text">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          CORPORATE ID PASS
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary via-[#5B86A9] to-[#8EAEC9] flex items-center justify-center text-[10px] font-black text-white shadow-md">
                        RS
                      </div>
                    </div>

                    {/* Photo & Identity with 3D Depth Elevation */}
                    <div className="relative z-10 my-auto flex flex-col items-center text-center">
                      <div className="relative w-36 h-36 rounded-2xl overflow-hidden depth-photo border-2 border-white/20 bg-slate-900 group">
                        <img
                          src={profileFull}
                          alt="Ronu Skariah"
                          fetchPriority="high"
                          decoding="async"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-primary border border-white/10 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-primary" />
                          <span>Verified</span>
                        </div>
                      </div>

                      <div className="mt-4 depth-text space-y-1">
                        <h3
                          className="text-xl font-black text-white tracking-tight cursor-pointer hover:text-primary transition-colors font-mono"
                          onMouseEnter={() =>
                            runScramble("Ronu Skariah", setIdNameScramble, 22, 1 / 2)
                          }
                        >
                          {idNameScramble}
                        </h3>
                        <p className="text-xs font-mono text-primary font-semibold">
                          Full Stack Engineer
                        </p>
                      </div>
                    </div>

                    {/* Footer Row: Code & Flip Button */}
                    <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs depth-badge">
                      <div>
                        <span className="block text-[9px] font-mono text-slate-400 uppercase">
                          ACCESS CODE
                        </span>
                        <span
                          className="font-mono text-[11px] font-bold text-white tracking-wider cursor-pointer hover:text-primary transition-colors"
                          onMouseEnter={() =>
                            runScramble("RS-2048-SEC", setIdCodeScramble, 20, 1 / 2)
                          }
                        >
                          {idCodeScramble}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlipCard(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-primary border border-white/15 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-all"
                      >
                        Flip ID ↻
                      </button>
                    </div>
                  </div>

                  {/* BACK FACE: Security Clearance & Organization */}
                  <div
                    className="id-3d-face bg-gradient-to-br from-[#20252B] via-[#1A1F24] to-[#14181B] text-[#FAFAFA] border border-[#426A8C]/40 shadow-2xl p-6 flex flex-col justify-between"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="glare-overlay" ref={glareBackRef} />

                    <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-mono text-primary font-bold">
                        DIGITAL BADGE METRICS
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                        ACTIVE DEPLOY
                      </span>
                    </div>

                    {/* Reverse Info Content with Cyber Decrypt */}
                    <div className="relative z-10 space-y-3 font-mono text-xs text-slate-300">
                      <div
                        className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 cursor-pointer hover:border-primary/40 transition-colors"
                        onMouseEnter={() =>
                          runScramble(
                            "Fintech (Dublin)",
                            setIdOrgScramble,
                            20,
                            1 / 2,
                          )
                        }
                      >
                        <div className="text-[10px] text-slate-400">
                          ORGANIZATION
                        </div>
                        <div className="font-bold text-white tracking-wide">
                          {idOrgScramble}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[10px] text-slate-400">
                          CLEARANCES & TECH
                        </div>
                        <div className="text-[11px] text-primary leading-relaxed">
                          Core Java • Spring Boot • Microservices • React
                        </div>
                      </div>

                      {/* Barcode & Mini QR simulation */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <div
                          className="space-y-1 cursor-pointer"
                          onMouseEnter={() =>
                            runScramble("8829-4109-7721", setIdAuthScramble, 18, 1 / 3)
                          }
                        >
                          <div className="h-6 w-32 bg-[repeating-linear-gradient(90deg,#fff_0px,#fff_2px,#000_2px,#000_5px,#fff_5px,#fff_8px,#000_8px,#000_9px)] rounded opacity-80" />
                          <span className="text-[9px] text-slate-400 font-mono">
                            AUTH: {idAuthScramble}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
                          <QrCode className="w-8 h-8 text-black" />
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlipCard(false);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer hover:scale-105 transition-all shadow-sm"
                      >
                        Flip Front
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Physics Hint & Nudge Trigger */}
            <div className="mt-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-[11px] font-medium text-muted-foreground shadow-sm">
                <Hand className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Drag to swing badge • Release to bounce</span>
              </div>
              <button
                type="button"
                onClick={triggerNudge}
                className="px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-[11px] font-bold text-primary transition-all cursor-pointer"
                title="Trigger a swing & bounce test"
              >
                Flick ⚡
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-12 flex justify-center">
          <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </div>
      </div>
    </section>
  );
}
