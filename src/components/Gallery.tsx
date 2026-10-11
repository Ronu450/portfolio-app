import {
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Flame,
  ZoomIn,
  Camera,
  Compass,
  Award,
  Pause,
} from "lucide-react";
import { useState, useMemo } from "react";
import FlexCarousel, {
  type FlexCarouselItem,
  type BendPreset,
} from "./FlexCarousel";

import bikePic from "../assets/bike.jpg";
import bearPic from "../assets/beer.jpg";
import dogPic from "../assets/dog.jpg";
import groupPic from "../assets/group.jpg";

interface MuseumMasterpiece {
  id: string;
  catalogNumber: string;
  room: string;
  category: string;
  title: string;
  subtitle: string;
  year: string;
  medium: string;
  dimensions: string;
  imageSrc: string;
  imageFit: "cover" | "contain";
  exif: {
    lens: string;
    shutter: string;
    aperture: string;
    iso: string;
    location: string;
  };
  curatorNote: string;
  audioGuideTranscript: string;
  provenance: string;
}

const masterpieces: MuseumMasterpiece[] = [
  {
    id: "jackie",
    catalogNumber: "CAT. RS-01-LFE",
    room: "GALLERY ROOM I // COMPANIONS & LIFE ANCHORS",
    category: "Portraiture & Life Anchor",
    title: "Jackie in Quiet Repose",
    subtitle: "A Portrait of Unconditional Fidelity & Daily Light",
    year: "2024",
    medium: "Archival Pigment Print on 310gsm Museum Cotton Rag",
    dimensions: "60 × 80 cm • Framed in Stained Walnut",
    imageSrc: dogPic,
    imageFit: "contain",
    exif: {
      lens: "50mm Prime",
      shutter: "1/400s",
      aperture: "f/1.8",
      iso: "100",
      location: "Dublin, Ireland",
    },
    curatorNote:
      "A quiet masterpiece of companionship. Jackie sits grounded on lush green, embodying stillness, unconditional warmth, and emotional ballast that grounds high-stakes engineering life.",
    audioGuideTranscript:
      "Welcome to Room One. Before you stands 'Jackie in Quiet Repose'. Notice how the ambient light caresses the fur texture, bringing a sense of tranquil contemplation amidst the chaotic velocity of the digital era.",
    provenance:
      "Commissioned for the Personal Permanent Archive • Dublin Studio Collection",
  },
  {
    id: "bike",
    catalogNumber: "CAT. RS-02-ADV",
    room: "GALLERY ROOM II // KINETIC VELOCITY",
    category: "Adventure & Solitude",
    title: "The Velocity Horizon",
    subtitle: "Two Wheels, Open Coastal Asphalt & Meditative Solitude",
    year: "2023",
    medium: "Monochrome & High-Dynamic Silver Gelatin C-Print",
    dimensions: "70 × 100 cm • Shadowbox Anodized Aluminum",
    imageSrc: bikePic,
    imageFit: "cover",
    exif: {
      lens: "35mm Wide",
      shutter: "1/1000s",
      aperture: "f/2.8",
      iso: "200",
      location: "Wicklow Mountain Gap, Ireland",
    },
    curatorNote:
      "The machine as an extension of the soul. Poised against sweeping horizons, this piece captures the exhilarating liberation of long-distance cycling. Speed dissolves cognitive clutter, leaving only the rhythm of breath and the endless road.",
    audioGuideTranscript:
      "Notice the stark geometric dialogue between precision mechanical engineering and raw Irish topography. This frame encapsulates the relentless pursuit of forward motion.",
    provenance:
      "Acquired following the Great Wicklow Coastal Odyssey • Permanent Vault",
  },
  {
    id: "undergrad",
    catalogNumber: "CAT. RS-03-MEM",
    room: "GALLERY ROOM III // THE GENESIS CIRCLE",
    category: "Historical Archive & Fellowship",
    title: "Fellowship of the Code",
    subtitle: "The Undergrad Circle & Roots of Computer Science",
    year: "2019",
    medium: "Archival Sepia Tonality on Tru-Vue Museum Glass",
    dimensions: "50 × 75 cm • Antique Brushed Brass Frame",
    imageSrc: groupPic,
    imageFit: "cover",
    exif: {
      lens: "24mm Street",
      shutter: "1/125s",
      aperture: "f/2.0",
      iso: "400",
      location: "Saintgits College of Engineering, Kerala",
    },
    curatorNote:
      "Where the foundation was laid. A historical document of brotherhood, sleepless hackathons, algorithm debates, and ambitious young engineers standing on the threshold of global careers.",
    audioGuideTranscript:
      "This archival photograph represents the origin point. Every line of enterprise code written today carries echoes of the collaborative camaraderie formed within this circle.",
    provenance:
      "Donated from the Saintgits Engineering Historical Archive",
  },
  {
    id: "bear",
    catalogNumber: "CAT. RS-04-NAT",
    room: "GALLERY ROOM IV // UNTAMED SOVEREIGNTY",
    category: "Wildlife & Raw Nature",
    title: "Raw Majesty: Solitude in the Wild",
    subtitle: "A Sacred Encounter with Wilderness Sovereignty",
    year: "2023",
    medium: "Fine Art Giclée with Hand-Embossed Matte Finish",
    dimensions: "80 × 120 cm • Heritage Deep Ebony Shadowbox",
    imageSrc: bearPic,
    imageFit: "cover",
    exif: {
      lens: "200mm Telephoto",
      shutter: "1/800s",
      aperture: "f/4.0",
      iso: "640",
      location: "Protected Wilderness Expedition",
    },
    curatorNote:
      "An extraordinary moment of raw presence in untouched habitat. The quiet apex authority of the creature demands reverence, reflecting nature’s enduring equilibrium beyond human constructs.",
    audioGuideTranscript:
      "Observed from distance in natural silence. The profound stillness of the subject commands the room, serving as a reminder of primeval nature’s delicate sovereignty.",
    provenance:
      "Special Exhibition Loan • Wilderness Expeditions Archive",
  },
];

