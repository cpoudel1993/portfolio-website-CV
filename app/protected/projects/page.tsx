import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectsTable } from '@/components/dashboard/projects-table'
import type { Project } from '@/lib/db'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (projectsError) {
    console.error('[v0] projects fetch error:', projectsError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your portfolio projects, drafts, and featured highlights.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <ProjectsTable projects={(projects ?? []) as Project[]} userId={data.user.id} />
      </div>
    </div>
  )
}
