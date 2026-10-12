import {
  BrainCircuit,
  Braces,
  Cloud,
  Database,
  PanelsTopLeft,
  ShieldCheck,
  Workflow,
  Server,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect, type ComponentType } from "react";
import CircularCarousel, {
  type CircularCarouselHandle,
  type CircularCarouselItem,
  type CircularCarouselPreset,
} from "./CircularCarousel";

// Import generated 3D skill artworks
import javaImg from "../assets/skills/Gemini_Generated_Image_f0oygtf0oygtf0oy.jfif";
import springImg from "../assets/skills/Gemini_Generated_Image_vvmerwvvmerwvvme.jfif";
import reactImg from "../assets/skills/Gemini_Generated_Image_xja5cjxja5cjxja5.jfif";
import dbImg from "../assets/skills/Gemini_Generated_Image_qmybnmqmybnmqmyb.jfif";
import cloudImg from "../assets/skills/Gemini_Generated_Image_o2u6eoo2u6eoo2u6.jfif";
import dataImg from "../assets/skills/Gemini_Generated_Image_lwkqb8lwkqb8lwkq.jfif";
import aiImg from "../assets/skills/Gemini_Generated_Image_jpum48jpum48jpum.jfif";
import secImg from "../assets/skills/Gemini_Generated_Image_qhg3uwqhg3uwqhg3.jfif";

interface SkillCategory {
  id: string;
  title: string;
  category: string;
  catKey: "core" | "frontend" | "backend" | "cloud" | "ai" | "security";
  skills: string[];
  icon: ComponentType<{ className?: string }>;
  image: string;
  highlight: string;
  level: string;
  telemetry: string;
  metric: string;
  color: {
    primary: string;
    accent: string;
    glow: string;
    border: string;
    bgGradient: string;
  };
}

