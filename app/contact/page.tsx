import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
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

  return (
    <>
      <NavigationServer />
      <main>
        <PageHero
          title="Get In Touch"
          subtitle="Let's Connect"
          description="Have a question or interested in collaborating? I'd love to hear from you. Reach out and let's start a conversation."
          imageUrl="/api/placeholder?w=500&h=500"
        />
        <ContactSection socialLinks={socialLinks} />
      </main>
      <Footer />
    </>
  )
}
