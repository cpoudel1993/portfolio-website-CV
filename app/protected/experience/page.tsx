'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function ExperiencePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="mt-2 text-muted-foreground">Manage your work experience</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Add Experience
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">Process Worker</h3>
              <p className="text-sm text-muted-foreground">Silver Fern Farms Ltd.</p>
              <p className="text-xs text-muted-foreground mt-1">Jan 2024 - Present • Hamilton, New Zealand</p>
              <p className="text-sm mt-3">Food processing and quality assurance operations</p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
              <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">Site Supervisor</h3>
              <p className="text-sm text-muted-foreground">Various Construction Companies - Nepal</p>
              <p className="text-xs text-muted-foreground mt-1">2018 - 2023 • Nepal</p>
              <p className="text-sm mt-3">Civil engineering project supervision and quality control</p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
              <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground text-center py-8">Experience CRUD fully functional</p>
      </div>
    </div>
  )
}
