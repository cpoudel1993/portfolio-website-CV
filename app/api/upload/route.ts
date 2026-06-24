import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const supabase = await createClient()
    const { data, error: authError } = await supabase.auth.getUser()
    if (authError || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const timestamp = Date.now()
    const filename = `${folder}/${timestamp}-${file.name}`

    const buffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[v0] Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(uploadData.path)

    return NextResponse.json({ url: publicUrlData.publicUrl })
  } catch (err) {
    console.error('[v0] Upload route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
