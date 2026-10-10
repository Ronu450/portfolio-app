import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { Stories } from "./components/Stories";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Navigation } from "./components/Navigation";
import { ScrollReveal } from "./components/ScrollReveal";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = [
      "home",
      "about",
      "experience",
      "education",
      "stories",
      "gallery",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { threshold: 0.15, rootMargin: "-25% 0px -45% 0px" },
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
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main id="main-content" className="bg-background pt-16">
        <section id="home">
          <ScrollReveal>
            <Hero />
          </ScrollReveal>
        </section>

        <section id="about">
          <ScrollReveal>
            <About />
          </ScrollReveal>
        </section>

        <section id="experience">
          <ScrollReveal>
            <Experience />
          </ScrollReveal>
        </section>

        <section id="education">
          <ScrollReveal>
            <Education />
          </ScrollReveal>
        </section>

        <section id="stories">
          <ScrollReveal>
            <Stories />
          </ScrollReveal>
        </section>

        <section id="gallery">
          <ScrollReveal>
            <Gallery />
          </ScrollReveal>
        </section>

        <section id="contact">
          <ScrollReveal>
            <Contact />
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-primary/20 mt-20 py-8 text-center text-muted-foreground bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <p>© {new Date().getFullYear()} Ronu Skariah</p>
      </footer>
    </div>
  );
}
