'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface BlogPostInput {
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  tags: string[] | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
}

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

async function requireAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
  return { supabase, user: data.user }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function getAllBlogPosts() {
  try {
    const { supabase } = await requireAdmin()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('getAllBlogPosts error:', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('getAllBlogPosts error:', e)
    return []
  }
}

export async function createBlogPost(input: BlogPostInput) {
  try {
    const { supabase, user } = await requireAdmin()
    const slug = input.slug ? slugify(input.slug) : slugify(input.title)
    const published_at =
      input.status === 'published' && !input.published_at
        ? new Date().toISOString()
        : input.published_at

    const { error } = await supabase.from('blog_posts').insert({
      user_id: user.id,
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt?.trim() || null,
      content: input.content || null,
      cover_image: input.cover_image?.trim() || null,
      tags: input.tags && input.tags.length ? input.tags : null,
      status: input.status,
      published_at,
    })
    if (error) {
      console.error('createBlogPost error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/blog-posts')
    revalidatePath('/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to create post' }
  }
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  try {
    const { supabase } = await requireAdmin()
    const updates: Record<string, unknown> = {}
    if (input.title !== undefined) updates.title = input.title.trim()
    if (input.slug !== undefined) updates.slug = slugify(input.slug)
    if (input.excerpt !== undefined) updates.excerpt = input.excerpt?.trim() || null
    if (input.content !== undefined) updates.content = input.content
    if (input.cover_image !== undefined) updates.cover_image = input.cover_image?.trim() || null
    if (input.tags !== undefined) updates.tags = input.tags && input.tags.length ? input.tags : null
    if (input.status !== undefined) {
      updates.status = input.status
      if (input.status === 'published' && input.published_at === undefined) {
        updates.published_at = new Date().toISOString()
      }
    }
    if (input.published_at !== undefined) updates.published_at = input.published_at

    const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
    if (error) {
      console.error('updateBlogPost error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/blog-posts')
    revalidatePath('/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to update post' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) {
      console.error('deleteBlogPost error:', error)
      return { success: false, error: error.message }
    }
    revalidatePath('/protected/blog-posts')
    revalidatePath('/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Failed to delete post' }
  }
}
