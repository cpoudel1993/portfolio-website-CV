'use client'

import { useState } from "react"
import Image from "next/image"
import { Send, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitContactMessage } from "@/app/actions/contact"
import { DEFAULT_SOCIAL_LINKS, getSocialIcon, type SocialLink } from "@/lib/site-content"

export function ContactSection({
  socialLinks = DEFAULT_SOCIAL_LINKS,
  backgroundImage = '/images/anime-mountain-bg-2.jpg',
}: {
  socialLinks?: SocialLink[]
  backgroundImage?: string
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const result = await submitContactMessage(formData)
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully!',
        })
        setFormData({ full_name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000)
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative px-4 py-20 lg:py-28 overflow-hidden">
      {/* Contact section background */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Contact section background"
          fill
          className="object-cover object-center"
          quality={90}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>
      
      <div className="relative mx-auto max-w-6xl">
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
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {"Let's Connect"}
            </h3>

            <div className="space-y-5">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.icon)
                const isExternal = link.href.startsWith("http")
                return (
                  <div key={link.label} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{link.label}</p>
                      {link.href ? (
                        <a
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {link.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{link.value}</p>
                      )}
                    </div>
                  </div>
                )
              })}
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
              {/* Status Messages */}
              {submitStatus.type === 'success' && (
                <div className="mb-4 flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">{submitStatus.message}</p>
                  </div>
                </div>
              )}
              {submitStatus.type === 'error' && (
                <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-950">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">{submitStatus.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1.5"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm text-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="How can I help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1.5"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  disabled={isSubmitting || submitStatus.type === 'success'}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin">⟳</span>
                      Sending...
                    </>
                  ) : submitStatus.type === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Message Sent!
                    </>
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
