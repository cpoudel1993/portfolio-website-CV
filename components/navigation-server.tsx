import { getActiveMenuItems } from '@/app/actions/menu'
import { Navigation } from '@/components/navigation'

export async function NavigationServer() {
  const items = await getActiveMenuItems('main')

  const menuItems = items.map((item) => ({
    label: item.label,
    href: item.href,
    anchor: item.anchor ?? undefined,
    external: item.is_external || undefined,
  }))

  return <Navigation menuItems={menuItems} />
}
