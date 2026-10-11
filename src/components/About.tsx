import {
  Bike,
  Camera,
  Heart,
  MapPin,
  Server,
  Disc,
  Gamepad2,
  Trophy,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

const TRACKS = [
  { artist: "The Weeknd", title: '"Blinding Lights" / Starboy', vibe: "Midnight Synthwave" },
  { artist: "Hans Zimmer", title: '"Time" / Inception OST', vibe: "Orchestral Deep Focus" },
  { artist: "Daft Punk", title: '"Get Lucky" / Random Access', vibe: "Electronic Groove" },
  { artist: "Coldplay", title: '"Viva La Vida" / Rush of Blood', vibe: "Anthemic Melodic" },
  { artist: "Eminem", title: '"Lose Yourself" / 8 Mile', vibe: "High-Energy Drive" },
];

const GAMES = [
  { title: "EA FC 24 (FIFA)", genre: "Competitive Tactical Football", status: "Elite Division" },
  { title: "Cyberpunk 2077", genre: "Night City Open World RPG", status: "100% Completed" },
  { title: "Valorant & CS:GO", genre: "Precision Tactical Shooter", status: "Diamond / Ranked" },
  { title: "Grand Theft Auto V", genre: "Open World Sandbox Action", status: "Heists & Cruise" },
];

const CLUBS = [
  { name: "Manchester United", tactics: "Fast Wingers & Theatre of Dreams", league: "Premier League" },
  { name: "Real Madrid", tactics: "Galácticos & European Royalty", league: "Champions League" },
  { name: "Arsenal FC", tactics: "Fluid Positional Play & High Press", league: "Premier League" },
  { name: "Celtic FC", tactics: "Passionate Parkhead European Nights", league: "Scottish Premiership" },
];

const aboutFilterButtons = [
  { key: "all", label: "🌟 Full Universe (8)" },
  { key: "work", label: "⚡ Engineering DNA" },
  { key: "media", label: "🎧 Music & Gaming" },
  { key: "sports", label: "⚽ Football & Trails" },
  { key: "life", label: "❤️ Life & Jackie" },
];

export function About() {
  // About Me Section State
  const [aboutCategory, setAboutCategory] = useState("all");
  const [dublinTime, setDublinTime] = useState("");
  const [trackIdx, setTrackIdx] = useState(0);
  const [gameIdx, setGameIdx] = useState(0);
  const [clubIdx, setClubIdx] = useState(0);

  // Live Dublin Local Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Dublin",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setDublinTime(new Intl.DateTimeFormat([], options).format(now) + " DUB");
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic Mouse Spotlight Follower
  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // Subtle 3D Gyroscope Perspective Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
  };

  const handleCardMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const currentTrack = TRACKS[trackIdx];
  const currentGame = GAMES[gameIdx];
  const currentClub = CLUBS[clubIdx];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent text-foreground transition-colors duration-300">
      <style>{`
        /* ANIMMASTER LIQUID AURORA TEXT SHIMMER */
        @keyframes auroraFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .aurora-text {
          background: linear-gradient(
            90deg,
            var(--foreground) 0%,
            var(--primary) 35%,
            #6B8BA6 65%,
            var(--foreground) 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: auroraFlow 6s ease infinite;
        }

        /* BENTO SPOTLIGHT & 3D GYROSCOPE */
        .bento-canvas {
          position: relative;
          isolation: isolate;
        }

        .bento-canvas::before {
          content: "";
          position: absolute;
          inset: -15px;
          background-image: 
            linear-gradient(rgba(66, 106, 140, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(66, 106, 140, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at 50% 50%, black 45%, transparent 85%);
          pointer-events: none;
          z-index: 0;
        }

        .bento-card {
          position: relative;
          border-radius: 1.5rem;
          background: radial-gradient(
            550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(66, 106, 140, 0.08),
            transparent 50%
          ), var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(32, 37, 43, 0.04);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.25s ease,
                      box-shadow 0.3s ease;
          overflow: hidden;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .bento-card:hover {
          border-color: var(--primary);
          box-shadow: 0 10px 30px rgba(66, 106, 140, 0.12);
        }

        /* Staggered Grid Item Reveal */
        @keyframes bentoReveal {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .bento-item-animate {
          animation: bentoReveal 0.48s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--item-idx, 0) * 0.05s) backwards;
        }

        /* Corner Cyber Reticles (HUD Brackets) */
        .hud-bracket {
          position: absolute;
          width: 9px;
          height: 9px;
          border-color: var(--primary);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
          z-index: 15;
        }

        .hud-tl { top: 9px; left: 9px; border-top: 2px solid; border-left: 2px solid; transform: translate(-3px, -3px); }
        .hud-tr { top: 9px; right: 9px; border-top: 2px solid; border-right: 2px solid; transform: translate(3px, -3px); }
        .hud-bl { bottom: 9px; left: 9px; border-bottom: 2px solid; border-left: 2px solid; transform: translate(-3px, 3px); }
        .hud-br { bottom: 9px; right: 9px; border-bottom: 2px solid; border-right: 2px solid; transform: translate(3px, 3px); }

        .bento-card:hover .hud-bracket {
          opacity: 0.95;
          transform: translate(0, 0);
        }

        /* SPINNING 3D VINYL RECORD */
        @keyframes spinVinyl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .vinyl-disc {
          animation: spinVinyl 6s linear infinite;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 14px rgba(0, 0, 0, 0.9);
        }

        /* SOUND EQUALIZER ANIMATION */
        @keyframes eqBar1 { 0%, 100% { height: 6px; } 50% { height: 26px; } }
        @keyframes eqBar2 { 0%, 100% { height: 22px; } 50% { height: 8px; } }
        @keyframes eqBar3 { 0%, 100% { height: 12px; } 50% { height: 30px; } }
        @keyframes eqBar4 { 0%, 100% { height: 26px; } 50% { height: 14px; } }
        @keyframes eqBar5 { 0%, 100% { height: 8px; } 50% { height: 22px; } }

        .eq-bar-1 { animation: eqBar1 1.1s infinite ease-in-out; }
        .eq-bar-2 { animation: eqBar2 0.85s infinite ease-in-out; }
        .eq-bar-3 { animation: eqBar3 1.35s infinite ease-in-out; }
        .eq-bar-4 { animation: eqBar4 1.05s infinite ease-in-out; }
        .eq-bar-5 { animation: eqBar5 1.25s infinite ease-in-out; }

        /* HOLOGRAPHIC FOIL SHIMMER */
        .holo-card {
          position: relative;
          overflow: hidden;
        }
        .holo-card::before {
          content: "";
          position: absolute;
          inset: -50%;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(197, 239, 107, 0.12) 30%,
            rgba(56, 189, 248, 0.18) 50%,
            rgba(236, 72, 153, 0.15) 70%,
            transparent 100%
          );
          transform: rotate(25deg) translateY(-100%);
          transition: transform 0.75s ease;
          pointer-events: none;
          z-index: 10;
        }
        .holo-card:hover::before {
          transform: rotate(25deg) translateY(100%);
        }

        /* Blinking Cursor & Microservice Packets */
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .cursor-blink {
          animation: blinkCursor 0.9s infinite;
        }

        @keyframes packetTravel {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(85px); opacity: 0; }
        }

        .api-packet {
          animation: packetTravel 2.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* =========================================================================
            SECTION 1: HIGH-IMPACT ANIMMASTER "ABOUT ME" SHOWCASE
           ========================================================================= */}
        <div className="space-y-7">
          {/* Header & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                About <span className="aurora-text">Ronu Skariah</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {aboutFilterButtons.map((btn) => {
                const isActive = aboutCategory === btn.key;
                return (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => setAboutCategory(btn.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-105"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVE TELEMETRY RADAR STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Dublin Local Clock */}
            <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">LOCATION</div>
                  <div className="text-xs font-bold text-foreground">Dublin, Ireland</div>
                </div>
              </div>
              <div className="text-xs font-mono text-primary font-bold bg-muted/50 px-2 py-1 rounded-md border border-border">
                {dublinTime || "11:22:30 DUB"}
              </div>
            </div>

            {/* Experience Meter */}
            <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">EXPERIENCE</div>
                <div className="text-xs font-bold text-foreground">6+ Years Full Stack</div>
              </div>
            </div>

            {/* Core Domain */}
            <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <Server className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">CORE SECTOR</div>
                <div className="text-xs font-bold text-foreground">Tier-1 Banking FinTech</div>
              </div>
            </div>

            {/* Availability Beacon */}
            <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">STATUS</div>
                  <div className="text-xs font-bold text-primary">Open to Impact</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-primary bg-primary/15 px-2 py-0.5 rounded-full border border-primary/25 font-bold">
                ACTIVE
              </span>
            </div>
          </div>

          {/* MAIN ABOUT ME BENTO SHOWCASE GRID */}
          <div className="bento-canvas pt-1">
            <div className="grid grid-cols-12 gap-5">
              {/* 1. FEATURED HERO: Professional Philosophy & Bio */}
              {(aboutCategory === "all" || aboutCategory === "work") && (
                <div
                  className="bento-card bento-item-animate col-span-12 lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        // ARCHITECTURAL DNA
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">ENGINEERING CRAFT</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight mb-4">
                      Developer by profession.<br />
                      <span className="aurora-text">Curious & creative by nature.</span>
                    </h3>

                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      I’m a full-stack engineer with over six years of experience modernizing and building mission-critical enterprise applications. 
                      I bridge the gap between heavy, resilient back-ends (<strong className="text-foreground font-semibold">Java 17+, Spring Boot, Microservices, Python</strong>) 
                      and modern, reactive web interfaces (<strong className="text-foreground font-semibold">React, Vite, Next.js, AG Grid, Tailwind CSS</strong>).
                    </p>

                    {/* Architecture Tenets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border hover:border-primary/40 transition-colors">
                        <div className="text-primary text-xs font-mono font-bold mb-1">01. ZERO-LOSS SCALE</div>
                        <div className="text-xs text-muted-foreground">Microservices with circuit breakers, idempotency, and sub-second cache.</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border hover:border-primary/40 transition-colors">
                        <div className="text-primary text-xs font-mono font-bold mb-1">02. TACTILE 3D UX</div>
                        <div className="text-xs text-muted-foreground">Hardware-accelerated 60fps animations, intuitive ergonomics, and accessible flows.</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border hover:border-primary/40 transition-colors">
                        <div className="text-primary text-xs font-mono font-bold mb-1">03. AGENTIC AI DISPATCH</div>
                        <div className="text-xs text-muted-foreground">Tool-calling agents with autonomous workflows, structured schemas, and continuous eval.</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Fintect (Dublin) • 6 Years Continuous Impact
                    </span>
                    <span className="text-primary font-serif italic text-base">Ronu Skariah ~</span>
                  </div>
                </div>
              )}

              {/* 2. MUSIC & ARTIST HUB: Interactive Spinning Vinyl Player */}
              {(aboutCategory === "all" || aboutCategory === "media") && (
                <div
                  className="bento-card bento-item-animate holo-card col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5" />
                        SOUNDSCAPE & ARTISTS
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-mono text-primary font-bold">STREAMING</span>
                      </div>
                    </div>

                    {/* Spinning Vinyl Record Stage */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border mb-4 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shrink-0 vinyl-disc">
                        <div className="w-12 h-12 rounded-full border border-neutral-600/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border border-neutral-600/30 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-sky-400 flex items-center justify-center text-[7px] font-black text-black">
                              RS
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">CURRENT TRACK</span>
                        <h4 className="text-sm font-black text-foreground truncate">{currentTrack.artist}</h4>
                        <p className="text-xs text-primary font-mono truncate">{currentTrack.title}</p>
                        <span className="text-[10px] font-mono text-muted-foreground/80">{currentTrack.vibe}</span>
                      </div>
                    </div>

                    {/* Equalizer & Track Switcher */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">SPECTRUM:</span>
                        <div className="flex items-end gap-1 h-5">
                          <span className="w-1 bg-primary rounded-full eq-bar-1" />
                          <span className="w-1 bg-primary rounded-full eq-bar-2" />
                          <span className="w-1 bg-primary rounded-full eq-bar-3" />
                          <span className="w-1 bg-primary rounded-full eq-bar-4" />
                          <span className="w-1 bg-primary rounded-full eq-bar-5" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTrackIdx((prev) => (prev + 1) % TRACKS.length)}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-[11px] font-mono text-primary transition-all font-bold cursor-pointer"
                      >
                        Next Track ↻
                      </button>
                    </div>

                    {/* Artists Array */}
                    <div className="flex flex-wrap gap-1.5">
                      {["The Weeknd", "Hans Zimmer", "Daft Punk", "Coldplay", "Eminem"].map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 rounded-md bg-muted/50 border border-border text-[10px] font-mono text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>HIGH-ENERGY CODING BEATS</span>
                    <span className="text-primary font-semibold">320 KBPS</span>
                  </div>
                </div>
              )}

              {/* 3. GAMING HUB: Interactive Holographic Gaming Rig */}
              {(aboutCategory === "all" || aboutCategory === "media") && (
                <div
                  className="bento-card bento-item-animate holo-card col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-primary" />
                        GAMING WAR ROOM
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono text-primary font-bold">
                        {currentGame.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🎮</span>
                        <button
                          type="button"
                          onClick={() => setGameIdx((prev) => (prev + 1) % GAMES.length)}
                          className="px-2 py-0.5 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-[10px] font-mono transition-all cursor-pointer font-bold"
                        >
                          Switch Game ↻
                        </button>
                      </div>
                      <h4 className="text-base font-black text-foreground">{currentGame.title}</h4>
                      <p className="text-xs text-primary font-mono mt-0.5">{currentGame.genre}</p>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="text-muted-foreground text-[11px]">Primary Rig:</span>
                        <span className="text-foreground font-bold">PS5 • DualSense • OLED</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="text-muted-foreground text-[11px]">Play Style:</span>
                        <span className="text-primary font-bold">Tactical Reflexes & Spatial IQ</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>REFLEX CALIBRATION</span>
                    <span className="text-primary font-semibold">120 FPS</span>
                  </div>
                </div>
              )}

              {/* 4. FOOTBALL & SPORTS HUB: Matchday Passion */}
              {(aboutCategory === "all" || aboutCategory === "sports") && (
                <div
                  className="bento-card bento-item-animate holo-card col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-primary" />
                        FOOTBALL PASSION
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-primary font-bold">MATCHDAY</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-muted/40 to-card border border-primary/25 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">⚽</span>
                        <button
                          type="button"
                          onClick={() => setClubIdx((prev) => (prev + 1) % CLUBS.length)}
                          className="px-2 py-0.5 rounded bg-muted hover:bg-primary hover:text-primary-foreground text-[10px] font-mono transition-all cursor-pointer font-bold"
                        >
                          Switch Club ↻
                        </button>
                      </div>
                      <h4 className="text-base font-black text-foreground">{currentClub.name}</h4>
                      <p className="text-xs text-primary font-mono mt-0.5">{currentClub.tactics}</p>
                    </div>

                    <div className="space-y-2 font-mono text-xs text-muted-foreground">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="text-muted-foreground text-[11px]">Philosophy:</span>
                        <span className="text-foreground font-bold">Fast Wingers & Relentless Press</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="text-muted-foreground text-[11px]">Weekend Ritual:</span>
                        <span className="text-primary font-bold">Pub Screens & 90-min Thrill</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>THE BEAUTIFUL GAME</span>
                    <span className="text-primary font-semibold">90 MINS + ET</span>
                  </div>
                </div>
              )}

              {/* 5. CYCLING & TRAIL ENDURANCE */}
              {(aboutCategory === "all" || aboutCategory === "sports") && (
                <div
                  className="bento-card bento-item-animate col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5" />
                        ENDURANCE & HORIZON
                      </span>
                      <span className="text-2xl">🚴</span>
                    </div>

                    <h4 className="text-xl font-black text-foreground mb-2">Cycling</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Dublin coastal routes, Howth head loops, and mountain trails. The ultimate meditation for clearing mental ram and recharging architectural breakthroughs.
                    </p>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Weekly Target:</span>
                        <span className="text-primary font-bold">35+ KM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Favorite Trail:</span>
                        <span className="text-foreground font-semibold">Howth Head Summit</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>ENDURANCE METRICS</span>
                    <span className="text-primary font-semibold">STRAVA SYNCED</span>
                  </div>
                </div>
              )}

              {/* 6. PHOTOGRAPHY & VISUAL COMPOSITION */}
              {(aboutCategory === "all" || aboutCategory === "life") && (
                <div
                  className="bento-card bento-item-animate col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-primary" />
                        LENS & SYMMETRY
                      </span>
                      <span className="text-2xl">📷</span>
                    </div>

                    <h4 className="text-xl font-black text-foreground mb-2">Photography</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Chasing natural golden light, brutalist architectural angles, and candid street frames across Dublin and international travels.
                    </p>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Prime Optics:</span>
                        <span className="text-primary font-bold">35mm f/1.8 & 50mm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Composition:</span>
                        <span className="text-foreground font-semibold">Golden Ratio & Geometry</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>VISUAL BALANCE</span>
                    <span className="text-primary font-semibold">RAW CAPTURE</span>
                  </div>
                </div>
              )}

              {/* 7. TIME WITH JACKIE: Life's True Anchor */}
              {(aboutCategory === "all" || aboutCategory === "life") && (
                <div
                  className="bento-card bento-item-animate col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-primary" />
                        LIFE ANCHOR
                      </span>
                      <span className="text-2xl">❤️</span>
                    </div>

                    <h4 className="text-xl font-black text-foreground mb-2">Time with Jackie</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Weekend road trips, artisanal coffee discoveries, culinary experiments, and shared belly laughs that keep life grounded, warm, and meaningful.
                    </p>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Priority:</span>
                        <span className="text-primary font-bold">#1 Always</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Favorite Escape:</span>
                        <span className="text-foreground font-semibold">Coastline drives & Brunch</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>HEART & SOUL</span>
                    <span className="text-primary font-semibold">FOUNDATION</span>
                  </div>
                </div>
              )}

              {/* 8. COLLEGE CIRCLE & TECH BROTHERHOOD */}
              {(aboutCategory === "all" || aboutCategory === "life") && (
                <div
                  className="bento-card bento-item-animate col-span-12 sm:col-span-6 lg:col-span-4 p-6 flex flex-col justify-between group"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="hud-bracket hud-tl" />
                  <span className="hud-bracket hud-tr" />
                  <span className="hud-bracket hud-bl" />
                  <span className="hud-bracket hud-br" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        COLLEGE CIRCLE
                      </span>
                      <span className="text-2xl">🎓</span>
                    </div>

                    <h4 className="text-xl font-black text-foreground mb-2">Friends from College</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Bonds forged over 3 AM compiler debugging, pizza boxes, startup pitches, and life milestones. Still meeting for annual reunions and tech debates.
                    </p>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Brotherhood:</span>
                        <span className="text-primary font-bold">Since Day 1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[11px]">Tradition:</span>
                        <span className="text-foreground font-semibold">Annual Trips & Hackathons</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>LIFELONG ALLIES</span>
                    <span className="text-primary font-semibold">EST. 2018</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
