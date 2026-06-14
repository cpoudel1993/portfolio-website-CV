"use client"

import Image from "next/image"
import { ArrowDown, MapPin, Briefcase, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content"

export function HeroSection({ content = DEFAULT_HOMEPAGE_CONTENT }: { content?: HomepageContent }) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20"
    >
      {/* Background image (editable from the admin panel) */}
      <div className="absolute inset-0">
        <Image
          src={content.heroBackgroundUrl || "/images/anime-mountain-bg-1.jpg"}
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground italic">
            <MapPin className="h-3.5 w-3.5" />
            {content.heroBadge}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl uppercase shadow-md" style={{ fontFamily: '"Playfair Display", sans-serif' }}>
            {content.heroNameFirst}{" "}
            <span className="text-primary">{content.heroNameLast}</span>
          </h1>

          <p className="mb-3 flex items-center justify-center gap-2 text-right text-lg font-medium text-foreground/80 lg:justify-start">
            <Briefcase className="h-4 w-4 text-primary" />
            {content.heroRole}
          </p>

          <p className="mx-auto mb-8 max-w-xl text-center text-base leading-relaxed text-muted-foreground lg:mx-0">
            {content.heroDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              className="gap-2"
              onClick={() =>
                document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {content.heroPrimaryCtaLabel}
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a
                href={content.heroCvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                {"Download CV"}
              </a>
            </Button>
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="relative h-72 w-72 overflow-hidden rounded-2xl border-2 border-border shadow-2xl sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <Image
              src={content.heroProfileImage || "/images/chiranjivi-formal.png"}
              alt={`${content.heroNameFirst} ${content.heroNameLast} - Professional portrait`}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
            />
          </div>
          {/* Decorative accent */}
          <div className="absolute -bottom-3 -right-3 h-72 w-72 rounded-2xl border-2 border-primary/20 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
