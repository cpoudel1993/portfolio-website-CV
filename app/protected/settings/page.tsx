'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and application settings</p>
      </div>

      {/* Account Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
        
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="flex gap-3">
              <input
                type="email"
                defaultValue={data.user.email || ''}
                disabled
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm"
              />
              <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                Change Email
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              Change Password
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between py-3 border-t border-border pt-6">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security</p>
            </div>
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6">Site Settings</h2>
        
        <div className="space-y-6">
          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <input
              type="text"
              defaultValue="Chiranjivi Poudel | Portfolio"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Site Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea
              defaultValue="Civil Engineer | Full-Stack Developer | Based in New Zealand"
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Enable Blog */}
          <div className="flex items-center justify-between py-3 border-t border-border pt-6">
            <div>
              <p className="font-medium text-sm">Enable Blog</p>
              <p className="text-xs text-muted-foreground mt-1">Show blog posts on your portfolio</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5"></span>
            </button>
          </div>

          {/* Enable Contact Form */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <p className="font-medium text-sm">Enable Contact Form</p>
              <p className="text-xs text-muted-foreground mt-1">Allow visitors to send messages</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5"></span>
            </button>
          </div>

          {/* Enable Analytics */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <p className="font-medium text-sm">Enable Analytics</p>
              <p className="text-xs text-muted-foreground mt-1">Track visitor analytics and metrics</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20 p-6">
        <h2 className="text-lg font-semibold mb-6 text-red-600 dark:text-red-400">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">This action cannot be undone</p>
            </div>
            <button className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Save Settings
      </button>
    </div>
  )
}
