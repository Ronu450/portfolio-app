import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { cn } from "../lib/utils";

export interface RingFieldHandle {
  pulse: () => void;
}

export interface RingFieldProps {
  colors?: [string, string];
  backgroundColor?: string;
  mode?: "auto" | "glow" | "ink";
  rings?: number;
  particles?: number;
  thickness?: number;
  folds?: number;
  fold?: number;
  dust?: number;
  innerRadius?: number;
  outerRadius?: number;
  flow?: "outward" | "inward";
  flowSpeed?: number;
  morph?: number;
  lobes?: number;
  turbulence?: number;
  morphSpeed?: number;
  twist?: number;
  rotation?: number;
  aspect?: number;
  tilt?: number;
  centerX?: number;
  centerY?: number;
  scale?: number;
  particleSize?: number;
  sizeVariance?: number;
  sparkle?: number;
  prism?: number;
  twinkle?: number;
  fade?: number;
  glow?: number;
  intensity?: number;
  grain?: number;
  interactive?: boolean;
  push?: number;
  pulse?: number;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const TWO_PI = 2 * Math.PI;

const subscribeReducedMotion = (cb: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
};
const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(val) ? val : min));

let canvas2D: CanvasRenderingContext2D | null = null;
const colorCache = new Map<string, [number, number, number]>();

