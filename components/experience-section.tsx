'use client'

import { MapPin, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Experience {
  id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
  responsibilities: string[] | null
  is_current: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  tags?: string[]
  type?: string
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('status', 'published')
        .order('start_date', { ascending: false })

      if (!mounted) return
      if (error) {
        console.error('[v0] experiences fetch error:', error.message)
        setLoading(false)
        return
      }

      setExperiences(data || [])
      setLoading(false)
    }

    fetchExperiences()

    // Real-time subscription for live updates from admin panel
    const channel = supabase
      .channel('experiences_public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'experiences' },
        () => {
          fetchExperiences()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <section id="experience" className="bg-secondary/50 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Career</p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Professional Experience</h2>
            <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="bg-secondary/50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Career</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Professional Experience</h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-0 top-8 z-10 h-3 w-3 -translate-x-1 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1.5" />

                <div className={`ml-6 w-full md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {exp.is_current ? 'Current' : 'Past'}
                      </span>
                    </div>

                    <h3 className="mb-1 text-base font-semibold text-foreground">{exp.position}</h3>
                    <p className="mb-2 text-sm font-medium text-primary">{exp.company}</p>

                    <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : '- Present'}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                      )}
                    </div>

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="mb-4 space-y-1.5">
                        {exp.responsibilities.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
