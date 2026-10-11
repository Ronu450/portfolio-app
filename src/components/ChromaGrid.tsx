import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';

export interface ChromaItem {
  id?: string;
  image: string;
  title?: string;
  subtitle?: string;
  accent?: string;
  url?: string;
  alt?: string;
  borderColor?: string;
  badge?: string;
  company?: string;
  role?: string;
  metrics?: { label: string; val: string; sub?: string }[];
  technologies?: string[];
  isActive?: boolean;
  onClick?: () => void;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  columns?: number;
  minCardWidth?: number;
  gap?: number;
  radius?: number;
  softness?: number;
  damping?: number;
  fadeOut?: number;
  grayscale?: number;
  dim?: number;
  glow?: number;
  borderGlow?: number;
  reveal?: 'spotlight' | 'card';
  aspectRatio?: string;
  cardRadius?: number;
  showInfo?: boolean;
  frame?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  onItemClick?: (item: ChromaItem, index: number) => void;
}

const THEMES: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--chroma-frame': 'rgba(32, 37, 43, 0.8)',
    '--chroma-frame-edge': 'rgba(227, 231, 235, 0.12)',
    '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.08)',
    '--chroma-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--chroma-tile': 'linear-gradient(180deg, #272D35 0%, #20252B 100%)',
    '--chroma-tile-edge': 'rgba(227, 231, 235, 0.14)',
    '--chroma-tile-highlight': 'rgba(255, 255, 255, 0.08)',
    '--chroma-tile-shadow': '0 4px 14px -4px rgba(0, 0, 0, 0.7)',
    '--chroma-media-edge': 'rgba(227, 231, 235, 0.12)',
    '--chroma-well': 'rgba(255, 255, 255, 0.04)',
    '--chroma-ink': '#FAFAFA',
    '--chroma-muted': 'rgba(227, 231, 235, 0.7)',
    '--chroma-hover': 'brightness(1.06)',
    '--chroma-press': 'brightness(0.92)'
  },
  light: {
    '--chroma-frame': 'rgba(250, 250, 250, 0.85)',
    '--chroma-frame-edge': '#E3E7EB',
    '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--chroma-frame-shadow': '0 22px 44px -222px rgba(32, 37, 43, 0.2), 0 6px 16px -10px rgba(32, 37, 43, 0.1)',
    '--chroma-tile': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
    '--chroma-tile-edge': '#E3E7EB',
    '--chroma-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--chroma-tile-shadow': '0 4px 10px -5px rgba(32, 37, 43, 0.15)',
    '--chroma-media-edge': '#E3E7EB',
    '--chroma-well': 'rgba(32, 37, 43, 0.04)',
    '--chroma-ink': '#20252B',
    '--chroma-muted': '#52606D',
    '--chroma-hover': 'brightness(0.97)',
    '--chroma-press': 'brightness(0.92)'
  }
};

const DEFAULT_ITEMS: ChromaItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1514519334989-3d5c8b1a9f91?w=800&q=80&auto=format&fit=crop',
    title: 'Golden Hour',
    subtitle: 'Sky study',
    accent: '#ff8a4c'
  },
  {
    image: 'https://images.unsplash.com/photo-1520930528075-4ea5ead759f5?w=800&q=80&auto=format&fit=crop',
    title: 'Steel Arches',
    subtitle: 'Sculpture',
    accent: '#ff5a36'
  },
  {
    image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=800&q=80&auto=format&fit=crop',
    title: 'Black Beach',
    subtitle: 'Landscape',
    accent: '#a98bff'
  }
];

const SPOT_MASK =
  'radial-gradient(circle var(--chroma-r) at calc(var(--chroma-x, -9999px) - var(--chroma-ox, 0px)) calc(var(--chroma-y, -9999px) - var(--chroma-oy, 0px)), var(--chroma-stops))';
const GRID_COLUMNS =
  'repeat(auto-fill, minmax(min(100%, max(var(--chroma-min), calc((100% - (var(--chroma-cols) - 1) * var(--chroma-gap)) / var(--chroma-cols)))), 1fr))';
