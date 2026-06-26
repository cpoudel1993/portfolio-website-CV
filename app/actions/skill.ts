'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface SkillInput {
  user_id: string
  name: string
  category: string
  proficiency: string
  status: string
}

export async function createSkill(data: SkillInput) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('skills').insert({ ...data })

    if (error) {
      console.error('[v0] Error creating skill:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/skills')
    revalidatePath('/skills')
    return { success: true }
  } catch (error) {
    console.error('[v0] Create skill error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateSkill(id: string, data: Partial<SkillInput>) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('skills')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('[v0] Error updating skill:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/skills')
    revalidatePath('/skills')
    return { success: true }
  } catch (error) {
    console.error('[v0] Update skill error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteSkill(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (error) {
      console.error('[v0] Error deleting skill:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/skills')
    revalidatePath('/skills')
    return { success: true }
  } catch (error) {
    console.error('[v0] Delete skill error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
