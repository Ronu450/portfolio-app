import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { cn } from "../lib/utils";

export interface RisingLinesHandle {
  launch: (x?: number, strength?: number) => void;
  replay: () => void;
}

export interface RisingLinesProps {
  colors?: [string, string];
  color?: string;
  lineColor?: string;
  horizonColor?: string;
  haloColor?: string;
  backgroundColor?: string;
  density?: number;
  speed?: number;
  lineWidth?: number;
  lineLength?: number;
  horizonHeight?: number;
  horizonGlow?: number;
  depth?: number;
  spread?: number;
  updraft?: number;
  particles?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
  riseSpeed?: number;
  riseScale?: number;
  riseIntensity?: number;
  flowSpeed?: number;
  flowDensity?: number;
  flowIntensity?: number;
  horizonIntensity?: number;
  haloIntensity?: number;
  circleScale?: number;
  scale?: number;
  brightness?: number;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
const finite = (val: number | undefined, fallback: number) =>
  typeof val === "number" && Number.isFinite(val) ? val : fallback;

const tempColor = new THREE.Color();

const parseColor = (colorStr?: string): [number, number, number] | null => {
  if (typeof colorStr !== "string") return null;
  const str = colorStr.trim().toLowerCase();
  if (!str || str === "transparent" || str === "none" || str === "auto")
    return null;

  const match = /^rgba?\(([^)]+)\)$/.exec(str);
  if (match) {
    const parts = match[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((p) => Number.parseFloat(p));
    if (
      parts.length < 3 ||
      parts.slice(0, 3).some((p) => !Number.isFinite(p)) ||
      (parts.length > 3 && Number.isFinite(parts[3]) && parts[3] < 0.05)
    ) {
      return null;
    }
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
  }

  tempColor.setRGB(-1, -1, -1);
  try {
    tempColor.setStyle(str, THREE.SRGBColorSpace);
  } catch {
    return null;
  }
  return tempColor.r < 0 ? null : [tempColor.r, tempColor.g, tempColor.b];
};

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const linearToOklab = ([r, g, b]: [number, number, number]): [
  number,
  number,
  number
] => {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  );
  const u = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const c = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    Math.hypot(u, c),
    Math.atan2(c, u),
  ];
};

