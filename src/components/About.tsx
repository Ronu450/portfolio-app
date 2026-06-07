import { Code2, Database, Cloud, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function About() {
  const professionalSummary = `Enthusiastic and detail-oriented Software Developer with 2 years of experience in full-stack development using Java, Python, and React. Skilled in designing RESTful APIs, developing responsive front-end interfaces, and deploying scalable cloud-based applications. Adept at working in Agile teams and delivering clean, maintainable code to meet business goals. Passionate about building innovative, efficient, and user-focused digital solutions.`;

  const skillCategories = [
    {
      category: "Programming Languages",
      skills: [
        "Java (SpringBoot, REST API, Hibernate, MyBatis)",
        "Python (Django, Flask)",
        "JavaScript",
      ],
      icon: Code2,
      color: "primary",
      bgColor: "bg-gradient-to-br from-primary/10 to-primary/5",
    },
    {
      category: "Front-End Technologies",
      skills: ["React.js, Redux", "Vite, Next.js", "Aggrid, MUI (Material UI)"],
      icon: Users,
      color: "secondary",
      bgColor: "bg-gradient-to-br from-secondary/10 to-secondary/5",
    },
    {
      category: "Back-End & Databases",
      skills: ["MySQL, PostgreSQL, MongoDB, Sybase"],
      icon: Database,
      color: "accent",
      bgColor: "bg-gradient-to-br from-accent/10 to-accent/5",
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS (EC2, S3, Lambda), Azure (ADF, Serverless Functions)",
        "Docker, Jenkins (CI/CD), Linux Shell Scripting, Openshift",
      ],
      icon: Cloud,
      color: "primary",
      bgColor: "bg-gradient-to-br from-primary/10 to-primary/5",
    },
    {
      category: "Data & Analytics Tools",
      skills: ["DBT (Data Build Tool), Apache Airflow, Autosys"],
      icon: Code2,
      color: "secondary",
      bgColor: "bg-gradient-to-br from-secondary/10 to-secondary/5",
    },
    {
      category: "Testing & Version Control",
      skills: [
        "JUnit, PyTest, Jest",
        "Git, GitHub",
        "Unit & Integration Testing",
      ],
      icon: Users,
      color: "accent",
      bgColor: "bg-gradient-to-br from-accent/10 to-accent/5",
    },
  ];

  const colorMap: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Professional Summary */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
            Professional Summary
          </h2>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {professionalSummary}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Skills */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
            Key Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((skillGroup, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${skillGroup.bgColor} flex items-center justify-center`}
                    >
                      <skillGroup.icon
                        className={`w-5 h-5 ${colorMap[skillGroup.color]}`}
                      />
                    </div>
                    <CardTitle className="text-lg">
                      {skillGroup.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {skillGroup.skills.map((skill, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>{skill}</span>
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
