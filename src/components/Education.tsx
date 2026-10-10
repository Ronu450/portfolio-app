import { Award, ChevronDown, Code2, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  credentialType: "Certification" | "Internship";
}

type EducationPhase =
  | "idle"
  | "emerging"
  | "traveling"
  | "developer"
  | "settled";

interface MarkerPosition {
  x: number;
  y: number;
}

export function Education() {
  const educations: EducationItem[] = [
    {
      id: "2019",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Saintgits College of Engineering",
      period: "2019",
      location: "Kerala",
    },
    {
      id: "2022",
      degree: "MSc in Data Analytics",
      institution: "National College of Ireland",
      period: "2022",
      location: "Ireland",
    },
  ];

  const certifications: CertificationItem[] = [
    {
      id: "1",
      name: "Introduction to Artificial Intelligence",
      issuer: "Microsoft",
      credentialType: "Certification",
    },
    {
      id: "2",
      name: "MongoDB",
      issuer: "Infosys Certified",
      credentialType: "Certification",
    },
    {
      id: "3",
      name: "Power BI",
      issuer: "Infosys Certified",
      credentialType: "Certification",
    },
    {
      id: "4",
      name: "Teradata",
      issuer: "Infosys Certified",
      credentialType: "Certification",
    },
    {
      id: "5",
      name: "Accenture Virtual Internship",
      issuer: "Forage",
      credentialType: "Internship",
    },
    {
      id: "6",
      name: "JPMorgan Chase Virtual Internship",
      issuer: "Forage",
      credentialType: "Internship",
    },
    {
      id: "7",
      name: "KPMG Virtual Internship",
      issuer: "Forage",
      credentialType: "Internship",
    },
  ];

  const journeyRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef<EducationPhase>("idle");
  const [phase, setPhase] = useState<EducationPhase>("idle");
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(
    null,
  );
  const [expandedCertifications, setExpandedCertifications] = useState<
    Set<string>
  >(() => new Set());

  const toggleCertification = (id: string) => {
    setExpandedCertifications((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const journey = journeyRef.current;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (
      !journey ||
      motionPreference.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const timers: number[] = [];
    const setJourneyPhase = (nextPhase: EducationPhase) => {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    };
    const clearSequenceTimers = () => {
      timers.forEach(window.clearTimeout);
      timers.length = 0;
    };
    const placeMarkerAt = (index: number) => {
      const stop = stopRefs.current[index];
      if (!stop) return;
      const journeyBounds = journey.getBoundingClientRect();
      const stopBounds = stop.getBoundingClientRect();
      setMarkerPosition({
        x: stopBounds.left - journeyBounds.left + stopBounds.width / 2 - 22,
        y: stopBounds.top - journeyBounds.top + stopBounds.height / 2 - 22,
      });
    };
    const updateMarkerPosition = () => {
      if (phaseRef.current === "emerging") placeMarkerAt(0);
      if (
        phaseRef.current === "traveling" ||
        phaseRef.current === "developer"
      ) {
        placeMarkerAt(1);
      }
    };
    const finishSequence = () => {
      clearSequenceTimers();
      setMarkerPosition(null);
      setJourneyPhase("settled");
    };
    const resetSequence = () => {
      clearSequenceTimers();
      setMarkerPosition(null);
      setJourneyPhase("idle");
    };
    const startSequence = () => {
      if (phaseRef.current !== "idle") return;
      placeMarkerAt(0);
      setJourneyPhase("emerging");
      timers.push(
        window.setTimeout(() => {
          setJourneyPhase("traveling");
          placeMarkerAt(1);
        }, 850),
      );
      timers.push(
        window.setTimeout(() => {
          placeMarkerAt(1);
          setJourneyPhase("developer");
        }, 1800),
      );
      timers.push(
        window.setTimeout(() => {
          setMarkerPosition(null);
          setJourneyPhase("settled");
        }, 2750),
      );
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            if (motionPreference.matches) finishSequence();
            else startSequence();
          } else if (!entry.isIntersecting && phaseRef.current !== "idle") {
            resetSequence();
          }
        });
      },
      { threshold: 0.15 },
    );
    intersectionObserver.observe(journey);

    const resizeObserver = new ResizeObserver(updateMarkerPosition);
    resizeObserver.observe(journey);
    stopRefs.current.forEach((stop) => {
      if (stop) resizeObserver.observe(stop);
    });

    const handleMotionPreferenceChange = () => {
      if (motionPreference.matches && phaseRef.current !== "idle") {
        finishSequence();
      }
    };
    motionPreference.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      motionPreference.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The academic chapters
            </p>
            <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              Education
            </h2>
            <p className="text-muted-foreground">
              Two milestones that shaped my path.
            </p>
          </div>

          <div
            ref={journeyRef}
            className={`education-journey education-journey--${phase}`}
          >
            <div className="education-role-stage" aria-hidden="true">
              <div
                className={`education-role${phase === "developer" ? " education-role--visible" : ""}`}
              >
                <Code2 className="h-4 w-4" />
                Software Developer
              </div>
            </div>

            <div className="education-journey__grid grid gap-5 md:grid-cols-2">
              {educations.map((edu, index) => (
                <Card
                  key={edu.id}
                  className={`education-tile education-tile--${edu.period} group relative overflow-hidden rounded-xl border border-white/10 bg-card transition-colors duration-300 hover:border-primary/30`}
                >
                  <div className="education-tile__content flex h-full flex-col p-5 sm:p-6">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div
                        className="education-tile__icon"
                        ref={(node) => {
                          stopRefs.current[index] = node;
                        }}
                      >
                        <GraduationCap className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Class of
                        </span>
                        <span className="education-tile__year text-3xl font-bold text-foreground sm:text-4xl">
                          {edu.period}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                        Academic degree
                      </p>
                      <h3 className="mb-3 text-lg font-semibold leading-snug text-foreground">
                        {edu.degree}
                      </h3>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        {edu.institution}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary/80" />
                        {edu.location}
                      </p>
                    </div>
                    <span
                      className="education-tile__ground"
                      aria-hidden="true"
                    />
                  </div>
                </Card>
              ))}
            </div>

            {markerPosition && phase !== "settled" && (
              <div
                className={`education-marker${phase === "developer" ? " education-marker--developer" : ""}`}
                style={{
                  transform: `translate3d(${markerPosition.x}px, ${markerPosition.y}px, 0)`,
                }}
                aria-hidden="true"
              >
                <GraduationCap className="education-marker__graduate h-6 w-6" />
                <Code2 className="education-marker__developer h-5 w-5" />
              </div>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Certifications & Internships
          </h3>
          <p className="text-muted-foreground mb-8">
            Professional certifications and training
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {certifications.map((cert, index) => (
              <article
                className={`certificate-tile${expandedCertifications.has(cert.id) ? " certificate-tile--expanded" : ""}`}
                key={cert.id}
              >
                <button
                  type="button"
                  className="certificate-tile__trigger"
                  aria-expanded={expandedCertifications.has(cert.id)}
                  aria-controls={`certificate-details-${cert.id}`}
                  onClick={() => toggleCertification(cert.id)}
                >
                  <span className="certificate-tile__heading">
                    <span className="certificate-tile__type">
                      {cert.credentialType}
                    </span>
                    <span className="certificate-tile__wordmark">
                      Credential {String(index + 1).padStart(2, "0")}
                    </span>
                    <ChevronDown
                      className="certificate-tile__chevron h-4 w-4"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="certificate-tile__name">{cert.name}</span>
                </button>

                <div
                  id={`certificate-details-${cert.id}`}
                  className="certificate-tile__reveal"
                  aria-hidden={!expandedCertifications.has(cert.id)}
                >
                  <div className="certificate-tile__reveal-inner">
                    <div className="certificate-tile__details">
                      <p className="certificate-tile__eyebrow">
                        Credential details
                      </p>
                      <div className="certificate-tile__issuer">
                        <span>Issued by</span>
                        <strong>{cert.issuer}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="certificate-tile__seal" aria-hidden="true">
                  <Award className="h-6 w-6" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
