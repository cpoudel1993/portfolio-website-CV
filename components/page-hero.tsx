'use client'

import Image from 'next/image'

interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
}

export function PageHero({ title, subtitle, description, imageUrl }: PageHeroProps) {
  return (
    <section className="relative min-h-[500px] overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-20">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-grid-pattern/5 pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:gap-16 items-center lg:grid-cols-2">
          {/* Left: Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg font-medium text-primary sm:text-xl">
                  {subtitle}
                </p>
              )}
            </div>
            
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                {description}
              </p>
            )}
            
            {/* Decorative line */}
            <div className="pt-6 flex justify-center lg:justify-start">
              <div className="h-1 w-16 rounded-full bg-primary" />
            </div>
          </div>

          {/* Right: Image */}
          {imageUrl && (
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  )
}
