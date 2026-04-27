'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

async function requireAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
  return supabase
}

export interface MessageInput {
  full_name: string
  email: string
  subject?: string | null
  message: string
  status?: 'unread' | 'read' | 'archived'
}

function validate(input: MessageInput) {
  if (!input.full_name?.trim()) return 'Full name is required.'
  if (!input.email?.trim()) return 'Email is required.'
  if (!input.message?.trim()) return 'Message is required.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(input.email)) return 'Please enter a valid email address.'
  return null
}

export async function createMessage(input: MessageInput) {
  try {
    const supabase = await requireAdmin()
    const validationError = validate(input)
    if (validationError) return { success: false, error: validationError }

    const { error } = await supabase.from('contact_messages').insert({
      full_name: input.full_name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || null,
      message: input.message.trim(),
      status: input.status || 'unread',
    })

    if (error) {
      console.error('Create message error:', error)
      return { success: false, error: 'Failed to create message.' }
    }

    revalidatePath('/protected/messages')
    return { success: true }
  } catch (err) {
    console.error('Create message exception:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export async function updateMessage(id: string, input: Partial<MessageInput>) {
  try {
    const supabase = await requireAdmin()

    if (input.full_name !== undefined || input.email !== undefined || input.message !== undefined) {
      const validationError = validate({
        full_name: input.full_name || '',
        email: input.email || '',
        message: input.message || '',
      })
      if (validationError) return { success: false, error: validationError }
    }

    const updates: Record<string, unknown> = {}
    if (input.full_name !== undefined) updates.full_name = input.full_name.trim()
    if (input.email !== undefined) updates.email = input.email.trim()
    if (input.subject !== undefined) updates.subject = input.subject?.trim() || null
    if (input.message !== undefined) updates.message = input.message.trim()
    if (input.status !== undefined) updates.status = input.status

    const { error } = await supabase.from('contact_messages').update(updates).eq('id', id)
    if (error) {
      console.error('Update message error:', error)
      return { success: false, error: 'Failed to update message.' }
    }

    revalidatePath('/protected/messages')
    return { success: true }
  } catch (err) {
    console.error('Update message exception:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export async function setMessageStatus(id: string, status: 'unread' | 'read' | 'archived') {
  return updateMessage(id, { status })
}

export async function deleteMessageAction(id: string) {
  try {
    const supabase = await requireAdmin()
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) {
      console.error('Delete message error:', error)
      return { success: false, error: 'Failed to delete message.' }
    }
    revalidatePath('/protected/messages')
    return { success: true }
  } catch (err) {
    console.error('Delete message exception:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
