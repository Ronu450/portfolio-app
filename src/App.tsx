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
    const sections = [
      "home",
      "about",
      "experience",
      "education",
      "stories",
      "gallery",
      "contact",
    ];

    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          threshold: 0.15, // Trigger when 15% of the section is visible
          rootMargin: "-25% 0px -45% 0px", // Active viewport scan window
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="bg-background pt-16">
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
        <p>© 2025 About Me Portfolio. All rights reserved.</p>
        <p className="mt-2">
          Made with <span className="text-secondary">🤖</span> and{" "}
          <span className="text-primary">creativity</span>
        </p>
      </footer>
    </div>
  );
}
