import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient<any> | undefined

export function createPublicClient() {
  if (publicClient) return publicClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Public Supabase configuration is missing')
  }

  publicClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return publicClient
}