type LightingAtmosphere = "vernissage" | "atrium" | "noir";

export function Gallery() {
  const [activeMood, setActiveMood] = useState<LightingAtmosphere>("vernissage");
  const [activePreset, setActivePreset] = useState<BendPreset>("liquid");
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [activePieceIndex, setActivePieceIndex] = useState(0);
  const [audioGuidePlaying, setAudioGuidePlaying] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<MuseumMasterpiece | null>(null);

  // Prepare 8-item infinite loop items for FlexCarousel
  const carouselItems: FlexCarouselItem[] = useMemo(() => {
    // Loop the 4 masterpieces twice for infinite seamless row flow
    return [...masterpieces, ...masterpieces].map((piece) => ({
      src: piece.imageSrc,
      alt: piece.title,
      title: piece.title,
      subtitle: `${piece.year} • ${piece.category}`,
    }));
  }, []);

  const currentPiece = masterpieces[activePieceIndex % masterpieces.length];

  return (
    <section
      className={`py-28 px-4 sm:px-6 lg:px-8 min-h-screen transition-colors duration-700 relative overflow-hidden bg-transparent ${
        activeMood === "atrium"
          ? "text-foreground"
          : "text-foreground"
      }`}
    >
      {/* Museum Ceiling Ambient Track Lighting */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-primary/10 via-primary/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Museum Grand Portal Header */}
        <div className="text-center pb-2 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground">
            The Permanent Collection
          </h2>
        </div>

        {/* Museum Amenities Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-card/85 dark:bg-[#20252B]/85 border border-border/40 backdrop-blur-xl shadow-md">
          {/* Liquid Glass Distortion Preset Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary flex items-center gap-1 font-bold">
              <span>✦</span> Glass Lens:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 text-xs font-mono">
              {(["liquid", "ribbon", "vortex", "arch"] as BendPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreset(p)}
                  className={`px-3 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                    activePreset === p
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Lighting Atmosphere */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-primary" />
              Atmosphere:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
              {[
                { id: "vernissage", label: "Vernissage", icon: Flame },
                { id: "atrium", label: "Atrium", icon: Sun },
                { id: "noir", label: "Noir", icon: Moon },
              ].map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood.id as LightingAtmosphere)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      activeMood === mood.id
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flow Toggle & Audio Guide */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isAutoplay
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-black/5 dark:bg-white/5 text-muted-foreground border-border/50"
              }`}
            >
              {isAutoplay ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>✦ FLOW: ACTIVE</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-muted-foreground" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            <button
              onClick={() => setAudioGuidePlaying(!audioGuidePlaying)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
                audioGuidePlaying
                  ? "bg-primary/20 border-primary/40 text-primary shadow-md shadow-primary/10"
                  : "bg-black/5 dark:bg-white/5 border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {audioGuidePlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>Audio: Active</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-primary rounded-full animate-bounce" />
                    <span
                      className="w-1 h-4 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Audio Guide No. 104</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Audio Guide Commentary Ticker (When Active) */}
        {audioGuidePlaying && (
          <div className="p-4 rounded-xl bg-card border border-primary/30 text-foreground text-xs font-serif italic flex items-start gap-3 shadow-lg">
            <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest not-italic shrink-0 px-2 py-0.5 rounded bg-primary/15">
              AUDIO COMMENTARY // {currentPiece.catalogNumber}
            </span>
            <p className="leading-relaxed">
              "{currentPiece.audioGuideTranscript}"
            </p>
          </div>
        )}

        {/* REACT BITS FLEX CAROUSEL (Infinite row flowing through liquid glass) */}
        <div className="relative w-full h-[460px] sm:h-[500px] overflow-hidden bg-transparent border-0 shadow-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <FlexCarousel
            items={carouselItems}
            preset={activePreset}
            cardHeight={0.75}
            gap={28}
            radius={18}
            fit="natural"
            autoplay={isAutoplay}
            interval={4}
            captions={true}
            focusOnClick={true}
            captureWheel={true}
            onChange={(idx) => {
              setActivePieceIndex(idx % masterpieces.length);
            }}
            onSelect={(idx) => {
              const piece = masterpieces[idx % masterpieces.length];
              setSelectedArtwork(piece);
            }}
            className="w-full h-full"
          />

          {/* Interactive Hint Banner */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-between px-6 pointer-events-none text-[10px] font-mono text-muted-foreground/70">
            <span>DRAG / SCROLL TO FLOW THROUGH LIQUID GLASS</span>
            <span>CLICK CARD TO INSPECT ARCHIVE ↗</span>
          </div>
        </div>

        {/* ENGRAVED MUSEUM PLACARD (`Cartellino`) */}
        <div className="rounded-3xl bg-card dark:bg-[#272D35] border border-border/40 dark:border-border/40 p-6 sm:p-8 shadow-xl text-foreground space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <div className="text-xs font-mono text-primary font-bold tracking-widest uppercase mb-1">
                {currentPiece.room}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-foreground">
                {currentPiece.title}
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-muted-foreground mt-0.5">
                {currentPiece.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 text-right font-mono">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  Catalog Number
                </div>
                <div className="text-sm font-black text-primary">
                  {currentPiece.catalogNumber}
                </div>
              </div>

              <button
                onClick={() => setSelectedArtwork(currentPiece)}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:opacity-90"
              >
                <ZoomIn className="w-4 h-4 text-primary-foreground" />
                <span>Examine Canvas</span>
              </button>
            </div>
          </div>

          {/* Curator's Narrative */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Curator's Exhibition Analysis</span>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-muted-foreground leading-relaxed">
              "{currentPiece.curatorNote}"
            </p>
          </div>

          {/* Medium, Dimensions & EXIF Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border/50 pt-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
              <span className="text-[9px] text-muted-foreground block uppercase">Medium</span>
              <span className="font-semibold text-foreground line-clamp-1">{currentPiece.medium}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
              <span className="text-[9px] text-muted-foreground block uppercase">Dimensions</span>
              <span className="font-semibold text-foreground">{currentPiece.dimensions}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
              <span className="text-[9px] text-muted-foreground block uppercase flex items-center gap-1">
                <Camera className="w-3 h-3 text-primary" />
                Optics
              </span>
              <span className="font-semibold text-foreground">
                {currentPiece.exif.lens} • {currentPiece.exif.aperture}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
              <span className="text-[9px] text-muted-foreground block uppercase flex items-center gap-1">
                <Compass className="w-3 h-3 text-primary" />
                Location
              </span>
              <span className="font-semibold text-foreground">{currentPiece.exif.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PRIVATE GALLERY LIGHTBOX MODAL */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card dark:bg-[#20252B] border border-border/70 dark:border-[#353E48] p-6 sm:p-10 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArtwork(null)}
              aria-label="Close dialog"
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Artwork Frame in Lightbox */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/80 border border-border/50 shadow-2xl flex items-center justify-center">
              <img
                src={selectedArtwork.imageSrc}
                alt={selectedArtwork.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Artwork Details */}
            <div className="space-y-4 text-foreground">
              <div className="border-b border-border/50 pb-4">
                <div className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                  {selectedArtwork.catalogNumber} • {selectedArtwork.room}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-foreground mt-1">
                  {selectedArtwork.title}
                </h3>
                <p className="text-sm font-serif italic text-muted-foreground">
                  {selectedArtwork.subtitle}
                </p>
              </div>

              <p className="text-sm font-serif italic leading-relaxed text-muted-foreground">
                "{selectedArtwork.curatorNote}"
              </p>

              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50 text-xs font-mono text-muted-foreground space-y-1">
                <div>PROVENANCE: {selectedArtwork.provenance}</div>
                <div>EXIF: {selectedArtwork.exif.lens} • {selectedArtwork.exif.shutter} • {selectedArtwork.exif.aperture} • ISO {selectedArtwork.exif.iso}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
