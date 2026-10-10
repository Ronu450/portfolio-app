import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  MessageSquare,
} from "lucide-react";
import type { FormEvent } from "react";
import type { ComponentType } from "react";
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

interface SocialLink {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const emailAddress = "ronu.skariah@outlook.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const socialLinks: SocialLink[] = [
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
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `From: ${name} <${email}>\n\n${formData.message.trim()}`,
    );
    setFormStatus(
      "Opening your email app with a draft. If it doesn't open, use the direct email link.",
    );
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            A direct line
          </p>
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Get in touch
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Have a project in mind? Send a note and I’ll get back to you.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Contact directly
            </h3>
            <a
              href={`mailto:${emailAddress}`}
              className="group flex items-center gap-3 border-b border-white/10 py-4 focus-visible:outline-offset-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block text-xs text-muted-foreground">
                  Email
                </span>
                <span className="block break-all text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {emailAddress}
                </span>
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </a>

            <div className="flex items-center gap-3 border-b border-white/10 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="mb-1 block text-xs text-muted-foreground">
                  Location
                </span>
                <span className="block text-sm font-medium text-foreground">
                  Dublin, Ireland
                </span>
              </span>
            </div>

            <div className="mt-7">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Find me elsewhere
              </h3>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${social.label} profile in a new tab`}
                    title={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <social.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <MessageSquare
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              I typically respond within 24 hours.
            </p>
          </aside>

          <div className="lg:col-span-8 rounded-xl border border-white/10 bg-card p-5 sm:p-7">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Send a message
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Submitting opens a draft in your email app; this site doesn’t
                send or store your message.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <Label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name
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
                  placeholder="Your name"
                  required
                />
                {formErrors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
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
                  placeholder="you@example.com"
                  required
                />
                {formErrors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
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
                  placeholder="What are you working on?"
                  rows={5}
                  maxLength={5000}
                  required
                />
                {formErrors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-400"
                  >
                    {formErrors.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button type="submit" className="min-h-11 w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Open email draft
                </Button>
                {formStatus && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm text-muted-foreground"
                  >
                    {formStatus}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
