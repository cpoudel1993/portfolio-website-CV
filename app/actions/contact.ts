'use server'

import { createClient } from '@/lib/supabase/server'

interface ContactMessageInput {
  full_name: string
  email: string
  subject: string
  message: string
}

export async function submitContactMessage(data: ContactMessageInput) {
  try {
    // Validate required fields
    if (!data.full_name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Please fill in all required fields.',
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address.',
      }
    }

    const supabase = await createClient()

    // Insert message into contact_messages table
    const { error } = await supabase.from('contact_messages').insert({
      full_name: data.full_name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
      status: 'unread',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return {
        success: false,
        error: 'Failed to send message. Please try again later.',
      }
    }

    return {
      success: true,
      message: 'Message sent successfully!',
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

