import { Code2, Palette, Rocket, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function About() {
  const features = [
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'Writing maintainable and scalable code is my priority',
      color: 'primary',
      bgColor: 'bg-gradient-to-br from-primary/10 to-primary/5',
    },
    {
      icon: Palette,
      title: 'Creative Design',
      description: 'Crafting beautiful user experiences that delight users',
      color: 'secondary',
      bgColor: 'bg-gradient-to-br from-secondary/10 to-secondary/5',
    },
    {
      icon: Rocket,
      title: 'Fast Performance',
      description: 'Optimizing for speed and efficiency in every project',
      color: 'accent',
      bgColor: 'bg-gradient-to-br from-accent/10 to-accent/5',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively with teams to achieve great results',
      color: 'primary',
      bgColor: 'bg-gradient-to-br from-primary/10 to-primary/5',
    },
  ];

  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm a developer who believes in the power of technology to transform ideas into reality. 
            With years of experience in web development, I specialize in creating innovative solutions 
            that make a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 shadow-md`}>
                  <feature.icon className={`w-6 h-6 ${colorMap[feature.color]}`} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