const WASH = 'radial-gradient(130% 70% at 50% 100%, var(--chroma-accent), transparent 72%)';
const TILE_RIM = 'inset 0 0 0 1px var(--chroma-tile-edge), inset 0 1px 0 var(--chroma-tile-highlight)';
const GLOW_RIM = 'inset 0 0 0 1px var(--chroma-accent), inset 0 0 16px -8px var(--chroma-accent)';
const FRAME_RIM = 'inset 0 0 0 1px var(--chroma-frame-edge), inset 0 1px 0 var(--chroma-frame-highlight)';
const IMAGE_CLASS = 'absolute inset-0 block h-full w-full select-none object-cover [-webkit-user-drag:none]';
const CARD_CLASS =
  'group relative box-border flex min-w-0 flex-col gap-3 overflow-hidden p-3 no-underline [isolation:isolate] transition-all duration-300 ease-out hover:[filter:var(--chroma-hover)] cursor-pointer text-left rounded-2xl border';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const falloffStops = (softness: number) => {
  const core = clamp(1 - softness, 0, 0.95);
  const stops = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const u = clamp((t - core) / Math.max(0.0001, 1 - core), 0, 1);
    const alpha = 1 - u * u * u * (u * (u * 6 - 15) + 10);
    stops.push(`rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`);
  }
  return stops.join(', ');
};

