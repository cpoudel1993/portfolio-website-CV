import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyProfile } from '@/app/actions/profile'
import { ProfileForm } from '@/components/admin/profile-form'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const profile = await getMyProfile()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the personal information shown across your portfolio.
        </p>
      </div>
      <ProfileForm initial={profile ?? {}} email={data.user.email ?? ''} />
    </div>
  )
}
