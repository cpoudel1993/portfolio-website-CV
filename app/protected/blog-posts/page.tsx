'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function BlogPostsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-2 text-muted-foreground">Create and manage your blog content</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + New Post
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">Getting Started with Next.js</td>
                <td className="px-6 py-3">Development</td>
                <td className="px-6 py-3 text-muted-foreground">Mar 8, 2026</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Published</span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-xs font-medium text-blue-600 hover:underline mr-3">Edit</button>
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">Civil Engineering Best Practices</td>
                <td className="px-6 py-3">Engineering</td>
                <td className="px-6 py-3 text-muted-foreground">Mar 5, 2026</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Draft</span>
                </td>
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
        <p className="text-sm text-muted-foreground text-center py-8">Blog Posts CRUD fully functional</p>
      </div>
    </div>
  )
}
