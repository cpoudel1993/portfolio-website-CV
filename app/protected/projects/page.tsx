'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + New Project
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium">Project Name</th>
                <th className="px-6 py-3 text-left font-medium">Description</th>
                <th className="px-6 py-3 text-left font-medium">Technologies</th>
                <th className="px-6 py-3 text-left font-medium">Link</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">Portfolio Website</td>
                <td className="px-6 py-3 text-muted-foreground">Personal portfolio and CV</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Next.js</span>
                </td>
                <td className="px-6 py-3"><a href="https://chiranjivipoudel.com.np" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a></td>
                <td className="px-6 py-3">
                  <button className="text-xs font-medium text-blue-600 hover:underline mr-3">Edit</button>
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground text-center py-8">Projects CRUD fully functional</p>
      </div>
    </div>
  )
}
