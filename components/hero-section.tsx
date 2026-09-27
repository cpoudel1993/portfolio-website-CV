"use client"

import Image from "next/image"
import { ArrowDown, MapPin, Briefcase, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content"
import type { PublicProfile } from "@/app/actions/profile-public"

export function HeroSection({
  content = DEFAULT_HOMEPAGE_CONTENT,
  profile,
}: {
  content?: HomepageContent
  profile?: PublicProfile | null
}) {
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
        <div className="hero-reveal flex-1 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground italic">
            <MapPin className="h-3.5 w-3.5" />
            {content.heroBadge}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl uppercase shadow-md" style={{ fontFamily: '"Playfair Display", sans-serif' }}>
            {profile?.full_name || `${content.heroNameFirst} ${content.heroNameLast}`}
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
        <div className="hero-reveal hero-reveal-delay group relative flex-shrink-0">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <div className="pointer-events-none absolute -inset-8 opacity-90 transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none">
              <svg viewBox="0 0 420 420" className="h-full w-full text-primary/70" aria-hidden="true">
                <path d="M38 112V58h54M328 58h54v54M382 308v54h-54M92 362H38v-54" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" className="origin-center animate-[spin_36s_linear_infinite] motion-reduce:animate-none" />
                <path d="M18 210h44M358 210h44M210 18v44M210 358v44M66 96l28 28M326 96l-28 28M66 324l28-28M326 324l-28-28" fill="none" stroke="currentColor" strokeWidth="1" opacity=".65" />
                <path d="M70 286V166l70-40 70 40v120M140 126v160M210 166l70-40 70 40v120M280 126v160M70 286h280M92 302h236" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".4" />
                <path d="M252 80h74M289 80v42M252 122h74M252 80l-24 42h98" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
                <path d="M36 210h26M38 204v12M358 210h26M382 204v12" fill="none" stroke="currentColor" strokeWidth="1" opacity=".8" />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-[2rem] border border-primary/50 bg-primary/5 shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_25%,transparent)] transition-transform duration-700 group-hover:rotate-1 group-hover:scale-[1.02] motion-reduce:transition-none" />
            <div className="absolute inset-0 overflow-hidden rounded-[1.65rem] border-2 border-primary/80 bg-background/20 shadow-2xl shadow-primary/20 [clip-path:polygon(8%_0,92%_0,100%_8%,100%_92%,92%_100%,8%_100%,0_92%,0_8%)]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-primary/15 via-transparent to-cyan-300/10" />
              <div className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100 motion-reduce:transition-none" />
              <Image
                src={content.heroProfileImage || "/images/chiranjivi-formal.png"}
                alt={`${content.heroNameFirst} ${content.heroNameLast} - Professional portrait`}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none"
                priority
                quality={100}
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
