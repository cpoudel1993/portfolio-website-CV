import 'server-only'

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { PublicProfile } from '@/app/actions/profile-public'
import type { MenuItem } from '@/app/actions/menu'

interface PublicSEOSetting {
  id: string
  page_slug: string
  meta_title: string | null
  meta_description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  robots_index: boolean | null
  robots_follow: boolean | null
  created_at: string
  updated_at: string
}

export interface PublicGalleryPhoto {
  id: string
  title: string
  location: string | null
  year: string | null
  category: string
  image_url: string
  alt: string | null
  status: string
  sort_order: number | null
  created_at: string
}

export interface PublicSkill {
  id: string
  name: string
  category: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface PublicSkillCategory {
  name: string
  icon_url: string | null
  sort_order: number | null
}

export interface PublicExperience {
  id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
  responsibilities: string[] | null
  is_current: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  tags?: string[]
  type?: string
}

export interface PublicCertification {
  id: string
  title: string
  platform: string
  type: string | null
  date_earned: string | null
  duration: string | null
  skills: string[] | null
  cert_id: string | null
  pdf_url: string | null
  verify_url: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

const PUBLIC_REVALIDATE_SECONDS = 300

export const getCachedPublicProfile = unstable_cache(
  async (): Promise<PublicProfile | null> => {
    const { data, error } = await createPublicClient()
      .from('profiles')
      .select(
        'id,full_name,display_name,bio,avatar_url,favicon_url,initials,location,linkedin_url,github_url,youtube_url,twitter_url,website,phone,work_experience,created_at'
      )
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('getCachedPublicProfile error:', error.message)
      return null
    }

    return data as PublicProfile | null
  },
  ['public-profile'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['profile'] }
)

export const getCachedSiteSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await createPublicClient()
      .from('site_settings')
      .select('key,value')
      .order('key', { ascending: true })

    if (error) {
      console.error('getCachedSiteSettings error:', error.message)
      return {}
    }

    return Object.fromEntries((data || []).map((item) => [item.key, item.value ?? '']))
  },
  ['public-site-settings'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['site-settings'] }
)

export const getCachedActiveMenuItems = unstable_cache(
  async (location: 'main' | 'footer' | 'admin' = 'main'): Promise<MenuItem[]> => {
    const { data, error } = await createPublicClient()
      .from('menu_items')
      .select('id,label,href,anchor,icon,sort_order,is_external,is_active,location,created_at,updated_at')
      .eq('is_active', true)
      .eq('location', location)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('getCachedActiveMenuItems error:', error.message)
      return []
    }

    return (data || []) as MenuItem[]
  },
  ['public-menu-items'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['menu-items'] }
)

export const getCachedSEOBySlug = unstable_cache(
  async (slug: string): Promise<PublicSEOSetting | null> => {
    const { data, error } = await createPublicClient()
      .from('seo_settings')
      .select(
        'id,page_slug,meta_title,meta_description,keywords,og_title,og_description,og_image,canonical_url,robots_index,robots_follow,created_at,updated_at'
      )
      .eq('page_slug', slug)
      .maybeSingle()

    if (error) {
      console.error('getCachedSEOBySlug error:', error.message)
      return null
    }

    return data as PublicSEOSetting | null
  },
  ['public-seo-by-slug'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['seo-settings'] }
)

export const getCachedProjects = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient()
      .from('projects')
      .select('id,title,description,image_url,category,live_url,github_url,display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('getCachedProjects error:', error.message)
      return []
    }

    return data || []
  },
  ['public-projects'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['projects'] }
)

export const getCachedBlogPosts = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient()
      .from('blog_posts')
      .select('id,slug,title,excerpt,featured_image,published_at,reading_time')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('getCachedBlogPosts error:', error.message)
      return []
    }

    return data || []
  },
  ['public-blog-posts'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['blog-posts'] }
)

export const getCachedGalleryPhotos = unstable_cache(
  async (): Promise<PublicGalleryPhoto[]> => {
    const { data, error } = await createPublicClient()
      .from('gallery_photos')
      .select('id,title,location,year,category,image_url,alt,status,sort_order,created_at')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getCachedGalleryPhotos error:', error.message)
      return []
    }
    return (data || []) as PublicGalleryPhoto[]
  },
  ['public-gallery-photos'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['gallery-photos'] }
)

export const getCachedSkillsData = unstable_cache(
  async (): Promise<{ skills: PublicSkill[]; categories: PublicSkillCategory[] }> => {
    const supabase = createPublicClient()
    const [skillsResult, categoriesResult] = await Promise.all([
      supabase
        .from('skills')
        .select('id,name,category,proficiency,status,created_at,updated_at')
        .eq('status', 'published')
        .order('name', { ascending: true }),
      supabase
        .from('skill_categories')
        .select('name,icon_url,sort_order')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    ])

    if (skillsResult.error) {
      console.error('getCachedSkillsData error:', skillsResult.error.message)
      return { skills: [], categories: [] }
    }

    return {
      skills: (skillsResult.data || []) as PublicSkill[],
      categories: (categoriesResult.data || []) as PublicSkillCategory[],
    }
  },
  ['public-skills-data'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['skills'] }
)

export const getCachedExperiences = unstable_cache(
  async (): Promise<PublicExperience[]> => {
    const { data, error } = await createPublicClient()
      .from('experiences')
      .select(
        'id,company,position,location,start_date,end_date,description,responsibilities,is_current,status,created_at,updated_at'
      )
      .eq('status', 'published')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('getCachedExperiences error:', error.message)
      return []
    }
    return (data || []) as PublicExperience[]
  },
  ['public-experiences'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['experiences'] }
)

export const getCachedCertifications = unstable_cache(
  async (): Promise<PublicCertification[]> => {
    const { data, error } = await createPublicClient()
      .from('certifications')
      .select(
        'id,title,platform,type,date_earned,duration,skills,cert_id,pdf_url,verify_url,status,created_at,updated_at'
      )
      .eq('status', 'published')
      .order('date_earned', { ascending: false })

    if (error) {
      console.error('getCachedCertifications error:', error.message)
      return []
    }
    return (data || []) as PublicCertification[]
  },
  ['public-certifications'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['certifications'] }
)

export const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    const { data, error } = await createPublicClient()
      .from('blog_posts')
      .select(
        'id,slug,title,excerpt,content,featured_image,cover_image,published_at,reading_time,tags'
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error('getCachedBlogPost error:', error.message)
      return null
    }

    return data
  },
  ['public-blog-post-by-slug'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ['blog-posts'] }
)