const parseRgb = (
  doc: Document,
  str: string,
  fallback: [number, number, number]
): [number, number, number] => {
  const cached = colorCache.get(str);
  if (cached) return cached;
  if (!canvas2D) {
    canvas2D = doc.createElement("canvas").getContext("2d");
  }
  if (!canvas2D) return fallback;

  canvas2D.fillStyle = "#010203";
  canvas2D.fillStyle = str;
  const styleStr = String(canvas2D.fillStyle);
  let res = fallback;

  if (styleStr === "#010203" && str.trim().toLowerCase() !== "#010203") {
    res = fallback;
  } else if (styleStr.startsWith("#")) {
    const hex = styleStr.slice(1);
    res = [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  } else {
    const nums = styleStr.match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      res = [
        Number(nums[0]) / 255,
        Number(nums[1]) / 255,
        Number(nums[2]) / 255,
      ];
    }
  }

  if (colorCache.size > 48) colorCache.clear();
  colorCache.set(str, res);
  return res;
};

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const linearToOklab = ([r, g, b]: [number, number, number]): [
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

const oklabToLinear = ([L, a, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const adjustInkLab = ([L, a, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const n = clamp(0.8 * L, 0.3, 0.55);
  let lo = 0;
  let hi = 1.15;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    const test = oklabToLinear([n, a * mid, b * mid]);
    if (
      Math.min(test[0], test[1], test[2]) >= -0.001 &&
      Math.max(test[0], test[1], test[2]) <= 1.001
    ) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return [n, a * lo, b * lo];
};

const pointsVertexShader = `
in vec4 aSeed;
in vec4 aTrait;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uUnit;
uniform float uDistance;
uniform float uIncline;
uniform float uAspect;
uniform int uRings;
uniform float uFlow;
uniform float uInner;
uniform float uOuter;
uniform float uThickness;
uniform float uFolds;
uniform float uFold;
uniform float uDust;
uniform float uMorph;
uniform float uLobes;
uniform float uTurbulence;
uniform float uShape;
uniform float uTwist;
uniform float uRotation;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uPixelRatio;
uniform float uMaxPoint;
uniform float uSize;
uniform float uSizeVariance;
uniform float uSparkle;
uniform float uPrism;
uniform float uTwinkle;
uniform float uTime;
uniform float uGain;
uniform float uInk;
uniform vec3 uLabA;
uniform vec3 uLabB;
uniform vec3 uInkA;
uniform vec3 uInkB;
uniform vec4 uKickA[32];
uniform vec4 uKickB[32];
uniform float uKickTime;
out vec3 vColor;
out float vGain;
out float vSigma;
out float vSpan;

vec3 lattice(vec3 cell) {
  uvec3 v = uvec3(ivec3(cell)) * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3(v >> 8u) * (2.0 / 16777215.0) - 1.0;
}

float corner(vec3 cell, vec3 f, vec3 o) {
  return dot(lattice(cell + o), f - o);
}

float noise(vec3 p) {
  vec3 cell = floor(p);
  vec3 f = p - cell;
  vec3 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float x00 = mix(corner(cell, f, vec3(0.0, 0.0, 0.0)), corner(cell, f, vec3(1.0, 0.0, 0.0)), w.x);
  float x10 = mix(corner(cell, f, vec3(0.0, 1.0, 0.0)), corner(cell, f, vec3(1.0, 1.0, 0.0)), w.x);
  float x01 = mix(corner(cell, f, vec3(0.0, 0.0, 1.0)), corner(cell, f, vec3(1.0, 0.0, 1.0)), w.x);
  float x11 = mix(corner(cell, f, vec3(0.0, 1.0, 1.0)), corner(cell, f, vec3(1.0, 1.0, 1.0)), w.x);
  return 1.8 * mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z);
}

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

void main() {
  int slotIndex = gl_VertexID % uRings;
  float rings = float(uRings);
  float slot = float(slotIndex);
  float travel = slot + uFlow;
  float generation = floor(travel / rings);
  float u = clamp((travel - generation * rings) / rings, 0.0, 1.0);
  float id = slot - generation * rings;
  float base = mix(uInner, uOuter, u);
  float spacing = (uOuter - uInner) / rings;
  float dust = step(aSeed.z, uDust);

  float lobes = uLobes;
  float local = aSeed.x - uTwist * id / max(lobes, 1.0);
  float wander = 1.7 * noise(vec3(id * 0.27, uShape * 0.55, 4.3));
  float swell = 0.8 + 0.3 * noise(vec3(id * 0.21, uShape * 0.42, 9.1));
  float lobe = cos(lobes * local + wander) * swell * (lobes > 0.5 ? 1.0 : 0.4);
  vec2 around = vec2(cos(local), sin(local));
  float broad = noise(vec3(around * (0.6 + 0.24 * lobes), id * 0.17 + uShape));
  float fine = noise(vec3(around * (2.4 + 0.7 * lobes), id * 0.33 + uShape * 1.9 + 17.0));
  float shape = 0.62 * lobe + 0.38 * broad + uTurbulence * 0.42 * fine;
  float centre = base * (1.0 + uMorph * (0.55 + 0.9 * u) * shape);

  float wave = 0.5 + 0.5 * sin(uFolds * local + 6.2831853 * fract(id * 0.618034) + uShape * 0.8 + 1.6 * noise(vec3(around * 0.85, id * 0.29 + uShape * 0.35 + 51.0)));
  float open = smoothstep(0.66, 0.97, wave);
  float phi = 1.5707963 * (1.0 - uFold * open);
  float width = uThickness * spacing * (0.8 + 0.4 * u);
  float across = aSeed.y * width;
  float radial = mix(across * max(cos(phi), 0.07), aTrait.z * spacing * 0.7, dust);
  float lift = mix(across * sin(phi), aTrait.w * width * 0.8, dust);
  float radius = max(centre + radial, 0.0);
  float theta = aSeed.x + uRotation;
  vec3 plane = vec3(radius * cos(theta) * uAspect, radius * sin(theta), lift);

  float ci = cos(uIncline);
  float si = sin(uIncline);
  vec3 q = vec3(plane.x, plane.y * ci + plane.z * si, -plane.y * si + plane.z * ci);
  float depth = uDistance - q.z;
  float clip = smoothstep(0.4, 1.4, depth);
  depth = max(depth, 0.4);
  float near = uDistance / depth;
  vec2 screen = uCenter + uUnit * near * q.xy;

  float scatter = 0.6 + 0.8 * fract(aSeed.w * 7.31);
  float delay = 0.75 + 0.5 * fract(aSeed.w * 3.17);
  float swirl = (fract(aSeed.w * 11.7) - 0.5) * 0.9;
  float cs = cos(swirl);
  float sn = sin(swirl);
  vec2 offset = vec2(0.0);
  for (int i = 0; i < 32; i++) {
    vec4 a = uKickA[i];
    if (a.w < 0.0) continue;
    vec4 b = uKickB[i];
    vec2 d = screen - a.xy;
    float dist = length(d);
    vec2 away = dist > 1e-3 ? d / dist : vec2(0.0);
    float strength = length(b.xy);
    float tau = a.w;
    float fall = exp(-dist * dist / (a.z * a.z));
    vec2 push = b.xy + away * strength * 0.45;
    if (b.z > 0.5) {
      tau = a.w - dist / b.w;
      fall = exp(-dist / a.z);
      push = away * strength;
    }
    if (tau <= 0.0 || fall < 0.003) continue;
    float t = tau / (uKickTime * delay);
    float response = t * exp(1.0 - t);
    offset += vec2(cs * push.x - sn * push.y, sn * push.x + cs * push.y) * fall * response;
  }
  offset *= scatter * (1.0 + 0.8 * dust);
  offset /= 1.0 + length(offset) / (uUnit * 0.18);
  screen += offset;
  float stirred = clamp(length(offset) / (uUnit * 0.05), 0.0, 1.0);

  float fadeOut = 1.0 - smoothstep(1.0 - uFadeOut, 1.0, u);
  float fade = smoothstep(0.0, uFadeIn, u) * fadeOut * fadeOut;
  float rim = smoothstep(0.72, 0.97, aSeed.y) * (1.0 - dust);
  float prism = step(1.0 - uPrism, aTrait.x);
  float glint = step(1.0 - uPrism - uSparkle * 0.3, aTrait.x) * (1.0 - prism);
  float beat = 0.5 + 0.5 * sin(uTime * (0.45 + 1.3 * fract(aSeed.w * 5.3)) + aSeed.w * 6.2831853);
  float twinkle = 1.0 - uTwinkle * (0.45 + 0.35 * glint + 0.3 * dust) * beat;
  float character = noise(vec3(id * 0.61, 2.7, uShape * 0.15));
  float clump = 1.0 + 0.3 * noise(vec3(around * 1.4, id * 0.43 + uShape * 0.6 + 31.0));

  float tone = clamp(0.2 + 0.55 * rim + (1.0 - u) * 0.35 - 0.3 * dust + (aTrait.y - 0.5) * 0.3, 0.0, 1.0);
  vec3 lab = mix(uLabA, uLabB, tone);
  float hue = aSeed.w * 6.2831853;
  vec3 speck = vec3(0.74, 0.13 * cos(hue), 0.13 * sin(hue));
  lab = mix(lab, speck, prism);
  vec3 bright = labToLinear(mix(lab, vec3(0.97, lab.yz * 0.18), glint * 0.8 + rim * 0.08));
  vec3 inked = labToLinear(mix(mix(uInkA, uInkB, tone), vec3(0.52, speck.yz), prism)) * (1.0 - 0.4 * glint);
  vColor = mix(bright, inked, uInk);

  float sizeMix = mix(1.0, 0.5 + 1.25 * aTrait.y * aTrait.y, uSizeVariance) * (1.0 - 0.25 * dust);
  float px = uSize * uPixelRatio * sizeMix * mix(1.0, near, 0.6) * (1.0 + 0.3 * glint + 0.2 * prism);
  float wanted = px / 2.3548;
  float sigma = clamp(wanted, 0.55, max((uMaxPoint - 1.5) / 5.0, 0.55));
  float shrink = min(1.0, (wanted * wanted) / (sigma * sigma));
  float body = mix(0.85 + 0.45 * rim, 0.38, dust);
  float gain = uGain * fade * twinkle * shrink * body * (1.0 + 1.6 * glint + 0.8 * prism) * mix(1.0, near, 0.5) * clip;
  gain *= (1.0 + 0.2 * character) * clump * (1.0 + 0.5 * stirred);

  vGain = gain;
  vSigma = sigma;
  vSpan = 5.0 * sigma + 1.5;
  gl_PointSize = vSpan;
  gl_Position = gain > 1e-5 ? vec4(screen / uResolution * 2.0 - 1.0, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
}
`;

const pointsFragShader = `
precision highp float;
in vec3 vColor;
in float vGain;
in float vSigma;
in float vSpan;
out vec4 fragColor;

void main() {
  vec2 d = (gl_PointCoord - 0.5) * vSpan;
  float r2 = dot(d, d) / (vSigma * vSigma);
  float e = max(exp(-0.5 * r2) - 0.0439369, 0.0) * (vGain / 0.9560631);
  fragColor = vec4(vColor * e, e);
}
`;

const quadVertexShader = `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const downsampleFragShader = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
}
`;

const upsampleFragShader = `
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
uniform float uKeep;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum * (uKeep / 16.0);
}
`;

const screenCompositeFragShader = `
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
uniform float uSeed;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 lines = texture(uLines, vUv);
  vec4 bloom = texture(uBloom, vUv);
  float speck = hash(gl_FragCoord.xy + uSeed * 311.0) - 0.5;
  vec3 color;
  float lit;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    color = uBackground + (1.0 - uBackground) * exposed;
    lit = peak;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.25;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.25) / max(energy, 1e-4);
    float density = 1.05 * (1.0 - exp(-energy * uExposure));
    vec3 absorb = -log(clamp(hue, 0.03, 1.0));
    color = uBackground * exp(-absorb * density);
    lit = min(density, 1.0);
  }
  float dither = hash(gl_FragCoord.xy * 1.37 + uSeed * 97.0) + hash(gl_FragCoord.xy * 0.71 + uSeed * 41.0 + 13.0) - 1.0;
  vec3 encoded = encode(color) + speck * uGrain * (2.0 / 255.0 + 0.07 * lit) + dither / 255.0;
  float alpha = clamp(lit * 2.2 + max(lines.a, bloom.a * uGlow * 0.5), 0.0, 1.0);
  fragColor = vec4(encoded, alpha);
}
`;

export const RingField = forwardRef<RingFieldHandle, RingFieldProps>(
  function RingField(
    {
      colors = ["#426A8C", "#52606D"],
      backgroundColor = "#0a0a0a",
      mode = "auto",
      rings = 6,
      particles = 46000,
      thickness = 0.34,
      folds = 3,
      fold = 0.9,
      dust = 0.14,
      innerRadius = 0.42,
      outerRadius = 1.3,
      flow = "outward",
      flowSpeed = 0.05,
      morph = 0.13,
      lobes = 3,
      turbulence = 0.45,
      morphSpeed = 0.1,
      twist = 0.4,
      rotation = 0.01,
      aspect = 1,
      tilt = 0,
      centerX = 0,
      centerY = 0,
      scale = 1,
      particleSize = 1.3,
      sizeVariance = 0.5,
      sparkle = 0.05,
      prism = 0.04,
      twinkle = 0.3,
      fade = 0.22,
      glow = 0.4,
      intensity = 1,
      grain = 0.3,
      interactive = true,
      push = 1,
      pulse = 1,
      paused = false,
      quality = 1,
      className,
      style,
      children,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<any>(null);
    const isReduced = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotionSnapshot,
      () => false
    );

    const config = {
      colors,
      backgroundColor,
      mode,
      rings,
      particles,
      thickness,
      folds,
      fold,
      dust,
      innerRadius,
      outerRadius,
      flow,
      flowSpeed,
      morph,
      lobes,
      turbulence,
      morphSpeed,
      twist,
      rotation,
      aspect,
      tilt,
      centerX,
      centerY,
      scale,
      particleSize,
      sizeVariance,
      sparkle,
      prism,
      twinkle,
      fade,
      glow,
      intensity,
      grain,
      interactive,
      push,
      pulse,
      paused,
      quality,
      reduced: isReduced,
    };

    const configRef = useRef(config);
    useEffect(() => {
      configRef.current = config;
      instanceRef.current?.sync();
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const initEngine = (el: HTMLElement, cfgRef: React.MutableRefObject<any>) => {
        let renderer: THREE.WebGLRenderer;
        const doc = el.ownerDocument;
        const win = doc.defaultView ?? window;
        const canvas = doc.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
        el.prepend(canvas);

        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          });
          renderer.setClearColor(0, 0);
        } catch {
          canvas.remove();
          return null;
        }

        if (!renderer.capabilities.isWebGL2) {
          renderer.dispose();
          canvas.remove();
          return null;
        }

        renderer.autoClear = false;

        const floatType =
          renderer.extensions.has("EXT_color_buffer_float") ||
          renderer.extensions.has("EXT_color_buffer_half_float")
            ? THREE.FloatType
            : THREE.HalfFloatType;

        const gl = renderer.getContext();
        const ptRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
        const maxPointSize =
          ptRange && ptRange.length > 1 ? Math.max(8, ptRange[1]) : 64;

        const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const screenQuadGeo = new THREE.PlaneGeometry(2, 2);

        const kickAVecs = Array.from({ length: 32 }, () => new THREE.Vector4(0, 0, 1, -1));
        const kickBVecs = Array.from({ length: 32 }, () => new THREE.Vector4());
        const interactionEvents: any[] = [];

        const pointsMat = new THREE.RawShaderMaterial({
          glslVersion: THREE.GLSL3,
          uniforms: {
            uResolution: { value: new THREE.Vector2(1, 1) },
            uCenter: { value: new THREE.Vector2() },
            uUnit: { value: 1 },
            uDistance: { value: 3.6 },
            uIncline: { value: 0 },
            uAspect: { value: 1 },
            uRings: { value: 7 },
            uFlow: { value: 0 },
            uInner: { value: 0.14 },
            uOuter: { value: 1.05 },
            uThickness: { value: 0.34 },
            uFolds: { value: 3 },
            uFold: { value: 0.9 },
            uDust: { value: 0.14 },
            uMorph: { value: 0.11 },
            uLobes: { value: 3 },
            uTurbulence: { value: 0.35 },
            uShape: { value: 0 },
            uTwist: { value: 0.35 },
            uRotation: { value: 0 },
            uFadeIn: { value: 0.2 },
            uFadeOut: { value: 0.3 },
            uPixelRatio: { value: 1 },
            uMaxPoint: { value: 64 },
            uSize: { value: 1.5 },
            uSizeVariance: { value: 0.5 },
            uSparkle: { value: 0.05 },
            uPrism: { value: 0.04 },
            uTwinkle: { value: 0.3 },
            uTime: { value: 0 },
            uGain: { value: 1 },
            uInk: { value: 0 },
            uLabA: { value: new THREE.Vector3() },
            uLabB: { value: new THREE.Vector3() },
            uInkA: { value: new THREE.Vector3() },
            uInkB: { value: new THREE.Vector3() },
            uKickA: { value: kickAVecs },
            uKickB: { value: kickBVecs },
            uKickTime: { value: 0.32 },
          },
          vertexShader: pointsVertexShader,
          fragmentShader: pointsFragShader,
          depthTest: false,
          depthWrite: false,
          transparent: true,
          blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneFactor,
        });

        const createQuadMat = (frag: string, unifs: Record<string, any>) =>
          new THREE.RawShaderMaterial({
            glslVersion: THREE.GLSL3,
            uniforms: unifs,
            vertexShader: quadVertexShader,
            fragmentShader: frag,
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending,
          });

        const downsampleMat = createQuadMat(downsampleFragShader, {
          uSource: { value: null },
          uTexel: { value: new THREE.Vector2() },
        });

        const upsampleMat = createQuadMat(upsampleFragShader, {
          uSource: { value: null },
          uBase: { value: null },
          uTexel: { value: new THREE.Vector2() },
          uKeep: { value: 0.62 },
        });

        const finalMat = createQuadMat(screenCompositeFragShader, {
          uLines: { value: null },
          uBloom: { value: null },
          uBackground: { value: new THREE.Vector3() },
          uGlow: { value: 0.45 },
          uExposure: { value: 1 },
          uMode: { value: 0 },
          uGrain: { value: 0.3 },
          uSeed: { value: 0 },
        });

        const pointsMesh = new THREE.Points(new THREE.BufferGeometry(), pointsMat);
        pointsMesh.frustumCulled = false;
        const pointsScene = new THREE.Scene();
        pointsScene.add(pointsMesh);

        const quadMesh = new THREE.Mesh(screenQuadGeo, finalMat);
        quadMesh.frustumCulled = false;
        const quadScene = new THREE.Scene();
        quadScene.add(quadMesh);

        let curParticleCount = 0;
        const createTarget = (w: number, h: number) =>
          new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
            type: floatType,
            format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false,
            generateMipmaps: false,
          });

        let mainTarget: THREE.WebGLRenderTarget | null = null;
        let downTargets: THREE.WebGLRenderTarget[] = [];
        let upTargets: THREE.WebGLRenderTarget[] = [];

        let isDestroyed = false;
        let isCtxLost = false;
        let rafId = 0;
        let lastTime = 0;
        let isVisible = true;
        let widthCss = 1;
        let heightCss = 1;
        let pixelRatioVal = 1;
        let widthBuf = 1;
        let heightBuf = 1;
        let grainSeed = 0;
        let totalElapsed = 0;
        let flowTravel = 0.37;
        let morphTravel = 6.2;
        let rotationTravel = 0;
        let activeHover: { x: number; y: number; t: number } | null = null;

        const clearTargets = () => {
          mainTarget?.dispose();
          downTargets.forEach((t) => t.dispose());
          upTargets.forEach((t) => t.dispose());
          mainTarget = null;
          downTargets = [];
          upTargets = [];
        };

        const renderQuad = (
          mat: THREE.RawShaderMaterial,
          target: THREE.WebGLRenderTarget | null
        ) => {
          quadMesh.material = mat;
          renderer.setRenderTarget(target);
          renderer.render(quadScene, orthoCam);
        };

        const getGeometryParams = () => {
          const cfg = cfgRef.current;
          const w = widthBuf;
          const h = heightBuf;
          return {
            unit:
              0.5 *
              Math.min(Math.max(w, h), 1.6 * Math.min(w, h)) *
              clamp(cfg.scale, 0.2, 4),
            cx: (0.5 + 0.5 * clamp(cfg.centerX, -1.5, 1.5)) * w,
            cy: (0.5 - 0.5 * clamp(cfg.centerY, -1.5, 1.5)) * h,
            incline: (clamp(cfg.tilt, 0, 80) * Math.PI) / 180,
            aspect: clamp(cfg.aspect, 0.25, 4),
          };
        };

        const generateParticleGeo = (count: number) => {
          let seed = 29;
          const rand = () => (seed = (16807 * seed) % 0x7fffffff) / 0x7fffffff;
          const randNorm = () =>
            Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-9))) *
            Math.cos(TWO_PI * rand());
          const arr = new Float32Array(8 * count);
          for (let i = 0; i < count; i++) {
            const rad =
              0.3 > rand()
                ? 1 - 0.16 * rand() * rand()
                : 1 - 2 * Math.pow(rand(), 0.85);
            arr.set(
              [
                rand() * TWO_PI,
                rad,
                rand(),
                rand(),
                rand(),
                rand(),
                clamp(randNorm(), -3, 3),
                clamp(randNorm(), -3, 3),
              ],
              8 * i
            );
          }
          const geo = new THREE.BufferGeometry();
          const buffer = new THREE.InterleavedBuffer(arr, 8);
          geo.setAttribute(
            "aSeed",
            new THREE.InterleavedBufferAttribute(buffer, 4, 0)
          );
          geo.setAttribute(
            "aTrait",
            new THREE.InterleavedBufferAttribute(buffer, 4, 4)
          );
          geo.setAttribute(
            "position",
            new THREE.InterleavedBufferAttribute(buffer, 3, 0)
          );
          return geo;
        };

        const updateUniformsAndRender = () => {
          if (!mainTarget || !downTargets.length || isCtxLost) return;
          const cfg = cfgRef.current;
          const desiredParticles = Math.round(
            clamp(cfg.particles, 2000, 200000)
          );

          if (desiredParticles !== curParticleCount) {
            curParticleCount = desiredParticles;
            pointsMesh.geometry.dispose();
            pointsMesh.geometry = generateParticleGeo(desiredParticles);
          }

          const u = pointsMat.uniforms;
          const geoP = getGeometryParams();
          const innerR = clamp(cfg.innerRadius, 0, 3);
          const outerR = Math.max(clamp(cfg.outerRadius, 0.05, 4), innerR + 0.05);

          const bgRgb = parseRgb(doc, cfg.backgroundColor, [0.04, 0.04, 0.04]);
          const lum =
            0.2126 * bgRgb[0] + 0.7152 * bgRgb[1] + 0.0722 * bgRgb[2];
          const isInkMode =
            cfg.mode === "ink" || (cfg.mode === "auto" && lum > 0.5);

          const labA = linearToOklab(
            parseRgb(doc, cfg.colors[0], [0.17, 0.78, 1])
          );
          const labB = linearToOklab(
            parseRgb(doc, cfg.colors[1], [0.61, 0.96, 0.89])
          );
          const ringsNum = Math.round(clamp(cfg.rings, 2, 24));
          const fadeVal = clamp(cfg.fade, 0, 1);

          u.uResolution.value.set(widthBuf, heightBuf);
          u.uCenter.value.set(geoP.cx, geoP.cy);
          u.uUnit.value = geoP.unit;
          u.uIncline.value = geoP.incline;
          u.uAspect.value = geoP.aspect;
          u.uRings.value = ringsNum;
          u.uFlow.value = flowTravel;
          u.uInner.value = innerR;
          u.uOuter.value = outerR;
          u.uThickness.value = clamp(cfg.thickness, 0, 2);
          u.uFolds.value = Math.round(clamp(cfg.folds, 0, 12));
          u.uFold.value = clamp(cfg.fold, 0, 1);
          u.uDust.value = clamp(cfg.dust, 0, 1);
          u.uMorph.value = clamp(cfg.morph, 0, 0.6);
          u.uLobes.value = Math.round(clamp(cfg.lobes, 0, 12));
          u.uTurbulence.value = clamp(cfg.turbulence, 0, 2);
          u.uShape.value = morphTravel;
          u.uTwist.value = clamp(cfg.twist, -Math.PI, Math.PI);
          u.uRotation.value = rotationTravel;
          u.uFadeIn.value = Math.max(0.04, fadeVal);
          u.uFadeOut.value = Math.max(0.04, fadeVal);
          u.uPixelRatio.value = pixelRatioVal;
          u.uMaxPoint.value = maxPointSize;
          u.uSize.value = clamp(cfg.particleSize, 0.3, 8);
          u.uSizeVariance.value = clamp(cfg.sizeVariance, 0, 1);
          u.uSparkle.value = clamp(cfg.sparkle, 0, 1);
          u.uPrism.value = clamp(cfg.prism, 0, 0.5);
          u.uTwinkle.value = cfg.reduced ? 0 : clamp(cfg.twinkle, 0, 1);
          u.uTime.value = totalElapsed;
          u.uInk.value = isInkMode ? 1 : 0;
          u.uLabA.value.set(labA[0], labA[1], labA[2]);
          u.uLabB.value.set(labB[0], labB[1], labB[2]);

          if (isInkMode) {
            const inkA = adjustInkLab(labA);
            const inkB = adjustInkLab(labB);
            u.uInkA.value.set(inkA[0], inkA[1], inkA[2]);
            u.uInkB.value.set(inkB[0], inkB[1], inkB[2]);
          }

          const scaleRatio = Math.pow(geoP.unit / pixelRatioVal / 360, 2);
          const qualityMult =
            clamp(scaleRatio, 0.25, 1) * clamp(cfg.quality, 0.25, 1);
          pointsMesh.geometry.setDrawRange(
            0,
            Math.round(curParticleCount * qualityMult)
          );
          u.uGain.value =
            0.6 *
            Math.sqrt(26000 / curParticleCount) *
            clamp(scaleRatio / qualityMult, 0.5, 4);

          for (let i = 0; i < 32; i++) {
            const ev = interactionEvents[i];
            if (!ev) {
              kickAVecs[i].w = -1;
              continue;
            }
            kickAVecs[i].set(ev.x, ev.y, ev.reach, ev.age);
            kickBVecs[i].set(ev.vx, ev.vy, ev.kind, ev.speed);
          }

          const fu = finalMat.uniforms;
          fu.uBackground.value.set(
            srgbToLinear(bgRgb[0]),
            srgbToLinear(bgRgb[1]),
            srgbToLinear(bgRgb[2])
          );
          fu.uGlow.value = clamp(cfg.glow, 0, 3) * (isInkMode ? 0.5 : 1);
          fu.uExposure.value = (isInkMode ? 2.2 : 1) * clamp(cfg.intensity, 0, 4);
          fu.uMode.value = isInkMode ? 1 : 0;
          fu.uGrain.value = clamp(cfg.grain, 0, 1);
          fu.uSeed.value = grainSeed;

          renderer.setRenderTarget(mainTarget);
          renderer.setClearColor(0, 0);
          renderer.clear();
          renderer.render(pointsScene, orthoCam);

          let curSrc = mainTarget;
          for (const dt of downTargets) {
            downsampleMat.uniforms.uSource.value = curSrc.texture;
            downsampleMat.uniforms.uTexel.value.set(
              1 / curSrc.width,
              1 / curSrc.height
            );
            renderQuad(downsampleMat, dt);
            curSrc = dt;
          }

          let curBloom = downTargets[downTargets.length - 1];
          for (let i = downTargets.length - 2; i >= 0; i--) {
            upsampleMat.uniforms.uSource.value = curBloom.texture;
            upsampleMat.uniforms.uBase.value = downTargets[i].texture;
            upsampleMat.uniforms.uTexel.value.set(
              1 / curBloom.width,
              1 / curBloom.height
            );
            renderQuad(upsampleMat, upTargets[i]);
            curBloom = upTargets[i];
          }

          finalMat.uniforms.uLines.value = mainTarget.texture;
          finalMat.uniforms.uBloom.value = curBloom.texture;
          renderQuad(finalMat, null);
        };

        const onFrame = (ts: number) => {
          rafId = 0;
          if (isDestroyed || isCtxLost) return;

          const dt = Math.min(0.05, Math.max(0, (ts - lastTime) / 1000));
          lastTime = ts;

          const cfg = cfgRef.current;
          if (!cfg.paused && !cfg.reduced) {
            totalElapsed += dt;
            const flowDir = cfg.flow === "inward" ? -1 : 1;
            flowTravel += dt * flowDir * clamp(cfg.flowSpeed, 0, 2);
            morphTravel += dt * clamp(cfg.morphSpeed, 0, 2);
            rotationTravel =
              (rotationTravel + dt * clamp(cfg.rotation, -3, 3)) % TWO_PI;

            for (let i = interactionEvents.length - 1; i >= 0; i--) {
              interactionEvents[i].age += dt;
              if (interactionEvents[i].age > interactionEvents[i].life) {
                interactionEvents.splice(i, 1);
              }
            }
            grainSeed = (grainSeed + 0.618034) % 1;
          }

          updateUniformsAndRender();

          if (isVisible && !doc.hidden && !cfg.paused && !cfg.reduced) {
            rafId = win.requestAnimationFrame(onFrame);
          }
        };

        const scheduleTick = () => {
          if (isDestroyed || isCtxLost || rafId || !isVisible) return;
          lastTime = win.performance.now();
          rafId = win.requestAnimationFrame(onFrame);
        };

        const handleResize = () => {
          const rect = el.getBoundingClientRect();
          widthCss = Math.max(1, el.clientWidth || rect.width || win.innerWidth);
          heightCss = Math.max(1, el.clientHeight || rect.height || win.innerHeight);
          pixelRatioVal =
            Math.min(win.devicePixelRatio || 1, 2) *
            clamp(cfgRef.current.quality, 0.25, 1);

          renderer.setPixelRatio(pixelRatioVal);
          renderer.setSize(widthCss, heightCss, false);

          const bw = Math.max(1, Math.floor(widthCss * pixelRatioVal));
          const bh = Math.max(1, Math.floor(heightCss * pixelRatioVal));
          widthBuf = bw;
          heightBuf = bh;

          clearTargets();
          mainTarget = createTarget(bw, bh);

          const levels = clamp(
            Math.floor(Math.log2(Math.min(bw, bh) / 8)),
            3,
            7
          );
          for (let i = 1; i <= levels; i++) {
            downTargets.push(
              createTarget(Math.max(1, bw >> i), Math.max(1, bh >> i))
            );
            upTargets.push(
              createTarget(Math.max(1, bw >> i), Math.max(1, bh >> i))
            );
          }

          updateUniformsAndRender();
          scheduleTick();
        };

        const mapClientToCanvas = (cx: number, cy: number) => {
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return null;
          const xFrac = (cx - rect.left) * (widthCss / rect.width);
          const yFrac = (cy - rect.top) * (heightCss / rect.height);
          return {
            x: (widthBuf / widthCss) * xFrac,
            y: (heightBuf / heightCss) * (heightCss - yFrac),
          };
        };

        const addInteraction = (ev: any) => {
          const kindCount = interactionEvents.filter(
            (t) => t.kind === ev.kind
          ).length;
          const maxAllowed = ev.kind === 1 ? 4 : 28;
          if (kindCount >= maxAllowed) {
            const firstIdx = interactionEvents.findIndex(
              (t) => t.kind === ev.kind
            );
            if (firstIdx !== -1) interactionEvents.splice(firstIdx, 1);
          }
          interactionEvents.push(ev);
          scheduleTick();
        };

        const firePulse = (x: number, y: number, strength: number) => {
          const cfg = cfgRef.current;
          if (cfg.reduced || cfg.paused || strength <= 0) return;
          const u = getGeometryParams().unit;
          addInteraction({
            x,
            y,
            vx: 0.11 * u * strength,
            vy: 0,
            reach: 0.9 * u,
            age: 0,
            kind: 1,
            speed: 1.25 * u,
            life: 3.6,
          });
        };

        const onPointerMove = (e: PointerEvent) => {
          const cfg = cfgRef.current;
          if (!cfg.interactive || cfg.reduced || cfg.paused) {
            activeHover = null;
            return;
          }
          const pt = mapClientToCanvas(e.clientX, e.clientY);
          if (!pt) return;
          const now = win.performance.now() / 1000;
          const prev = activeHover;
          if (!prev) {
            activeHover = { x: pt.x, y: pt.y, t: now };
            return;
          }
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const u = getGeometryParams().unit;
          if (Math.hypot(dx, dy) < 0.012 * u && now - prev.t < 0.05) return;
          activeHover = { x: pt.x, y: pt.y, t: now };

          const pStrength = clamp(cfg.push, 0, 3);
          if (pStrength <= 0) return;
          const maxD = 0.1 * u * pStrength;
          let fx = 1.5 * dx * pStrength;
          let fy = 1.5 * dy * pStrength;
          const dist = Math.hypot(fx, fy);
          if (dist < 0.5) return;
          if (dist > maxD) {
            fx *= maxD / dist;
            fy *= maxD / dist;
          }
          addInteraction({
            x: pt.x,
            y: pt.y,
            vx: fx,
            vy: fy,
            reach: 0.2 * u,
            age: 0,
            kind: 0,
            speed: 0,
            life: 2.6,
          });
        };

        const onPointerDown = (e: PointerEvent) => {
          const cfg = cfgRef.current;
          if (e.button !== 0 || !cfg.interactive) return;
          const pt = mapClientToCanvas(e.clientX, e.clientY);
          if (pt) firePulse(pt.x, pt.y, clamp(cfg.pulse, 0, 3));
        };

        const onPointerLeave = () => {
          activeHover = null;
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(el);

        const intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) scheduleTick();
          },
          { rootMargin: "80px" }
        );
        intersectionObserver.observe(el);

        const onVisibilityChange = () => {
          if (!doc.hidden) scheduleTick();
        };
        doc.addEventListener("visibilitychange", onVisibilityChange);

        const onContextLost = (e: Event) => {
          e.preventDefault();
          isCtxLost = true;
          if (rafId) win.cancelAnimationFrame(rafId);
          rafId = 0;
        };
        const onContextRestored = () => {
          isCtxLost = false;
          updateUniformsAndRender();
          scheduleTick();
        };

        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerleave", onPointerLeave);
        el.addEventListener("pointercancel", onPointerLeave);
        el.addEventListener("pointerdown", onPointerDown);

        handleResize();

        return {
          sync: () => {
            const curPr =
              Math.min(win.devicePixelRatio || 1, 2) *
              clamp(cfgRef.current.quality, 0.25, 1);
            if (!cfgRef.current.interactive) activeHover = null;
            if (Math.abs(curPr - pixelRatioVal) > 0.001) handleResize();
            else updateUniformsAndRender();
            scheduleTick();
          },
          destroy: () => {
            isDestroyed = true;
            if (rafId) win.cancelAnimationFrame(rafId);
            rafId = 0;
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerleave", onPointerLeave);
            el.removeEventListener("pointercancel", onPointerLeave);
            el.removeEventListener("pointerdown", onPointerDown);
            doc.removeEventListener("visibilitychange", onVisibilityChange);
            canvas.removeEventListener("webglcontextlost", onContextLost);
            canvas.removeEventListener("webglcontextrestored", onContextRestored);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            clearTargets();
            pointsMesh.geometry.dispose();
            screenQuadGeo.dispose();
            [pointsMat, downsampleMat, upsampleMat, finalMat].forEach((m) =>
              m.dispose()
            );
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
          },
          pulse: () => {
            const p = getGeometryParams();
            firePulse(p.cx, p.cy, clamp(cfgRef.current.pulse, 0, 3) || 1);
          },
        };
      };

      const instance = initEngine(container, configRef);
      instanceRef.current = instance;

      return () => {
        instance?.destroy();
        instanceRef.current = null;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        pulse: () => instanceRef.current?.pulse(),
      }),
      []
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative isolate h-full min-h-[240px] w-full overflow-hidden",
          className
        )}
        style={{ backgroundColor, ...style }}
      >
        {children && (
          <div className="relative z-10 h-full w-full">{children}</div>
        )}
      </div>
    );
  }
);

RingField.displayName = "RingField";
export default RingField;
