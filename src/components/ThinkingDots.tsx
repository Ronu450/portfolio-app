import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  phase: number;
}

export function ThinkingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      console.error("Thinking dots background could not create a 2D canvas.");
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frameId = 0;
    let isVisible = false;
    let elapsed = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const spacing = Math.max(15, Math.min(21, width / 58));
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          dots.push({ x, y, phase: (x * 0.013 + y * 0.009) % (Math.PI * 2) });
        }
      }
      draw(elapsed);
    };

    const draw = (time: number) => {
      elapsed = time;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;

      const scale = Math.min(width, height);
      const t = time * 0.18;
      const lobes = [
        {
          x: width * (0.5 + Math.sin(t * 0.67) * 0.12),
          y: height * (0.48 + Math.cos(t * 0.53) * 0.1),
          radius: scale * 0.22,
        },
        {
          x: width * (0.36 + Math.cos(t * 0.42 + 1.4) * 0.08),
          y: height * (0.53 + Math.sin(t * 0.6 + 1.4) * 0.1),
          radius: scale * 0.17,
        },
        {
          x: width * (0.64 + Math.sin(t * 0.49 + 2.1) * 0.08),
          y: height * (0.45 + Math.cos(t * 0.58 + 2.1) * 0.09),
          radius: scale * 0.18,
        },
      ];

      for (const dot of dots) {
        let density = 0;
        for (const lobe of lobes) {
          const dx = (dot.x - lobe.x) / lobe.radius;
          const dy = (dot.y - lobe.y) / (lobe.radius * 0.78);
          density += Math.exp(-(dx * dx + dy * dy) * 1.6) * 0.82;
        }
        density = Math.min(1, density);

        const ripple = 0.84 + Math.sin(t * 1.2 - dot.phase) * 0.16;
        const alpha = (0.1 + density * 0.56) * ripple;
        const radius = 0.85 + density * 1.15;
        const red = Math.round(107 + density * 79);
        const green = Math.round(133 + density * 73);
        const blue = Math.round(157 + density * 65);

        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.fill();
      }
    };

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const animate = (time: number) => {
      draw(time / 1000);
      frameId = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      stop();
      if (motionPreference.matches || !isVisible) {
        draw(motionPreference.matches ? 0 : elapsed);
        return;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateAnimation();
    });
    visibilityObserver.observe(canvas);
    motionPreference.addEventListener("change", updateAnimation);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionPreference.removeEventListener("change", updateAnimation);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
