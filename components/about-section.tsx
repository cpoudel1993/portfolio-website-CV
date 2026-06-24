import Image from "next/image"
import { DEFAULT_HOMEPAGE_CONTENT, type HomepageContent } from "@/lib/homepage-content"
import {
  DEFAULT_HIGHLIGHTS,
  getHighlightIcon,
  type Highlight,
} from "@/lib/site-content"
import type { PublicProfile } from "@/app/actions/profile-public"

export function AboutSection({
  content = DEFAULT_HOMEPAGE_CONTENT,
  highlights = DEFAULT_HIGHLIGHTS,
  profile,
}: {
  content?: HomepageContent
  highlights?: Highlight[]
  profile?: PublicProfile | null
}) {
  // Use work experience from profile if available, otherwise fall back to highlights
  const displayHighlights = profile?.work_experience
    ? (() => {
        try {
          return JSON.parse(profile.work_experience) as Highlight[]
        } catch {
          return highlights
        }
      })()
    : highlights
  return (
    <section id="about" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            About
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {content.aboutHeading}
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className="relative flex-shrink-0">
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-border shadow-lg sm:h-72 sm:w-72">
              <Image
                src={content.aboutImage || "/images/chiranjivi-casual.png"}
                alt={`${content.heroNameFirst} ${content.heroNameLast} - Casual portrait`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 256px, 288px"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              {content.aboutParagraph1}
            </p>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              {content.aboutParagraph2}
            </p>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayHighlights.map((item, index) => {
            const Icon = getHighlightIcon(item.icon)
            return (
              <div
                key={`${item.title}-${index}`}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