export const ChromaGrid = ({
  items,
  columns = 3,
  minCardWidth = 260,
  gap = 16,
  radius = 280,
  softness = 0.65,
  damping = 0.45,
  fadeOut = 0.6,
  grayscale = 1,
  dim = 0.15,
  glow = 0.6,
  borderGlow = 1,
  reveal = 'spotlight',
  aspectRatio = '16 / 10',
  cardRadius = 20,
  showInfo = true,
  frame = false,
  theme = 'dark',
  className = '',
  onItemClick
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<{ damping: number; fadeOut: number; spotlight: boolean } | null>(null);
  const placeRef = useRef<(() => void) | null>(null);
  const data = items?.length ? items : DEFAULT_ITEMS;
  settingsRef.current = { damping, fadeOut, spotlight: reveal !== 'card' };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
    let raf = 0;
    let last = 0;

    const place = () => {
      const box = root.getBoundingClientRect();
      root.querySelectorAll<HTMLElement>('[data-chroma-area]').forEach(node => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--chroma-ox', `${rect.left - box.left}px`);
        node.style.setProperty('--chroma-oy', `${rect.top - box.top}px`);
      });
    };
    placeRef.current = place;

    const frame = (now: number) => {
      raf = 0;
      const s = settingsRef.current;
      if (!s) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const follow = reduce ? 1 : 1 - Math.exp(-dt / Math.max(0.01, s.damping * 0.32));
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      const span = state.target > state.power ? 0.1 : Math.max(0.02, s.fadeOut * 0.35);
      state.power += (state.target - state.power) * (reduce ? 1 : 1 - Math.exp(-dt / span));
      root.style.setProperty('--chroma-x', `${state.x.toFixed(2)}px`);
      root.style.setProperty('--chroma-y', `${state.y.toFixed(2)}px`);
      root.style.setProperty('--chroma-power', state.power.toFixed(4));
      const settled =
        Math.abs(state.tx - state.x) < 0.1 &&
        Math.abs(state.ty - state.y) < 0.1 &&
        Math.abs(state.target - state.power) < 0.002;
      if (settled) {
        state.power = state.target;
        root.style.setProperty('--chroma-power', state.power.toFixed(4));
        last = 0;
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (!settingsRef.current?.spotlight) return;
      const box = root.getBoundingClientRect();
      state.tx = event.clientX - box.left;
      state.ty = event.clientY - box.top;
      if (!state.primed || state.power < 0.02) {
        state.x = state.tx;
        state.y = state.ty;
        state.primed = true;
      }
      state.target = 1;
      wake();
    };

    const onLeave = () => {
      state.target = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(place);
    resizeObserver.observe(root);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointercancel', onLeave);
    place();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointercancel', onLeave);
      placeRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    placeRef.current?.();
  });

  const spotlight = reveal !== 'card';
  const rootStyle = {
    ...(THEMES[theme] ?? THEMES.dark),
    '--chroma-cols': Math.max(1, Math.round(columns)),
    '--chroma-min': `${Math.max(80, minCardWidth)}px`,
    '--chroma-gap': `${Math.max(0, gap)}px`,
    '--chroma-r': `${Math.max(20, radius)}px`,
    '--chroma-stops': falloffStops(clamp(softness, 0, 1)),
    '--chroma-gray': clamp(grayscale, 0, 1),
    '--chroma-dim': clamp(dim, 0, 0.9),
    '--chroma-glow': clamp(glow, 0, 1),
    '--chroma-border': clamp(borderGlow, 0, 1),
    '--chroma-fade': `${Math.max(0, fadeOut)}s`,
    '--chroma-ratio': aspectRatio,
    '--chroma-radius': `${Math.max(0, cardRadius)}px`,
    ...(frame
      ? {
          padding: 10,
          borderRadius: 'calc(var(--chroma-radius) + 10px)',
          background: 'var(--chroma-frame)',
          boxShadow: 'var(--chroma-frame-shadow)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          backdropFilter: 'blur(20px) saturate(1.6)'
        }
      : {})
  } as CSSProperties;

  const washStyle: CSSProperties = spotlight
    ? {
        background: WASH,
        opacity: 'calc(var(--chroma-glow) * var(--chroma-power, 0) * 0.45)',
        WebkitMaskImage: SPOT_MASK,
        maskImage: SPOT_MASK
      }
    : { background: WASH };

  const colorStyle: CSSProperties = spotlight
    ? { opacity: 'var(--chroma-power, 0)', WebkitMaskImage: SPOT_MASK, maskImage: SPOT_MASK }
    : {};

  const glowStyle: CSSProperties = spotlight
    ? {
        boxShadow: GLOW_RIM,
        opacity: 'calc(var(--chroma-border) * var(--chroma-power, 0))',
        WebkitMaskImage: SPOT_MASK,
        maskImage: SPOT_MASK
      }
    : { boxShadow: GLOW_RIM };

  const fadeClass = 'opacity-0 transition-opacity duration-[var(--chroma-fade)] ease-[ease] group-hover:duration-300';

  return (
    <div
      ref={rootRef}
      className={`relative box-border w-full select-none [-webkit-tap-highlight-color:transparent] ${className}`.trim()}
      style={rootStyle}
    >
      <div className="grid" style={{ gap: 'var(--chroma-gap)', gridTemplateColumns: GRID_COLUMNS }}>
        {data.map((item, index) => {
          const accent = item.accent ?? item.borderColor ?? '#38bdf8';
          const key = `${item.id || item.title || index}-${index}`;
          const isSelected = Boolean(item.isActive);

          const cardStyle = {
            '--chroma-accent': accent,
            borderRadius: 'var(--chroma-radius)',
            background: 'var(--chroma-tile)',
            boxShadow: isSelected
              ? `0 0 35px -5px ${accent}50, var(--chroma-tile-shadow)`
              : 'var(--chroma-tile-shadow)',
            borderColor: isSelected ? accent : 'rgba(255, 255, 255, 0.1)',
            color: 'var(--chroma-ink)'
          } as CSSProperties;

          const body = (
            <>
              {/* Radial color wash */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-0 ${
                  spotlight ? '' : `${fadeClass} group-hover:opacity-[calc(var(--chroma-glow)*0.45)]`
                }`}
                style={washStyle}
              />

              {/* Media Container with Dual Image Layers: Grayscale base + Spotlight color reveal */}
              <div
                data-chroma-area=""
                className="relative z-[1] overflow-hidden rounded-xl border border-white/10 group-hover:border-white/20 transition-colors"
                style={{
                  aspectRatio: 'var(--chroma-ratio)',
                  borderRadius: 'max(0px, calc(var(--chroma-radius) - 6px))',
                  background: 'var(--chroma-well)'
                }}
              >
                {/* Grayscale Base Image */}
                <img
                  className={IMAGE_CLASS}
                  style={{
                    filter: 'grayscale(var(--chroma-gray)) brightness(calc(1 - var(--chroma-dim)))'
                  }}
                  src={item.image}
                  alt={item.alt ?? item.title ?? ''}
                  loading="lazy"
                />

                {/* Color Image revealed by cursor spotlight mask */}
                <img
                  className={`${IMAGE_CLASS} ${
                    spotlight ? '' : `${fadeClass} group-hover:opacity-100`
                  }`}
                  style={colorStyle}
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />

                {/* Subtle top and bottom dark vignettes for chip legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

                {/* Top Badge Overlay */}
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border truncate max-w-[70%]"
                      style={{
                        backgroundColor: 'rgba(5, 10, 20, 0.85)',
                        borderColor: `${accent}45`,
                        color: accent
                      }}
                    >
                      {item.badge}
                    </span>
                    {item.company && (
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-slate-300 border border-white/10 shrink-0">
                        {item.company}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Key Metric Chip overlay on the image */}
                {item.metrics && item.metrics.length > 0 && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
                    <span
                      className="font-bold flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/10"
                      style={{ color: accent }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      {item.metrics[0].val} {item.metrics[0].label}
                    </span>
                    {item.role && (
                      <span className="text-slate-300 text-[9px] bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/5 truncate max-w-[120px]">
                        {item.role}
                      </span>
                    )}
                  </div>
                )}

                {/* Edge ring */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{ boxShadow: 'inset 0 0 0 1px var(--chroma-media-edge)' }}
                />
              </div>

              {/* Card Information Body */}
              {showInfo && (
                <div className="relative z-[1] flex min-w-0 flex-col gap-2 px-1 pt-1 pb-1">
                  {item.title && (
                    <h4 className="text-sm sm:text-base font-bold text-foreground leading-snug tracking-tight line-clamp-2">
                      {item.title}
                    </h4>
                  )}
                  {item.subtitle && (
                    <p className="text-xs line-clamp-2 leading-relaxed text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Technology Pills */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.technologies.slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-foreground/80 border border-white/10 flex items-center gap-1"
                        >
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          <span>{tech}</span>
                        </span>
                      ))}
                      {item.technologies.length > 4 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.02] text-muted-foreground border border-white/5">
                          +{item.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Inspect Action Row */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">BLUEPRINT TOPOLOGY</span>
                    <span
                      className="font-bold flex items-center gap-1 transition-transform group-hover:translate-x-1"
                      style={{ color: accent }}
                    >
                      <span>INSPECT DETAILS</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Base Rim */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit]"
                style={{ boxShadow: TILE_RIM }}
              />

              {/* Spotlight Glow Rim */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-[2] rounded-[inherit] ${
                  spotlight ? '' : `${fadeClass} group-hover:opacity-[var(--chroma-border)]`
                }`}
                style={glowStyle}
              />
            </>
          );

          const handleClick = () => {
            item.onClick?.();
            onItemClick?.(item, index);
          };

          return item.url ? (
            <a
              key={key}
              data-chroma-area=""
              className={`${CARD_CLASS} active:[filter:var(--chroma-press)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:[outline-color:var(--chroma-ink)]`}
              style={cardStyle}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
            >
              {body}
            </a>
          ) : (
            <article
              key={key}
              data-chroma-area=""
              className={`${CARD_CLASS} active:[filter:var(--chroma-press)]`}
              style={cardStyle}
              onClick={handleClick}
            >
              {body}
            </article>
          );
        })}
      </div>
      {frame && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ boxShadow: FRAME_RIM }}
        />
      )}
    </div>
  );
};

export default ChromaGrid;
