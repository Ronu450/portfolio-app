import { ArrowDown, MapPin, Code, Palette, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import profileFootballVideo from "../assets/profile-football.mp4";

export function Hero() {
  const [videoUrl, setVideoUrl] = useState("./videos/my-video.mp4");
  const [locationName, setLocationName] = useState("Kottayam, Kerala");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // keep track of previous blob URL so we can revoke it when replaced
  const prevBlobRef = useRef<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load persisted values on mount
  useEffect(() => {
    try {
      const savedVideo = localStorage.getItem("hero.videoUrl");
      const savedLocation = localStorage.getItem("hero.locationName");
      if (savedVideo) setVideoUrl(savedVideo);
      if (savedLocation) setLocationName(savedLocation);
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      if (videoUrl) localStorage.setItem("hero.videoUrl", videoUrl);
      else localStorage.removeItem("hero.videoUrl");
    } catch (e) {
      // ignore
    }
  }, [videoUrl]);

  useEffect(() => {
    try {
      localStorage.setItem("hero.locationName", locationName);
    } catch (e) {
      // ignore
    }
  }, [locationName]);

  // Revoke previous blob URL when videoUrl changes or on unmount
  useEffect(() => {
    if (
      prevBlobRef.current &&
      prevBlobRef.current !== videoUrl &&
      prevBlobRef.current.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(prevBlobRef.current);
      } catch (e) {
        /* ignore */
      }
      prevBlobRef.current = null;
    }

    if (videoUrl && videoUrl.startsWith("blob:")) {
      prevBlobRef.current = videoUrl;
    }

    return () => {
      if (prevBlobRef.current && prevBlobRef.current.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prevBlobRef.current);
        } catch (e) {
          /* ignore */
        }
        prevBlobRef.current = null;
      }
    };
  }, [videoUrl]);

  // Parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.015;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.015;
    setMousePosition({ x, y });
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 35px rgba(99, 102, 241, 0.7); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes location-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-rotate-gradient {
          animation: rotate-gradient 15s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-location-ping::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1px solid rgba(59, 130, 246, 0.4);
          animation: location-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .role-tag {
          animation: fade-in-up 0.6s ease-out backwards;
        }
        .role-tag:nth-child(1) { animation-delay: 0.2s; }
        .role-tag:nth-child(2) { animation-delay: 0.4s; }
        .role-tag:nth-child(3) { animation-delay: 0.6s; }
      `}</style>

      {/* Video Background - Reduced Blur to make it more visible */}
      {videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-[5px] opacity-80"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Fallback gradient background if no video
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-secondary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      )}

      {/* Lighter Cinematic gradient overlay for improved video visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50 pointer-events-none" />

      {/* Content Container with Grid and Parallax */}
      <div
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-24 md:py-32"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 text-left space-y-8 animate-fade-in-up">

            {/* Location Pill */}
            <div>
              <div className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full"></div>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  From {locationName}
                </span>
              </div>
            </div>

            {/* Title Name */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
                Hi, I'm <br />
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Ronu Skariah
                </span>
              </h1>
            </div>

            {/* Role Tags */}
            <div className="flex flex-wrap gap-3">
              {[
                { role: "Full Stack Engineer", icon: Code },
                { role: "Product Designer", icon: Palette },
                { role: "Creative Thinker", icon: Zap },
              ].map(({ role, icon: IconComponent }, i) => (
                <span
                  key={i}
                  className="role-tag px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-default flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {role}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="max-w-xl text-white/90 leading-relaxed text-base sm:text-lg font-light">
              I architect and build scalable, high-performance web
              applications with a focus on elegant design and exceptional user
              experience. Specializing in modern full-stack development, I
              transform complex technical challenges into intuitive,
              production-grade solutions that drive business value.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) {
                    const offset = 64;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                Get in Touch
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("experience");
                  if (el) {
                    const offset = 64;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                View Experience
              </button>
            </div>
          </div>

          {/* Right Column: Premium Showcase Video */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/20 shadow-2xl backdrop-blur-xl bg-white/[0.05] group transition-all duration-500 hover:scale-[1.02] hover:border-white/35">

              {/* Inner glowing shadow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none rounded-[32px]"></div>

              {/* Showcase Video Player */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[30px] shadow-2xl animate-pulse-glow"
              >
                <source src={profileFootballVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in-up pt-12 flex justify-center" style={{ animationDelay: "0.5s" }}>
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Instructions box for adding video */}
      {!videoUrl && (
        <div className="absolute bottom-4 right-4 max-w-sm bg-card/95 backdrop-blur-md border border-primary/20 rounded-lg p-4 shadow-xl z-20">
          <h4 className="text-primary mb-2">Add Your Hometown Video</h4>
          <p className="text-muted-foreground mb-3">
            Replace the placeholder with your video URL to showcase where you're
            from!
          </p>
          <code className="block text-xs bg-muted p-2 rounded overflow-x-auto">
            setVideoUrl('your-video-url.mp4')
          </code>
        </div>
      )}
    </section>
  );
}
