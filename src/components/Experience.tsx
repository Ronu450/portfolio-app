import {
  Briefcase,
  Calendar,
  LaptopMinimal,
  MapPin,
  PersonStanding,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
  isCurrent?: boolean;
}

function calculateExperienceYears(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const elapsedMs = now.getTime() - start.getTime();

  return elapsedMs / (1000 * 60 * 60 * 24 * 365.25);
}

function formatExperienceYears(startDate: string): string {
  const years = calculateExperienceYears(startDate);

  if (years >= 1) {
    return `${years.toFixed(1).replace(/\.0$/, "")}+ Yrs`;
  }

  return `${Math.max(1, Math.round(years * 12))} Months`;
}

export function Experience() {
  const experiences: ExperienceItem[] = [
    {
      id: "1",
      title: "Software Developer",
      company: "Bank of America",
      location: "Dublin",
      period: "July 2023 – Present",
      isCurrent: true,
      technologies: [
        "Java",
        "Spring Boot",
        "React",
        "Python",
        "REST APIs",
        "OAuth 2.0",
        "Hibernate",
      ],
      description: [
        "Developed and maintained RESTful APIs using Java Spring Boot, JPA, and Hibernate for high-traffic applications, ensuring scalability and reliability.",
        "Implemented entity auditing with Hibernate Envers to monitor data changes and maintain historical records.",
        "Built a Spring Boot console application to automate data feed generation, improving workflow efficiency and reducing manual errors.",
        "Refactored React.js front-end code to remove unused components and simplify spaghetti code, improving maintainability and performance.",
        "Created dynamic, responsive front-end interfaces using React.js, Vite, and Material-UI, enhancing user experience.",
        "Implemented a full OAuth 2.0 authentication and authorization solution for both back-end (Spring Boot) and front-end (React), strengthening access control and security.",
        "Developed Python scripts to automate repetitive tasks, accelerating data processing and reporting.",
        "Participated in Agile ceremonies and collaborated with cross-functional teams to deliver features on time.",
        "Conducted peer code reviews, profiled applications, and refactored performance-critical areas to improve system efficiency.",
      ],
    },
    {
      id: "2",
      title: "Systems Engineer",
      company: "Infosys Ltd.",
      location: "India",
      period: "Dec 2019 – Jan 2022",
      isCurrent: false,
      technologies: [
        "Python",
        "AWS",
        "Azure",
        "ETL",
        "Apache Airflow",
        "DBT",
        "Lambda",
      ],
      description: [
        "Developed and tested web applications hosted on Amazon EC2 to orchestrate ETL workflows using Python, Lambda functions, and DBT, ensuring efficient and reliable data transformation while following Agile practices.",
        "Built and managed ETL workflows using Amazon Managed Airflow and Azure Data Factory to automate pipeline orchestration and scheduling, improving reliability and efficiency.",
        "Used Python, Jinja templates, Azure serverless functions, and Blob storage to dynamically generate SQL transformation queries based on user inputs from a front-end interface, enabling flexible and automated data processing.",
        "Gained hands-on experience with cloud technologies, including AWS Secrets Manager, Flask APIs, and foundational Django, to build scalable backend services and data pipelines.",
      ],
    },
  ];

  const timelineExperiences = experiences.slice().reverse();
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastStopRef = useRef(-1);
  const [walkerOffset, setWalkerOffset] = useState(0);
  const [routeHeight, setRouteHeight] = useState(48);
  const [walkerProgress, setWalkerProgress] = useState(0);
  const [isWalking, setIsWalking] = useState(false);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !("IntersectionObserver" in window)) return;

    const stops = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-career-stop]"),
    );
    let movementTimer: number | undefined;
    let measuredRouteHeight = 48;

    const updateRouteHeight = () => {
      const finalStop = stops[stops.length - 1];
      if (!finalStop) return;
      const timelineBounds = timeline.getBoundingClientRect();
      const finalStopBounds = finalStop.getBoundingClientRect();
      measuredRouteHeight =
        finalStopBounds.top - timelineBounds.top + finalStopBounds.height / 2;
      setRouteHeight(measuredRouteHeight);

      const activeStop = stops[lastStopRef.current];
      if (!activeStop) return;
      const activeStopBounds = activeStop.getBoundingClientRect();
      const activeCenter =
        activeStopBounds.top - timelineBounds.top + activeStopBounds.height / 2;
      const offset = Math.max(0, activeCenter - 24);
      setWalkerOffset(offset);
      setWalkerProgress(
        Math.min(1, offset / Math.max(1, measuredRouteHeight - 24)),
      );
    };

    updateRouteHeight();
    const resizeObserver = new ResizeObserver(updateRouteHeight);
    resizeObserver.observe(timeline);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const viewportMiddle = window.innerHeight / 2;
        const activeEntry = visibleEntries.reduce((nearest, entry) => {
          const nearestDistance = Math.abs(
            nearest.boundingClientRect.top +
              nearest.boundingClientRect.height / 2 -
              viewportMiddle,
          );
          const entryDistance = Math.abs(
            entry.boundingClientRect.top +
              entry.boundingClientRect.height / 2 -
              viewportMiddle,
          );
          return entryDistance < nearestDistance ? entry : nearest;
        });
        const stopIndex = Number(
          activeEntry.target.getAttribute("data-career-stop"),
        );
        if (!Number.isInteger(stopIndex) || stopIndex === lastStopRef.current) {
          return;
        }

        const previousStop = lastStopRef.current;
        lastStopRef.current = stopIndex;
        const timelineBounds = timeline.getBoundingClientRect();
        const stopBounds = activeEntry.target.getBoundingClientRect();
        const stopCenter =
          stopBounds.top - timelineBounds.top + stopBounds.height / 2;
        const offset = Math.max(0, stopCenter - 24);

        setWalkerOffset(offset);
        setWalkerProgress(
          Math.min(1, offset / Math.max(1, measuredRouteHeight - 24)),
        );

        if (previousStop >= 0) {
          setIsWalking(true);
          window.clearTimeout(movementTimer);
          movementTimer = window.setTimeout(() => setIsWalking(false), 640);
        }
      },
      { threshold: 0, rootMargin: "-44% 0px -44% 0px" },
    );

    stops.forEach((stop) => observer.observe(stop));

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.clearTimeout(movementTimer);
    };
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            Professional Journey
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            A timeline of engineering impactful, scalable software solutions
            across global enterprise platforms and cloud architectures.
          </p>
        </div>

        <div className="mb-14 grid grid-cols-2 gap-x-0 gap-y-5 border-y border-white/10 py-5 md:grid-cols-4">
          {[
            {
              label: "Years in Industry",
              val: formatExperienceYears("2019-12-01"),
              desc: "Enterprise Engineering",
            },
            {
              label: "Global Enterprise",
              val: "BofA",
              desc: "Bank of America",
            },
            {
              label: "Systems Engineer",
              val: "Infosys",
              desc: "Cloud & Data Pipelines",
            },
            {
              label: "Core Stack",
              val: "Java/Py",
              desc: "Full Stack & DevOps",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col justify-between border-l border-white/10 py-2 pl-4 first:border-l-0 first:pl-0 sm:py-3"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </span>
              <div className="my-2">
                <span className="text-xl font-semibold text-foreground sm:text-2xl">
                  {stat.val}
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>

        <div ref={timelineRef} className="career-path relative">
          <div
            className="career-path__track"
            style={{ height: `${routeHeight}px` }}
            aria-hidden="true"
          >
            <span className="career-path__line" />
            <span
              className="career-path__progress"
              style={{ transform: `scaleY(${walkerProgress})` }}
            />
            <span
              className={`career-walker${isWalking ? " is-walking" : ""}`}
              style={{
                transform: `translate3d(-50%, ${walkerOffset}px, 0)`,
              }}
            >
              <span className="career-walker__figure">
                <PersonStanding className="career-walker__person" />
                <LaptopMinimal className="career-walker__laptop" />
              </span>
            </span>
          </div>

          <div className="space-y-10 sm:space-y-14">
            {timelineExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="career-stop group/item relative pl-14 md:pl-24"
              >
                <span
                  className="career-waypoint"
                  data-career-stop={index}
                  aria-hidden="true"
                >
                  <span className="career-waypoint__point" />
                </span>

                <Card className="career-entry overflow-hidden rounded-lg border border-white/10 bg-[#151915] transition-colors duration-300 hover:border-primary/30">
                  <div className="grid md:grid-cols-[15rem_minmax(0,1fr)]">
                    <div className="career-entry__meta border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Career stop {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
                        {exp.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {exp.company}
                      </p>
                      <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      {exp.isCurrent && (
                        <Badge className="mt-5 border border-primary/20 bg-primary/10 text-xs font-medium text-primary">
                          Current role
                        </Badge>
                      )}
                    </div>

                    <div className="p-5 md:p-7">
                      <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Selected impact
                      </div>
                      <ul className="mb-6 space-y-3">
                        {exp.description.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="career-entry__bullet mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
