'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET_NAME = 'gallery-images'

export async function listImages(path: string = '') {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(path, {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.error('[v0] listImages error:', error)
      return { success: false, error: error.message }
    }

    let allFiles: any[] = []

    // Process files in current directory
    if (data) {
      const files = data.filter((item) => !item.id.endsWith('/')) // Filter out folders
      allFiles = allFiles.concat(
        files.map((file) => ({
          name: path ? `${path}/${file.name}` : file.name,
          filename: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          url: supabase.storage.from(BUCKET_NAME).getPublicUrl(path ? `${path}/${file.name}` : file.name).data.publicUrl,
        }))
      )

      // Recursively list subdirectories
      const folders = data.filter((item) => item.id.endsWith('/'))
      for (const folder of folders) {
        const subPath = path ? `${path}/${folder.name}` : folder.name
        const subResult = await listImages(subPath)
        if (subResult.success) {
          allFiles = allFiles.concat(subResult.images)
        }
      }
    }

    return {
      success: true,
      images: allFiles,
    }
  } catch (e) {
    console.error('[v0] listImages error:', e)
    return { success: false, error: 'Failed to list images' }
  }
}

export async function deleteImage(fullPath: string) {
  try {
    const supabase = await createClient()
    console.log('[v0] Deleting image:', fullPath)
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([fullPath])

    if (error) {
      console.error('[v0] deleteImage error:', error)
      return { success: false, error: error.message }
    }

    console.log('[v0] Image deleted successfully:', fullPath)
    revalidatePath('/protected/images')
    return { success: true }
  } catch (e) {
    console.error('[v0] deleteImage error:', e)
    return { success: false, error: 'Failed to delete image' }
  }
}
