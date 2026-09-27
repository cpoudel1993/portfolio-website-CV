import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { identifier, email, password } = await request.json()
    const loginIdentifier = String(identifier ?? email ?? '').trim()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    let loginEmail = loginIdentifier

    if (!loginIdentifier.includes('@')) {
      if (!serviceRoleKey) {
        return NextResponse.json({ error: 'Username login is not configured.' }, { status: 500 })
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('id')
        .ilike('username', loginIdentifier)
        .maybeSingle()

      if (profileError || !profile) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
      }

      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(profile.id)
      if (userError || !userData.user?.email) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
      }
      loginEmail = userData.user.email
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        session: data.session,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth-token=${data.session?.access_token}; Path=/; HttpOnly; SameSite=Lax`,
        },
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
