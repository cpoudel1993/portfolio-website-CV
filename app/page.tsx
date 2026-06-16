import type { Metadata } from "next"
import { NavigationServer } from "@/components/navigation-server"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { getSiteSettingsAsMap } from "@/app/actions/site-settings"
import { getSEOBySlug } from "@/app/actions/seo"
import { mapSettingsToHomepageContent } from "@/lib/homepage-content"
import { parseHighlights, parseSocialLinks } from "@/lib/site-content"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOBySlug("home")
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
  const settings = await getSiteSettingsAsMap()
  const content = mapSettingsToHomepageContent(settings)
  const highlights = parseHighlights(settings.home_about_highlights)
  const socialLinks = parseSocialLinks(settings.site_social_links)

  return (
    <>
      <NavigationServer />
      <main>
        <HeroSection content={content} />
        <AboutSection content={content} highlights={highlights} />
        <GallerySection />
        <ContactSection socialLinks={socialLinks} />
      </main>
      <Footer />
    </>
  )
}
