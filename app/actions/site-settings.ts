'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SiteSetting {
  key: string
  value: string | null
  description: string | null
  updated_at: string
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

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true })
    if (error) {
      console.error('getAllSiteSettings error:', error)
      return []
    }
    return (data || []) as SiteSetting[]
  } catch (e) {
    console.error('getAllSiteSettings error:', e)
    return []
  }
}

export async function getSiteSettingsAsMap(): Promise<Record<string, string>> {
  const list = await getAllSiteSettings()
  const map: Record<string, string> = {}
  for (const item of list) {
    map[item.key] = item.value ?? ''
  }
  return map
}

export async function upsertSiteSetting(key: string, value: string, description?: string) {
  try {
    const supabase = await requireAdmin()
    const payload: Record<string, unknown> = { key, value }
    if (description !== undefined) payload.description = description

    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'key' })
    if (error) {
      console.error('upsertSiteSetting error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/settings')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to save setting' }
  }
}

export async function upsertSiteSettings(values: Record<string, string>) {
  try {
    const supabase = await requireAdmin()
    const rows = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' })
    if (error) {
      console.error('upsertSiteSettings error:', error)
      return { success: false, error: error.message }
    }
    // Revalidate all pages that use site_settings data
    revalidatePath('/protected/settings')
    revalidatePath('/', 'layout') // Homepage + all layouts
    revalidatePath('/contact', 'layout') // Contact page + layouts
    revalidatePath('/experience', 'layout') // All other pages
    revalidatePath('/skills', 'layout')
    revalidatePath('/projects', 'layout')
    revalidatePath('/certifications', 'layout')
    revalidatePath('/blog', 'layout')
    revalidatePath('/gallery', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to save settings' }
  }
}

export async function deleteSiteSetting(key: string) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('site_settings').delete().eq('key', key)
    if (error) {
      console.error('deleteSiteSetting error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/settings')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to delete setting' }
  }
}
