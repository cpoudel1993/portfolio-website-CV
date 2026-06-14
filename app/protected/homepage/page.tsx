import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettingsAsMap } from '@/app/actions/site-settings'
import { HomepageForm } from '@/components/admin/homepage-form'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function HomepageEditorPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const settings = await getSiteSettingsAsMap()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homepage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the hero background, photos, and all homepage text. Changes appear live on the
          public site after saving.
        </p>
      </div>
      <HomepageForm initial={settings} userId={data.user.id} />
    </div>
  )
}
