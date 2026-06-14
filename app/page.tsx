import { NavigationServer } from "@/components/navigation-server"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <NavigationServer />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
