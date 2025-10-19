import { useState } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { Stories } from "./components/Stories";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Navigation } from "./components/Navigation";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="pt-16">
        {activeSection === "home" && (
          <>
            <Hero />
            <About />
          </>
        )}
        {activeSection === "experience" && <Experience />}
        {activeSection === "education" && <Education />}
        {activeSection === "stories" && <Stories />}
        {activeSection === "gallery" && <Gallery />}
        {activeSection === "contact" && <Contact />}
      </main>

      <footer className="border-t border-primary/20 mt-20 py-8 text-center text-muted-foreground bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <p>© 2025 About Me Portfolio. All rights reserved.</p>
        <p className="mt-2">
          Made with <span className="text-secondary">❤</span> and{" "}
          <span className="text-primary">creativity</span>
        </p>
      </footer>
    </div>
  );
}
