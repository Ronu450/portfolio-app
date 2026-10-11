import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Copy,
  Check,
  Clock,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

type ContactField = keyof ContactFormData;
type ContactErrors = Record<ContactField, string>;

const emailAddress = "ronu.skariah@outlook.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const projectCategories = [
  { id: "fullstack", label: "🚀 Full Stack System Architecture" },
  { id: "spring", label: "⚡ Spring Boot & API Engineering" },
  { id: "react", label: "🎨 Modern React & UI Performance" },
  { id: "coffee", label: "☕ Mentorship & Technical Coffee" },
];

function validateField(field: ContactField, value: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return field === "name"
      ? "Enter your name."
      : field === "email"
        ? "Enter your email address."
        : "Enter a message.";
  }

  if (field === "email" && !emailPattern.test(normalizedValue)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<ContactErrors>({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    projectCategories[0].id
  );

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const updateField = (field: ContactField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
    setFormStatus("");
  };

  const validateOnBlur = (field: ContactField) => {
    setFormErrors((current) => ({
      ...current,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ContactErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFormErrors(nextErrors);

    const firstInvalidField = (
      ["name", "email", "message"] as ContactField[]
    ).find((field) => nextErrors[field]);
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const categoryObj = projectCategories.find((c) => c.id === selectedCategory);
    const categoryTitle = categoryObj ? categoryObj.label : "General Inquiry";
    
    const subject = encodeURIComponent(
      `[${categoryTitle}] Portfolio inquiry from ${name}`
    );
    const body = encodeURIComponent(
      `From: ${name} <${email}>\nCategory: ${categoryTitle}\n\nMessage:\n${formData.message.trim()}`
    );

    setFormStatus(
      "Opening your default email app with this message draft. You can review and hit send!"
    );
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="px-4 py-28 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-14">
        {/* Header with Cyber Communication Protocol Badge */}
        <div className="text-center sm:text-left max-w-3xl space-y-3">

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Let's Build Together
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Direct Connection & Telemetry Dossier */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Live Dublin Node Card */}
            <div className="rounded-3xl border border-border/70 bg-card/80 dark:bg-[#20252B]/85 backdrop-blur-xl p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    Node: Dublin, Ireland
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-bold">
                  AVAILABLE
                </span>
              </div>

              {/* Direct Email with One-Click Copy */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">
                  Encrypted Direct Mail
                </span>
                <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-border/60 hover:border-primary/40 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-xs sm:text-sm font-mono font-bold text-foreground hover:text-primary truncate transition-colors"
                      title="Open in mail client"
                    >
                      {emailAddress}
                    </a>
                  </div>

                  <button
                    onClick={copyEmailToClipboard}
                    className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all cursor-pointer shrink-0"
                    title="Copy email to clipboard"
                    aria-label="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Physical Location Telemetry */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-border/60">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Coordinates & Timezone
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-foreground">
                    Dublin, IE • 53.3498° N, 6.2603° W (UTC+1)
                  </span>
                </div>
              </div>

              {/* SLA Response Time */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-border/60">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Response Window
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-foreground">
                    &lt; 24h Average Dispatch Latency
                  </span>
                </div>
              </div>
            </div>

            {/* Social Network Terminal Card */}
            <div className="rounded-3xl border border-border/70 bg-card/80 dark:bg-[#20252B]/85 backdrop-blur-xl p-6 shadow-xl space-y-4">
              <span className="text-xs font-mono text-primary uppercase font-bold tracking-widest block">
                Verified Social & Network Ports
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/Ronu450"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col justify-between group space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Github className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      GitHub
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      @Ronu450
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ronu-skariah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col justify-between group space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Linkedin className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      LinkedIn
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      /in/ronu-skariah
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs font-mono text-muted-foreground flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Zero-tracker dispatch: All messages generate an encrypted local mailto transport directly in your native mail application.
              </span>
            </div>
          </aside>

          {/* Right Column: Next-Gen Dispatch Terminal (Contact Form) */}
          <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-card/90 dark:bg-[#20252B]/90 backdrop-blur-2xl p-6 sm:p-9 shadow-2xl relative overflow-hidden space-y-6">
            {/* Top specular reflection line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Terminal Form Header */}
            <div className="border-b border-border/50 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-widest mb-1">
                <Terminal className="w-4 h-4" />
                <span>INTERACTIVE DISPATCH CONSOLE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Dispatch an Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Select your focus area and outline your vision. Submitting opens a populated draft directly in your preferred mail client.
              </p>
            </div>

            {/* 1. Category Selection Pills */}
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Select Inquiry Domain:
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {projectCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2.5 rounded-xl text-xs font-mono text-left transition-all border cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-md shadow-primary/20 scale-[1.01]"
                        : "bg-black/[0.02] dark:bg-white/[0.03] border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Interactive Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    maxLength={80}
                    value={formData.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    onBlur={() => validateOnBlur("name")}
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                    placeholder="e.g. Jane Doe"
                    required
                    className="h-11 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border-border/60 focus:border-primary focus:ring-primary/20 text-sm font-sans"
                  />
                  {formErrors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-400 font-mono"
                    >
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    onBlur={() => validateOnBlur("email")}
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                    placeholder="jane@company.com"
                    required
                    className="h-11 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border-border/60 focus:border-primary focus:ring-primary/20 text-sm font-sans"
                  />
                  {formErrors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-400 font-mono"
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center justify-between"
                >
                  <span>Project Scope & Message</span>
                  <span className="text-[10px] text-muted-foreground">
                    {formData.message.length} / 5000 chars
                  </span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  onBlur={() => validateOnBlur("message")}
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={
                    formErrors.message ? "message-error" : undefined
                  }
                  placeholder="Outline your application requirements, architectural goals, or team timeline..."
                  rows={5}
                  maxLength={5000}
                  required
                  className="rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border-border/60 focus:border-primary focus:ring-primary/20 text-sm font-sans leading-relaxed resize-y"
                />
                {formErrors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-400 font-mono"
                  >
                    {formErrors.message}
                  </p>
                )}
              </div>

              {/* Action Button & Dispatch Feedback */}
              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="min-h-12 w-full rounded-2xl bg-primary text-primary-foreground font-mono font-bold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE DRAFT →</span>
                </Button>

                {formStatus && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-xs font-mono text-foreground flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span>{formStatus}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
