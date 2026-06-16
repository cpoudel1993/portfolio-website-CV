import { getSiteSettingsAsMap } from "@/app/actions/site-settings"
import { parseSocialLinks, getSocialIcon } from "@/lib/site-content"

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const settings = await getSiteSettingsAsMap()
  const socialLinks = parseSocialLinks(settings.site_social_links)

  // Only items with a usable link are shown as footer icon buttons.
  const linkItems = socialLinks.filter((link) => link.href.trim() !== "")

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
            {linkItems.map((link) => {
              const Icon = getSocialIcon(link.icon)
              const isExternal = link.href.startsWith("http")
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {`\u00A9 ${currentYear} Chiranjivi Poudel. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
