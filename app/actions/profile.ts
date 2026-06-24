'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProfileInput {
  full_name: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  initials: string | null
  phone: string | null
  location: string | null
  website: string | null
  linkedin_url: string | null
  github_url: string | null
  twitter_url: string | null
  youtube_url: string | null
  work_experience: string | null
}

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

async function requireAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
  return { supabase, user: data.user }
}

export async function getMyProfile() {
  try {
    const { supabase, user } = await requireAdmin()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    if (error) {
      console.error('getMyProfile error:', error)
      return null
    }
    return data
  } catch (e) {
    console.error('getMyProfile error:', e)
    return null
  }
}

export async function upsertProfile(input: ProfileInput) {
  try {
    const { supabase, user } = await requireAdmin()
    const payload = {
      id: user.id,
      full_name: input.full_name?.trim() || null,
      display_name: input.display_name?.trim() || null,
      bio: input.bio?.trim() || null,
      avatar_url: input.avatar_url?.trim() || null,
      initials: input.initials?.trim() || null,
      phone: input.phone?.trim() || null,
      location: input.location?.trim() || null,
      website: input.website?.trim() || null,
      linkedin_url: input.linkedin_url?.trim() || null,
      github_url: input.github_url?.trim() || null,
      twitter_url: input.twitter_url?.trim() || null,
      youtube_url: input.youtube_url?.trim() || null,
      work_experience: input.work_experience || null,
    }
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
    if (error) {
      console.error('upsertProfile error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/profile')
    revalidatePath('/about')
    revalidatePath('/contact')
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to save profile' }
  }
}
