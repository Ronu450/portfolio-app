import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { Credentials } from "./components/Credentials";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Navigation } from "./components/Navigation";
import { ScrollReveal } from "./components/ScrollReveal";
import { Section3DBackground } from "./components/Section3DBackground";
import { RotatingStars, ShaderWaves } from "./components/AmbientBackgrounds";
import { LaunchTransition } from "./components/LaunchTransition";
import { SectionScroller } from "./components/SectionScroller";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = [
      "home",
      "about",
      "skills",
      "experience",
      "education",
      "credentials",
      "gallery",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { threshold: 0.15, rootMargin: "-20% 0px -40% 0px" }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
        isLoaded ? "opacity-100" : "opacity-95"
      }`}
    >
      {/* Cinematic Snappy Launch Transition */}
      <LaunchTransition onComplete={() => setIsLoaded(true)} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      {/* Clear Glass Slider Navbar */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Floating Section Progress Indicator */}
      <SectionScroller activeSection={activeSection} />

      <main id="main-content" className="pt-16">
        {/* 1. HOME / HERO */}
        <section
          id="home"
          className="relative overflow-hidden min-h-screen bg-background"
        >
          <Section3DBackground
            sectionId="home"
            active={activeSection === "home"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "home"} immediate={true}>
              <Hero />
            </ScrollReveal>
          </div>
        </section>

        {/* 2. ABOUT */}
        <section
          id="about"
          className="relative overflow-hidden min-h-screen bg-transparent border-t border-border/40"
        >
          <Section3DBackground
            sectionId="about"
            active={activeSection === "about"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "about"}>
              <About />
            </ScrollReveal>
          </div>
        </section>

        {/* 3. KEY SKILLS */}
        <section
          id="skills"
          className="relative overflow-hidden min-h-screen bg-transparent border-t border-border/40"
        >
          <RotatingStars />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "skills"}>
              <Skills />
            </ScrollReveal>
          </div>
        </section>

        {/* 4. EXPERIENCE */}
        <section
          id="experience"
          className="relative overflow-hidden min-h-screen bg-background/50 border-t border-border/40"
        >
          <Section3DBackground
            sectionId="experience"
            active={activeSection === "experience"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "experience"}>
              <Experience />
            </ScrollReveal>
          </div>
        </section>

        {/* 5. EDUCATION */}
        <section
          id="education"
          className="relative overflow-hidden min-h-screen bg-background border-t border-border/40"
        >
          <Section3DBackground
            sectionId="education"
            active={activeSection === "education"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "education"}>
              <Education />
            </ScrollReveal>
          </div>
        </section>

        {/* 6. CREDENTIALS */}
        <section
          id="credentials"
          className="relative overflow-hidden min-h-screen bg-transparent border-t border-border/40"
        >
          <ShaderWaves />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "credentials"}>
              <Credentials />
            </ScrollReveal>
          </div>
        </section>

        {/* 7. GALLERY */}
        <section
          id="gallery"
          className="relative overflow-hidden min-h-screen bg-background/50 border-t border-border/40"
        >
          <Section3DBackground
            sectionId="gallery"
            active={activeSection === "gallery"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "gallery"}>
              <Gallery />
            </ScrollReveal>
          </div>
        </section>

        {/* 9. CONTACT */}
        <section
          id="contact"
          className="relative overflow-hidden min-h-screen bg-background border-t border-border/40"
        >
          <Section3DBackground
            sectionId="contact"
            active={activeSection === "contact"}
          />
          <div className="relative z-10">
            <ScrollReveal active={activeSection === "contact"}>
              <Contact />
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Charcoal Footer */}
      <footer className="border-t border-[#353E48] py-10 text-center bg-[#20252B] text-[#FAFAFA] font-mono text-xs relative z-10">
        <p className="text-[#98A5B3]">© {new Date().getFullYear()} Ronu Skariah • All Architectural Systems Nominal</p>
      </footer>
    </div>
  );
}
