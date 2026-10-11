'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform float uCoverageAlpha;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    float ringAmount = ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px);
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }
  // If no ring coverage, immediately discard to guarantee clean background blending
  if (coverage <= 0.0005) {
    gl_FragColor = vec4(0.0);
    return;
  }

  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount * min(coverage * 2.0, 1.0);
  float intensity = max(c.r, max(c.g, c.b));
  vec3 emissiveColor = intensity > 0.0001 ? clamp(c / intensity, 0.0, 1.0) : vec3(0.0);
  vec3 outputColor = mix(emissiveColor, clamp(c, 0.0, 1.0), uCoverageAlpha);
  float baseAlpha = mix(intensity, coverage, uCoverageAlpha);

  // Smooth edge falloff towards canvas bounds to guarantee no hard rectangular edge clipping
  vec2 normCoord = gl_FragCoord.xy / uResolution.xy;
  vec2 edgeDist = min(normCoord, 1.0 - normCoord);
  float edgeFade = smoothstep(0.0, 0.10, min(edgeDist.x, edgeDist.y));
  float radialFade = smoothstep(0.95, 0.70, length(p));
  float boundaryFade = edgeFade * radialFade;

  float outputAlpha = clamp(baseAlpha * boundaryFade * uOpacity, 0.0, 1.0);
  if (outputAlpha <= 0.0005) {
    gl_FragColor = vec4(0.0);
    return;
  }

  gl_FragColor = vec4(outputColor, outputAlpha);
}
`;

export interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  speed?: number;
  ringCount?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
  alphaMode?: 'luminance' | 'coverage';
  className?: string;
  burstTrigger?: number | string;
}

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function MagicRings({
  color = '#426A8C',
  colorTwo = '#7F9CB5',
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
  alphaMode = 'luminance',
  className = '',
  burstTrigger,
}: MagicRingsProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef<Required<Omit<MagicRingsProps, 'className' | 'burstTrigger'>> | null>(null);
  const mouseRef = useRef<[number, number]>([0, 0]);
  const smoothMouseRef = useRef<[number, number]>([0, 0]);
  const hoverAmountRef = useRef(0);
  const isHoveredRef = useRef(false);
  const burstRef = useRef(0);

  useEffect(() => {
    if (burstTrigger !== undefined) {
      burstRef.current = 1.0;
    }
  }, [burstTrigger]);

  propsRef.current = {
    color,
    colorTwo,
    speed,
    ringCount,
    attenuation,
    lineThickness,
    baseRadius,
    radiusStep,
    scaleRate,
    opacity,
    blur,
    noiseAmount,
    rotation,
    ringGap,
    fadeIn,
    fadeOut,
    followMouse,
    mouseInfluence,
    hoverScale,
    parallax,
    clickBurst,
    alphaMode,
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    mount.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true }) ||
               canvas.getContext('webgl', { alpha: true, antialias: true });

    if (!gl) {
      if (mount.contains(canvas)) mount.removeChild(canvas);
      return;
    }

    // Shader compilation
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad geometry (single fullscreen quad)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations lookup
    const u = {
      uTime: gl.getUniformLocation(program, 'uTime'),
      uAttenuation: gl.getUniformLocation(program, 'uAttenuation'),
      uLineThickness: gl.getUniformLocation(program, 'uLineThickness'),
      uBaseRadius: gl.getUniformLocation(program, 'uBaseRadius'),
      uRadiusStep: gl.getUniformLocation(program, 'uRadiusStep'),
      uScaleRate: gl.getUniformLocation(program, 'uScaleRate'),
      uOpacity: gl.getUniformLocation(program, 'uOpacity'),
      uNoiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
      uRotation: gl.getUniformLocation(program, 'uRotation'),
      uRingGap: gl.getUniformLocation(program, 'uRingGap'),
      uFadeIn: gl.getUniformLocation(program, 'uFadeIn'),
      uFadeOut: gl.getUniformLocation(program, 'uFadeOut'),
      uMouseInfluence: gl.getUniformLocation(program, 'uMouseInfluence'),
      uHoverAmount: gl.getUniformLocation(program, 'uHoverAmount'),
      uHoverScale: gl.getUniformLocation(program, 'uHoverScale'),
      uParallax: gl.getUniformLocation(program, 'uParallax'),
      uBurst: gl.getUniformLocation(program, 'uBurst'),
      uCoverageAlpha: gl.getUniformLocation(program, 'uCoverageAlpha'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uColor: gl.getUniformLocation(program, 'uColor'),
      uColorTwo: gl.getUniformLocation(program, 'uColorTwo'),
      uRingCount: gl.getUniformLocation(program, 'uRingCount'),
    };

    let w = mount.clientWidth || 300;
    let h = mount.clientHeight || 300;
    const resize = () => {
      const rect = mount.getBoundingClientRect();
      w = mount.clientWidth || Math.round(rect.width) || window.innerWidth;
      h = mount.clientHeight || Math.round(rect.height) || 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseRef.current[0] = (e.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current[1] = -((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onMouseEnter = () => { isHoveredRef.current = true; };
    const onMouseLeave = () => {
      isHoveredRef.current = false;
      mouseRef.current[0] = 0;
      mouseRef.current[1] = 0;
    };
    const onClick = () => { burstRef.current = 1; };

    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseenter', onMouseEnter);
    mount.addEventListener('mouseleave', onMouseLeave);
    mount.addEventListener('click', onClick);

    let frameId = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let elapsed = 0;
    let lastT = 0;

    const animate = (t: number) => {
      frameId = requestAnimationFrame(animate);
      const p = propsRef.current;
      if (!p) return;

      const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
      lastT = t;
      elapsed += dt * 0.001 * p.speed;

      smoothMouseRef.current[0] += (mouseRef.current[0] - smoothMouseRef.current[0]) * 0.08;
      smoothMouseRef.current[1] += (mouseRef.current[1] - smoothMouseRef.current[1]) * 0.08;
      hoverAmountRef.current += ((isHoveredRef.current ? 1 : 0) - hoverAmountRef.current) * 0.08;
      burstRef.current *= 0.95;
      if (burstRef.current < 0.001) burstRef.current = 0;

      const [r1, g1, b1] = hexToRgb(p.color);
      const [r2, g2, b2] = hexToRgb(p.colorTwo);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.useProgram(program);
      gl.uniform1f(u.uTime, elapsed);
      gl.uniform1f(u.uAttenuation, p.attenuation);
      gl.uniform1f(u.uLineThickness, p.lineThickness);
      gl.uniform1f(u.uBaseRadius, p.baseRadius);
      gl.uniform1f(u.uRadiusStep, p.radiusStep);
      gl.uniform1f(u.uScaleRate, p.scaleRate);
      gl.uniform1i(u.uRingCount, p.ringCount);
      gl.uniform1f(u.uOpacity, p.opacity);
      gl.uniform1f(u.uNoiseAmount, p.noiseAmount);
      gl.uniform1f(u.uRotation, (p.rotation * Math.PI) / 180);
      gl.uniform1f(u.uRingGap, p.ringGap);
      gl.uniform1f(u.uFadeIn, p.fadeIn);
      gl.uniform1f(u.uFadeOut, p.fadeOut);
      gl.uniform2f(u.uResolution, w * dpr, h * dpr);
      gl.uniform2f(u.uMouse, smoothMouseRef.current[0], smoothMouseRef.current[1]);
      gl.uniform1f(u.uMouseInfluence, p.followMouse ? p.mouseInfluence : 0);
      gl.uniform1f(u.uHoverAmount, hoverAmountRef.current);
      gl.uniform1f(u.uHoverScale, p.hoverScale);
      gl.uniform1f(u.uParallax, p.parallax);
      gl.uniform1f(u.uBurst, p.clickBurst ? burstRef.current : 0);
      gl.uniform1f(u.uCoverageAlpha, p.alphaMode === 'coverage' ? 1 : 0);
      gl.uniform3f(u.uColor, r1, g1, b1);
      gl.uniform3f(u.uColorTwo, r2, g2, b2);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && frameId === 0) {
        lastT = 0;
        frameId = requestAnimationFrame(animate);
      }
    };

    const tryStop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseenter', onMouseEnter);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.removeEventListener('click', onClick);
      if (mount.contains(canvas)) mount.removeChild(canvas);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden ${className}`.trim()}
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
}
