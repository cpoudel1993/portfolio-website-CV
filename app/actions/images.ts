'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET_NAME = 'gallery-images'

export async function listImages() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list()

    if (error) {
      console.error('[v0] listImages error:', error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      images: data?.map((file) => ({
        name: file.name,
        size: file.metadata?.size || 0,
        created_at: file.created_at,
        url: supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl,
      })) || [],
    }
  } catch (e) {
    console.error('[v0] listImages error:', e)
    return { success: false, error: 'Failed to list images' }
  }
}

export async function deleteImage(filename: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename])

    if (error) {
      console.error('[v0] deleteImage error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/protected/images')
    return { success: true }
  } catch (e) {
    console.error('[v0] deleteImage error:', e)
    return { success: false, error: 'Failed to delete image' }
  }
}
