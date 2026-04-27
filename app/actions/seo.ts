'use server'

import { createClient } from '@/lib/supabase/server'

interface SEOSettingsInput {
  id?: string
  user_id: string
  page_slug: string
  meta_title: string | null
  meta_description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
}

export async function upsertSEOSettings(data: SEOSettingsInput) {
  try {
    const supabase = await createClient()

    // Check if exists
    const { data: existing } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('page_slug', data.page_slug)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('seo_settings')
        .update({
          meta_title: data.meta_title || null,
          meta_description: data.meta_description || null,
          keywords: data.keywords || null,
          og_title: data.og_title || null,
          og_description: data.og_description || null,
          og_image: data.og_image || null,
          canonical_url: data.canonical_url || null,
          robots_index: data.robots_index,
          robots_follow: data.robots_follow,
        })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating SEO settings:', error)
        return { success: false, error: 'Failed to update SEO settings' }
      }
    } else {
      // Insert new
      const { error } = await supabase.from('seo_settings').insert({
        user_id: data.user_id,
        page_slug: data.page_slug,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        keywords: data.keywords || null,
        og_title: data.og_title || null,
        og_description: data.og_description || null,
        og_image: data.og_image || null,
        canonical_url: data.canonical_url || null,
        robots_index: data.robots_index,
        robots_follow: data.robots_follow,
      })

      if (error) {
        console.error('Error inserting SEO settings:', error)
        return { success: false, error: 'Failed to save SEO settings' }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('SEO settings error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getSEOBySlug(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching SEO settings:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('SEO fetch error:', error)
    return null
  }
}
