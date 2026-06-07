import { GraduationCap, Award } from "lucide-react";
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
}

export function Education() {
  const educations: EducationItem[] = [
    {
      id: "1",
      degree: "Msc in Data Analytics",
      institution: "National College of Ireland",
      period: "2022",
      location: "Ireland",
    },
    {
      id: "2",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Saintgits College of Engineering",
      period: "2019",
      location: "Kerala",
    },
  ];

  const certifications: CertificationItem[] = [
    {
      id: "1",
      name: "Introduction to Artificial Intelligence",
      issuer: "Microsoft",
    },
    {
      id: "2",
      name: "MongoDB",
      issuer: "Infosys Certified",
    },
    {
      id: "3",
      name: "Power BI",
      issuer: "Infosys Certified",
    },
    {
      id: "4",
      name: "Teradata",
      issuer: "Infosys Certified",
    },
    {
      id: "5",
      name: "Accenture Virtual Internship",
      issuer: "Forage",
    },
    {
      id: "6",
      name: "JPMorgan Chase Virtual Internship",
      issuer: "Forage",
    },
    {
      id: "7",
      name: "KPMG Virtual Internship",
      issuer: "Forage",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">

        {/* Education Section */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Education
          </h2>
          <p className="text-muted-foreground mb-8">My academic background</p>

          <div className="space-y-6">
            {educations.map((edu) => (
              <Card
                key={edu.id}
                className="border-accent/20 overflow-hidden hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group"
              >
                <div className="grid sm:grid-cols-12 h-full">
                  {/* Left Side: Icon & Period */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-accent/10 to-secondary/10 relative overflow-hidden text-center border-b sm:border-b-0 border-accent/20">
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <GraduationCap className="w-10 h-10 text-accent mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      Academic Degree
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      🎓 Class of {edu.period}
                    </span>
                  </div>

                  {/* Right Side: Institution & Location */}
                  <div className="sm:col-span-8 p-6 flex flex-col justify-center sm:border-l border-border bg-card/50">
                    <h3 className="text-lg font-bold mb-2 text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-accent mb-1">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📍 {edu.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
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

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card
                key={cert.id}
                className="border-secondary/20 overflow-hidden hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 group"
              >
                <div className="grid grid-cols-12 h-full">
                  {/* Left Side Icon Badge */}
                  <div className="col-span-3 flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 to-accent/10 border-r border-secondary/20">
                    <Award className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* Right Side Details */}
                  <div className="col-span-9 p-4 flex flex-col justify-center bg-card/50">
                    <h4 className="font-bold text-sm text-foreground leading-snug mb-1">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
