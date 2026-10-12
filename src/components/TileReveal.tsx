'use client';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';

export interface TileRevealItem {
  id: string;
  image: string;
  title: string;
  badge?: string;
  company?: string;
}

export interface TileRevealProps {
  items: TileRevealItem[];
  headline?: ReactNode;
  children?: ReactNode;
  columns?: number;
  gap?: number;
  gridWidth?: number;
  tileAspect?: number;
  tileRadius?: number;
  grayscale?: boolean;
  direction?: 'alternate' | 'top' | 'bottom';
  stagger?: number;
  overlap?: number;
  zoom?: number;
  spread?: number;
  scrollLength?: number;
  scrub?: number;
  contentGap?: number;
  backgroundColor?: string;
  onProgress?: (progress: number) => void;
  onTileClick?: (index: number, item: TileRevealItem) => void;
  className?: string;
  style?: CSSProperties;
}

const clamp = (val: number, min: number, max: number) =>
  val < min ? min : val > max ? max : val;

const easePower = (t: number, power: number) =>
  t < 0.5
    ? Math.pow(2, power - 1) * Math.pow(t, power)
    : 1 - Math.pow(-2 * t + 2, power) / 2;

export default function TileReveal({
  items,
  headline,
  children,
  columns = 3,
  gap = 24,
  gridWidth = 780,
  tileAspect = 1.15,
  tileRadius = 18,
  grayscale = false,
  direction = 'alternate',
  stagger = 0.06,
  overlap = 0.6,
  zoom = 2.05,
  spread = 0.42,
  scrollLength = 2.8,
  scrub = 0.08,
  contentGap = 28,
  backgroundColor = 'transparent',
  onProgress,
  onTileClick,
  className = '',
  style,
}: TileRevealProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const currentProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef(0);
  const lastTime = useRef(0);
  const isTicking = useRef(false);

  const stickyWidth = useRef(0);
  const stickyHeight = useRef(0);
  const gridWidthCurrent = useRef(0);
  const gridHeightCurrent = useRef(0);
  const contentHeight = useRef(0);

  const cols = Math.max(1, Math.round(columns));
  const totalItems = items.length;

  const sequence = useMemo(() => {
    const midCol = (cols - 1) / 2;
    const colLengths = Array.from({ length: cols }, (_, c) =>
      Math.floor((totalItems - c + cols - 1) / cols)
    );
    const maxColLength = Math.max(0, ...colLengths);
    const zoomStart = Math.max(
      0,
      (maxColLength > 0 ? 1 + (maxColLength - 1) * stagger : 0) - overlap
    );
    const splitStart = zoomStart + 0.5;
    const contentStart = zoomStart + 1 - 0.32;
    const totalDuration = Math.max(zoomStart + 1, contentStart + 0.32, 0.001);

    const tiles = Array.from({ length: totalItems }, (_, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const colLen = colLengths[col];
      const isTop =
        direction === 'top' || (direction !== 'bottom' && col % 2 === 0);
      const isMid = Math.abs(col - midCol) < 0.001;
      const lateral = isMid ? 0 : Math.sign(col - midCol);
      const vertical = isMid
        ? row < Math.floor(colLen / 2)
          ? -1
          : 1
        : 0;

      return {
        start: (isTop ? colLen - 1 - row : row) * stagger,
        dir: isTop ? -1 : 1,
        col,
        row,
        lateral,
        vertical,
      };
    });

    return {
      tiles,
      rows: Math.ceil(totalItems / cols),
      midCol,
      zoomStart,
      splitStart,
      contentStart,
      total: totalDuration,
    };
  }, [cols, totalItems, direction, overlap, stagger]);

  const updateTransforms = useCallback(
    (progress: number) => {
      const grid = gridRef.current;
      if (!grid) return;

      // Use most of the pinned scroll span for the reveal to avoid a long idle tail.
      const headlineEased = easePower(clamp(progress / 0.56, 0, 1), 2);
      const headlineEl = headlineRef.current;
      if (headlineEl) {
        headlineEl.style.opacity = clamp(0.35 + headlineEased * 0.65, 0.35, 1).toFixed(3);
        headlineEl.style.transform = `translate3d(0, ${((1 - headlineEased) * 16).toFixed(2)}px, 0)`;
      }

      const contentEased = easePower(clamp(progress / 0.68, 0, 1), 2);
      const contentEl = contentRef.current;
      if (contentEl) {
        contentEl.style.opacity = contentEased.toFixed(3);
        contentEl.style.transform = `translate3d(0, ${((1 - contentEased) * 12).toFixed(2)}px, 0)`;
        contentEl.style.pointerEvents = contentEased > 0.2 ? 'auto' : 'none';
      }

      // 2. Controlled zoom: subtle scaling (1.0 to 1.12), so tiles DO NOT blow up and push offscreen
      const zoomEased = easePower(clamp(progress / 0.84, 0, 1), 2);
      const maxZoom = Math.max(zoom, 1);
      grid.style.transform = `scale(${1 + (maxZoom - 1) * zoomEased})`;

      const tileWidth = Math.max(
        1,
        (gridWidthCurrent.current - gap * (cols - 1)) / cols
      );
      const tileHeight = tileWidth / Math.max(tileAspect, 0.01);

      // 3. Spreading: tiles gently part outward to frame the headline, keeping ALL tiles visible on screen
      const spreadEased = easePower(clamp(progress / 0.84, 0, 1), 2);

      for (let i = 0; i < sequence.tiles.length; i++) {
        const tileEl = tileRefs.current[i];
        if (!tileEl) continue;

        const tileData = sequence.tiles[i];

        // Push outer columns outward slightly
        const lateralX =
          tileData.lateral *
          (tileWidth * 0.38 * spread) *
          spreadEased;

        // Push top row slightly up, bottom row slightly down
        const splitY =
          tileData.vertical *
          (tileHeight * 0.40 * spread) *
          spreadEased;

        tileEl.style.transform = `translate3d(${lateralX.toFixed(2)}px, ${splitY.toFixed(2)}px, 0)`;
        tileEl.style.visibility = 'visible';
      }

      onProgress?.(progress);
    },
    [cols, gap, onProgress, sequence, spread, tileAspect, zoom]
  );

  const getScrollProgress = useCallback(() => {
    const sec = sectionRef.current;
    const sticky = stickyRef.current;
    if (!sec || !sticky) return 0;
    const secRect = sec.getBoundingClientRect();
    const scrollableDistance =
      secRect.height - sticky.getBoundingClientRect().height;
    return scrollableDistance <= 0
      ? 0
      : clamp(-secRect.top / scrollableDistance, 0, 1);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const sec = sectionRef.current;
    const sticky = stickyRef.current;
    const grid = gridRef.current;
    if (!sec || !sticky || !grid) return;

    const doc = sec.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;

    const damping = Math.max(scrub, 0);

    const onFrame = (time: number) => {
      const prevTime = lastTime.current || time;
      const dt = Math.min(0.05, Math.max(0, (time - prevTime) / 1000));
      lastTime.current = time;

      const rawTarget = getScrollProgress();
      const alpha = damping > 0 ? 1 - Math.exp(-dt / damping) : 1;
      const nextProgress =
        currentProgress.current +
        (rawTarget - currentProgress.current) * alpha;

      currentProgress.current = nextProgress;
      updateTransforms(nextProgress);

      if (Math.abs(rawTarget - nextProgress) > 0.0004) {
        rafId.current = win.requestAnimationFrame(onFrame);
      } else {
        currentProgress.current = rawTarget;
        updateTransforms(rawTarget);
        isTicking.current = false;
      }
    };

    const handleScroll = () => {
      if (!isTicking.current) {
        isTicking.current = true;
        lastTime.current = 0;
        rafId.current = win.requestAnimationFrame(onFrame);
      }
    };

    const handleResize = () => {
      const stickyRect = sticky.getBoundingClientRect();
      stickyWidth.current = stickyRect.width;
      stickyHeight.current = stickyRect.height;
      gridWidthCurrent.current = grid.offsetWidth;
      gridHeightCurrent.current = grid.offsetHeight;
      contentHeight.current = contentRef.current?.offsetHeight ?? 0;
      targetProgress.current = getScrollProgress();
      currentProgress.current = targetProgress.current;
      updateTransforms(currentProgress.current);
    };

    handleResize();

    win.addEventListener('scroll', handleScroll, { passive: true });
    doc.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });
    win.addEventListener('resize', handleResize);
    win.addEventListener('pageshow', handleResize);

    const ro = new ResizeObserver(handleResize);
    ro.observe(sec);
    ro.observe(sticky);
    ro.observe(grid);
    if (contentRef.current) ro.observe(contentRef.current);

    return () => {
      win.cancelAnimationFrame(rafId.current);
      isTicking.current = false;
      win.removeEventListener('scroll', handleScroll);
      doc.removeEventListener('scroll', handleScroll, { capture: true });
      win.removeEventListener('resize', handleResize);
      win.removeEventListener('pageshow', handleResize);
      ro.disconnect();
    };
  }, [getScrollProgress, prefersReducedMotion, scrub, updateTransforms]);

  const sectionStyle = useMemo(
    () => ({
      height: prefersReducedMotion
        ? undefined
        : `${((1 + Math.max(scrollLength, 0)) * 100).toFixed(2)}svh`,
      ...style,
    }),
    [prefersReducedMotion, scrollLength, style]
  );

  const tileBaseStyle = useMemo(
    () => ({
      aspectRatio: `${tileAspect}`,
      borderRadius: `${tileRadius}px`,
    }),
    [tileAspect, tileRadius]
  );

  // Center stage container holding headline and revealed content
  const stageCenter = (
    <div
      className="relative z-30 pointer-events-none flex h-full w-full flex-col items-center justify-center text-center px-4"
      style={{ gap: `${contentGap}px` }}
    >
      {headline !== undefined && (
        <div
          ref={headlineRef}
          className="will-change-transform [backface-visibility:hidden] select-none pointer-events-auto max-w-3xl mx-auto"
        >
          {headline}
        </div>
      )}
      {children !== undefined && (
        <div
          ref={contentRef}
          className="will-change-transform [backface-visibility:hidden] pointer-events-auto"
          style={prefersReducedMotion ? undefined : { opacity: 0 }}
        >
          {children}
        </div>
      )}
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        className={`relative w-full py-16 px-4 ${className}`.trim()}
        style={{ ...sectionStyle, background: backgroundColor }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {stageCenter}
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            style={{ width: '100%' }}
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => onTileClick?.(idx, item)}
                className="group relative rounded-2xl overflow-hidden border border-border/60 bg-card text-left transition-all hover:scale-[1.02] hover:border-primary/50 shadow-md"
              >
                <div style={tileBaseStyle} className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold text-primary uppercase">
                      {item.badge}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">
                    {item.title}
                  </h4>
                  {item.company && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.company}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${className}`.trim()}
      style={sectionStyle}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden flex flex-col justify-center"
        style={{ height: '100svh', background: backgroundColor }}
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

        {/* Headline & Revealed Details */}
        {stageCenter}

        {/* Flying Image Tiles */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ width: `min(${gridWidth}px, calc(100% - ${2 * gap}px))` }}
        >
          <div
            ref={gridRef}
            className="grid will-change-transform"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }}
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                ref={(el) => {
                  tileRefs.current[idx] = el;
                }}
                onClick={() => onTileClick?.(idx, item)}
                className="group relative w-full overflow-hidden will-change-transform [backface-visibility:hidden] pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xl hover:shadow-2xl transition-shadow"
                style={{
                  ...tileBaseStyle,
                  visibility: 'hidden',
                }}
                title={`Inspect: ${item.title}`}
                aria-label={`Inspect ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full select-none object-cover transition-all duration-500 group-hover:scale-108 ${
                    grayscale ? 'grayscale' : ''
                  }`}
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                {/* Refined Tile Card Border */}
                <div className="absolute inset-0 rounded-[inherit] border border-white/20 group-hover:border-primary/70 transition-colors pointer-events-none" />

                {/* Bottom Tile Label & Badge */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left pointer-events-none transition-transform duration-300 group-hover:-translate-y-0.5">
                  {item.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 text-primary border border-primary/30 backdrop-blur-sm mb-1">
                      {item.badge}
                    </span>
                  )}
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/70 mt-0.5">
                    <span>{item.company || 'Enterprise System'}</span>
                    <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect ↗
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
