import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/app/actions/menu'
import { MenuManager } from '@/components/admin/menu-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const items = await getMenuItems()

  return <MenuManager items={items} />
}
