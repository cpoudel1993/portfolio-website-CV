import type { Metadata } from "next"
import { NavigationServer } from "@/components/navigation-server"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import {
  getCachedPublicProfile,
  getCachedSEOBySlug,
  getCachedSiteSettings,
} from "@/lib/public-data"
import { mapSettingsToHomepageContent } from "@/lib/homepage-content"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCachedSEOBySlug("home")
  if (!seo) return {}

  const metadata: Metadata = {}
  if (seo.meta_title) metadata.title = { absolute: seo.meta_title }
  if (seo.meta_description) metadata.description = seo.meta_description
  if (seo.keywords) metadata.keywords = seo.keywords
  if (seo.canonical_url) metadata.alternates = { canonical: seo.canonical_url }
  if (seo.og_title || seo.og_description || seo.og_image) {
    metadata.openGraph = {
      ...(seo.og_title ? { title: seo.og_title } : {}),
      ...(seo.og_description ? { description: seo.og_description } : {}),
      ...(seo.og_image ? { images: [{ url: seo.og_image }] } : {}),
    }
  }
  metadata.robots = {
    index: seo.robots_index ?? true,
    follow: seo.robots_follow ?? true,
  }
  return metadata
}

export default async function Home() {
  const [settings, profile] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPublicProfile(),
  ])
  const content = mapSettingsToHomepageContent(settings)

  return (
    <>
      <NavigationServer />
      <main>
        <HeroSection content={content} profile={profile} />
      </main>
      <Footer />
    </>
  )
}
