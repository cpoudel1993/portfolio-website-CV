import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Contact | Chiranjivi Poudel',
  description: 'Get in touch with Chiranjivi Poudel for professional opportunities and inquiries.',
  openGraph: {
    title: 'Contact | Chiranjivi Poudel',
    description: 'Get in touch with Chiranjivi Poudel for professional opportunities.',
  },
}

export default function ContactPage() {
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
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
