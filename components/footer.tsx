import { Linkedin, Mail, Phone, Globe, Youtube } from "lucide-react"

const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cpoudel1993/",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC7CJV2aO5MSQIPz8LHnobpg?sub_confirmation=1",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:c.poudel1993@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    href: "tel:+64220153300",
  },
  {
    icon: Globe,
    label: "Website",
    href: "https://www.chiranjivipoudel.com.np",
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div>
            <a href="#home" className="text-lg font-bold text-foreground">
              CP<span className="text-primary">.</span>
            </a>
            <p className="mt-1 text-xs text-muted-foreground">
              Chiranjivi Poudel &middot; Hamilton, New Zealand
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5"
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {`\u00A9 ${currentYear} Chiranjivi Poudel. All rights reserved.`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Built with Next.js &middot; Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
