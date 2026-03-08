'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">Edit your profile information</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
        
        <form className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              CP
            </div>
            <div>
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
              <button type="button" className="mt-3 text-sm font-medium text-blue-600 hover:underline">
                Upload
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue={data.user.email || ''}
              disabled
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Chiranjivi Poudel"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              defaultValue="Civil engineer from Nepal, now based in Hamilton, New Zealand. Full-stack web developer and process worker."
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                defaultValue="New Zealand"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                defaultValue="Hamilton"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+64220153300"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-medium">Social Links</h3>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                defaultValue="https://www.linkedin.com/in/cpoudel1993/"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                placeholder="https://github.com/"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube</label>
              <input
                type="url"
                defaultValue="https://www.youtube.com/channel/UC7CJV2aO5MSQIPz8LHnobpg"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
