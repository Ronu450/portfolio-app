import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Send,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "ronu0623@gmail.com",
      href: "mailto:ronu0623@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dublin, Ireland",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Ronu450",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ronu-skariah",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/yourusername",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-2 bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-muted-foreground">
            Have a project in mind? Let's work together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
              <CardContent className="p-6">
                <h3 className="mb-6 text-primary">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-md">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p>{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
              <CardContent className="p-6">
                <h3 className="mb-6 text-accent">Social Media</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center hover:shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-1"
                    >
                      <social.icon className="w-5 h-5 text-accent" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-secondary/20 hover:shadow-lg hover:shadow-secondary/10 transition-all">
            <CardContent className="p-6">
              <h3 className="mb-6 text-secondary">Send Me a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ronu Skariah"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ronu0623@gmail.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell me about your project..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
