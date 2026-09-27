'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  description: string | null
  image_url: string | null
  category: string | null
  details: {
    project_type?: string
    location?: string
    client_name?: string
    website_name?: string
    service_type?: string
    gallery_urls?: string[]
    feedback?: string
    reaction_count?: number
  } | null
  live_url: string | null
  github_url: string | null
}

function isValidImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url)
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categoryOrder = ['Civil Engineering', 'IT', 'Programming', 'Website Hosting', 'Graphic Design', 'Digital Marketing']
  const projectCategories = Array.from(new Set(projects.map((project) => project.category).filter(Boolean) as string[]))
  const categories = ['All', ...categoryOrder, ...projectCategories.filter((category) => !categoryOrder.includes(category))]
  const [activeCategory, setActiveCategory] = useState('All')
  const visibleProjects = activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory)

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Filter projects by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      <div id="projects" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <article
            key={project.id}
            id={project.category ? project.category.toLowerCase().replace(/\s+/g, '-') : undefined}
            className="project-card group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
          >
            {project.image_url && isValidImageUrl(project.image_url) ? (
              <div className="relative aspect-video overflow-hidden">
                <Image src={project.image_url} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={100} unoptimized />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <p className="px-4 text-center text-sm font-medium text-muted-foreground">{project.title}</p>
              </div>
            )}
            <div className="p-5">
              {project.category && <span className="mb-2 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{project.category}</span>}
              <h2 className="mb-2 font-semibold text-foreground">{project.title}</h2>
              {project.category === 'Civil Engineering' && project.details && <p className="mb-3 text-sm text-muted-foreground">{[project.details.project_type, project.details.location].filter(Boolean).join(' · ')}</p>}
              {project.category === 'Website Hosting' && project.details && <p className="mb-3 text-sm text-muted-foreground">{project.details.website_name || project.title}{project.details.client_name ? ` · Client: ${project.details.client_name}` : ''}</p>}
              {project.category === 'Digital Marketing' && project.details && <p className="mb-3 text-sm text-muted-foreground">{[project.details.service_type, project.details.client_name].filter(Boolean).join(' · ')}</p>}
              {project.description && <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>}
              {project.category === 'Graphic Design' && (project.details?.gallery_urls?.length ?? 0) > 0 && <div className="mb-4 grid grid-cols-3 gap-2">{project.details?.gallery_urls?.slice(0, 3).map((url) => <img key={url} src={url} alt="Design work" className="aspect-square rounded object-cover" />)}</div>}
              {project.details?.feedback && <blockquote className="mb-4 border-l-2 border-primary pl-3 text-sm italic text-muted-foreground">“{project.details.feedback}”{project.details.reaction_count ? <span className="ml-2 not-italic">· {project.details.reaction_count} reactions</span> : null}</blockquote>}
              <div className="flex items-center gap-2">
                {project.live_url && <Button size="sm" variant="outline" asChild><a href={project.live_url} target="_blank" rel="noopener noreferrer"><ExternalLink data-icon="inline-start" />{project.category === 'Website Hosting' ? 'Live demo' : 'View'}</a></Button>}
                {project.github_url && <Button size="sm" variant="ghost" asChild><a href={project.github_url} target="_blank" rel="noopener noreferrer"><Github data-icon="inline-start" />Code</a></Button>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
