import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";

export function Hero() {
  const [videoUrl, setVideoUrl] = useState("./videos/my-video.mp4");
  const [locationName, setLocationName] = useState("Kottayam, Kerala");

  // keep track of previous blob URL so we can revoke it when replaced
  const prevBlobRef = useRef<string | null>(null);

  // Load persisted values on mount
  useEffect(() => {
    try {
      const savedVideo = localStorage.getItem("hero.videoUrl");
      const savedLocation = localStorage.getItem("hero.locationName");
      if (savedVideo) setVideoUrl(savedVideo);
      if (savedLocation) setLocationName(savedLocation);
    } catch (e) {
      // ignore (e.g., SSR or browser storage disabled)
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
    // If previous was a blob URL and we switched to something else, revoke it
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

  return (
    <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
      {videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Fallback gradient background if no video
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      )}

      {/* Subtle overlay so video shows through but text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/0 pointer-events-none" />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Location Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/30 backdrop-blur-sm border border-primary/10 shadow">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">From {locationName}</span>
        </div>

        <div className="mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-secondary mx-auto mb-6 flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 backdrop-blur-sm">
            <span className="text-5xl">👋</span>
          </div>
        </div>

        <h1 className="mb-4 drop-shadow-lg">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Ronu Skariah
          </span>
        </h1>

        <h2 className="mb-6 drop-shadow-md">
          <span className="text-primary">Full Stack Developer</span> |{" "}
          <span className="text-accent">Designer</span> |{" "}
          <span className="text-secondary">Creative Thinker</span>
        </h2>

        <p className="text-foreground/95 max-w-2xl mx-auto mb-8 drop-shadow-md bg-background/20 backdrop-blur-sm rounded-lg px-6 py-4">
          I'm a passionate developer with expertise in building beautiful and
          functional web applications. I love turning complex problems into
          simple, elegant solutions.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          >
            View My Work
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary/20 hover:bg-primary/5 bg-background/10"
          >
            Get In Touch
          </Button>
        </div>

        <div className="mt-16 animate-bounce">
          <ArrowDown className="mx-auto text-primary drop-shadow-lg" />
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
