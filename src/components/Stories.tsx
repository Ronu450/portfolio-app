import { BookOpen, Calendar, Shield, Cpu, GitBranch, Layers } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface Story {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
}

export function Stories() {
  const stories: Story[] = [
    {
      id: "1",
      title: "Architecting Scalable REST APIs with Spring Boot",
      date: "2024-01-15",
      category: "Technical",
      content:
        "At Bank of America, I led the development and maintenance of RESTful APIs using Java Spring Boot, JPA, and Hibernate to support high-traffic applications. The key challenge was ensuring scalability while maintaining code quality. Through implementing entity auditing with Hibernate Envers and conducting rigorous peer code reviews, I learned the importance of monitoring data changes and maintaining historical records for compliance and debugging purposes.",
    },
    {
      id: "2",
      title: "Full-Stack Authentication with OAuth 2.0",
      date: "2024-02-20",
      category: "Security",
      content:
        "Implementing a comprehensive OAuth 2.0 authentication and authorization solution across both Spring Boot backend and React frontend was a transformative experience. This project taught me the critical importance of security in modern applications. From managing access control to protecting sensitive user data, I discovered how proper authentication architecture strengthens the entire application ecosystem. The key takeaway: security is not a feature to add later—it must be architected from the beginning.",
    },
    {
      id: "3",
      title: "Automating ETL Pipelines: From Manual to Intelligent",
      date: "2024-03-10",
      category: "DevOps",
      content:
        "During my time at Infosys, I transformed manual data processing workflows into intelligent, automated ETL pipelines using Python, Apache Airflow, and DBT. Building and managing workflows across AWS and Azure taught me how to orchestrate complex data transformations at scale. The most valuable lesson: proper pipeline architecture reduces errors, accelerates processing, and frees teams to focus on strategic improvements rather than repetitive tasks.",
    },
    {
      id: "4",
      title: "Refactoring Legacy Code: From Spaghetti to Clean Architecture",
      date: "2024-04-05",
      category: "Architecture",
      content:
        "One of my proudest achievements at Bank of America was refactoring a complex React.js front-end codebase to eliminate unused components and simplify architecture. This experience reinforced a fundamental principle: maintaining code quality is an ongoing responsibility. By removing technical debt early and organizing code properly, we improved both maintainability and performance. Sometimes the most impactful work isn't building new features—it's making the existing codebase better.",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryDetails = (category: string) => {
    switch (category.toLowerCase()) {
      case "technical":
        return { icon: Cpu, color: "text-primary", bg: "from-primary/20 to-primary/5 border-primary/30" };
      case "security":
        return { icon: Shield, color: "text-accent", bg: "from-accent/20 to-accent/5 border-accent/30" };
      case "devops":
        return { icon: GitBranch, color: "text-secondary", bg: "from-secondary/20 to-secondary/5 border-secondary/30" };
      case "architecture":
        return { icon: Layers, color: "text-primary", bg: "from-primary/20 to-secondary/5 border-primary/30" };
      default:
        return { icon: BookOpen, color: "text-white", bg: "from-white/10 to-white/5 border-white/20" };
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            My Stories
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Reflections, key learnings, and engineering highlights from my professional work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story) => {
            const cat = getCategoryDetails(story.category);
            const Icon = cat.icon;
            return (
              <Card
                key={story.id}
                className="border border-white/10 bg-slate-950/40 backdrop-blur-xl hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group transform hover:-translate-y-1.5 rounded-3xl flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 md:p-8 space-y-4">
                  {/* Category icon and title */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.bg} border flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-primary transition-colors duration-300 leading-snug">
                      {story.title}
                    </h3>
                  </div>

                  <CardContent className="p-0 pt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {story.content}
                    </p>
                  </CardContent>
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 md:px-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>{formatDate(story.date)}</span>
                  </div>
                  {story.category && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-default">
                      {story.category}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
