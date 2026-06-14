'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck, HardHat, Pencil, Users, Monitor, Wrench } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

interface SkillCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  skills: Skill[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Production & Food Safety': ShieldCheck,
  'Construction & Surveying': HardHat,
  'Drafting & Design': Pencil,
  'Software & Digital': Monitor,
  'Teamwork & Reliability': Users,
  'Technical & Hardware': Wrench,
}

const proficiencyLevels: Record<string, number> = {
  'Beginner': 40,
  'Intermediate': 65,
  'Advanced': 85,
  'Expert': 95,
}

export function SkillsSection() {
  const [skillsByCategory, setSkillsByCategory] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'published')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (!mounted) return
      if (error) {
        console.error('[v0] skills fetch error:', error.message)
        setLoading(false)
        return
      }

      // Group skills by category
      const grouped = (data || []).reduce((acc: SkillCategory[], skill) => {
        const existing = acc.find((g) => g.name === skill.category)
        if (existing) {
          existing.skills.push(skill)
        } else {
          acc.push({
            name: skill.category || 'Other',
            icon: iconMap[skill.category] || Monitor,
            skills: [skill],
          })
        }
        return acc
      }, [] as SkillCategory[])

      setSkillsByCategory(grouped)
      setLoading(false)
    }

    fetchSkills()

    // Real-time subscription for live updates
    const channel = supabase
      .channel('skills_public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'skills' },
        () => {
          fetchSkills()
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
      <section id="skills" className="px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Expertise</p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Skills & Competencies</h2>
            <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Expertise</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Skills & Competencies</h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillsByCategory.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
                </div>

                <div className="space-y-3.5">
                  {category.skills.map((skill) => {
                    const level = proficiencyLevels[skill.proficiency] || 70
                    return (
                      <div key={skill.id}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{skill.name}</span>
                          <span className="text-xs font-medium text-primary">{level}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-700"
                            style={{ width: `${level}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
