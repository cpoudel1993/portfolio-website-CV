import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
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
      <Navigation />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
