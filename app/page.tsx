import { NavigationServer } from "@/components/navigation-server"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { getSiteSettingsAsMap } from "@/app/actions/site-settings"
import { mapSettingsToHomepageContent } from "@/lib/homepage-content"

export default async function Home() {
  const settings = await getSiteSettingsAsMap()
  const content = mapSettingsToHomepageContent(settings)

  return (
    <>
      <NavigationServer />
      <main>
        <HeroSection content={content} />
        <AboutSection content={content} />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
