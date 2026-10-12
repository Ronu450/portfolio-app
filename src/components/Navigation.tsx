import { Menu, X, Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import profilePic from "../assets/profile.png";
import { smoothScrollToSection } from "../utils/smoothScroll";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navigation({
  activeSection,
  setActiveSection,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [sliderStyle, setSliderStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "credentials", label: "Credentials" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    smoothScrollToSection(id, 420);
  };

  // Measure and align the clear glass slider pill to target tab
  const updateSlider = useCallback(() => {
    const rawTargetId = hoveredSection || activeSection;
    const currentTargetId =
      itemRefs.current[rawTargetId]
        ? rawTargetId
        : rawTargetId === "skills"
        ? "about"
        : rawTargetId === "credentials"
        ? "education"
        : "home";
    const container = containerRef.current;
    const targetEl = itemRefs.current[currentTargetId];

    if (!container || !targetEl) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    setSliderStyle({
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      opacity: 1,
    });
  }, [hoveredSection, activeSection]);

  useEffect(() => {
    updateSlider();
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [updateSlider]);

  // Ensure precise placement after fonts/layout settle
  useEffect(() => {
    const timer = setTimeout(updateSlider, 120);
    return () => clearTimeout(timer);
  }, [updateSlider, activeSection]);

  // Track global page scroll progress for bottom glass slider
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 bg-[#20252B]/95 text-[#FAFAFA] backdrop-blur-2xl border-b border-[#353E48] shadow-[0_4px_30px_rgba(0,0,0,0.12)] transition-colors duration-300"
    >
      {/* Top Ambient Specular Rim */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Live Status Avatar */}
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className="flex-shrink-0 flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="Return to top"
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-[#426A8C]/40 group-hover:border-[#426A8C] transition-all duration-300 ring-2 ring-[#426A8C]/20">
                <AvatarImage src={profilePic} alt="Ronu Skariah" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#426A8C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#426A8C] border-2 border-[#20252B]"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[#FAFAFA] text-sm tracking-tight group-hover:text-[#8EAEC9] transition-colors">
                Ronu Skariah
              </span>
              <span className="text-[10px] text-[#98A5B3] font-mono tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#426A8C]"></span>
                Dublin, IE
              </span>
            </div>
          </button>

          {/* Desktop Navigation with Clear Glass Slider */}
          <div className="hidden md:flex items-center gap-3">
            <div
              ref={containerRef}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative flex items-center p-1 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_12px_rgba(0,0,0,0.25)]"
            >
              {/* Animated Clear Glass Slider Pill */}
              <div
                className="absolute top-1 bottom-1 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  transform: `translateX(${sliderStyle.left}px)`,
                  width: `${sliderStyle.width}px`,
                  opacity: sliderStyle.opacity,
                }}
              >
                {/* 1. Muted Blue Slider Body */}
                <div className="absolute inset-0 rounded-full bg-[#426A8C] backdrop-blur-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" />

                {/* 2. Prismatic Light Reflection Sheen */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />

                {/* 3. Ambient Edge Glow */}
                <div className="absolute -inset-[2px] rounded-full bg-[#426A8C]/30 blur-[6px] opacity-75 -z-10" />

                {/* 4. Active Micro Glow Bead */}
                <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredSection === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[item.id] = el;
                    }}
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredSection(item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative z-10 px-3.5 py-1.5 text-xs lg:text-sm font-medium tracking-tight rounded-full transition-colors duration-200 select-none cursor-pointer ${
                      isActive || isHovered
                        ? "text-[#FAFAFA] font-semibold"
                        : "text-[#98A5B3] hover:text-[#FAFAFA]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Clear Glass Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl text-[#98A5B3] hover:text-[#FAFAFA] hover:bg-white/[0.1] shadow-sm transition-all"
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[#8EAEC9] transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-[#8EAEC9] transition-transform duration-300 hover:-rotate-12" />
              )}
            </Button>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/10 text-muted-foreground hover:text-foreground"
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/10 text-primary"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Progress Slider along bottom rim */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.08] overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#426A8C] via-[#5B86A9] to-[#8EAEC9] transition-all duration-100 ease-out relative shadow-[0_0_8px_rgba(66,106,140,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Glass slider prism tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-2 bg-white rounded-full blur-[1px] opacity-90" />
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-[#353E48] bg-[#20252B] px-4 py-3 space-y-1.5 shadow-2xl"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "font-semibold text-white bg-[#426A8C] shadow-sm"
                    : "text-[#98A5B3] hover:text-[#FAFAFA] hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
