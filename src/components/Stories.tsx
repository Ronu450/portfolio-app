import { BookOpen, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            My Stories
          </h2>
          <p className="text-muted-foreground">
            Thoughts, experiences, and insights
          </p>
        </div>

        <div className="space-y-6">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="border-secondary/20 hover:shadow-lg hover:shadow-secondary/10 transition-all"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(story.date)}</span>
                      </div>
                      {story.category && (
                        <Badge variant="secondary" className="text-xs">
                          {story.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {story.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
