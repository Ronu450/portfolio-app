import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code2,
  GraduationCap,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import MagicRings from "./MagicRings";

interface EducationItem {
  id: string;
  orderNumber: string;
  badgeLabel: string;
  degree: string;
  institution: string;
  period: string;
  level: string;
  honour: string;
  location: string;
  summary: string;
  coursework: string[];
  ringColor: string;
  ringColorTwo: string;
  outcomeNote: string;
}

export function Education() {
  const educations: EducationItem[] = [
    {
      id: "2019",
      orderNumber: "01",
      badgeLabel: "Undergraduate Degree",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Saintgits College of Engineering",
      period: "2015 – 2019",
      level: "Undergraduate Degree",
      honour: "First Class Degree",
      location: "Kerala, India",
      summary:
        "Foundational mastery in computer science fundamentals, data structures, operating systems, object-oriented systems design, and engineering methodologies.",
      coursework: [
        "Core Java & OOP",
        "Data Structures & Algorithms",
        "Database Management (SQL)",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
      ],
      ringColor: "#426A8C", // Muted Blue
      ringColorTwo: "#52606D", // Slate Gray
      outcomeNote: "Graduated with First Class • Launched Career in Enterprise Engineering",
    },
    {
      id: "2023",
      orderNumber: "02",
      badgeLabel: "Postgraduate Master's",
      degree: "MSc in Data Analytics",
      institution: "National College of Ireland",
      period: "2022 – 2023",
      level: "Postgraduate Master's",
      honour: "First Class Honours",
      location: "Dublin, Ireland",
      summary:
        "Advanced specialization in distributed data analytics, machine learning engineering, statistical modeling, big data architectures, and predictive analytics.",
      coursework: [
        "Machine Learning & AI",
        "Big Data Architectures",
        "Distributed Computing",
        "Statistical Modeling",
        "Data Mining & ETL",
        "Data Visualization",
      ],
      ringColor: "#426A8C", // Muted Blue
      ringColorTwo: "#7F9CB5", // Soft Steel Accent
      outcomeNote: "Graduated with First Class Honours • Professional Full-Stack & Data Engineer",
    },
  ];

  // Active Tile Index (0 = 2019, 1 = Class of 2023)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [burstCount, setBurstCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentEdu = educations[currentIndex];

  const switchTile = useCallback((nextIndex: number) => {
    setIsTransitioning(true);
    setBurstCount((prev) => prev + 1);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 220);
  }, []);

  const handleNext = useCallback(() => {
    const next = (currentIndex + 1) % educations.length;
    switchTile(next);
  }, [currentIndex, educations.length, switchTile]);

  const handlePrev = useCallback(() => {
    const prev = (currentIndex - 1 + educations.length) % educations.length;
    switchTile(prev);
  }, [currentIndex, educations.length, switchTile]);

  const handleReplayOrder = useCallback(() => {
    switchTile(0);
    setIsPlaying(true);
  }, [switchTile]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = window.setTimeout(() => {
      handleNext();
    }, 5500);

    return () => {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [currentIndex, isPlaying, isHovered, handleNext]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center bg-transparent"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-primary/10 border border-primary/20 text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Milestones</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Education
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-mono">
            Chronological progression • Computer science foundation to advanced data analytics
          </p>
        </div>

        {/* Milestone Navigation & Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
          {/* Stepper Tabs */}
          <div className="flex items-center gap-2">
            {educations.map((edu, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={edu.id}
                  onClick={() => switchTile(idx)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform ${
                      isActive ? "scale-125 bg-current animate-pulse" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span>
                    {edu.orderNumber}. {edu.id === "2019" ? "2019" : "Class of 2023"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Player & Sequence Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={isPlaying ? "Pause auto-advance" : "Resume auto-advance"}
              aria-label={isPlaying ? "Pause auto-advance" : "Resume auto-advance"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleReplayOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-mono font-semibold transition-all active:scale-95"
              title="Restart from 2019"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Order</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAGIC RING PORTAL STAGE:
            - The Magic Ring shader is placed OUTSIDE the tile across the stage.
            - Low opacity, muted blue & slate gray palette.
            - Only ONE tile is rendered at a time INSIDE the center of the ring.
           ========================================================================= */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full min-h-[560px] sm:min-h-[600px] flex items-center justify-center py-10 px-4 rounded-3xl overflow-hidden bg-transparent border-0"
        >
          {/* 1. OUTSIDE SHADER: React Bits Magic Rings Animation in Muted Palette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <MagicRings
              color={currentEdu.ringColor}
              colorTwo={currentEdu.ringColorTwo}
              ringCount={currentIndex === 0 ? 6 : 7}
              speed={0.65}
              attenuation={4.8}
              lineThickness={2.0}
              baseRadius={0.24}
              radiusStep={0.065}
              scaleRate={0.06}
              opacity={0.55}
              noiseAmount={0.04}
              followMouse={true}
              mouseInfluence={0.16}
              hoverScale={1.1}
              parallax={0.03}
              clickBurst={true}
              burstTrigger={burstCount}
              className="w-full h-full"
            />
          </div>

          {/* 2. Soft Ambient Radial Glow behind the floating tile */}
          <div
            className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 z-0 bg-primary/10"
          />

          {/* 3. Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 w-10 h-10 rounded-full border border-border/50 bg-card/85 hover:bg-card text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm group hover:border-primary/50"
            aria-label="Previous milestone"
          >
            <ChevronLeft className="w-4 h-4 text-primary group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* 4. Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 w-10 h-10 rounded-full border border-border/50 bg-card/85 hover:bg-card text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm group hover:border-primary/50"
            aria-label="Next milestone"
          >
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 5. THE SINGLE TILE INSIDE THE MAGIC RING (No big year text inside) */}
          <div
            className={`relative z-10 w-full max-w-lg sm:max-w-xl mx-auto transition-all duration-300 ease-out ${
              isTransitioning
                ? "opacity-0 scale-95 translate-y-3"
                : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            <div
              className="relative rounded-2xl border border-border/40 bg-card/95 text-card-foreground p-6 sm:p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {/* Top Card Subtle Accent Line */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />

              {/* Card Header: Icon, Category & Period Pill (Big year text removed) */}
              <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-5 mb-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center shadow-sm"
                  >
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
                      {currentEdu.badgeLabel}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Stage {currentEdu.orderNumber} of 02
                    </span>
                  </div>
                </div>

                {/* Right side: Clean Period and Honours Pill (big text removed) */}
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{currentEdu.period}</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wide">
                    {currentEdu.honour}
                  </span>
                </div>
              </div>

              {/* Degree Title & Institution */}
              <div className="space-y-2 mb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {currentEdu.location}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold leading-snug text-foreground">
                  {currentEdu.degree}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-primary">
                  {currentEdu.institution}
                </p>
              </div>

              {/* Academic Overview Summary */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                {currentEdu.summary}
              </p>

              {/* Curriculum & Key Disciplines Chips */}
              <div className="pt-4 border-t border-border/50 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
                  Curriculum & Applied Disciplines:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentEdu.coursework.map((course) => (
                    <span
                      key={course}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trajectory Outcome Note */}
              <div className="mt-5 pt-3.5 border-t border-border/30 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Code2 className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{currentEdu.outcomeNote}</span>
              </div>
            </div>

            {/* Stepper Progress Dots below the card */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {educations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => switchTile(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to milestone ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Global Capstone Outcome Banner */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-medium bg-card border border-border text-muted-foreground shadow-sm">
            <Code2 className="w-4 h-4 text-primary" />
            <span>
              Cumulative Pathway: Saintgits (2019) ➜ NCI (Class of 2023) ➜ Software Developer & Data Engineer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
