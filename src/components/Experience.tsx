import { Briefcase } from "lucide-react";
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Work Experience
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary opacity-30"></div>

          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-4 ring-background">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${exp.isCurrent
                        ? "bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/50"
                        : "bg-primary/60"
                      }`}
                  >
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Card */}
                <Card className="border-primary/20 overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                  <div className="grid sm:grid-cols-12 h-full">
                    {/* Left Side: Icon & Period/Location */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden text-center border-b sm:border-b-0 border-primary/20">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                      <Briefcase className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                        Work Experience
                      </span>
                      <span className="text-sm font-bold text-foreground mb-1">
                        ⏱️ {exp.period}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        📍 {exp.location}
                      </span>
                    </div>

                    {/* Right Side: Details */}
                    <div className="sm:col-span-8 p-6 flex flex-col justify-center sm:border-l border-border bg-card/50">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {exp.title}
                        </h3>
                        {exp.isCurrent && (
                          <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary mb-4">
                        {exp.company}
                      </p>

                      {/* Description List */}
                      <ul className="space-y-2.5 mb-4">
                        {exp.description.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                          >
                            <span className="text-primary font-bold flex-shrink-0">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
