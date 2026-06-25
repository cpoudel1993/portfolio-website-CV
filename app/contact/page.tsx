import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { getSiteSettingsAsMap } from '@/app/actions/site-settings'
import { parseSocialLinks } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Contact | Chiranjivi Poudel',
  description: 'Get in touch with Chiranjivi Poudel for professional opportunities and inquiries.',
  openGraph: {
    title: 'Contact | Chiranjivi Poudel',
    description: 'Get in touch with Chiranjivi Poudel for professional opportunities.',
  },
}

export default async function ContactPage() {
  const settings = await getSiteSettingsAsMap()
  const socialLinks = parseSocialLinks(settings.site_social_links)
  const contactBgImage = settings.contact_bg_image || '/images/anime-mountain-bg-2.jpg'

  return (
    <>
      <NavigationServer />
      <main>
        <ContactSection socialLinks={socialLinks} backgroundImage={contactBgImage} />
      </main>
      <Footer />
    </>
  )
}
