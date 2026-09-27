import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { Footer } from '@/components/footer'
import { getCachedProjects } from '@/lib/public-data'
import { ProjectsGrid } from '@/components/projects-grid'

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
              <ProjectsGrid projects={projects} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
