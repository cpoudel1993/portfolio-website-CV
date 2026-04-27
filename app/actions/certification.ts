'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CertificationInput {
  user_id: string
  title: string
  platform: string
  type: string | null
  date_earned: string | null
  duration: string | null
  skills: string[] | null
  cert_id: string | null
  pdf_url: string | null
  verify_url: string | null
  status: string
  display_order: number
}

export async function createCertification(data: CertificationInput) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('certifications').insert({
      ...data,
    })

    if (error) {
      console.error('Error creating certification:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/certifications')
    revalidatePath('/certifications')
    return { success: true }
  } catch (error) {
    console.error('Create certification error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateCertification(id: string, data: Partial<CertificationInput>) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('certifications')
      .update(data)
      .eq('id', id)

    if (error) {
      console.error('Error updating certification:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/certifications')
    revalidatePath('/certifications')
    return { success: true }
  } catch (error) {
    console.error('Update certification error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteCertification(id: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting certification:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/certifications')
    revalidatePath('/certifications')
    return { success: true }
  } catch (error) {
    console.error('Delete certification error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getPublishedCertifications() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('date_earned', { ascending: false })

    if (error) {
      console.error('Error fetching certifications:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get certifications error:', error)
    return []
  }
}