const oklabToLinear = ([L, C, h]: [number, number, number]): [
  number,
  number,
  number
] => {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

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
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const mainFragmentShader = `
precision highp float;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec3 uHead;
uniform vec3 uBody;
uniform vec3 uTail;
uniform vec3 uHaze;
uniform float uRiseSpeed;
uniform float uRiseScale;
uniform float uRiseIntensity;
uniform float uFlowSpeed;
uniform float uFlowDensity;
uniform float uFlowIntensity;
uniform float uHorizonIntensity;
uniform float uHaloIntensity;
uniform float uHorizonHeight;
uniform float uCircleScale;
uniform float uScale;
uniform float uBrightness;
uniform float uColumn;
uniform float uWidth;
uniform float uLength;
uniform float uDepth;
uniform float uSpread;
uniform float uFade;
uniform float uHorizonIn;
uniform float uOpen;
uniform float uReveal;
uniform float uEncode;
uniform vec3 uDraft;
uniform float uLift[64];
uniform vec4 uVolleys[8];

in vec2 vUv;
out vec4 fragColor;

float hash2D(vec2 coord) {
  vec2 k = fract(coord * vec2(127.82, 311.45));
  k += dot(k, k + 71.83);
  return fract(k.x * k.y);
}

vec2 hash2D_vec2(vec2 coord) {
  float h1 = hash2D(coord);
  float h2 = hash2D(coord + h1);
  return vec2(h1, h2);
}

vec2 computeParticleOffset(vec2 cellIndex, float timeScale) {
  vec2 randVec = hash2D_vec2(cellIndex);
  return sin(randVec * uTime * timeScale) * 0.4;
}

float liftAt(float u) {
  float f = clamp(u * 64.0 - 0.5, 0.0, 63.0);
  int i = int(f);
  int j = min(i + 1, 63);
  return mix(uLift[i], uLift[j], f - float(i));
}

float draftAt(float u, float aspect) {
  float g = ((u - 0.5) * aspect - uDraft.x) / uDraft.z;
  return min(uDraft.y * exp(-g * g), 1.5);
}

vec3 lineTint(float along, float near) {
  vec3 tint = mix(uHead, uBody, smoothstep(0.0, 0.2, along));
  tint = mix(tint, uTail, smoothstep(0.22, 1.0, along));
  return mix(tint, uTail, (1.0 - near) * 0.55);
}

float generateAscendingGlow(vec2 coordinates, float gridDensity, float aspect) {
  vec2 scaledCoords = coordinates * gridDensity;
  float column = floor(scaledCoords.x);
  float total = 0.0;
  for (int i = -1; i <= 1; i++) {
    float cellX = column + float(i);
    float u = (cellX + 0.5) / gridDensity * uScale / aspect * 0.5 + 0.5;
    float lifted = scaledCoords.y - (uTime + liftAt(u)) * uRiseSpeed * gridDensity;
    float row = floor(lifted);
    float boost = 1.0 + 0.6 * draftAt(u, aspect);
    for (int j = -1; j <= 1; j++) {
      vec2 cellIndex = vec2(cellX, row + float(j));
      vec2 pick = hash2D_vec2(cellIndex + 17.3);
      if (pick.x > 0.38) continue;
      vec2 localPos = vec2(scaledCoords.x, lifted) - cellIndex - 0.5;
      vec2 particlePos = computeParticleOffset(cellIndex, 0.7);
      vec2 delta = particlePos - localPos;
      float spot = 1.0 / (1.0 + dot(delta, delta) * 22500.0);
      float window = 1.0 - smoothstep(0.25, 0.55, length(delta));
      float phase = particlePos.x * 10.0;
      float oscillation = sin(uTime * 1.6 + phase) * 0.22 + 0.85;
      total += spot * window * oscillation * boost * (0.3 + 1.2 * pick.y * pick.y);
    }
  }
  return total;
}

void main() {
  vec2 cssRes = uRes / uDpr;
  float aspectRatio = uRes.x / uRes.y;
  vec2 screenUV = gl_FragCoord.xy / uRes;
  vec2 centeredUV = (screenUV - 0.5) * 2.0;
  centeredUV.x *= aspectRatio;

  vec2 transformedUV = centeredUV / uScale;
  transformedUV.y -= uHorizonHeight / uScale;
  float rise = transformedUV.y + 0.1;

  float reveal = 1.0 - smoothstep(uReveal - 0.14, uReveal, rise);
  float ceiling = 1.0 - smoothstep(0.6, 0.98, screenUV.y);
  vec2 vignetteCoords = (screenUV - 0.5) * 2.0;
  float vignetteMask = smoothstep(-0.6 + uCircleScale, 0.2 + uCircleScale, 1.0 - length(vignetteCoords));

  vec2 haloOffset = transformedUV * vec2(1.0, 10.0) - vec2(0.0, -1.0);
  float halo = uHaloIntensity * 2.0 / pow(dot(haloOffset, haloOffset) + 0.0004, 1.2) / 15.0;
  float lineAmp = halo / (1.0 + halo / 3.0);
  float combAmp = halo / (1.0 + halo / 10.0);
  float shown = smoothstep(0.0, 0.01, rise + 0.01) * reveal * ceiling;

  vec2 scaledScreenUV = (screenUV - 0.5) / uScale + 0.5;
  vec2 pixelCoords = scaledScreenUV * cssRes;
  float workX = abs((scaledScreenUV.x - 0.5) * 2.0) * uFlowDensity;
  float workY = 1.0 - scaledScreenUV.y + workX;
  float weight = workY * workY * 2.4;
  float horizonScreen = 0.5 + 0.5 * (uHorizonHeight - 0.1 * uScale);
  float horizonPixel = ((horizonScreen - 0.5) / uScale + 0.5) * cssRes.y;
  float unit = 1.0 / (uDpr * uScale);
  float cssUnit = 1.0 / uScale;

  float sx = vignetteCoords.x / max(uOpen * uSpread, 0.05);
  float bell = exp(-2.4 * sx * sx) * (1.0 - smoothstep(0.4, 0.97, abs(sx)));
  float wide = exp(-1.2 * sx * sx) * (1.0 - smoothstep(0.35, 1.0, abs(sx)));
  float lateral = 1.0 - smoothstep(0.5, 1.05, abs(sx));
  vec3 light = vec3(0.0);
  float total = 0.0;

  float cssX = gl_FragCoord.x / uDpr;
  float column = floor(cssX / uColumn);
  float columnX = (column + 0.5) * uColumn;
  float columnU = columnX / cssRes.x;
  float seed = fract(tan(((columnU - 0.5) / uScale + 0.5) * cssRes.x) * 7.0);
  vec2 pick = hash2D_vec2(vec2(column, 5.31));
  vec2 pick2 = hash2D_vec2(vec2(column, 9.77));
  float near = mix(1.0, pick.x, uDepth);
  float draft = draftAt(columnU, aspectRatio);
  float animOffset = cssRes.y * (uTime + 60.0 + liftAt(columnU)) * uFlowSpeed;
  float head = mod(seed * animOffset, cssRes.x);
  float wrapFade = 1.0 - smoothstep(cssRes.x * 0.72, cssRes.x, head);
  float base = horizonPixel + (1.0 - near) * 0.05 * cssRes.y * cssUnit;
  float above = pixelCoords.y - base;
  float gap = head - pixelCoords.y;
  float widthDev = uWidth * mix(0.5, 1.0, near) * uDpr;
  float cover = clamp(0.5 + 0.5 * widthDev - abs(cssX - columnX) * uDpr, 0.0, min(widthDev, 1.0));
  float hero = pow(pick2.x, 5.0);
  float strength = (0.1 + 2.2 * hero) * (0.45 + 0.55 * seed) * mix(0.3, 1.0, near) * (1.0 + 0.8 * draft);
  float tailLen = (40.0 + 150.0 * pick2.y + 220.0 * hero) * uLength * mix(0.45, 1.0, near) * cssUnit;
  float along = gap / tailLen;
  float taper = pow(clamp(1.0 - along, 0.0, 1.0), 2.2);
  float headGlow = exp(-max(gap, 0.0) / (3.5 * cssUnit));
  float body = strength * weight * cover * wrapFade * smoothstep(-unit, unit, gap) * smoothstep(0.0, 2.0 * unit, above);
  float needle = body * taper * (0.75 * lineAmp + headGlow * (2.2 + 0.8 * min(lineAmp, 2.0))) * lateral;
  light += lineTint(clamp(along, 0.0, 1.0), near) * needle;
  total += needle;

  float lead = head - base;
  float combHeight = (4.0 + 12.0 * pick.y * pick.y) * cssUnit * (1.0 + 0.6 * draft);
  float comb = seed * weight * cover * wrapFade * smoothstep(0.0, 4.0 * unit, lead) / (1.0 + max(lead, 0.0) / (60.0 * cssUnit))
    * exp(-max(above, 0.0) / combHeight) * smoothstep(-unit, unit, above) * mix(0.4, 1.0, near) * combAmp * 0.55 * pow(wide, 1.5);
  light += mix(uBody, uHead, min(combAmp / 10.0, 1.0) * 0.6) * comb;
  total += comb;

  for (int n = 0; n < 8; n++) {
    vec4 volley = uVolleys[n];
    if (volley.z <= 0.0 || abs(cssX - volley.x) > 66.0 + uWidth) continue;
    for (int j = 0; j < 9; j++) {
      float lane = float(j);
      vec2 a = hash2D_vec2(vec2(volley.w, lane * 1.37 + 0.5));
      vec2 b = hash2D_vec2(vec2(lane * 2.11 + 0.25, volley.w));
      float t = volley.y - a.y * 0.2;
      if (t <= 0.0) continue;
      float x = volley.x + (a.x + b.x - 1.0) * 64.0;
      float widthV = uWidth * 1.1 * uDpr;
      float coverV = clamp(0.5 + 0.5 * widthV - abs(cssX - x) * uDpr, 0.0, min(widthV, 1.0));
      if (coverV <= 0.0) continue;
      float apex = (0.3 + 0.45 * b.y) * min(volley.z, 2.0) * cssRes.y * cssUnit;
      float gapV = horizonPixel + apex * (1.0 - exp(-t / (0.5 + 0.3 * a.x))) - pixelCoords.y;
      float tailV = (70.0 + 110.0 * b.x) * uLength * cssUnit;
      float alongV = gapV / tailV;
      float taperV = pow(clamp(1.0 - alongV, 0.0, 1.0), 2.2);
      float life = smoothstep(0.0, 0.06, t) * pow(1.0 - clamp(t / 3.0, 0.0, 1.0), 2.0);
      float valueV = min(volley.z, 2.0) * 1.3 * weight * coverV * life * smoothstep(-unit, unit, gapV)
        * smoothstep(0.0, 2.0 * unit, pixelCoords.y - horizonPixel) * taperV * (0.75 * lineAmp + exp(-max(gapV, 0.0) / (3.5 * cssUnit)) * (2.2 + 0.8 * min(lineAmp, 2.0)));
      light += lineTint(clamp(alongV, 0.0, 1.0), 1.0) * valueV;
      total += valueV;
    }
  }

  float sparks = uRiseIntensity > 0.0 ? generateAscendingGlow(transformedUV, uRiseScale, aspectRatio) * uRiseIntensity : 0.0;
  sparks *= (0.6 + min(lineAmp, 2.0)) * 1.6 * lateral;
  light += mix(uBody, uHead, 0.35) * sparks;
  total += sparks;

  light *= shown;
  total *= shown;

  float dyCss = (pixelCoords.y - horizonPixel) * uScale;
  float dyDev = dyCss * uDpr;
  float sigma = (0.4 + 0.55 * bell) * uDpr;
  float sigmaE = sqrt(sigma * sigma + 0.083);
  float coreLine = exp(-0.5 * dyDev * dyDev / (sigmaE * sigmaE)) * (sigma / sigmaE) * pow(bell, 1.3);
  float upward = max(dyCss, 0.0);
  float downward = max(-dyCss, 0.0);
  float reach = 1.0 - smoothstep(0.0, 0.55 * cssRes.y, abs(dyCss));
  float glowBand = exp(-(upward / (4.0 + 20.0 * bell) + downward / (2.5 + 9.0 * bell))) * pow(bell, 0.9) * reach;
  float hazeBand = exp(-(upward / (0.14 * cssRes.y) + downward / (0.035 * cssRes.y))) * wide * reach;
  float horizonLight = uHorizonIntensity * uHorizonIn * uFade;
  vec3 horizon = uHead * coreLine * 2.6 + mix(uTail, uBody, bell) * glowBand * 0.6 + uHaze * hazeBand * 0.12 * (0.4 + uDepth);
  light += horizon * horizonLight;
  total += (coreLine * 2.6 + glowBand * 0.6 + hazeBand * 0.12 * (0.4 + uDepth)) * horizonLight;

  float gain = vignetteMask * uBrightness * uFade;
  light *= gain;
  total *= gain;
  vec4 result = vec4(light, total);
  fragColor = uEncode > 0.5 ? result / (1.0 + result) : result;
}
`;

const thresholdFragShader = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;
vec4 tap(vec2 d) {
  vec4 c = texture(uSource, vUv + d * uTexel);
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}
void main() {
  vec4 color = tap(vec2(0.0)) * 0.125
    + (tap(vec2(-2.0, 2.0)) + tap(vec2(2.0, 2.0)) + tap(vec2(-2.0, -2.0)) + tap(vec2(2.0, -2.0))) * 0.03125
    + (tap(vec2(0.0, 2.0)) + tap(vec2(-2.0, 0.0)) + tap(vec2(2.0, 0.0)) + tap(vec2(0.0, -2.0))) * 0.0625
    + (tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0)) + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0))) * 0.125;
  if (uThreshold > 0.0) {
    float peak = max(color.r, max(color.g, color.b));
    float knee = uThreshold * 0.8;
    float soft = clamp(peak - uThreshold + knee, 0.0, 2.0 * knee);
    soft = soft * soft / (4.0 * knee + 0.00001);
    color *= max(soft, peak - uThreshold) / max(peak, 0.00001);
  }
  fragColor = uEncode > 0.5 ? color / (1.0 + color) : color;
}
`;

const blurFragShader = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;
vec4 tap(vec2 d) {
  vec4 c = texture(uSource, vUv + d * uTexel);
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}
void main() {
  vec4 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  color /= 16.0;
  fragColor = uEncode > 0.5 ? color / (1.0 + color) : color;
}
`;

