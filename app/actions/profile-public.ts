'use server'

import { createClient } from '@/lib/supabase/server'

export interface PublicProfile {
  id: string
  full_name: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  linkedin_url: string | null
  github_url: string | null
  youtube_url: string | null
  twitter_url: string | null
  website: string | null
  phone: string | null
}

export async function getPublicProfile(): Promise<PublicProfile | null> {
  try {
    const supabase = await createClient()
    // Fetch any profile (there should be only one admin profile)
    // Order by created_at desc to get the most recent, then limit to 1
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[v0] getPublicProfile error:', error)
      return null
    }
    return data as PublicProfile | null
  } catch (e) {
    console.error('[v0] getPublicProfile error:', e)
    return null
  }
}
