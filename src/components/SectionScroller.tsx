import { ChevronDown, ArrowUp } from "lucide-react";
import { smoothScrollToSection, smoothScrollTo } from "../utils/smoothScroll";

interface SectionScrollerProps {
  activeSection: string;
}

const SECTIONS = [
  { id: "home", label: "01 // Home", color: "#426A8C" },
  { id: "about", label: "02 // About Me", color: "#426A8C" },
  { id: "skills", label: "03 // Key Skills", color: "#426A8C" },
  { id: "experience", label: "04 // Experience", color: "#426A8C" },
  { id: "education", label: "05 // Education", color: "#426A8C" },
  { id: "credentials", label: "06 // Credentials", color: "#426A8C" },
  { id: "stories", label: "07 // Dev Works", color: "#426A8C" },
  { id: "gallery", label: "08 // Gallery", color: "#426A8C" },
  { id: "contact", label: "09 // Contact", color: "#426A8C" },
];

export function SectionScroller({ activeSection }: SectionScrollerProps) {
  const currentIndex = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === activeSection)
  );
  const isLast = currentIndex === SECTIONS.length - 1;

  const handleNextSection = () => {
    if (isLast) {
      smoothScrollTo(0, 420);
    } else {
      const next = SECTIONS[currentIndex + 1];
      if (next) smoothScrollToSection(next.id, 420);
    }
  };

  return (
    <aside
      aria-label="Section Quick Navigator"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2.5 p-2 rounded-full bg-[#20252B]/85 backdrop-blur-xl border border-[#353E48] shadow-xl transition-all duration-300"
    >
      {/* Visual Section Ticks */}
      <div className="flex flex-col items-center gap-2 py-1">
        {SECTIONS.map((s) => {
          const isActive = s.id === activeSection;

          return (
            <button
              key={s.id}
              onClick={() => smoothScrollToSection(s.id, 420)}
              className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              aria-label={`Slow transition to ${s.label}`}
            >
              {/* Tooltip Label Pill on Hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded-md bg-black/80 border border-white/15 text-[10px] font-mono text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all shadow-lg">
                {s.label}
              </span>

              {/* Progress Node */}
              <span
                style={{
                  backgroundColor: isActive ? s.color : undefined,
                  boxShadow: isActive ? `0 0 10px ${s.color}` : undefined,
                }}
                className={`transition-all duration-500 rounded-full ${
                  isActive
                    ? "w-3 h-3 scale-110"
                    : "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/70 group-hover:scale-125"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Slow Transition Next / Top Button */}
      <div className="pt-1.5 border-t border-white/10">
        <button
          onClick={handleNextSection}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
          title={isLast ? "Slow transition to top" : "Slow transition to next section"}
          aria-label={isLast ? "Back to top" : "Next section"}
        >
          {isLast ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
