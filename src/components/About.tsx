import {
  BrainCircuit,
  Bike,
  Braces,
  Camera,
  Cloud,
  Database,
  Heart,
  MapPin,
  PanelsTopLeft,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type SkillVisual =
  | "code"
  | "interface"
  | "data"
  | "cloud"
  | "pipeline"
  | "intelligence"
  | "quality";

interface SkillCategory {
  category: string;
  skills: string[];
  icon: ComponentType<{ className?: string }>;
  visual: SkillVisual;
  span: string;
}

const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: ["Java", "Python", "JavaScript"],
    icon: Braces,
    visual: "code",
    span: "lg:col-span-4",
  },
  {
    category: "Back-End Frameworks & APIs",
    skills: [
      "Spring Boot",
      "REST APIs",
      "Hibernate",
      "MyBatis",
      "Django",
      "Flask",
    ],
    icon: Workflow,
    visual: "pipeline",
    span: "lg:col-span-4",
  },
  {
    category: "Front-End Technologies",
    skills: ["React", "Redux", "Vite", "Next.js", "AG Grid", "Material UI"],
    icon: PanelsTopLeft,
    visual: "interface",
    span: "lg:col-span-4",
  },
  {
    category: "Back-End & Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Sybase"],
    icon: Database,
    visual: "data",
    span: "lg:col-span-4",
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "AWS EC2",
      "S3",
      "Lambda",
      "Azure Data Factory",
      "Azure Serverless Functions",
      "Docker",
      "Jenkins",
      "Linux Shell Scripting",
      "OpenShift",
    ],
    icon: Cloud,
    visual: "cloud",
    span: "lg:col-span-4",
  },
  {
    category: "Data & Analytics",
    skills: ["dbt", "Apache Airflow", "Autosys"],
    icon: Workflow,
    visual: "pipeline",
    span: "lg:col-span-4",
  },
  {
    category: "AI & Agentic Workflows",
    skills: [
      "OpenAI",
      "Azure OpenAI",
      "Prompt engineering",
      "Model evaluation",
      "Response optimization",
      "Tool calling",
      "Workflow orchestration",
      "Task automation",
    ],
    icon: BrainCircuit,
    visual: "intelligence",
    span: "lg:col-span-6",
  },
  {
    category: "Testing & Version Control",
    skills: [
      "JUnit",
      "PyTest",
      "Jest",
      "Git",
      "GitHub",
      "Unit & integration tests",
    ],
    icon: ShieldCheck,
    visual: "quality",
    span: "lg:col-span-6",
  },
];

export function About() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Professional Summary */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
            About Me
          </h2>
          <Card className="overflow-hidden rounded-xl border-primary/20 bg-card">
            <CardContent className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-6 p-5 sm:p-8 md:p-10">
              <div className="border-l-2 border-primary pl-5 sm:pl-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Behind the code
                </p>
                <h3 className="max-w-2xl text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                  Developer by profession.
                  <br />
                  <span className="text-primary">Curious by nature.</span>
                </h3>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Braces className="h-4 w-4 text-primary" aria-hidden="true" />
                  What I do
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  I’m a full-stack software developer with six years of
                  experience building and modernizing applications. I work
                  across Java and Spring Boot, React, Python, APIs, cloud
                  platforms, and data workflows, turning complex requirements
                  into reliable software and thoughtful user experiences.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
                  Outside work
                </h4>
                <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Bike
                      className="h-4 w-4 text-primary/80"
                      aria-hidden="true"
                    />
                    Cycling
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Camera
                      className="h-4 w-4 text-primary/80"
                      aria-hidden="true"
                    />
                    Photography
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Heart
                      className="h-4 w-4 text-primary/80"
                      aria-hidden="true"
                    />
                    Time with Jackie
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin
                      className="h-4 w-4 text-primary/80"
                      aria-hidden="true"
                    />
                    Friends from college
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What I build with
            </p>
            <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              Key Skills
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              The tools and systems I use to take products from idea to
              production.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {skillCategories.map((skillGroup, index) => (
              <Card
                key={skillGroup.category}
                className={`skill-tile group overflow-hidden rounded-xl border border-white/10 bg-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-black/20 ${skillGroup.span}`}
              >
                <CardContent className="flex h-full flex-col gap-5 p-5 sm:p-6">
                  <div
                    className={`skill-visual skill-visual--${skillGroup.visual}`}
                    aria-hidden="true"
                  >
                    {Array.from({ length: 5 }, (_, visualIndex) => (
                      <span className="skill-visual__item" key={visualIndex} />
                    ))}
                  </div>

                  <CardHeader className="flex items-center gap-3 p-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <skillGroup.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base font-semibold leading-snug text-foreground">
                        {skillGroup.category}
                      </CardTitle>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Capability {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </CardHeader>

                  <ul className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill, idx) => (
                      <li
                        key={idx}
                        className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-xs leading-snug text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
