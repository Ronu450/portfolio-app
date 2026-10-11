import {
  Award,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";

export interface CredentialPass {
  id: string;
  name: string;
  issuer: string;
  credentialType: "Certification" | "Virtual Internship";
  badgeCode: string;
  color: {
    accent: string;
    border: string;
    bgGradient: string;
    tagBg: string;
  };
  skills: string[];
  summary: string;
}

const credentials: CredentialPass[] = [
  {
    id: "ms-ai",
    name: "Introduction to Artificial Intelligence",
    issuer: "Microsoft",
    credentialType: "Certification",
    badgeCode: "MS-AI-9942",
    color: {
      accent: "#426A8C",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "Azure OpenAI",
      "Cognitive APIs",
      "Prompt Engineering",
      "Model Evaluation",
    ],
    summary:
      "Practical mastery in modern neural architectures, Azure cognitive services, prompt design, and AI model evaluation.",
  },
  {
    id: "jpmc",
    name: "Software Engineering Simulation",
    issuer: "JPMorgan Chase & Co.",
    credentialType: "Virtual Internship",
    badgeCode: "JPMC-SWE-401",
    color: {
      accent: "#527C9F",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "Financial Feeds",
      "Perspective Visualizer",
      "React",
      "Unit Tests",
    ],
    summary:
      "Engineered real-time trader dashboards, live stock price stream synchronization, and data visualization tools.",
  },
  {
    id: "mongodb",
    name: "MongoDB Certified Developer",
    issuer: "Infosys Certified",
    credentialType: "Certification",
    badgeCode: "INF-MDB-108",
    color: {
      accent: "#52606D",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "Aggregation Pipeline",
      "Atlas Cloud",
      "Schema Design",
      "Indexing",
    ],
    summary:
      "High-performance distributed document data modeling, indexing optimization, aggregation frameworks, and cluster scaling.",
  },
  {
    id: "accenture",
    name: "Technology Consulting Simulation",
    issuer: "Accenture (Forage)",
    credentialType: "Virtual Internship",
    badgeCode: "ACN-TECH-780",
    color: {
      accent: "#6388A6",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "Cloud Migration",
      "System Architecture",
      "Agile Sprints",
      "Security",
    ],
    summary:
      "Simulation designing resilient enterprise cloud migrations, solution scalability audits, and architectural proposals.",
  },
  {
    id: "kpmg",
    name: "Data Analytics Simulation",
    issuer: "KPMG (Forage)",
    credentialType: "Virtual Internship",
    badgeCode: "KPMG-DA-605",
    color: {
      accent: "#426A8C",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "Data Quality Audit",
      "Statistical Modeling",
      "Customer Insights",
      "Dashboards",
    ],
    summary:
      "Assessing customer datasets, identifying data quality anomalies, and modeling demographic trends for strategic decisions.",
  },
  {
    id: "powerbi",
    name: "Power BI Enterprise Analytics",
    issuer: "Infosys Certified",
    credentialType: "Certification",
    badgeCode: "INF-PBI-220",
    color: {
      accent: "#527C9F",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "DAX Modeling",
      "Power Query",
      "ETL Pipelines",
      "Executive Reports",
    ],
    summary:
      "End-to-end business intelligence dashboards, advanced DAX calculations, multidimensional modeling, and reporting systems.",
  },
  {
    id: "teradata",
    name: "Teradata Enterprise Data Warehouse",
    issuer: "Infosys Certified",
    credentialType: "Certification",
    badgeCode: "INF-TD-315",
    color: {
      accent: "#465B6E",
      border: "border-primary/35",
      bgGradient: "from-card via-card/95 to-card/85",
      tagBg: "bg-primary/15 text-primary border-primary/30",
    },
    skills: [
      "MPP Architecture",
      "SQL Optimization",
      "Large ETL",
      "Data Warehousing",
    ],
    summary:
      "Architecting massive parallel queries, indexing strategies, table partitioning, and high-volume data warehousing.",
  },
];

export function Credentials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderMode, setSliderMode] = useState<"deck" | "coverflow">("deck");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glareRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoverTilt, setHoverTilt] = useState<{ rx: number; ry: number } | null>(null);

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const nextSlide = () => {
    setHoverTilt(null);
    setActiveSlide((prev) => (prev + 1) % credentials.length);
  };

  const prevSlide = () => {
    setHoverTilt(null);
    setActiveSlide(
      (prev) => (prev - 1 + credentials.length) % credentials.length,
    );
  };

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (index !== activeSlide) return;
    const card = cardContainerRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -10;
    const ry = ((x - centerX) / centerX) * 10;
    setHoverTilt({ rx, ry });
  };

  const handleCardMouseLeave = () => {
    setHoverTilt(null);
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent text-foreground">
      <style>{`
        /* Stage 3D Perspective */
        .cred-carousel-stage-3d {
          perspective: 1400px;
          perspective-origin: center center;
        }

        .cred-pass-flipper {
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 100%;
          height: 100%;
          position: relative;
        }

        .cred-pass-card.is-flipped .cred-pass-flipper {
          transform: rotateY(180deg);
        }

        .cred-pass-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          border-radius: 20px;
          overflow: hidden;
        }

        .cred-pass-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
          mix-blend-mode: color-dodge;
          z-index: 20;
        }

        /* 1. SIDE VIEW DECK OF CARDS EFFECT (ANIMMASTER STYLE) */
        .cred-stage-deck-3d {
          perspective: 1500px;
          perspective-origin: 32% 50%;
        }

        .cred-deck-card-layer {
          position: absolute;
          width: min(440px, calc(100vw - 40px));
          height: 380px;
          left: 50%;
          top: 0;
          margin-left: max(-220px, calc((100vw - 40px) / -2));
          transform-style: preserve-3d;
          transition: all 0.65s cubic-bezier(0.2, 0.9, 0.3, 1);
          cursor: pointer;
        }

        /* 2. COVERFLOW MODE */
        .cred-coverflow-card-layer {
          position: absolute;
          width: min(440px, calc(100vw - 40px));
          height: 380px;
          left: 50%;
          top: 0;
          margin-left: max(-220px, calc((100vw - 40px) / -2));
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          cursor: pointer;
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        {/* Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              Certifications & <span className="text-primary">Simulations</span>
            </h2>
          </div>

          {/* View Mode Switcher & Navigation Arrows */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center bg-card/80 p-1 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => setSliderMode("deck")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  sliderMode === "deck"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Side Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setSliderMode("coverflow")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  sliderMode === "coverflow"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <span>Coverflow</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 rounded-xl bg-card/80 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer shadow-sm"
                aria-label="Previous credential"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-2 rounded-xl bg-card/80 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer shadow-sm"
                aria-label="Next credential"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D STAGE */}
        <div
          className={`relative h-[430px] w-full flex items-center justify-center select-none ${
            sliderMode === "deck"
              ? "cred-stage-deck-3d"
              : "cred-carousel-stage-3d"
          }`}
        >
          {credentials.map((pass, index) => {
            const isFlipped = !!flippedCards[pass.id];
            const offset = index - activeSlide;

            let cardStyle: React.CSSProperties = {};
            let zIndex = 10;
            let opacity = 1;

            if (sliderMode === "deck") {
              if (offset === 0) {
                const rx = hoverTilt ? hoverTilt.rx : 0;
                const ry = hoverTilt ? hoverTilt.ry : 0;
                zIndex = 50;
                opacity = 1;
                cardStyle = {
                  transform: `translate3d(0, 0, 90px) rotateY(${-8 + ry}deg) rotateX(${2 + rx}deg) scale(${hoverTilt ? 1.02 : 1})`,
                  filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.5))",
                };
              } else if (offset > 0) {
                const stackOffset = Math.min(offset, 4);
                zIndex = 40 - stackOffset;
                opacity = Math.max(0.4, 1 - stackOffset * 0.15);
                cardStyle = {
                  transform: `translate3d(${stackOffset * 54}px, ${
                    stackOffset * -10
                  }px, ${60 - stackOffset * 70}px) rotateY(-20deg) rotateX(3deg) scale(${
                    1 - stackOffset * 0.05
                  })`,
                  filter: `brightness(${0.92 - stackOffset * 0.05})`,
                };
              } else {
                const stackOffset = Math.min(Math.abs(offset), 4);
                zIndex = 20 - stackOffset;
                opacity = Math.max(0.3, 0.75 - stackOffset * 0.15);
                cardStyle = {
                  transform: `translate3d(${-stackOffset * 55}px, ${
                    stackOffset * 12
                  }px, ${-stackOffset * 75}px) rotateY(15deg) scale(${
                    1 - stackOffset * 0.06
                  })`,
                  filter: `brightness(${0.88 - stackOffset * 0.05})`,
                };
              }
            } else {
              // Coverflow Mode
              if (offset === 0) {
                const rx = hoverTilt ? hoverTilt.rx : 0;
                const ry = hoverTilt ? hoverTilt.ry : 0;
                zIndex = 50;
                opacity = 1;
                cardStyle = {
                  transform: `translate3d(0, 0, 100px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${hoverTilt ? 1.06 : 1.03})`,
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.45))",
                };
              } else if (offset > 0) {
                const distance = Math.min(offset, 4);
                zIndex = 35 - distance;
                opacity = Math.max(0.35, 1 - distance * 0.18);
                cardStyle = {
                  transform: `translate3d(${distance * 135}px, 0, ${
                    -distance * 110
                  }px) rotateY(-42deg) scale(${1 - distance * 0.07})`,
                  filter: "brightness(0.85)",
                };
              } else {
                const distance = Math.min(Math.abs(offset), 4);
                zIndex = 35 - distance;
                opacity = Math.max(0.35, 1 - distance * 0.18);
                cardStyle = {
                  transform: `translate3d(${-distance * 135}px, 0, ${
                    -distance * 110
                  }px) rotateY(42deg) scale(${1 - distance * 0.07})`,
                  filter: "brightness(0.85)",
                };
              }
            }

            return (
              <div
                key={pass.id}
                ref={(el) => {
                  cardContainerRefs.current[index] = el;
                }}
                style={{ ...cardStyle, zIndex, opacity }}
                onClick={() => {
                  setHoverTilt(null);
                  if (activeSlide !== index) setActiveSlide(index);
                }}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={handleCardMouseLeave}
                className={`cred-pass-card ${
                  sliderMode === "deck"
                    ? "cred-deck-card-layer"
                    : "cred-coverflow-card-layer"
                } ${isFlipped ? "is-flipped" : ""}`}
              >
                <div className="cred-pass-flipper">
                  {/* FRONT FACE */}
                  <div
                    className={`cred-pass-face bg-gradient-to-br ${pass.color.bgGradient} border ${pass.color.border} p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative`}
                  >
                    <div
                      ref={(el) => {
                        glareRefs.current[index] = el;
                      }}
                      className="cred-pass-glare"
                    />

                    {/* Holographic Top Stripe */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2">
                        <Award
                          className="h-5 w-5"
                          style={{ color: pass.color.accent }}
                        />
                        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-foreground/90">
                          {pass.issuer}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${pass.color.tagBg} font-bold`}
                      >
                        {pass.credentialType}
                      </span>
                    </div>

                    {/* Credential Name & Skills */}
                    <div className="space-y-3 my-auto py-2">
                      <h4 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                        {pass.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {pass.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pass.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/5 border border-border/50 text-foreground/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom HUD Bar & Flip Trigger */}
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-primary font-bold">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span>{pass.badgeCode}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardFlip(pass.id);
                        }}
                        className="flex items-center gap-1 text-[11px] text-primary hover:text-primary-foreground hover:bg-primary px-2 py-1 rounded-md bg-primary/10 border border-primary/25 cursor-pointer font-bold transition-all"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Flip Verification</span>
                      </button>
                    </div>
                  </div>

                  {/* BACK FACE (VERIFICATION TELEMETRY) */}
                  <div
                    className="cred-pass-face bg-card dark:bg-[#20252B] border border-border/60 p-6 sm:p-7 flex flex-col justify-between shadow-2xl"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-xs font-mono font-bold text-primary">
                        OFFICIAL VERIFICATION DOSSIER
                      </span>
                      <span className="text-[10px] font-mono text-primary bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                        AUTHENTICATED
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs my-auto py-2">
                      <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">ISSUER ENTITY:</span>
                          <span className="text-foreground font-bold">{pass.issuer}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">AUDIT CODE:</span>
                          <span className="text-primary font-bold">{pass.badgeCode}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">STATUS:</span>
                          <span className="text-primary font-bold">LIFETIME VALIDITY</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                        {pass.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex justify-between items-center text-xs font-mono">
                      <span className="text-muted-foreground text-[10px]">TAP TO RETURN</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardFlip(pass.id);
                        }}
                        className="flex items-center gap-1 text-[11px] text-primary hover:text-primary-foreground hover:bg-primary px-2 py-1 rounded-md bg-primary/10 border border-primary/25 cursor-pointer font-bold transition-all"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Flip Front</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Credential Title Selector Buttons & Dots */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {credentials.map((pass, i) => {
              const isSelected = activeSlide === i;
              return (
                <button
                  key={pass.id}
                  type="button"
                  onClick={() => {
                    setHoverTilt(null);
                    setActiveSlide(i);
                  }}
                  className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                      : "bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground border-border/60 hover:border-primary/40"
                  }`}
                  aria-label={`Select ${pass.name}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isSelected ? "bg-white" : "bg-primary/50 group-hover:bg-primary"
                    }`}
                  />
                  <span className="font-bold">{pass.issuer}</span>
                  <span className="hidden sm:inline text-[11px] opacity-75">
                    — {pass.name.length > 28 ? `${pass.name.slice(0, 26)}...` : pass.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Deck Navigation Indicator Dots */}
          <div className="flex justify-center items-center gap-2">
            {credentials.map((pass, i) => (
              <button
                key={pass.id}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === i
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary/25 hover:bg-primary/50"
                }`}
                aria-label={`Jump to ${pass.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
