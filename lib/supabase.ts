import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// supabaseUrl and anonKey should be provided via environment variables.
// During build or when the variables are missing, we provide a stub object so
// that importing this module does not crash. Any runtime usage without proper
// configuration will return errors.

let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    'Supabase environment variables are missing. Authentication will not work.'
  )
  // minimal stub implementation of relevant methods used in this repo
  supabase = {
    auth: {
      signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
    },
  }
}

export { supabase }
