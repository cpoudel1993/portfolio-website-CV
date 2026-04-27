'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEOManager } from '@/components/admin/seo-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

// Define pages that need SEO settings
const sitePages = [
  { slug: 'home', name: 'Homepage', path: '/' },
  { slug: 'about', name: 'About', path: '/about' },
  { slug: 'experience', name: 'Experience', path: '/experience' },
  { slug: 'skills', name: 'Skills', path: '/skills' },
  { slug: 'projects', name: 'Projects', path: '/projects' },
  { slug: 'certifications', name: 'Certifications', path: '/certifications' },
  { slug: 'gallery', name: 'Gallery', path: '/gallery' },
  { slug: 'blog', name: 'Blog', path: '/blog' },
  { slug: 'contact', name: 'Contact', path: '/contact' },
]

export default async function SEOPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  // Fetch existing SEO settings
  const { data: seoSettings, error: seoError } = await supabase
    .from('seo_settings')
    .select('*')
    .order('page_slug', { ascending: true })

  if (seoError) {
    console.error('Error fetching SEO settings:', seoError)
  }

  // Merge site pages with existing SEO settings
  const pagesWithSEO = sitePages.map((page) => {
    const existingSEO = seoSettings?.find((s) => s.page_slug === page.slug)
    return {
      ...page,
      seo: existingSEO || null,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage meta titles, descriptions, and Open Graph settings for each page
          </p>
        </div>
      </div>

      <SEOManager pages={pagesWithSEO} userId={data.user.id} />
    </div>
  )
}
