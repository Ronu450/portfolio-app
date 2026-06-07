import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Send,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setFormData({ name: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "ronu.skariah@outlook.com",
      href: "mailto:ronu.skariah@outlook.com",
      gradient: "from-primary/10 to-accent/10 border-primary/20",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dublin, Ireland",
      href: null,
      gradient: "from-secondary/10 to-primary/10 border-secondary/20",
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
      href: "https://www.linkedin.com/in/ronu-skariah ",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Get In Touch
          </h2>
          <p className="text-muted-foreground">
            Have a project in mind? Let's work together!
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="border-primary/20 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="grid grid-cols-12 h-full">
                {/* Left Side Icon Badge */}
                <div className={`col-span-4 flex items-center justify-center p-4 bg-gradient-to-br ${info.gradient} border-r`}>
                  <info.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Right Side Content */}
                <div className="col-span-8 p-4 flex flex-col justify-center bg-card/50">
                  <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-1 block">
                    {info.label}
                  </span>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-foreground truncate block">
                      {info.value}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Social Media (4 cols) */}
          <div className="lg:col-span-4 h-full">
            <Card className="border-accent/20 overflow-hidden hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group h-full">
              <div className="grid grid-cols-12 h-full min-h-[160px] lg:flex lg:flex-col lg:h-full">
                {/* Left/Top Side: Icon Badge */}
                <div className="col-span-4 lg:w-full lg:h-24 flex items-center justify-center p-4 bg-gradient-to-br from-accent/10 to-secondary/10 border-r lg:border-r-0 lg:border-b border-accent/20 flex-shrink-0">
                  <Share2 className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Right/Bottom Side Details */}
                <div className="col-span-8 lg:w-full lg:flex-1 p-6 flex flex-col justify-center bg-card/50">
                  <h3 className="text-lg font-bold text-accent mb-4">Connect Socially</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/15 to-secondary/15 flex items-center justify-center hover:shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-1"
                        title={social.label}
                      >
                        <social.icon className="w-4 h-4 text-accent" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Message Form (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="border-secondary/20 overflow-hidden hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 group">
              <div className="grid sm:grid-cols-12 h-full">
                {/* Left Side decorative gradient */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/10 to-primary/10 relative overflow-hidden text-center border-b sm:border-b-0 border-secondary/20">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <MessageSquare className="w-10 h-10 text-secondary mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                    Write to me
                  </span>
                  <span className="text-xs text-muted-foreground">
                    I typically respond within 24 hours.
                  </span>
                </div>

                {/* Right Side: Form inputs */}
                <div className="sm:col-span-8 p-6 bg-card/50 sm:border-l border-border">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Alan Walker"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value="ronu.skariah@outlook.com"
                        readOnly
                        disabled
                        className="bg-muted text-muted-foreground cursor-not-allowed opacity-70"
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
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
