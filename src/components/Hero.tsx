import { ArrowDown, MapPin, Code, Palette, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import profileFull from "../assets/profile-full.png";

export function Hero() {
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const updateVideoPreference = () =>
      setCanPlayVideo(!motionPreference.matches && !compactViewport.matches);

    updateVideoPreference();
    motionPreference.addEventListener("change", updateVideoPreference);
    compactViewport.addEventListener("change", updateVideoPreference);
    return () => {
      motionPreference.removeEventListener("change", updateVideoPreference);
      compactViewport.removeEventListener("change", updateVideoPreference);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <style>{`
        @keyframes badge-settle {
          0% { transform: rotateZ(-9deg); }
          24% { transform: rotateZ(6deg); }
          44% { transform: rotateZ(-3.5deg); }
          64% { transform: rotateZ(1.8deg); }
          82% { transform: rotateZ(-0.7deg); }
          100% { transform: rotateZ(0); }
        }
        @keyframes lanyard-settle {
          0% { transform: translateX(-50%) rotateZ(-4deg); }
          24% { transform: translateX(-50%) rotateZ(2.5deg); }
          44% { transform: translateX(-50%) rotateZ(-1.5deg); }
          64% { transform: translateX(-50%) rotateZ(0.8deg); }
          82% { transform: translateX(-50%) rotateZ(-0.3deg); }
          100% { transform: translateX(-50%) rotateZ(0); }
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
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .role-tag {
          animation: fade-in-up 0.6s ease-out backwards;
        }
        .role-tag:nth-child(1) { animation-delay: 0.2s; }
        .role-tag:nth-child(2) { animation-delay: 0.4s; }
        .role-tag:nth-child(3) { animation-delay: 0.6s; }

        .id-card-scene {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1400px;
          transform-style: preserve-3d;
        }

        .id-card-lanyard {
          position: absolute;
          left: 50%;
          top: -88px;
          width: 8px;
          height: 128px;
          border-radius: 9999px;
          transform: translateX(-50%);
          transform-origin: 50% 0%;
          animation: lanyard-settle 1.8s cubic-bezier(0.22, 0.61, 0.36, 1) 0.25s;
          transition: transform 650ms cubic-bezier(0.2, 0.85, 0.35, 1.15);
          background: linear-gradient(90deg, #41483a 0%, #c5ef6b 48%, #41483a 100%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        }

        .id-card-lanyard::before {
          content: '';
          position: absolute;
          inset: 10px 0 auto 0;
          height: 72%;
          background: repeating-linear-gradient(
            180deg,
            rgba(21, 25, 14, 0.35) 0px,
            rgba(21, 25, 14, 0.35) 6px,
            rgba(255, 255, 255, 0.08) 6px,
            rgba(255, 255, 255, 0.08) 12px
          );
          opacity: 0.55;
          border-radius: 9999px;
        }

        .id-card-clip {
          position: absolute;
          left: 50%;
          top: -10px;
          width: 28px;
          height: 14px;
          border-radius: 4px;
          transform: translateX(-50%);
          transform-origin: 50% 0%;
          transition: transform 650ms cubic-bezier(0.2, 0.85, 0.35, 1.15);
          border: 1px solid rgba(242, 244, 237, 0.78);
          background: linear-gradient(180deg, #e1e4d9, #7a8271);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
          z-index: 3;
        }

        .id-card-clip::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 11px;
          width: 10px;
          height: 10px;
          transform: translateX(-50%);
          border: 1px solid rgba(225, 228, 217, 0.85);
          border-top: 0;
          border-radius: 0 0 6px 6px;
        }

        .id-card-rotator {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: 50% 0%;
          animation: badge-settle 1.8s cubic-bezier(0.22, 0.61, 0.36, 1);
          transition: transform 650ms cubic-bezier(0.2, 0.85, 0.35, 1.15), filter 350ms ease;
          transform-style: preserve-3d;
        }

        .id-card-scene:hover .id-card-rotator {
          transform: rotateZ(4deg) rotateY(-2deg) rotateX(1deg);
          filter: drop-shadow(0 18px 24px rgba(10, 14, 8, 0.35));
        }

        .id-card-scene:hover .id-card-lanyard {
          transform: translateX(-50%) rotateZ(2deg);
        }

        .id-card-scene:hover .id-card-clip {
          transform: translateX(-50%) rotateZ(2deg);
        }

        .id-card-shell {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.25);
          background: linear-gradient(180deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.9) 24%, rgba(2,6,23,0.95) 100%);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 50px rgba(2, 6, 23, 0.6);
        }

        .id-card-header {
          position: absolute;
          inset: 0 0 auto 0;
          height: 26%;
          z-index: 3;
          padding: 18px 18px 12px;
          background: linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(15,23,42,0.7) 46%, rgba(15,23,42,0) 100%);
          border-bottom: 1px solid rgba(148,163,184,0.18);
        }

        .id-card-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .id-card-tag {
          color: rgba(255,255,255,0.78);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .id-card-mark {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(248, 113, 113, 0.9);
          background: radial-gradient(circle at center, #191d19 0 30%, #c5ef6b 31% 54%, #191d19 55% 100%);
          box-shadow: 0 0 10px rgba(197, 239, 107, 0.28);
        }

        .id-card-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(197,239,107,0.18), rgba(255,255,255,0.05), rgba(0,0,0,0));
          z-index: 1;
          pointer-events: none;
        }

        .id-card-shell::after {
          content: '';
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 12px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
          z-index: 2;
          pointer-events: none;
        }

        .id-card-photo-wrap {
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(15,23,42,0.4);
        }

        .id-card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          border-radius: 28px;
          filter: saturate(1.08) contrast(1.05);
        }

        .id-card-team {
          position: absolute;
          right: 18px;
          top: 56px;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 9999px;
          background: rgba(15,23,42,0.58);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.82);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .id-card-team-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399, #22c55e);
          box-shadow: 0 0 12px rgba(52,211,153,0.7);
        }

        .id-card-name {
          position: absolute;
          left: 20px;
          right: 18px;
          bottom: 68px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .id-card-name strong {
          display: block;
          color: white;
          font-size: 18px;
          letter-spacing: 0.05em;
          line-height: 1.2;
        }

        .id-card-name span {
          display: block;
          color: rgba(242,244,237,0.78);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .id-card-meta {
          position: absolute;
          left: 20px;
          right: 82px;
          bottom: 18px;
          z-index: 4;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .id-card-meta-label {
          color: rgba(148,163,184,0.9);
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .id-card-meta-value {
          margin-top: 3px;
          color: rgba(255,255,255,0.88);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .id-card-micro-bar {
          position: absolute;
          right: 18px;
          bottom: 20px;
          width: 54px;
          height: 54px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,41,59,0.9));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
        }

        .id-card-micro-bar::before {
          content: '';
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.7) 0px,
            rgba(255,255,255,0.7) 2px,
            rgba(15,23,42,0.5) 2px,
            rgba(15,23,42,0.5) 4px
          );
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
      `}</style>

      {/* Video Background - Reduced Blur to make it more visible */}
      <video
        autoPlay={canPlayVideo}
        loop
        muted
        playsInline
        preload={canPlayVideo ? "metadata" : "none"}
        poster={profileFull}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-[5px] opacity-80"
      >
        {canPlayVideo && <source src="/videos/my-video.mp4" type="video/mp4" />}
      </video>

      {/* Lighter Cinematic gradient overlay for improved video visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50 pointer-events-none" />

      {/* Content Container with Grid and Parallax */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 sm:py-24 md:py-32">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Text & Info Content */}
          <div className="w-full md:col-span-7 text-left space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
            {/* Top Row on Mobile: Name & Video Side-by-Side */}
            <div className="flex md:block items-center justify-between gap-4 w-full">
              <div className="space-y-3 sm:space-y-6 flex-1">
                {/* Location Pill */}
                <div>
                  <div className="relative inline-flex items-center gap-1.5 sm:gap-3 px-3 py-1.5 sm:px-5 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                    <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full"></div>
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="text-[10px] sm:text-sm font-medium text-white">
                      From Kottayam, Kerala
                    </span>
                  </div>
                </div>

                {/* Title Name */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
                    Hi, I'm <br />
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Ronu Skariah
                    </span>
                  </h1>
                </div>

                {/* Role Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-3">
                  {[
                    { role: "Full Stack Engineer", icon: Code },
                    { role: "Product Designer", icon: Palette },
                    { role: "Creative Thinker", icon: Zap },
                  ].map(({ role, icon: IconComponent }, i) => (
                    <span
                      key={i}
                      className="role-tag px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-white/10 border border-white/20 text-[9px] sm:text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-default flex items-center gap-1 sm:gap-2"
                    >
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Picture: Mobile Only side-by-side */}
              <div
                className="block md:hidden shrink-0 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="id-card-scene relative w-[120px] aspect-[4/5]">
                  <div className="id-card-lanyard" />
                  <div className="id-card-clip" />
                  <div className="id-card-rotator w-full h-full">
                    <div className="id-card-shell w-full h-full">
                      <div className="id-card-header">
                        <div className="id-card-header-inner">
                          <span className="id-card-tag">Corporate ID</span>
                          <span className="id-card-mark" />
                        </div>
                      </div>
                      <div className="id-card-photo-wrap">
                        <img
                          src={profileFull}
                          alt="Ronu Skariah"
                          className="id-card-image"
                        />
                      </div>
                      <div className="id-card-team">
                        <span className="id-card-team-dot" />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl text-white/95 leading-relaxed text-xs sm:text-base lg:text-lg font-light">
              I architect and build scalable, high-performance web applications
              with a focus on elegant design and exceptional user experience.
              Specializing in modern full-stack development, I transform complex
              technical challenges into intuitive, production-grade solutions
              that drive business value.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) {
                    const offset = 64;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="px-4 py-2 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs sm:text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                Get in Touch
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("experience");
                  if (el) {
                    const offset = 64;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="px-4 py-2 sm:px-8 sm:py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-base font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                View Experience
              </button>
            </div>
          </div>

          {/* Right Column: Premium Showcase Profile (Desktop Only) */}
          <div
            className="hidden md:flex md:col-span-5 justify-center lg:justify-end animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="id-card-scene group w-full max-w-[300px] lg:max-w-[400px] aspect-[4/5] py-8">
              <div className="id-card-lanyard" />
              <div className="id-card-clip" />
              <div className="id-card-rotator w-full h-full">
                <div className="id-card-shell w-full h-full">
                  <div className="id-card-header">
                    <div className="id-card-header-inner">
                      <span className="id-card-tag">Corporate ID</span>
                      <span className="id-card-mark" />
                    </div>
                  </div>

                  <div className="id-card-photo-wrap">
                    <img
                      src={profileFull}
                      alt="Ronu Skariah"
                      className="id-card-image"
                      style={{ objectPosition: "center center" }}
                    />
                  </div>

                  <div className="id-card-team">
                    <span className="id-card-team-dot" />
                    Verified
                  </div>

                  <div className="id-card-name">
                    <strong>Ronu Skariah</strong>
                    <span>Full Stack Engineer</span>
                  </div>

                  <div className="id-card-meta">
                    <div>
                      <div className="id-card-meta-label">Role</div>
                      <div className="id-card-meta-value">Developer</div>
                    </div>
                    <div>
                      <div className="id-card-meta-label">ID</div>
                      <div className="id-card-meta-value">RS-2048</div>
                    </div>
                  </div>

                  <div className="id-card-micro-bar" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="animate-fade-in-up pt-12 flex justify-center"
          style={{ animationDelay: "0.5s" }}
        >
          <ArrowDown className="w-6 h-6 text-white opacity-80" />
        </div>
      </div>

      {/* Instructions box for adding video */}
    </section>
  );
}
