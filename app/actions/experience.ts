'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ExperienceInput {
  user_id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
  responsibilities: string[] | null
  tags: string[] | null
  type: string | null
  is_current: boolean
  status: string
  display_order: number
}

export async function createExperience(data: ExperienceInput) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('experiences').insert({
      ...data,
    })

    if (error) {
      console.error('Error creating experience:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/experience')
    revalidatePath('/experience')
    return { success: true }
  } catch (error) {
    console.error('Create experience error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateExperience(id: string, data: Partial<ExperienceInput>) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('experiences')
      .update(data)
      .eq('id', id)

    if (error) {
      console.error('Error updating experience:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/experience')
    revalidatePath('/experience')
    return { success: true }
  } catch (error) {
    console.error('Update experience error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteExperience(id: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting experience:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/experience')
    revalidatePath('/experience')
    return { success: true }
  } catch (error) {
    console.error('Delete experience error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getPublishedExperiences() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching experiences:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get experiences error:', error)
    return []
  }
}
