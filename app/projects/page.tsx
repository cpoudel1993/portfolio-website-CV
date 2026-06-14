import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Projects | Chiranjivi Poudel',
  description: 'View projects and portfolio work by Chiranjivi Poudel including engineering and web development projects.',
  openGraph: {
    title: 'Projects | Chiranjivi Poudel',
    description: 'Projects and portfolio work by Chiranjivi Poudel.',
  },
}

async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data || []
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <NavigationServer />
      <main>
        <PageHero
          title="My Projects"
          subtitle="Portfolio & Work"
          description="Explore the projects I've built, from full-stack applications to civil engineering solutions and innovative digital products."
          imageUrl="/api/placeholder?w=500&h=500"
        />
        <section className="px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects to display yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
                  >
                    {project.image_url && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground mb-2">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3.5 w-3.5 mr-1.5" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