const compositeFragShader = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uInk;
uniform float uEncode;
in vec2 vUv;
out vec4 fragColor;

vec4 decode(vec4 c) {
  return uEncode > 0.5 ? c / max(1.0 - c, 0.002) : c;
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec4 scene = decode(texture(uScene, vUv));
  vec4 bloom = decode(texture(uBloom, vUv));
  float dither = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  if (uInk > 0.5) {
    vec4 field = scene + bloom * uBloomStrength * 0.45;
    float amount = field.a * field.a / (field.a + 0.06);
    vec3 ink = field.rgb / max(field.a, 0.00001);
    float cover = 1.0 - exp(-amount * 1.5 * uExposure);
    fragColor = vec4(encode(ink), clamp(cover + dither, 0.0, 1.0));
    return;
  }
  vec3 emission = scene.rgb + bloom.rgb * uBloomStrength;
  float peak = max(emission.r, max(emission.g, emission.b));
  emission *= peak / (peak + 0.05);
  vec3 color = encode(1.0 - exp(-emission * uExposure)) + dither;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  fragColor = vec4(clamp(color / max(alpha, 0.0001), 0.0, 1.0), alpha);
}
`;

export const RisingLines = forwardRef<RisingLinesHandle, RisingLinesProps>(
  function RisingLines(
    {
      colors,
      backgroundColor = "transparent",
      density = 1,
      speed = 0.6,
      lineWidth = 1,
      lineLength = 1,
      horizonHeight = -0.45,
      horizonGlow = 1,
      depth = 0.5,
      spread = 1,
      updraft = 1,
      particles = 1,
      interactive = true,
      intro = true,
      paused = false,
      dpr = 2,
      className,
      style,
      color,
      horizonColor,
      haloColor,
      riseSpeed = 0.1,
      riseScale = 11.5,
      riseIntensity = 1,
      flowSpeed = 0.2,
      flowDensity = 4,
      flowIntensity = 0.6,
      horizonIntensity = 0.85,
      haloIntensity = 7.5,
      circleScale,
      scale = 3.5,
      brightness = 1,
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

    const activeLineColor = color ?? colors?.[1] ?? "#426A8C";
    const config = {
      glowColor: horizonColor ?? colors?.[0] ?? "#527C9F",
      lineColor: activeLineColor,
      haloColor: haloColor ?? colors?.[1] ?? activeLineColor,
      backgroundColor,
      column: Math.max(lineWidth, 1) / clamp(finite(density, 1), 0.1, 10),
      speed,
      lineWidth,
      lineLength,
      horizonHeight,
      depth,
      spread,
      updraft,
      riseSpeed,
      riseScale,
      riseIntensity: riseIntensity * particles,
      flowSpeed,
      flowDensity,
      flowIntensity,
      horizonIntensity: horizonIntensity * horizonGlow,
      haloIntensity,
      circleScale: circleScale ?? 0.2 + (spread - 1) * 0.6,
      scale,
      brightness,
      interactive,
      intro,
      paused,
      dpr,
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

        try {
          renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          });
        } catch {
          return null;
        }

        renderer.setClearColor(0, 0);
        renderer.autoClear = false;

        const canvas = renderer.domElement;
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
        el.appendChild(canvas);

        const hasFloat =
          renderer.extensions.has("EXT_color_buffer_float") ||
          renderer.extensions.has("EXT_color_buffer_half_float");
        const encodeFlag = hasFloat ? 0 : 1;

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
        const quadGeo = new THREE.BufferGeometry();
        quadGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
            3
          )
        );

        const scene = new THREE.Scene();
        const mesh = new THREE.Mesh(quadGeo);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const createMat = (
          frag: string,
          uniforms: Record<string, any>,
          addBlend = false
        ) =>
          new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            vertexShader,
            fragmentShader: frag,
            uniforms,
            blending: addBlend
              ? THREE.AdditiveBlending
              : THREE.NoBlending,
            transparent: addBlend,
            depthTest: false,
            depthWrite: false,
          });

        const liftArray = new Float32Array(64);
        const volleyVecs = Array.from({ length: 8 }, () => new THREE.Vector4());

        const uniforms = {
          uRes: { value: new THREE.Vector2(1, 1) },
          uDpr: { value: 1 },
          uTime: { value: 0 },
          uHead: { value: new THREE.Vector3() },
          uBody: { value: new THREE.Vector3() },
          uTail: { value: new THREE.Vector3() },
          uHaze: { value: new THREE.Vector3() },
          uRiseSpeed: { value: 0.1 },
          uRiseScale: { value: 11.5 },
          uRiseIntensity: { value: 1 },
          uFlowSpeed: { value: 0.2 },
          uFlowDensity: { value: 4 },
          uFlowIntensity: { value: 0.6 },
          uHorizonIntensity: { value: 0.85 },
          uHaloIntensity: { value: 7.5 },
          uHorizonHeight: { value: -0.45 },
          uCircleScale: { value: 0.2 },
          uScale: { value: 3.5 },
          uBrightness: { value: 1 },
          uColumn: { value: 1 },
          uWidth: { value: 1 },
          uLength: { value: 1 },
          uDepth: { value: 0.5 },
          uSpread: { value: 1 },
          uFade: { value: 1 },
          uHorizonIn: { value: 1 },
          uOpen: { value: 1 },
          uReveal: { value: 9 },
          uEncode: { value: encodeFlag },
          uDraft: { value: new THREE.Vector3(0, 0, 0.13) },
          uLift: { value: liftArray },
          uVolleys: { value: volleyVecs },
        };

        const mainMaterial = createMat(mainFragmentShader, uniforms);

        const createTarget = () =>
          new THREE.WebGLRenderTarget(1, 1, {
            type: hasFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
            format: THREE.RGBAFormat,
            depthBuffer: false,
            stencilBuffer: false,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            generateMipmaps: false,
          });

        const sceneTarget = createTarget();
        const bloomTargets = Array.from({ length: 5 }, createTarget);

        const thresholdMat = createMat(thresholdFragShader, {
          uSource: { value: null },
          uTexel: { value: new THREE.Vector2() },
          uThreshold: { value: 0 },
          uEncode: { value: encodeFlag },
        });

        const blurMat = createMat(
          blurFragShader,
          {
            uSource: { value: null },
            uTexel: { value: new THREE.Vector2() },
            uEncode: { value: encodeFlag },
          },
          !encodeFlag
        );

        const compositeMat = createMat(compositeFragShader, {
          uScene: { value: sceneTarget.texture },
          uBloom: { value: bloomTargets[0].texture },
          uBloomStrength: { value: 0.1 },
          uExposure: { value: 1 },
          uInk: { value: 0 },
          uEncode: { value: encodeFlag },
        });

        let vpW = 0;
        let vpH = 0;
        let vpDpr = 1;
        let ready = false;
        let isLightBg = false;
        let lastColorKey = "";
        let lastTimeCheck = -Infinity;
        let animTime = 0;
        let fadeAlpha = 1;
        let isReplaying = false;
        let horizonInVal = 1;
        let revealVal = 9;
        let introStartTime = -1;
        let draftX = 0;
        let draftVel = 0;
        let targetDraftX = 0;
        let draftZ = 0;
        let pointerActive = 0;
        let rafId = 0;
        let lastTimestamp = 0;
        let isDestroyed = false;
        let isCtxLost = false;
        let isVisible = true;
        let activePointer: { id: number; x: number; y: number; time: number } | null = null;
        const volleys: { x: number; age: number; strength: number; seed: number }[] = [];

        const updateColors = () => {
          const cfg = cfgRef.current;
          const bgRgb =
            parseColor(cfg.backgroundColor) ??
            (() => {
              let cur: HTMLElement | null = el.parentElement;
              while (cur) {
                const computed = win
                  .getComputedStyle(cur)
                  .backgroundColor.match(/rgba?\(([^)]+)\)/);
                if (computed) {
                  const parts = computed[1]
                    .split(/[\s,/]+/)
                    .filter(Boolean)
                    .map((p) => Number.parseFloat(p));
                  if (parts.length < 4 || parts[3] > 0.05) {
                    return [parts[0] / 255, parts[1] / 255, parts[2] / 255] as [
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

          isLightBg =
            0.2126 * bgRgb[0] + 0.7152 * bgRgb[1] + 0.0722 * bgRgb[2] > 0.55;
          const key = [
            cfg.glowColor,
            cfg.lineColor,
            cfg.haloColor,
            isLightBg,
          ].join("|");
          if (key === lastColorKey) return;
          lastColorKey = key;

          const glowRgb = parseColor(cfg.glowColor) ?? [0.55, 0.36, 0.96];
          const lineRgb = parseColor(cfg.lineColor) ?? [1, 0.62, 0.99];
          const haloRgb = parseColor(cfg.haloColor) ?? lineRgb;

          const fLab = linearToOklab([
            lineRgb[0] * haloRgb[0],
            lineRgb[1] * haloRgb[1],
            lineRgb[2] * haloRgb[2],
          ]);
          const hLab = linearToOklab(glowRgb);

          if (fLab[1] < 0.02) fLab[2] = hLab[2];
          if (hLab[1] < 0.02) hLab[2] = fLab[2];

          const diff = hLab[2] - fLab[2];
          hLab[2] = fLab[2] + Math.atan2(Math.sin(diff), Math.cos(diff));
          const hasChroma = fLab[1] > 0.02 || hLab[1] > 0.02;

          let headLab: [number, number, number] = [
            Math.min(fLab[0] + 0.16, 0.97),
            0.45 * fLab[1],
            fLab[2],
          ];
          let bodyLab: [number, number, number] = [fLab[0], 1.15 * fLab[1], fLab[2]];
          let tailLab: [number, number, number] = [
            0.92 * hLab[0],
            1.1 * hLab[1],
            hLab[2],
          ];
          let hazeLab: [number, number, number] = [
            tailLab[0] + (bodyLab[0] - tailLab[0]) * 0.3,
            tailLab[1] + (bodyLab[1] - tailLab[1]) * 0.3,
            tailLab[2] + (bodyLab[2] - tailLab[2]) * 0.3,
          ];

          if (isLightBg) {
            headLab = [
              clamp(0.62 * fLab[0], 0.4, 0.52),
              Math.max(1.3 * fLab[1], 0.16 * (hasChroma ? 1 : 0)),
              fLab[2],
            ];
            bodyLab = [
              clamp(0.7 * fLab[0], 0.44, 0.58),
              Math.max(1.15 * fLab[1], 0.14 * (hasChroma ? 1 : 0)),
              fLab[2],
            ];
            tailLab = [
              clamp(0.8 * hLab[0], 0.38, 0.52),
              Math.max(1.15 * hLab[1], 0.13 * (hasChroma ? 1 : 0)),
              hLab[2],
            ];
            hazeLab = [
              0.62,
              Math.max(0.9 * hLab[1], 0.1 * (hasChroma ? 1 : 0)),
              hLab[2],
            ];
          }

          const setUniformVec3 = (
            vec: THREE.Vector3,
            lab: [number, number, number]
          ) => {
            const temp = [...lab] as [number, number, number];
            for (
              let step = 0;
              step < 24 &&
              !oklabToLinear(temp).every(
                (v) => v >= -0.0005 && v <= 1.0005
              );
              step++
            ) {
              temp[1] *= 0.93;
            }
            const lin = oklabToLinear(temp);
            vec.set(
              clamp(lin[0], 0, 1),
              clamp(lin[1], 0, 1),
              clamp(lin[2], 0, 1)
            );
          };

          setUniformVec3(uniforms.uHead.value, headLab);
          setUniformVec3(uniforms.uBody.value, bodyLab);
          setUniformVec3(uniforms.uTail.value, tailLab);
          setUniformVec3(uniforms.uHaze.value, hazeLab);
          compositeMat.uniforms.uInk.value = isLightBg ? 1 : 0;
        };

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
            ready = false;
            return false;
          }
          const dprVal = Math.min(
            win.devicePixelRatio || 1,
            clamp(finite(cfg.dpr, 2), 0.5, 3)
          );
          if (ready && w === vpW && h === vpH && dprVal === vpDpr) return false;

          ready = true;
          vpW = w;
          vpH = h;
          vpDpr = dprVal;

          renderer.setPixelRatio(vpDpr);
          renderer.setSize(vpW, vpH, false);

          const bufW = Math.max(1, Math.round(vpW * vpDpr));
          const bufH = Math.max(1, Math.round(vpH * vpDpr));

          sceneTarget.setSize(bufW, bufH);
          uniforms.uRes.value.set(bufW, bufH);
          uniforms.uDpr.value = bufH / vpH;

          let curW = bufW;
          let curH = bufH;
          for (const target of bloomTargets) {
            curW = Math.max(1, Math.round(curW / 2));
            curH = Math.max(1, Math.round(curH / 2));
            target.setSize(curW, curH);
          }
          return true;
        };

        const renderFrame = () => {
          if (!ready) return;
          const cfg = cfgRef.current;

          if (performance.now() - lastTimeCheck > 1000) {
            lastTimeCheck = performance.now();
            updateColors();
          }

          const strokeW = clamp(finite(cfg.lineWidth, 1), 0.25, 6);
          uniforms.uTime.value = animTime;
          uniforms.uRiseSpeed.value = clamp(finite(cfg.riseSpeed, 0.1), 0, 2);
          uniforms.uRiseScale.value = clamp(finite(cfg.riseScale, 11.5), 1, 60);
          uniforms.uRiseIntensity.value = clamp(
            finite(cfg.riseIntensity, 1),
            0,
            4
          );
          uniforms.uFlowSpeed.value = clamp(finite(cfg.flowSpeed, 0.2), 0, 4);
          uniforms.uFlowDensity.value = clamp(finite(cfg.flowDensity, 4), 0, 20);
          uniforms.uFlowIntensity.value = clamp(
            finite(cfg.flowIntensity, 0.6),
            0,
            4
          );
          uniforms.uHorizonIntensity.value = clamp(
            finite(cfg.horizonIntensity, 0.85),
            0,
            8
          );
          uniforms.uHaloIntensity.value = clamp(
            finite(cfg.haloIntensity, 7.5),
            0,
            40
          );
          uniforms.uHorizonHeight.value = clamp(
            finite(cfg.horizonHeight, -0.45),
            -3,
            3
          );
          uniforms.uCircleScale.value = clamp(
            finite(cfg.circleScale, 0.2),
            -0.5,
            1.5
          );
          uniforms.uScale.value = clamp(finite(cfg.scale, 3.5), 0.3, 40);
          uniforms.uBrightness.value =
            (clamp(finite(cfg.brightness, 1), 0, 4) *
              clamp(finite(cfg.flowIntensity, 0.6), 0, 4)) /
            0.6;
          uniforms.uColumn.value = Math.max(
            clamp(finite(cfg.column, 1), 0.25, 40),
            strokeW,
            1 / vpDpr
          );
          uniforms.uWidth.value = strokeW;
          uniforms.uLength.value = clamp(finite(cfg.lineLength, 1), 0.1, 6);
          uniforms.uDepth.value = clamp(finite(cfg.depth, 0.5), 0, 1);
          uniforms.uSpread.value = clamp(finite(cfg.spread, 1), 0.1, 2);
          uniforms.uFade.value = fadeAlpha;
          uniforms.uHorizonIn.value = horizonInVal;
          uniforms.uOpen.value = 0.1 + 0.9 * horizonInVal;
          uniforms.uReveal.value = revealVal;
          uniforms.uDraft.value.set(
            draftX,
            draftZ * clamp(finite(cfg.updraft, 1), 0, 3),
            0.13
          );

          for (let i = 0; i < 8; i++) {
            const v = volleys[i];
            if (v) volleyVecs[i].set(v.x, v.age, v.strength, v.seed);
            else volleyVecs[i].set(0, 0, 0, 0);
          }

          mesh.material = mainMaterial;
          renderer.setRenderTarget(sceneTarget);
          renderer.clear();
          renderer.render(scene, camera);

          let src = sceneTarget;
          mesh.material = thresholdMat;
          for (const target of bloomTargets) {
            thresholdMat.uniforms.uThreshold.value =
              src === sceneTarget ? (isLightBg ? 0.5 : 0.35) : 0;
            thresholdMat.uniforms.uSource.value = src.texture;
            thresholdMat.uniforms.uTexel.value.set(
              1 / src.width,
              1 / src.height
            );
            renderer.setRenderTarget(target);
            renderer.render(scene, camera);
            src = target;
          }

          mesh.material = blurMat;
          for (let i = bloomTargets.length - 1; i > 0; i--) {
            blurMat.uniforms.uSource.value = bloomTargets[i].texture;
            blurMat.uniforms.uTexel.value.set(
              1 / bloomTargets[i].width,
              1 / bloomTargets[i].height
            );
            renderer.setRenderTarget(bloomTargets[i - 1]);
            if (encodeFlag) renderer.clear();
            renderer.render(scene, camera);
          }

          compositeMat.uniforms.uBloomStrength.value =
            ((isLightBg ? 0.35 : 0.85) / bloomTargets.length) * 2;
          mesh.material = compositeMat;
          renderer.setRenderTarget(null);
          renderer.clear();
          renderer.render(scene, camera);
        };

        const resetToEmpty = () => {
          liftArray.fill(0);
          volleys.length = 0;
          horizonInVal = 1;
          revealVal = 9;
          introStartTime = -1;
          fadeAlpha = 1;
          isReplaying = false;
        };

        const resetToStatic = () => {
          animTime = 9;
          horizonInVal = 1;
          revealVal = 9;
          introStartTime = -1;
          fadeAlpha = 1;
          isReplaying = false;
          volleys.length = 0;
          draftZ = 0;
          pointerActive = 0;
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

          if (cfg.reduced || (cfg.paused && introStartTime === -2)) {
            resetToStatic();
          }

          const isMoving = !cfg.reduced && !cfg.paused;
          if (isMoving) {
            const spd = clamp(finite(cfg.speed, 1), 0, 4);
            if (isReplaying) {
              fadeAlpha = Math.max(0, fadeAlpha - dt / 0.4);
              if (fadeAlpha <= 0) resetToEmpty();
            }

            if (introStartTime === -2) introStartTime = ts;
            if (introStartTime >= 0) {
              const elapsed = (ts - introStartTime) / 1000;
              horizonInVal = 1 - Math.pow(1 - clamp(elapsed / 1.6, 0, 1), 3);
              revealVal =
                (1 - Math.pow(1 - clamp((elapsed - 0.25) / 1.6, 0, 1), 3)) * 1.2;
              if (elapsed > 2.1) {
                introStartTime = -1;
                horizonInVal = 1;
                revealVal = 9;
              }
            }

            animTime += dt * spd;
            const targetZ = cfg.interactive ? pointerActive : 0;
            draftZ += (targetZ - draftZ) * (1 - Math.exp(-dt / 0.45));
            draftVel += (-56.25 * (draftX - targetDraftX) - 15 * draftVel) * dt;
            draftX += draftVel * dt;

            const draftPower = clamp(finite(cfg.updraft, 1), 0, 3) * draftZ;
            if (draftPower > 0.0005) {
              const asp = vpW / Math.max(vpH, 1);
              const pushAmt = dt * spd * draftPower * 1.2;
              for (let i = 0; i < 64; i++) {
                const uPos = (((i + 0.5) / 64 - 0.5) * asp - draftX) / 0.13;
                liftArray[i] += pushAmt * Math.exp(-uPos * uPos);
              }
            }

            for (let i = volleys.length - 1; i >= 0; i--) {
              volleys[i].age += dt * spd;
              if (volleys[i].age > 3.4) volleys.splice(i, 1);
            }
          }

          renderFrame();

          if (isMoving && !doc.hidden) {
            rafId = requestAnimationFrame(onTick);
          } else {
            lastTimestamp = 0;
          }
        };

        const getPointerInfo = (clientX: number) => {
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return null;
          return {
            fraction: (clientX - rect.left) / rect.width,
            aspect: rect.width / rect.height,
          };
        };

        const fireVolley = (xFrac: number, strength: number) => {
          if (volleys.length >= 8) {
            let oldestIdx = 0;
            for (let i = 1; i < volleys.length; i++) {
              if (volleys[i].age > volleys[oldestIdx].age) oldestIdx = i;
            }
            if (volleys[oldestIdx].age < 2.38) return;
            volleys.splice(oldestIdx, 1);
          }
          volleys.push({
            x: clamp(xFrac, 0, 1) * vpW,
            age: 0,
            strength,
            seed: 1 + Math.floor(900 * Math.random()),
          });
          scheduleTick();
        };

        const canInteract = () => {
          const cfg = cfgRef.current;
          return cfg.interactive && !cfg.reduced && !cfg.paused;
        };

        const setDraft = (fraction: number, aspect: number) => {
          const target = (fraction - 0.5) * aspect;
          if (draftZ < 0.03) {
            draftX = target;
            draftVel = 0;
          }
          targetDraftX = target;
          pointerActive = 1;
          scheduleTick();
        };

        const onPointerDown = (e: PointerEvent) => {
          if (!e.isPrimary || !canInteract() || (e.pointerType === "mouse" && e.button !== 0))
            return;
          const info = getPointerInfo(e.clientX);
          if (!info) return;
          if (e.pointerType === "mouse") {
            fireVolley(info.fraction, 1);
            return;
          }
          activePointer = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            time: performance.now(),
          };
          setDraft(info.fraction, info.aspect);
        };

        const onPointerUp = (e: PointerEvent) => {
          if (e.pointerType === "mouse") return;
          pointerActive = 0;
          const p = activePointer;
          activePointer = null;
          if (
            !p ||
            p.id !== e.pointerId ||
            !canInteract() ||
            Math.hypot(e.clientX - p.x, e.clientY - p.y) > 12 ||
            performance.now() - p.time > 500
          )
            return;
          const info = getPointerInfo(e.clientX);
          if (info) fireVolley(info.fraction, 1);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (!canInteract() || (e.pointerType !== "mouse" && (!activePointer || activePointer.id !== e.pointerId)))
            return;
          const info = getPointerInfo(e.clientX);
          if (info) setDraft(info.fraction, info.aspect);
        };

        const onPointerLeave = (e: PointerEvent) => {
          if (e.pointerType === "mouse") {
            pointerActive = 0;
            scheduleTick();
          }
        };

        const onPointerCancel = () => {
          activePointer = null;
          pointerActive = 0;
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

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerleave", onPointerLeave);
        el.addEventListener("pointercancel", onPointerCancel);
        doc.addEventListener("visibilitychange", onVisibilityChange);
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);

        resizeObserver.observe(el);
        intersectionObserver.observe(el);

        if (cfgRef.current.reduced) resetToStatic();
        else if (cfgRef.current.intro) resetToEmpty();

        resize();
        updateColors();
        renderFrame();
        scheduleTick();

        return {
          sync: () => {
            lastTimeCheck = -Infinity;
            resize();
            lastTimestamp = 0;
            if (!rafId && isVisible) {
              renderFrame();
              scheduleTick();
            }
          },
          launch: (x?: number, strength?: number) => {
            const cfg = cfgRef.current;
            if (cfg.reduced || cfg.paused) return;
            fireVolley(
              x === undefined ? 0.2 + 0.6 * Math.random() : clamp(finite(x, 0.5), 0, 1),
              clamp(finite(strength ?? 1, 1), 0.1, 2)
            );
          },
          replay: () => {
            if (!cfgRef.current.reduced) {
              isReplaying = true;
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
            doc.removeEventListener("visibilitychange", onVisibilityChange);
            canvas.removeEventListener("webglcontextlost", onContextLost);
            canvas.removeEventListener("webglcontextrestored", onContextRestored);

            quadGeo.dispose();
            mainMaterial.dispose();
            thresholdMat.dispose();
            blurMat.dispose();
            compositeMat.dispose();
            sceneTarget.dispose();
            for (const t of bloomTargets) t.dispose();
            renderer.dispose();
            canvas.remove();
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
        launch: (x, s) => instanceRef.current?.launch(x, s),
        replay: () => instanceRef.current?.replay(),
      }),
      []
    );

    const bgStr = (backgroundColor ?? "").trim().toLowerCase();
    const hasBg = bgStr && bgStr !== "transparent" && bgStr !== "none";

    return (
      <div
        ref={containerRef}
        className={cn("absolute inset-0 overflow-hidden", className)}
        style={{
          backgroundColor: hasBg ? backgroundColor : undefined,
          ...style,
        }}
      />
    );
  }
);

RisingLines.displayName = "RisingLines";
export default RisingLines;
