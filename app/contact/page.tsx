import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
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
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
