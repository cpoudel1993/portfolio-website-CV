'use client'

import { ExternalLink, Clock, Award, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Certification {
  id: string
  title: string
  platform: string
  type: string | null
  date_earned: string | null
  duration: string | null
  skills: string[] | null
  cert_id: string | null
  pdf_url: string | null
  verify_url: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('status', 'published')
        .order('date_earned', { ascending: false })

      if (!mounted) return
      if (error) {
        console.error('[v0] certifications fetch error:', error.message)
        setLoading(false)
        return
      }

      setCertifications(data || [])
      setLoading(false)
    }

    fetchCertifications()

    // Real-time subscription for live updates
    const channel = supabase
      .channel('certifications_public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certifications' },
        () => {
          fetchCertifications()
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
      <section id="certifications" className="bg-secondary/50 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Credentials</p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Certifications & Training</h2>
            <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="bg-secondary/50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Credentials</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Certifications & Training</h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-4 w-4" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {cert.type || 'Certificate'}
                </span>
              </div>

              <h3 className="mb-1 text-sm font-semibold text-foreground leading-snug">{cert.title}</h3>
              <p className="mb-3 text-xs text-primary">{cert.platform}</p>

              <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {cert.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cert.duration}
                  </span>
                )}
                {cert.date_earned && <span>{cert.date_earned}</span>}
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-2">
                {cert.verify_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto gap-1.5 px-0 text-xs text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href={cert.verify_url} target="_blank" rel="noopener noreferrer">
                      Verify
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {cert.pdf_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto gap-1.5 px-0 text-xs text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer">
                      View PDF
                      <FileText className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
