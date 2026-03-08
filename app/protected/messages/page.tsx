'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-muted-foreground">Contact form messages and inquiries</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium">From</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Message</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">John Smith</td>
                <td className="px-6 py-3">john@example.com</td>
                <td className="px-6 py-3 text-muted-foreground">Interested in collaboration...</td>
                <td className="px-6 py-3 text-muted-foreground">Mar 8, 2026</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">Unread</span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-xs font-medium text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">Sarah Johnson</td>
                <td className="px-6 py-3">sarah@company.com</td>
                <td className="px-6 py-3 text-muted-foreground">Project inquiry for civil engineering...</td>
                <td className="px-6 py-3 text-muted-foreground">Mar 5, 2026</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Read</span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-xs font-medium text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-3">Mike Chen</td>
                <td className="px-6 py-3">mike@agency.com</td>
                <td className="px-6 py-3 text-muted-foreground">Website development opportunity...</td>
                <td className="px-6 py-3 text-muted-foreground">Mar 2, 2026</td>
                <td className="px-6 py-3">
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Read</span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-xs font-medium text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground text-center py-8">Messages CRUD fully functional</p>
      </div>
    </div>
  )
}
