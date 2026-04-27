'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface MenuItem {
  id: string
  label: string
  href: string
  anchor: string | null
  icon: string | null
  sort_order: number
  is_external: boolean
  is_active: boolean
  location: 'main' | 'footer' | 'admin'
  created_at: string
  updated_at: string
}

export interface MenuItemInput {
  label: string
  href: string
  anchor?: string | null
  icon?: string | null
  sort_order: number
  is_external: boolean
  is_active: boolean
  location: 'main' | 'footer' | 'admin'
}

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

async function requireAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
  return supabase
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('location', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching menu items:', error)
      return []
    }
    return (data || []) as MenuItem[]
  } catch (e) {
    console.error('getMenuItems error:', e)
    return []
  }
}

export async function getActiveMenuItems(location: 'main' | 'footer' | 'admin' = 'main'): Promise<MenuItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .eq('location', location)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching active menu items:', error)
      return []
    }
    return (data || []) as MenuItem[]
  } catch (e) {
    console.error('getActiveMenuItems error:', e)
    return []
  }
}

export async function createMenuItem(input: MenuItemInput) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('menu_items').insert({
      label: input.label.trim(),
      href: input.href.trim(),
      anchor: input.anchor?.trim() || null,
      icon: input.icon?.trim() || null,
      sort_order: input.sort_order,
      is_external: input.is_external,
      is_active: input.is_active,
      location: input.location,
    })
    if (error) {
      console.error('createMenuItem error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/menu')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to create menu item' }
  }
}

export async function updateMenuItem(id: string, input: Partial<MenuItemInput>) {
  try {
    const supabase = await requireAdmin()
    const updates: Record<string, unknown> = {}
    if (input.label !== undefined) updates.label = input.label.trim()
    if (input.href !== undefined) updates.href = input.href.trim()
    if (input.anchor !== undefined) updates.anchor = input.anchor?.trim() || null
    if (input.icon !== undefined) updates.icon = input.icon?.trim() || null
    if (input.sort_order !== undefined) updates.sort_order = input.sort_order
    if (input.is_external !== undefined) updates.is_external = input.is_external
    if (input.is_active !== undefined) updates.is_active = input.is_active
    if (input.location !== undefined) updates.location = input.location

    const { error } = await supabase.from('menu_items').update(updates).eq('id', id)
    if (error) {
      console.error('updateMenuItem error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/menu')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to update menu item' }
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) {
      console.error('deleteMenuItem error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/menu')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to delete menu item' }
  }
}

export async function reorderMenuItems(updates: Array<{ id: string; sort_order: number }>) {
  try {
    const supabase = await requireAdmin()
    for (const u of updates) {
      const { error } = await supabase
        .from('menu_items')
        .update({ sort_order: u.sort_order })
        .eq('id', u.id)
      if (error) {
        console.error('reorderMenuItems error:', error)
        return { success: false, error: error.message }
      }
    }
    revalidatePath('/protected/menu')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to reorder' }
  }
}
