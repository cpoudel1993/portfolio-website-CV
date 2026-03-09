"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Linkedin, Youtube, Github, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Open mailto link with form data
    const mailtoLink = `mailto:c.poudel1993@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    )}`
    window.open(mailtoLink)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <section id="contact" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Get in Touch
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Contact Me
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Contact Info */}
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {"Let's Connect"}
            </h3>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              {"I'm"} always open to discussing new opportunities, whether in production,
              construction, engineering, or customer-focused roles in New Zealand. Feel
              free to reach out.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href="mailto:c.poudel1993@gmail.com"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    c.poudel1993@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a
                    href="tel:+64220153300"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    +64 22 015 3300
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">
                    81 Lake Road, Frankton, Hamilton, New Zealand
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Linkedin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LinkedIn</p>
                  <a
                    href="https://www.linkedin.com/in/cpoudel1993/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    linkedin.com/in/cpoudel1993
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Youtube className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">YouTube</p>
                  <a
                    href="https://www.youtube.com/channel/UC7CJV2aO5MSQIPz8LHnobpg?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Chiranjivi Poudel
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Github className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <a
                    href="https://github.com/cpoudel1993"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    cpoudel1993
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-foreground">Work Rights</p>
              <p className="text-xs text-muted-foreground">
                Eligible to work full-time in New Zealand. References available upon request.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm text-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="How can I help?"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about the opportunity..."
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1.5 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={submitted}>
                  {submitted ? (
                    "Message Sent!"
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
