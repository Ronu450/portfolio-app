import { Briefcase, Calendar, MapPin, Terminal } from "lucide-react";
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-black">
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

        {/* Industry Experience Highlights Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            {
              label: "Years in Industry",
              val: "3+ Yrs",
              desc: "Enterprise Engineering",
              color: "from-primary/20 to-primary/5 border-primary/30",
            },
            {
              label: "Global Enterprise",
              val: "BofA",
              desc: "Bank of America",
              color: "from-accent/20 to-accent/5 border-accent/30",
            },
            {
              label: "Systems Engineer",
              val: "Infosys",
              desc: "Cloud & Data Pipelines",
              color: "from-secondary/20 to-secondary/5 border-secondary/30",
            },
            {
              label: "Core Stack",
              val: "Java/Py",
              desc: "Full Stack & DevOps",
              color: "from-primary/20 to-secondary/5 border-primary/30",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between`}
            >
              <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {stat.val}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line: Pulsing gradient line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-secondary opacity-40 animate-pulse"></div>

          <div className="space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-14 md:pl-24 group/item">
                {/* Timeline dot: Dual-ring pulsing */}
                <div className="absolute left-0 md:left-2 top-2 w-12 h-12 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center ring-4 ring-black z-10 transition-all duration-500 group-hover/item:border-primary/50 group-hover/item:scale-110">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                      exp.isCurrent
                        ? "bg-gradient-to-r from-primary via-accent to-secondary shadow-lg shadow-primary/40"
                        : "bg-slate-900 border border-white/20"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Card */}
                <Card className="border border-white/10 bg-slate-950/40 backdrop-blur-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 group transform hover:-translate-y-1.5 rounded-3xl">
                  <div className="grid md:grid-cols-12 h-full">
                    {/* Left Side: Brand Panel */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white/[0.02] to-white/[0.04] relative overflow-hidden text-center border-b md:border-b-0 md:border-r border-white/10 min-h-[160px]">
                      {/* Interactive light ray */}
                      <div className="absolute -inset-x-20 -inset-y-40 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none"></div>
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                      <div className="relative z-10">
                        <Briefcase className="w-12 h-12 text-primary/80 mx-auto mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2 block">
                          {exp.company}
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white font-semibold shadow-inner mb-2">
                          <Calendar className="w-3 h-3 text-accent" />
                          {exp.period}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground font-medium mt-1">
                          <MapPin className="w-3 h-3 text-secondary" />
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-center bg-slate-950/20">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-primary transition-colors duration-300">
                          {exp.title}
                        </h3>
                        {exp.isCurrent && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                        )}
                        {exp.isCurrent && (
                          <Badge className="bg-gradient-to-r from-primary via-accent to-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                            Active Role
                          </Badge>
                        )}
                      </div>

                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-6"></div>

                      {/* Description List with Lucide Icons */}
                      <ul className="space-y-4 mb-6">
                        {exp.description.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed group/li"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                              <Terminal className="w-3 h-3 text-primary" />
                            </span>
                            <span className="group-hover/li:text-white transition-colors duration-200">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 pt-5 border-t border-white/5">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-white/5 text-muted-foreground border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs font-semibold px-3 py-1 rounded-full cursor-default"
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
