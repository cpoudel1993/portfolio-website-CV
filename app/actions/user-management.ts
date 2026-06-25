'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function changeUserPassword(userId: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (error) throw error

    revalidatePath('/protected/users')
    return { success: true }
  } catch (error) {
    console.error('[v0] changeUserPassword error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to change password' }
  }
}

export async function createNewUser(email: string, password: string) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email required' }
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) throw error

    revalidatePath('/protected/users')
    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error('[v0] createNewUser error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create user' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) throw error

    revalidatePath('/protected/users')
    return { success: true }
  } catch (error) {
    console.error('[v0] deleteUser error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' }
  }
}

export async function listAllUsers() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) throw error

    return { success: true, users: data.users }
  } catch (error) {
    console.error('[v0] listAllUsers error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to list users' }
  }
}
