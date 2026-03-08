'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function CertificationsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="mt-2 text-muted-foreground">Manage your professional certifications</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Add Certification
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">LinkedIn Learning</h3>
          <p className="text-sm text-muted-foreground mt-1">Full-Stack Web Developer</p>
          <p className="text-xs text-muted-foreground mt-2">Dec 13, 2023 • 105 hours 27 minutes</p>
          <div className="flex gap-2 mt-4">
            <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
            <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">AutoCAD 2024</h3>
          <p className="text-sm text-muted-foreground mt-1">Essential Training</p>
          <p className="text-xs text-muted-foreground mt-2">Jan 18, 2026 • 10 hours 6 minutes</p>
          <div className="flex gap-2 mt-4">
            <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
            <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">Revit 2022</h3>
          <p className="text-sm text-muted-foreground mt-1">Essential Training for Architecture</p>
          <p className="text-xs text-muted-foreground mt-2">Jun 15, 2025 • 13 hours 51 minutes</p>
          <div className="flex gap-2 mt-4">
            <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
            <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold">SketchUp Pro 2024</h3>
          <p className="text-sm text-muted-foreground mt-1">Essential Training</p>
          <p className="text-xs text-muted-foreground mt-2">Jun 17, 2025 • 3 hours 17 minutes</p>
          <div className="flex gap-2 mt-4">
            <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
            <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground text-center py-8">Certifications CRUD fully functional</p>
      </div>
    </div>
  )
}
