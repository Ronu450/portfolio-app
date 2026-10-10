import { Calendar, Shield, Cpu, GitBranch, Layers } from "lucide-react";
import type { ComponentType } from "react";

interface Story {
  id: string;
  title: string;
  date: string;
  category: string;
  challenge: string;
  contribution: string;
  outcome: string;
  technologies: string[];
  icon: ComponentType<{ className?: string }>;
}

const stories: Story[] = [
  {
    id: "1",
    title: "Scaling REST APIs with Spring Boot",
    date: "2024-01-15",
    category: "API engineering & platform",
    challenge:
      "High-traffic APIs needed to scale reliably, control request bursts, preserve data-change history, and deploy consistently.",
    contribution:
      "At Bank of America, I developed Java and Spring Boot REST APIs with JPA and Hibernate, added entity auditing with Hibernate Envers, and implemented rate limiting to control incoming traffic. I packaged and managed OpenShift deployments with Helm charts and worked on API scaling for high-traffic workloads.",
    outcome:
      "The service combined auditable data changes, controlled request traffic, and repeatable Helm-based OpenShift deployments to support scalable API operations.",
    technologies: [
      "Java",
      "Spring Boot REST APIs",
      "Hibernate",
      "Hibernate Envers",
      "Rate limiting",
      "OpenShift",
      "Helm",
    ],
    icon: Cpu,
  },
  {
    id: "2",
    title: "OAuth 2.0 Across React and Spring Boot",
    date: "2024-02-20",
    category: "Application security",
    challenge:
      "Every API endpoint needed protection, and users needed access limited to their assigned permissions without repeated sign-in friction.",
    contribution:
      "I implemented OAuth 2.0 authentication and authorization across the React frontend and Spring Boot backend, protected API endpoints, enforced permission-based access, and handled authenticated sessions so users could sign in to the application seamlessly.",
    outcome:
      "API access was restricted to authenticated users and authorized by their permissions, while session-aware sign-in reduced friction across the application.",
    technologies: [
      "OAuth 2.0",
      "Spring Boot",
      "React",
      "Endpoint protection",
      "Permission-based access",
      "Session handling",
    ],
    icon: Shield,
  },
  {
    id: "3",
    title: "Automating Cloud ETL Workflows",
    date: "2024-03-10",
    category: "Data engineering",
    challenge:
      "Manual data-processing steps made complex transformations harder to run consistently.",
    contribution:
      "At Infosys, I built automated ETL workflows with Python, Apache Airflow, and dbt across AWS and Azure environments.",
    outcome:
      "Repeatable orchestration improved workflow reliability and reduced repetitive manual handling.",
    technologies: ["Python", "Apache Airflow", "dbt", "AWS", "Azure"],
    icon: GitBranch,
  },
  {
    id: "4",
    title: "Modernizing a Legacy React Application",
    date: "2024-04-05",
    category: "Frontend modernization",
    challenge:
      "A legacy Webpack frontend needed a modern build workflow, typed components, and updated UI dependencies.",
    contribution:
      "I migrated the application from Webpack to Vite, moved the codebase to TypeScript, upgraded React, MUI, and AG Grid packages, and improved error-modal handling.",
    outcome:
      "The application gained a modern Vite workflow, stronger type safety, current UI dependencies, and clearer feedback when errors occur.",
    technologies: [
      "Webpack → Vite",
      "TypeScript",
      "React",
      "MUI",
      "AG Grid",
      "Error modals",
    ],
    icon: Layers,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Stories() {
  return (
    <section className="min-h-screen bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Engineering journal
          </p>
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Development Work
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Challenges I tackled, the work I delivered, and what changed.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {stories.map((story, index) => {
            const Icon = story.icon;
            return (
              <article
                key={story.id}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <header className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.07] text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                          {story.category}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Case {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <time
                      dateTime={story.date}
                      className="flex shrink-0 items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs"
                    >
                      <Calendar
                        className="h-3.5 w-3.5 text-primary/80"
                        aria-hidden="true"
                      />
                      {formatDate(story.date)}
                    </time>
                  </header>

                  <h3 className="mb-5 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {story.title}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Challenge
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {story.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        My contribution
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {story.contribution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-l-2 border-primary/60 bg-primary/[0.035] py-3 pl-4 pr-3">
                    <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      Outcome
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/85">
                      {story.outcome}
                    </p>
                  </div>

                  <footer className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    {story.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[10px] font-medium text-muted-foreground"
                      >
                        {technology}
                      </span>
                    ))}
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
