import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { Footer } from '@/components/footer'
import { getCachedProjects } from '@/lib/public-data'
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

function isValidImageUrl(url: string): boolean {
  try {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i
    return imageExtensions.test(url)
  } catch {
    return false
  }
}

export default async function ProjectsPage() {
  const projects = await getCachedProjects()

  return (
    <>
      <NavigationServer />
      <main>
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
                    {project.image_url && isValidImageUrl(project.image_url) ? (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={82}
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <p className="text-sm text-muted-foreground font-medium">{project.title}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      {project.category && (
                        <span className="inline-block mb-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                          {project.category}
                        </span>
                      )}
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
