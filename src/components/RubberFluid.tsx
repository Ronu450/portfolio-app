import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { cn } from "../lib/utils";

export interface RubberFluidHandle {
  poke: (x?: number, y?: number, strength?: number) => void;
  replay: () => void;
}

export interface RubberFluidProps {
  colors?: [string, string];
  backgroundColor?: string;
  speed?: number;
  scale?: number;
  foldDepth?: number;
  gloss?: number;
  sheen?: number;
  roughness?: number;
  lightAngle?: number;
  contrast?: number;
  waveStrength?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  opacity?: number;
  iterations?: number;
  rotationRate?: number;
  warpPower?: number;
  seedFactor?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  zoom?: number;
  iterationStep?: number;
  drift?: number;
  channelOffset1?: number;
  channelOffset2?: number;
  channelOffset3?: number;
  compression?: number;
  threshold?: number;
  preBrightness?: number;
  preOffset?: number;
  glowIntensity?: number;
  tintR?: number;
  tintG?: number;
  tintB?: number;
  cursorInteraction?: boolean;
  cursorIntensity?: number;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
const finite = (val: number | undefined, fallback: number) =>
  typeof val === "number" && Number.isFinite(val) ? val : fallback;
const degToRad = (deg: number) => (deg * Math.PI) / 180;

const smoothstepVal = (e: number, t: number, a: number) => {
  const r = clamp((a - e) / (t - e), 0, 1);
  return r * r * (3 - 2 * r);
};

const tempColor = new THREE.Color();
const parseRgb = (str: string): [number, number, number] | null => {
  const t = str.trim().toLowerCase();
  if (!t || t === "transparent" || t === "none" || t === "auto") return null;
  const match = /^rgba?\(([^)]+)\)$/i.exec(t);
  if (match) {
    const parts = match[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((p) => Number.parseFloat(p));
    return parts.length > 3 && Number.isFinite(parts[3]) && parts[3] < 0.05
      ? null
      : [(parts[0] ?? 0) / 255, (parts[1] ?? 0) / 255, (parts[2] ?? 0) / 255];
  }
  try {
    tempColor.setStyle(t, THREE.SRGBColorSpace);
  } catch {
    return null;
  }
  return [tempColor.r, tempColor.g, tempColor.b];
};

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const rgbToOklab = ([r, g, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const lr = srgbToLinear(r),
    lg = srgbToLinear(g),
    lb = srgbToLinear(b);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const oklabToOklch = ([L, a, b]: [number, number, number]): [
  number,
  number,
  number
] => [L, Math.hypot(a, b), Math.atan2(b, a)];

const subscribeReducedMotion = (cb: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
};
const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const vertexShader = `
in vec3 position;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uZoom;
uniform float uCount;
uniform vec4 uSteps[20];
uniform vec2 uDrift;
uniform vec3 uPhase;
uniform float uGlow;
uniform float uCompress;
uniform float uPre;
uniform float uPreOff;
uniform float uThresh;
uniform float uGamma;
uniform float uNorm;
uniform float uDepth;
uniform float uGloss;
uniform float uSheen;
uniform float uRough;
uniform vec3 uLight;
uniform vec3 uRim;
uniform vec3 uLchA;
uniform vec3 uLchB;
uniform float uInk;
uniform vec3 uPage;
uniform float uPageL;
uniform float uAlpha;
uniform vec4 uWaves[8];
uniform vec3 uWave;
uniform float uStretch;
out vec4 fragColor;

vec3 fromLch(vec3 lch) {
  vec3 lab = vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
  vec3 lms = mat3(1.0, 1.0, 1.0, 0.3963377774, -0.1055613458, -0.0894841775, 0.2158037573, -0.0638541728, -1.291485548) * lab;
  lms = lms * lms * lms;
  return max(mat3(4.0767416621, -1.2684380046, -0.0041960863, -3.3077115913, 2.6097574011, -0.7034186147, 0.2309699292, -0.3413193965, 1.707614701) * lms, 0.0);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float ring(float tau) {
  return smoothstep(0.0, 0.16, tau) * exp(-tau * uWave.z) * sin(uWave.y * tau);
}

float fold(vec2 st, out vec2 grad) {
  vec2 p = st * uZoom;
  vec2 jx = vec2(uZoom, 0.0);
  vec2 jy = vec2(0.0, uZoom);
  float sumC = 0.0;
  float sumS = 0.0;
  vec2 gradC = vec2(0.0);
  vec2 gradS = vec2(0.0);
  for (int i = 0; i < 20; i++) {
    if (float(i) >= uCount) break;
    vec4 k = uSteps[i];
    vec2 q = (p.yx + uTime) * k.x;
    vec2 sq = sin(q);
    vec2 slope = cos(q) / (1.0 + sq * sq) * k.x * k.y;
    p += atan(sq) * k.y;
    vec2 nx = jx + slope.x * jy;
    jy += slope.y * jx;
    jx = nx;
    float x = p.x + p.y;
    vec2 gx = jx + jy;
    float sx = sin(x);
    float cx = cos(x);
    sumC += cx;
    sumS += sx;
    gradC -= sx * gx;
    gradS += cx * gx;
    p = vec2(k.z * p.x + k.w * p.y, k.z * p.y - k.w * p.x);
    nx = k.z * jx + k.w * jy;
    jy = k.z * jy - k.w * jx;
    jx = nx;
    p += uDrift;
  }
  vec2 base = st * uZoom;
  float r = length(base);
  vec2 gradR = r > 0.0001 ? base * uZoom / r : vec2(0.0);
  vec3 cp = cos(uPhase);
  vec3 sp = sin(uPhase);
  vec3 acc = uGlow * r + cp * sumC - sp * sumS;
  vec3 accX = uGlow * gradR.x + cp * gradC.x - sp * gradS.x;
  vec3 accY = uGlow * gradR.y + cp * gradC.y - sp * gradS.y;
  vec3 a = tanh(acc * acc * uCompress);
  vec3 da = (1.0 - a * a) * 2.0 * acc * uCompress;
  vec3 u = a * uPre - uPreOff;
  vec3 au = max(abs(u), 0.00001);
  vec3 b = au * au * au * au * au;
  vec3 chain = 5.0 * b / au * sign(u) * uPre * da;
  float col = (b.x + b.y + b.z) / 3.0;
  vec2 gradCol = vec2(dot(chain, accX), dot(chain, accY)) / 3.0;
  float lifted = col * uPre - uThresh;
  if (lifted <= 0.0) {
    grad = vec2(0.0);
    return 0.0;
  }
  float v = pow(lifted, 5.0) * uNorm;
  float shaped = 0.734017 * pow(v / 0.734017, uGamma);
  grad = 5.0 * v / lifted * uPre * gradCol * uGamma * shaped / max(v, 0.000001);
  return shaped;
}

void main() {
  vec2 st = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float lift = 0.0;
  vec2 tilt = vec2(0.0);
  vec2 push = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    vec2 d = st - wave.xy;
    float r = length(d);
    float tau = wave.z - r / uWave.x;
    if (tau <= 0.0) continue;
    float s = ring(tau);
    float ds = (ring(tau + 0.004) - ring(max(tau - 0.004, 0.0))) / 0.008;
    float spread = inversesqrt(1.0 + r * 5.0);
    float dspread = -2.5 * spread * spread * spread;
    vec2 dir = d / max(r, 0.0001);
    float w = wave.w * s * spread;
    lift += w;
    push += dir * w;
    tilt += dir * wave.w * (s * dspread - ds * spread / uWave.x);
  }
  lift = 0.3 * tanh(lift / 0.3);
  tilt /= max(1.0, length(tilt) / 3.0);

  vec2 grad;
  float v = fold(st - push * uStretch, grad);
  grad += tilt;
  float height = v + lift * 0.55;

  vec2 g = grad * uDepth;
  g /= 1.0 + length(g) / 0.9;
  vec3 n = normalize(vec3(-g, 1.0));
  vec3 dx = dFdx(n);
  vec3 dy = dFdy(n);
  float variance = 0.5 * (dot(dx, dx) + dot(dy, dy));
  float a2 = clamp(uRough * uRough + min(4.0 * variance, 0.7), 0.0004, 1.0);

  float diffuse = clamp((dot(n, uLight) + 0.5) / 1.5, 0.0, 1.0);
  float level = clamp((uLight.z + 0.5) / 1.5, 0.0, 1.0);
  float lit = diffuse - level;
  float crest = clamp(height / 0.734017, 0.0, 1.25);
  float glow = pow(crest, 0.55);

  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  float keySpec = exp((dot(r, uLight) - 1.0) / (0.004 + a2 * 0.45));
  float rimSpec = exp((dot(r, uRim) - 1.0) / (0.01 + a2 * 0.6));
  float spec = (uGloss * keySpec * 0.9 + uSheen * rimSpec * 0.35) * smoothstep(0.1, 0.8, crest) / (1.0 + 40.0 * variance);
  vec3 sheenTint = mix(vec3(1.0), fromLch(vec3(0.86, min(uLchB.y, 0.12), uLchB.z)), 0.55);

  float tone = clamp(0.15 + glow * 0.7 + lit * 1.2, 0.0, 1.0);
  vec3 lch = mix(uLchA, uLchB, tone);
  float alpha;
  vec3 color;
  if (uInk > 0.5) {
    float rimL = clamp(uLchA.x * 0.7, 0.24, 0.4);
    float rimC = min(uLchA.y, 0.16);
    float fall = clamp(height / 0.275, 0.0, 1.0);
    float swell = clamp((height - 0.275) / 0.459017, 0.0, 1.0);
    float relief = clamp(1.0 + lit * 0.9, 0.7, 1.2);
    float dark = 1.0 - (1.0 - pow(smoothstep(0.14, 1.0, fall), 1.15)) * (1.0 - clamp(-lit * 0.8, 0.0, 0.3));
    vec3 shadow = vec3(mix(uPageL, rimL * relief, dark), rimC * sqrt(dark), uLchA.z);
    vec3 body = vec3(
      mix(rimL, uLchB.x, pow(swell, 0.75)) * relief,
      mix(rimC, uLchB.y, swell),
      mix(uLchA.z, uLchB.z, smoothstep(0.0, 1.0, swell))
    );
    vec3 ink = height < 0.275 ? shadow : body;
    vec3 light = fromLch(ink) + sheenTint * spec * 0.8;
    light = mix(light, 0.72 + 0.28 * (1.0 - exp(-(light - 0.72) / 0.28)), step(0.72, light));
    color = encode(light);
    alpha = clamp(0.70 + 0.30 * crest + spec * 0.35, 0.0, 1.0);
  } else {
    float shade = clamp(0.35 + glow * 0.65 + lit * 0.6, 0.2, 1.35);
    lch.x *= shade;
    lch.y *= mix(1.2, 1.0, clamp(shade, 0.0, 1.0));
    vec3 light = fromLch(lch) + sheenTint * spec;
    light = mix(light, 0.72 + 0.28 * (1.0 - exp(-(light - 0.72) / 0.28)), step(0.72, light));
    color = encode(light);
    alpha = clamp(0.72 + 0.28 * crest + spec * 0.4, 0.0, 1.0);
  }
  color += (ign(gl_FragCoord.xy) - 0.5) / 255.0;
  alpha = clamp(alpha * uAlpha, 0.0, 1.0);
  fragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
`;

export const RubberFluid = forwardRef<RubberFluidHandle, RubberFluidProps>(
  function RubberFluid(
    {
      colors,
      backgroundColor = "transparent",
      speed = 1,
      scale = 1,
      foldDepth = 1,
      gloss = 0.2,
      sheen = 0.12,
      roughness = 0.4,
      lightAngle = 135,
      contrast = 5,
      waveStrength,
      interactive,
      intro = true,
      paused = false,
      dpr = 2,
      opacity = 1,
      iterations = 10,
      rotationRate = 2,
      warpPower = 1.5,
      seedFactor = 1,
      width = "100%",
      height = "100%",
      className,
      style,
      children,
      zoom = 7.5,
      iterationStep = 0.77,
      drift = 3,
      channelOffset1 = 3,
      channelOffset2 = 3,
      channelOffset3 = 2,
      compression = 0.001,
      threshold = 0.3,
      preBrightness = 2.1,
      preOffset = 0.9,
      glowIntensity = 0.8,
      tintR,
      tintG,
      tintB,
      cursorInteraction,
      cursorIntensity,
    },
    ref
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const canvasWrapRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<any>(null);
    const isReduced = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotionSnapshot,
      () => false
    );

    const config = {
      colors: colors ?? null,
      tint:
        tintR !== undefined || tintG !== undefined || tintB !== undefined
          ? [tintR ?? 1, tintG ?? 0.07, tintB ?? 1]
          : null,
      backgroundColor,
      speed,
      scale,
      zoom,
      foldDepth,
      gloss,
      sheen,
      roughness,
      lightAngle,
      contrast,
      waveStrength: waveStrength ?? cursorIntensity ?? 1,
      interactive: interactive ?? cursorInteraction ?? true,
      intro,
      paused,
      dpr,
      opacity,
      iterations,
      iterationStep,
      seedFactor,
      warpPower,
      drift,
      rotationRate,
      channelOffset1,
      channelOffset2,
      channelOffset3,
      compression,
      threshold,
      preBrightness,
      preOffset,
      glowIntensity,
      reduced: isReduced,
    };

    const configRef = useRef(config);
    useEffect(() => {
      configRef.current = config;
      instanceRef.current?.sync();
    });

    useEffect(() => {
      const root = rootRef.current;
      const wrap = canvasWrapRef.current;
      if (!root || !wrap) return;

      const initEngine = (
        el: HTMLElement,
        holder: HTMLElement,
        cfgRef: React.MutableRefObject<any>
      ) => {
        let renderer: THREE.WebGLRenderer;
        const doc = el.ownerDocument;
        const win = doc.defaultView ?? window;
        const canvas = doc.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            premultipliedAlpha: false,
            antialias: false,
            powerPreference: "high-performance",
          });
        } catch {
          return null;
        }

        renderer.setClearColor(0, 0);
        holder.appendChild(canvas);

        const stepsVecs = Array.from({ length: 20 }, () => new THREE.Vector4());
        const wavesVecs = Array.from({ length: 8 }, () => new THREE.Vector4());

        const uniforms = {
          uRes: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uZoom: { value: 7.5 },
          uCount: { value: 10 },
          uSteps: { value: stepsVecs },
          uDrift: { value: new THREE.Vector2(3, 3) },
          uPhase: { value: new THREE.Vector3(3, 3, 2) },
          uGlow: { value: 0.8 },
          uCompress: { value: 0.001 },
          uPre: { value: 2.1 },
          uPreOff: { value: 0.9 },
          uThresh: { value: 0.3 },
          uGamma: { value: 1 },
          uNorm: { value: 1 },
          uDepth: { value: 0.1 },
          uGloss: { value: 0.6 },
          uSheen: { value: 0.5 },
          uRough: { value: 0.35 },
          uLight: { value: new THREE.Vector3(0, 0, 1) },
          uRim: { value: new THREE.Vector3(0, 0, 1) },
          uLchA: { value: new THREE.Vector3() },
          uLchB: { value: new THREE.Vector3() },
          uInk: { value: 0 },
          uPage: { value: new THREE.Vector3(1, 1, 1) },
          uPageL: { value: 1 },
          uAlpha: { value: 1 },
          uWaves: { value: wavesVecs },
          uWave: { value: new THREE.Vector3(0.55, 2 * Math.PI, 1.4) },
          uStretch: { value: 0.25 },
        };

        const material = new THREE.ShaderMaterial({
          glslVersion: THREE.GLSL3,
          vertexShader,
          fragmentShader,
          uniforms,
          blending: THREE.NoBlending,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const quadGeo = new THREE.BufferGeometry();
        quadGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
            3
          )
        );

        const mesh = new THREE.Mesh(quadGeo, material);
        mesh.frustumCulled = false;
        const scene = new THREE.Scene();
        scene.add(mesh);

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

        let vpW = 0;
        let vpH = 0;
        let isReady = false;
        let lastColorKey = "";
        let lastStepKey = "";
        let lastColorCheck = -Infinity;
        let animTime = 0;
        let elapsedReal = 0;
        let targetTight = 0;
        let currentTight = 0;
        let tightVelocity = 0;
        let introProgress = 1;
        let introVelocity = 0;
        let introAlpha = 1;
        let introTimeElapsed = 0;
        let isIntroRunning = false;
        let rafId = 0;
        let lastTimestamp = 0;
        let isDestroyed = false;
        let isCtxLost = false;
        let isVisible = true;
        let activeTouch: { id: number; x: number; y: number; time: number } | null = null;
        const waves: { x: number; y: number; born: number; strength: number }[] = [];

        const resize = () => {
          const cfg = cfgRef.current;
          const rect = el.getBoundingClientRect();
          const w =
            Math.round(el.clientWidth) ||
            Math.round(rect.width) ||
            win.innerWidth;
          const h =
            Math.round(el.clientHeight) ||
            Math.round(rect.height) ||
            win.innerHeight;
          if (w < 2 || h < 2) {
            isReady = false;
            return false;
          }
          const dprVal = Math.min(
            win.devicePixelRatio || 1,
            clamp(finite(cfg.dpr, 2), 0.5, 3)
          );
          if (isReady && w === vpW && h === vpH && renderer.getPixelRatio() === dprVal)
            return false;

          isReady = true;
          vpW = w;
          vpH = h;
          renderer.setPixelRatio(dprVal);
          renderer.setSize(vpW, vpH, false);
          const buf = renderer.getDrawingBufferSize(new THREE.Vector2());
          uniforms.uRes.value.copy(buf);
          return true;
        };

        const renderFrame = () => {
          if (!isReady) return;
          const cfg = cfgRef.current;

          if (performance.now() - lastColorCheck > 1000) {
            lastColorCheck = performance.now();
            // Colors update
            const bgRgb =
              parseRgb(cfg.backgroundColor) ??
              (() => {
                let cur: HTMLElement | null = el.parentElement;
                while (cur) {
                  const m = win
                    .getComputedStyle(cur)
                    .backgroundColor.match(/rgba?\(([^)]+)\)/);
                  if (m) {
                    const pts = m[1]
                      .split(/[\s,/]+/)
                      .filter(Boolean)
                      .map((p) => Number.parseFloat(p));
                    if (pts.length < 4 || pts[3] > 0.05) {
                      return [pts[0] / 255, pts[1] / 255, pts[2] / 255] as [
                        number,
                        number,
                        number
                      ];
                    }
                  }
                  cur = cur.parentElement;
                }
                return win.matchMedia("(prefers-color-scheme: dark)").matches
                  ? ([0.04, 0.04, 0.04] as [number, number, number])
                  : ([1, 1, 1] as [number, number, number]);
              })();

            const isLight =
              0.2126 * bgRgb[0] + 0.7152 * bgRgb[1] + 0.0722 * bgRgb[2] > 0.55;
            const cKey = [
              bgRgb.join(","),
              cfg.colors?.join(",") ?? "",
              cfg.tint?.join(",") ?? "",
            ].join("|");

            if (cKey !== lastColorKey) {
              lastColorKey = cKey;
              let col1: [number, number, number];
              let col2: [number, number, number];

              if (cfg.colors) {
                col1 = rgbToOklab(
                  parseRgb(cfg.colors[0]) ?? [0.26, 0.42, 0.55]
                );
                col2 = rgbToOklab(
                  parseRgb(cfg.colors[1]) ?? [0.32, 0.49, 0.62]
                );
              } else if (cfg.tint) {
                const tr = rgbToOklab([
                  clamp(cfg.tint[0], 0, 1),
                  clamp(cfg.tint[1], 0, 1),
                  clamp(cfg.tint[2], 0, 1),
                ]);
                col1 = [0.6 * tr[0], tr[1], tr[2]];
                col2 = tr;
              } else {
                col1 = rgbToOklab(parseRgb("#426A8C") ?? [0.26, 0.42, 0.55]);
                col2 = rgbToOklab(parseRgb("#527C9F") ?? [0.32, 0.49, 0.62]);
              }

              let lchA = oklabToOklch(col1);
              let lchB = oklabToOklch(col2);

              if (lchA[1] < 0.02) lchA[2] = lchB[2];
              if (lchB[1] < 0.02) lchB[2] = lchA[2];

              let diff = lchB[2] - lchA[2];
              diff -= Math.round(diff / (2 * Math.PI)) * Math.PI * 2;
              lchB[2] = lchA[2] + diff;

              if (isLight) {
                lchA[0] = clamp(0.86 * lchA[0], 0.28, 0.7);
                lchA[1] = Math.min(1.12 * lchA[1], 0.32);
                lchB[0] = clamp(0.86 * lchB[0], 0.28, 0.7);
                lchB[1] = Math.min(1.12 * lchB[1], 0.32);
              }

              uniforms.uLchA.value.set(lchA[0], lchA[1], lchA[2]);
              uniforms.uLchB.value.set(lchB[0], lchB[1], lchB[2]);
              uniforms.uInk.value = isLight ? 1 : 0;
              uniforms.uPage.value.set(bgRgb[0], bgRgb[1], bgRgb[2]);
              uniforms.uPageL.value = rgbToOklab(bgRgb)[0];
            }
          }

          const iters = clamp(finite(cfg.iterations, 10), 1, 20);
          const itStep = finite(cfg.iterationStep, 0.77);
          const seedF = finite(cfg.seedFactor, 1);
          const warpP = clamp(finite(cfg.warpPower, 1.5), 0, 6);
          const rotR = finite(cfg.rotationRate, 2);
          const stepKey = [iters, itStep, seedF, warpP, rotR].join("|");

          if (stepKey !== lastStepKey) {
            lastStepKey = stepKey;
            for (let i = 0; i < 20; i++) {
              const t = (i + 0.3) * itStep;
              const a = Math.cos(0.05 * t) * Math.tanh(t) * seedF;
              const frac = a - Math.floor(a);
              const uVal = Math.min(1 / Math.pow(frac + 0.001, warpP), 40);
              stepsVecs[i].set(
                frac,
                uVal,
                Math.cos(t * rotR),
                Math.sin(t * rotR)
              );
            }
            uniforms.uCount.value = clamp(Math.ceil(iters - 0.3), 1, 20);
          }

          const sc = clamp(finite(cfg.scale, 1), 0.2, 5);
          const zm = clamp(finite(cfg.zoom, 7.5), 0.5, 40);
          const lAng = degToRad(finite(cfg.lightAngle, 135));
          const elev = degToRad(58);
          const rimElev = degToRad(28);
          const introFactor = 1 - 0.08 * (1 - introProgress);

          uniforms.uTime.value = animTime;
          uniforms.uZoom.value = (zm / sc) * introFactor;
          uniforms.uDrift.value.setScalar(finite(cfg.drift, 3));
          uniforms.uPhase.value.set(
            finite(cfg.channelOffset1, 3),
            finite(cfg.channelOffset2, 3),
            finite(cfg.channelOffset3, 2)
          );
          uniforms.uGlow.value = clamp(finite(cfg.glowIntensity, 0.8), 0, 5);
          uniforms.uCompress.value = clamp(
            finite(cfg.compression, 0.001),
            0.00001,
            1
          );
          uniforms.uPre.value = clamp(finite(cfg.preBrightness, 2.1), 0.1, 10);
          uniforms.uPreOff.value = clamp(finite(cfg.preOffset, 0.9), -5, 5);
          uniforms.uThresh.value = clamp(finite(cfg.threshold, 0.3), -2, 2);

          const preAbs = Math.pow(
            Math.max(Math.abs(uniforms.uPreOff.value), 0.0001),
            5
          );
          const testB = preAbs * uniforms.uPre.value - uniforms.uThresh.value;
          const power5 = testB > 0.0001 ? Math.pow(testB, 5) : 0;
          uniforms.uNorm.value =
            power5 > 0 ? clamp(0.7340172379846278 / power5, 0.001, 1000) : 1;
          uniforms.uGamma.value = clamp(finite(cfg.contrast, 5), 1, 20) / 5;
          uniforms.uDepth.value =
            0.1 *
            clamp(finite(cfg.foldDepth, 1), 0, 4) *
            Math.max(introProgress, 0) *
            (1 - 0.06 * currentTight);
          uniforms.uGloss.value =
            clamp(finite(cfg.gloss, 0.2), 0, 3) * (1 + 0.2 * currentTight);
          uniforms.uSheen.value =
            clamp(finite(cfg.sheen, 0.12), 0, 3) * (1 + 0.15 * currentTight);
          uniforms.uRough.value =
            clamp(finite(cfg.roughness, 0.4), 0.02, 1) *
            (1 - 0.35 * currentTight);

          uniforms.uLight.value.set(
            Math.cos(lAng) * Math.cos(elev),
            Math.sin(lAng) * Math.cos(elev),
            Math.sin(elev)
          );
          uniforms.uRim.value.set(
            -Math.cos(lAng) * Math.cos(rimElev),
            -Math.sin(lAng) * Math.cos(rimElev),
            Math.sin(rimElev)
          );
          uniforms.uAlpha.value =
            clamp(finite(cfg.opacity, 1), 0, 1) * introAlpha;

          for (let i = 0; i < 8; i++) {
            const w = waves[i];
            if (w) {
              const age = elapsedReal - w.born;
              const falloff = 1 - smoothstepVal(3.15, 4.5, age);
              wavesVecs[i].set(w.x, w.y, age, 0.1 * w.strength * falloff);
            } else {
              wavesVecs[i].set(0, 0, 0, 0);
            }
          }

          renderer.render(scene, camera);
        };

        const scheduleTick = () => {
          if (isDestroyed || isCtxLost || !isVisible || rafId) return;
          rafId = requestAnimationFrame(onTick);
        };

        const onTick = (ts: number) => {
          rafId = 0;
          if (isDestroyed || isCtxLost) return;

          const cfg = cfgRef.current;
          const dt =
            lastTimestamp && ts - lastTimestamp < 100
              ? Math.min(Math.max((ts - lastTimestamp) / 1000, 0), 0.05)
              : 1 / 60;
          lastTimestamp = ts;

          const isMoving = !cfg.reduced && !cfg.paused;
          if (isMoving) {
            animTime += dt * clamp(finite(cfg.speed, 1), 0, 5) * 0.25;
          }
          elapsedReal += dt;

          for (let i = waves.length - 1; i >= 0; i--) {
            if (elapsedReal - waves[i].born >= 4.5) waves.splice(i, 1);
          }

          if (cfg.reduced) {
            currentTight = targetTight;
            tightVelocity = 0;
          } else {
            tightVelocity +=
              (-49 * (currentTight - targetTight) - 14 * tightVelocity) * dt;
            currentTight += tightVelocity * dt;
          }

          if (isIntroRunning) {
            const frac = clamp((introTimeElapsed += dt) / 1.3, 0, 1);
            introAlpha = 1 - Math.pow(1 - frac, 3);
            introVelocity +=
              (-27.04 * (introProgress - 1) - 6.24 * introVelocity) * dt;
            introProgress += introVelocity * dt;

            if (
              frac >= 1 &&
              Math.abs(introProgress - 1) < 0.0005 &&
              Math.abs(introVelocity) < 0.0005
            ) {
              isIntroRunning = false;
              introProgress = 1;
              introVelocity = 0;
              introAlpha = 1;
            }
          }

          renderFrame();

          const needsLoop =
            Math.abs(currentTight - targetTight) + Math.abs(tightVelocity) >
              0.0005 ||
            waves.length > 0 ||
            isIntroRunning;

          if ((isMoving || needsLoop) && !doc.hidden) {
            rafId = requestAnimationFrame(onTick);
          } else {
            lastTimestamp = 0;
          }
        };

        const addWave = (x: number, y: number, strength: number) => {
          if (strength <= 0) return;
          if (waves.length >= 8) waves.shift();
          waves.push({ x, y, born: elapsedReal, strength });
          lastTimestamp = 0;
          scheduleTick();
        };

        const triggerInteraction = (clientX: number, clientY: number) => {
          const cfg = cfgRef.current;
          if (!cfg.interactive || cfg.reduced || cfg.paused) return;
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          const x = ((clientX - rect.left) / rect.width - 0.5) * (rect.width / rect.height);
          const y = 0.5 - (clientY - rect.top) / rect.height;
          addWave(x, y, clamp(finite(cfg.waveStrength, 1), 0, 3));
        };

        const onPointerDown = (e: PointerEvent) => {
          if (!e.isPrimary) return;
          const target = e.target as HTMLElement | null;
          if (
            target &&
            typeof target.closest === "function" &&
            target.closest(
              "a,button,input,textarea,select,label,summary,[role=button],[contenteditable=true]"
            )
          )
            return;

          if (e.pointerType === "mouse") {
            if (e.button !== 0) return;
            triggerInteraction(e.clientX, e.clientY);
            return;
          }
          activeTouch = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            time: performance.now(),
          };
        };

        const onPointerUp = (e: PointerEvent) => {
          const t = activeTouch;
          activeTouch = null;
          if (
            !t ||
            t.id !== e.pointerId ||
            Math.hypot(e.clientX - t.x, e.clientY - t.y) > 10 ||
            performance.now() - t.time > 600
          )
            return;
          triggerInteraction(e.clientX, e.clientY);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const t = cfgRef.current.interactive ? 1 : 0;
          if (t !== targetTight) {
            targetTight = t;
            scheduleTick();
          }
        };

        const onPointerLeave = (e: PointerEvent) => {
          if (e.pointerType !== "touch") {
            targetTight = 0;
            scheduleTick();
          }
        };

        const onPointerCancel = () => {
          activeTouch = null;
        };

        const onVisibilityChange = () => {
          lastTimestamp = 0;
          scheduleTick();
        };

        const onContextLost = (e: Event) => {
          e.preventDefault();
          isCtxLost = true;
          cancelAnimationFrame(rafId);
          rafId = 0;
        };

        const onContextRestored = () => {
          isCtxLost = false;
          lastColorKey = "";
          lastStepKey = "";
          scheduleTick();
        };

        const resizeObserver = new ResizeObserver(() => {
          if (resize()) {
            renderFrame();
            scheduleTick();
          }
        });

        const intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            lastTimestamp = 0;
            scheduleTick();
          },
          { rootMargin: "120px" }
        );

        const startIntro = () => {
          isIntroRunning = false;
          introTimeElapsed = 0;
          introProgress = 1;
          introVelocity = 0;
          introAlpha = 1;
        };

        const onWindowPointerMove = (e: PointerEvent) => {
          if (!cfgRef.current.interactive || cfgRef.current.reduced || cfgRef.current.paused) return;
          const rect = el.getBoundingClientRect();
          if (
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right
          ) {
            if (Math.random() < 0.22) {
              triggerInteraction(e.clientX, e.clientY);
            }
          }
        };

        const onWindowPointerDown = (e: PointerEvent) => {
          if (!cfgRef.current.interactive || cfgRef.current.reduced || cfgRef.current.paused) return;
          const rect = el.getBoundingClientRect();
          if (
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right
          ) {
            triggerInteraction(e.clientX, e.clientY);
          }
        };

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerleave", onPointerLeave);
        el.addEventListener("pointercancel", onPointerCancel);
        win.addEventListener("pointerdown", onWindowPointerDown, { passive: true });
        win.addEventListener("pointermove", onWindowPointerMove, { passive: true });
        doc.addEventListener("visibilitychange", onVisibilityChange);
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);

        resizeObserver.observe(el);
        intersectionObserver.observe(el);

        if (cfgRef.current.intro && !cfgRef.current.reduced) {
          startIntro();
        }

        animTime = 4;
        resize();
        renderFrame();
        scheduleTick();

        return {
          sync: () => {
            lastColorCheck = -Infinity;
            resize();
            lastTimestamp = 0;
            if (!rafId && isVisible) {
              renderFrame();
              scheduleTick();
            }
          },
          poke: (x?: number, y?: number, strength?: number) => {
            const cfg = cfgRef.current;
            if (cfg.reduced) return;
            const aspect = vpW / Math.max(vpH, 1);
            addWave(
              (clamp(finite(x ?? 0.5, 0.5), 0, 1) - 0.5) * aspect,
              0.5 - clamp(finite(y ?? 0.5, 0.5), 0, 1),
              clamp(finite(strength ?? cfg.waveStrength, 1), 0, 3)
            );
          },
          replay: () => {
            if (!cfgRef.current.reduced) {
              startIntro();
              lastTimestamp = 0;
              scheduleTick();
            }
          },
          destroy: () => {
            isDestroyed = true;
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerleave", onPointerLeave);
            el.removeEventListener("pointercancel", onPointerCancel);
            win.removeEventListener("pointerdown", onWindowPointerDown);
            win.removeEventListener("pointermove", onWindowPointerMove);
            doc.removeEventListener("visibilitychange", onVisibilityChange);
            canvas.removeEventListener("webglcontextlost", onContextLost);
            canvas.removeEventListener("webglcontextrestored", onContextRestored);

            scene.remove(mesh);
            quadGeo.dispose();
            material.dispose();
            renderer.dispose();
            canvas.remove();
          },
        };
      };

      const instance = initEngine(root, wrap, configRef);
      instanceRef.current = instance;

      return () => {
        instance?.destroy();
        instanceRef.current = null;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        poke: (x, y, s) => instanceRef.current?.poke(x, y, s),
        replay: () => instanceRef.current?.replay(),
      }),
      []
    );

    const bgStr = backgroundColor.trim().toLowerCase();
    const hasBg = bgStr && bgStr !== "transparent" && bgStr !== "auto";

    return (
      <div
        ref={rootRef}
        className={cn("absolute inset-0 w-full h-full overflow-hidden", className)}
        style={{
          width,
          height,
          backgroundColor: hasBg ? backgroundColor : undefined,
          ...style,
        }}
      >
        <div
          ref={canvasWrapRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
        {children && (
          <div className="relative z-10 h-full w-full">{children}</div>
        )}
      </div>
    );
  }
);

RubberFluid.displayName = "RubberFluid";
export default RubberFluid;
