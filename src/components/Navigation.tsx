import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import profilePic from "../assets/profile.png";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navigation({
  activeSection,
  setActiveSection,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);


  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "stories", label: "Stories" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; // Height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-primary/20 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={profilePic} alt="Ronu Skariah" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ronu Skariah
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div 
              className="flex relative bg-muted/40 backdrop-blur-md p-1 rounded-full border border-primary/10"
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Sliding background pill */}
              <div 
                className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/20 transition-all duration-300 ease-in-out pointer-events-none z-0"
                style={{
                  left: `${navItems.findIndex(item => item.id === (hoveredSection || activeSection)) * 100 + 4}px`,
                  width: "92px"
                }}
              />
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  className={`w-[100px] py-1.5 rounded-full transition-colors duration-300 relative z-10 text-sm font-semibold text-center cursor-pointer ${
                    (hoveredSection || activeSection) === item.id
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-primary"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-background/95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-all ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "text-foreground hover:bg-primary/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
