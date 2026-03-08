'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Track your website performance and metrics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Page Views</p>
          <p className="mt-2 text-3xl font-bold">1,247</p>
          <p className="mt-1 text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
          <p className="mt-2 text-3xl font-bold">842</p>
          <p className="mt-1 text-xs text-green-600">+8% from last month</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Avg. Time on Site</p>
          <p className="mt-2 text-3xl font-bold">3m 24s</p>
          <p className="mt-1 text-xs text-green-600">+5s from last month</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Analytics Management</h2>
        <p className="text-muted-foreground text-sm mb-4">Create, read, update, and delete analytics records</p>
        <p className="text-sm text-muted-foreground py-8 text-center">Analytics CRUD coming soon...</p>
      </div>
    </div>
  )
}
