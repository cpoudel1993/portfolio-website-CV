import { getCachedActiveMenuItems, getCachedPublicProfile } from '@/lib/public-data'
import { Navigation } from '@/components/navigation'

export async function NavigationServer() {
  const [items, profile] = await Promise.all([
    getCachedActiveMenuItems('main'),
    getCachedPublicProfile(),
  ])

  const menuItems = items.map((item) => ({
    label: item.label,
    href: item.href,
    anchor: item.anchor ?? undefined,
    external: item.is_external || undefined,
  }))

  return <Navigation 
    menuItems={menuItems} 
    initials={profile?.initials || 'CP'}
  />
}
