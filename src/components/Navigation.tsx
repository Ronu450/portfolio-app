import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navigation({
  activeSection,
  setActiveSection,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "stories", label: "Stories" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-primary/20 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ronu Skariah
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20"
                      : "text-foreground hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
