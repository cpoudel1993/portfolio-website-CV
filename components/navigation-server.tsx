import { getActiveMenuItems } from '@/app/actions/menu'
import { getPublicProfile } from '@/app/actions/profile-public'
import { Navigation } from '@/components/navigation'

export async function NavigationServer() {
  const items = await getActiveMenuItems('main')
  const profile = await getPublicProfile()

  const menuItems = items.map((item) => ({
    label: item.label,
    href: item.href,
    anchor: item.anchor ?? undefined,
    external: item.is_external || undefined,
  }))

  return <Navigation menuItems={menuItems} initials={profile?.initials || 'CP'} />
}
