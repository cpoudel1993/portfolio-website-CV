'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContact(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const supabase = await createClient()

    // Insert message into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          is_read: false,
          is_archived: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to save message. Please try again.' }
    }

    // TODO: Send email using Resend/SMTP when configured
    // For now, just confirm the message was saved
    return { 
      success: true, 
      message: 'Thank you! Your message has been received. I will get back to you soon.',
      id: data?.[0]?.id 
    }
  } catch (error) {
    console.error('Contact submission error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