const SKILL_DOMAINS: SkillCategory[] = [
  {
    id: "languages",
    title: "Java 17+ & Core Languages",
    category: "Programming Languages",
    catKey: "core",
    skills: ["Java 17+", "Python 3", "TypeScript", "JavaScript", "SQL Optimization"],
    icon: Braces,
    image: javaImg,
    highlight:
      "Core Java 17+, Object-Oriented Architecture, Multi-Threading, Concurrency, and Low-Latency Execution.",
    level: "Senior",
    telemetry: "JVM • STREAMS • ASYNC",
    metric: "6+ Yrs Exp",
    color: {
      primary: "#426A8C",
      accent: "#5B86A9",
      glow: "rgba(66, 106, 140, 0.25)",
      border: "rgba(66, 106, 140, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "backend-frameworks",
    title: "Spring Boot 3 & REST APIs",
    category: "Back-End Frameworks",
    catKey: "core",
    skills: ["Spring Boot 3", "REST APIs", "Hibernate Envers", "MyBatis", "Django", "Flask"],
    icon: Workflow,
    image: springImg,
    highlight:
      "Resilient Microservices, RESTful Architecture, High-Volume Financial Gateways, and Immutable Audits.",
    level: "Expert",
    telemetry: "HTTP/2 • LATENCY < 4MS",
    metric: "99.99% SLA",
    color: {
      primary: "#5B86A9",
      accent: "#426A8C",
      glow: "rgba(91, 134, 169, 0.25)",
      border: "rgba(91, 134, 169, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "frontend",
    title: "React 19 & Modern Web",
    category: "Front-End Systems",
    catKey: "frontend",
    skills: ["React 19", "TypeScript", "Vite", "Redux Toolkit", "Next.js", "Tailwind CSS", "AG Grid"],
    icon: PanelsTopLeft,
    image: reactImg,
    highlight:
      "High-performance interactive web UIs, State machines, Responsive design, and Sub-second render pipelines.",
    level: "Advanced",
    telemetry: "60 FPS • 100% LIGHTHOUSE",
    metric: "Reactive UI",
    color: {
      primary: "#426A8C",
      accent: "#6B92B5",
      glow: "rgba(66, 106, 140, 0.25)",
      border: "rgba(66, 106, 140, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "databases",
    title: "Databases & High-Volume Storage",
    category: "Databases & Storage",
    catKey: "backend",
    skills: ["PostgreSQL", "MySQL", "Redis Caching", "Sybase ASE", "MongoDB"],
    icon: Database,
    image: dbImg,
    highlight:
      "Relational modeling, Index optimization, ACID transactions, Query tuning, and Distributed cache layers.",
    level: "Advanced",
    telemetry: "ACID • INDEX CACHE • REPLICATION",
    metric: "Sub-ms Query",
    color: {
      primary: "#52606D",
      accent: "#6F8293",
      glow: "rgba(82, 96, 109, 0.25)",
      border: "rgba(82, 96, 109, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "cloud-devops",
    title: "Cloud Infrastructure & DevOps",
    category: "Cloud & DevOps",
    catKey: "cloud",
    skills: ["AWS EC2/S3/Lambda", "Azure Serverless", "Docker", "OpenShift", "Helm", "Jenkins CI/CD"],
    icon: Cloud,
    image: cloudImg,
    highlight:
      "Containerized deployment pipelines, Automated release gates, Kubernetes meshes, and Cloud infra automation.",
    level: "Proficient",
    telemetry: "K8S • DOCKER • ZERO DOWNTIME",
    metric: "Automated CI",
    color: {
      primary: "#426A8C",
      accent: "#5B86A9",
      glow: "rgba(66, 106, 140, 0.25)",
      border: "rgba(66, 106, 140, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "data-analytics",
    title: "Data Pipelines & Automation",
    category: "Workflow Automation",
    catKey: "backend",
    skills: ["Apache Airflow (MWAA)", "DBT", "ETL Pipelines", "Data Warehouse", "Autosys"],
    icon: Server,
    image: dataImg,
    highlight:
      "Automated batch orchestration, Scheduled compute, Analytical workflows, and Directed Acyclic Graphs (DAGs).",
    level: "Proficient",
    telemetry: "CRON DAGS • BATCH TRANSFORMS",
    metric: "10M+ Rows/Day",
    color: {
      primary: "#52606D",
      accent: "#426A8C",
      glow: "rgba(82, 96, 109, 0.25)",
      border: "rgba(82, 96, 109, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "ai-workflows",
    title: "AI & Agentic Workflows",
    category: "Cognitive AI",
    catKey: "ai",
    skills: ["OpenAI & Azure", "Prompt Engineering", "Tool Calling", "Multi-Agent Synapse", "RAG Systems"],
    icon: BrainCircuit,
    image: aiImg,
    highlight:
      "Autonomous agent execution, Tool-augmented LLMs, Automated reasoning pipelines, and Vector semantics.",
    level: "Specialist",
    telemetry: "GPT-4o • MULTI-AGENT SYNAPSE",
    metric: "Autonomous AI",
    color: {
      primary: "#5B86A9",
      accent: "#8EAEC9",
      glow: "rgba(91, 134, 169, 0.25)",
      border: "rgba(91, 134, 169, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
  {
    id: "security-testing",
    title: "Security, Governance & QA",
    category: "Governance & Quality",
    catKey: "security",
    skills: ["OAuth 2.0 / RBAC", "Spring Security", "JUnit 5", "Mockito", "SonarQube", "Agile/Scrum"],
    icon: ShieldCheck,
    image: secImg,
    highlight:
      "Zero-defect financial compliance, Automated security audits, Comprehensive unit tests, and Zero-Trust RBAC.",
    level: "Specialist",
    telemetry: "ZERO-TRUST • 100% COVERAGE",
    metric: "Zero-Defect",
    color: {
      primary: "#426A8C",
      accent: "#52606D",
      glow: "rgba(66, 106, 140, 0.25)",
      border: "rgba(66, 106, 140, 0.35)",
      bgGradient: "from-[#272D35]/90 via-[#20252B]/95 to-[#1E2328]/90",
    },
  },
];

function SkillCardTile({
  domain,
  isActive,
}: {
  domain: SkillCategory;
  isActive: boolean;
}) {
  const Icon = domain.icon;
  return (
    <div
      className={`w-full h-full rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden select-none group ${
        isActive
          ? "border-primary shadow-2xl"
          : "border-white/10 hover:border-white/25"
      }`}
      style={{
        borderColor: isActive ? domain.color.primary : "rgba(255,255,255,0.12)",
        boxShadow: isActive ? `0 0 35px -5px ${domain.color.glow}` : "none",
        backgroundColor: "#070c18",
      }}
    >
      {/* Background 3D Render Image */}
      <img
        src={domain.image}
        alt={domain.title}
        className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out ${
          isActive ? "scale-105" : "scale-100 opacity-90 group-hover:scale-105"
        }`}
        loading="eager"
        decoding="async"
      />

      {/* Ambient Radial & Linear Dark Gradient Scrim to enhance contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/60 via-35% to-[#060a14]/75 pointer-events-none" />

      {/* Top Hairline Glowing Gradient */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${domain.color.primary}, transparent)`,
        }}
      />

      {/* Header with Icon, Category Badge & Level */}
      <div className="relative z-10 p-3.5 pb-2">
        <div className="flex items-center justify-between gap-1.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border backdrop-blur-md"
            style={{
              backgroundColor: `${domain.color.primary}20`,
              borderColor: `${domain.color.primary}45`,
              color: domain.color.primary,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>

          <span
            className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md truncate max-w-[125px] backdrop-blur-md border"
            style={{
              color: domain.color.primary,
              backgroundColor: "rgba(6, 10, 20, 0.8)",
              borderColor: `${domain.color.primary}35`,
            }}
          >
            {domain.category}
          </span>

          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-300 border border-white/15 shrink-0">
            {domain.level}
          </span>
        </div>
      </div>

      {/* Center 3D Logo Showcase Zone (Artwork shines clearly through) */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        {isActive && (
          <div
            className="w-14 h-14 rounded-full border border-dashed animate-spin pointer-events-none opacity-25"
            style={{
              borderColor: domain.color.primary,
              animationDuration: "25s",
            }}
          />
        )}
      </div>

      {/* Bottom Frosted Glassmorphic Information Dock */}
      <div className="relative z-10 p-3.5 pt-2.5 bg-gradient-to-t from-[#060a14]/98 via-[#070d1a]/92 to-transparent border-t border-white/10 backdrop-blur-md space-y-2">
        <div>
          <h4 className="text-sm sm:text-base font-black text-white leading-tight tracking-tight drop-shadow-md">
            {domain.title}
          </h4>

          <div
            className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] font-bold"
            style={{ color: domain.color.primary }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: domain.color.primary }}
            />
            <span>{domain.metric}</span>
          </div>
        </div>

        {/* The Verified Skill Tiles / Chips inside the card */}
        <div className="flex flex-wrap gap-1">
          {domain.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-slate-200 border border-white/10 flex items-center gap-1 backdrop-blur-sm"
            >
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: domain.color.primary }}
              />
              <span className="truncate">{skill}</span>
            </span>
          ))}
          {domain.skills.length > 4 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-muted-foreground border border-white/5">
              +{domain.skills.length - 4}
            </span>
          )}
        </div>

        {/* Bottom Telemetry & Status */}
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8.5px] font-mono text-slate-400">
          <span className="truncate max-w-[140px]">{domain.telemetry}</span>
          <span
            className="font-bold flex items-center gap-1 shrink-0"
            style={{ color: domain.color.primary }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: domain.color.primary }}
            />
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [preset, setPreset] = useState<CircularCarouselPreset>("cylinder");
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [carouselCardWidth, setCarouselCardWidth] = useState(280);

  useEffect(() => {
    const updateSize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 480) {
        setCarouselCardWidth(220);
      } else if (window.innerWidth < 640) {
        setCarouselCardWidth(250);
      } else {
        setCarouselCardWidth(280);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const carouselRef = useRef<CircularCarouselHandle | null>(null);

  // Generate the 8 CircularCarouselItems with wired 3D artworks and rich skill tiles
  const carouselItems: CircularCarouselItem[] = useMemo(() => {
    return SKILL_DOMAINS.map((domain, index) => ({
      src: domain.image,
      alt: domain.title,
      title: domain.title,
      subtitle: domain.category,
      content: (
        <SkillCardTile
          domain={domain}
          isActive={index === activeSkillIndex}
        />
      ),
    }));
  }, [activeSkillIndex]);

  const activeDomain = SKILL_DOMAINS[activeSkillIndex] || SKILL_DOMAINS[0];
  const ActiveIcon = activeDomain.icon;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-transparent relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Key Skills
            </h2>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {[
              { label: "Core Stack", val: "Java 17+ / Spring", sub: "Enterprise" },
              { label: "Client Layer", val: "React 19 / TS", sub: "Reactive UI" },
              { label: "Cloud Infra", val: "AWS / OpenShift", sub: "Kubernetes" },
              { label: "AI Workflows", val: "Multi-Agent", sub: "Autonomous" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm"
              >
                <div className="text-[10px] text-muted-foreground uppercase">{stat.label}</div>
                <div className="text-base sm:text-lg font-black text-primary my-0.5">{stat.val}</div>
                <div className="text-[9px] text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2.5 rounded-2xl bg-card/75 dark:bg-[#0c1220]/80 border border-border/60 backdrop-blur-xl shadow-lg">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 text-xs font-mono">
            {(["cylinder", "orbit", "wheel"] as CircularCarouselPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  preset === p
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Stepper Buttons & Odometer Counter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => carouselRef.current?.stepBy(-1)}
              aria-label="Previous skill"
              className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center cursor-pointer border border-border/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => carouselRef.current?.stepBy(1)}
              aria-label="Next skill"
              className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center cursor-pointer border border-border/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs px-2.5 text-primary font-bold">
              0{activeSkillIndex + 1} / 0{SKILL_DOMAINS.length}
            </span>
          </div>

          {/* Autoplay Drift Toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isAutoplay
                ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                : "bg-black/5 dark:bg-white/5 text-muted-foreground border-border/50"
            }`}
          >
            {isAutoplay ? (
              <>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>✦ AUTOPLAY: DRIFT</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-muted-foreground" />
                <span>PAUSED</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Category Jump Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {SKILL_DOMAINS.map((domain, idx) => {
            const isSelected = idx === activeSkillIndex;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setActiveSkillIndex(idx);
                  carouselRef.current?.focusIndex(idx);
                }}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? "font-bold shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-border/40"
                }`}
                style={{
                  backgroundColor: isSelected ? domain.color.primary : "transparent",
                  color: isSelected ? "#050810" : undefined,
                  borderColor: isSelected ? domain.color.primary : undefined,
                }}
              >
                <span>{domain.title.split(" ")[0]}</span>
                <span className="opacity-70 text-[10px]">0{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* 3D CIRCULAR CAROUSEL STAGE */}
        <div className="relative h-[440px] sm:h-[520px] w-full flex items-center justify-center">
          <CircularCarousel
            ref={carouselRef}
            items={carouselItems}
            preset={preset}
            cardWidth={carouselCardWidth}
            aspectRatio={0.72}
            gap={carouselCardWidth < 250 ? 20 : 32}
            curve={0}
            tilt={preset === "cylinder" ? -6 : undefined}
            autoplay={isAutoplay ? "drift" : "off"}
            speed={12}
            draggable={true}
            momentum={0.65}
            snap={true}
            pauseOnHover={true}
            focusOnClick={true}
            captions={false}
            onChange={(index) => setActiveSkillIndex(index)}
            onItemClick={(_, index) => {
              setActiveSkillIndex(index);
              carouselRef.current?.focusIndex(index);
            }}
            className="w-full h-full"
          />
        </div>

        {/* SYNCHRONIZED SKILL DOSSIER & TELEMETRY PANEL */}
        <div
          className="rounded-3xl border bg-card/85 dark:bg-[#0c1220]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6 transition-all duration-500"
          style={{
            borderColor: activeDomain.color.primary,
            boxShadow: `0 0 60px -15px ${activeDomain.color.glow}`,
          }}
        >
          {/* Top Hairline Glowing Gradient */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${activeDomain.color.primary}, transparent)`,
            }}
          />

          {/* Dossier Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Active Skill 3D Artwork Avatar */}
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 shadow-2xl group transition-all duration-300"
                style={{
                  borderColor: activeDomain.color.primary,
                  boxShadow: `0 0 25px -5px ${activeDomain.color.glow}`,
                }}
              >
                <img
                  src={activeDomain.image}
                  alt={activeDomain.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-md flex items-center justify-center border backdrop-blur-md"
                  style={{
                    backgroundColor: `${activeDomain.color.primary}30`,
                    borderColor: `${activeDomain.color.primary}60`,
                    color: activeDomain.color.primary,
                  }}
                >
                  <ActiveIcon className="w-3 h-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md"
                    style={{
                      color: activeDomain.color.primary,
                      backgroundColor: `${activeDomain.color.primary}15`,
                    }}
                  >
                    {activeDomain.category}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Level: {activeDomain.level}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                  {activeDomain.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <div className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 text-right">
                <div className="text-[10px] text-muted-foreground uppercase">Metric</div>
                <div
                  className="text-base font-black"
                  style={{ color: activeDomain.color.primary }}
                >
                  {activeDomain.metric}
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Narrative */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl">
            {activeDomain.highlight}
          </p>

          {/* Verified Skills Grid */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: activeDomain.color.primary }}
              />
              <span>Verified Domain Capabilities & Technologies</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {activeDomain.skills.map((skill) => (
                <div
                  key={skill}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-default border group hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${activeDomain.color.primary}10`,
                    borderColor: `${activeDomain.color.primary}30`,
                    color: activeDomain.color.primary,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: activeDomain.color.primary }}
                  />
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-4 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeDomain.color.primary }}
              />
              TELEMETRY: {activeDomain.telemetry}
            </span>
            <span>3D RING SYNCED ✦ CLICK / DRAG CARDS TO ROTATE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
