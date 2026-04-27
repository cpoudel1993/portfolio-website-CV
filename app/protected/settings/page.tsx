import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettingsAsMap } from '@/app/actions/site-settings'
import { SiteSettingsForm } from '@/components/admin/site-settings-form'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const settings = await getSiteSettingsAsMap()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your account, public site, and feature toggles.
        </p>
      </div>
      <SiteSettingsForm initial={settings} email={data.user.email ?? ''} />
    </div>
  )
}
