import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { CertificationsSection } from '@/components/certifications-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Certifications | Chiranjivi Poudel',
  description: 'Professional certifications and credentials of Chiranjivi Poudel including workplace safety, engineering, and technology certifications.',
  openGraph: {
    title: 'Certifications | Chiranjivi Poudel',
    description: 'Professional certifications and credentials of Chiranjivi Poudel.',
  },
}

export default function CertificationsPage() {
  return (
    <>
      <NavigationServer />
      <main>
        <CertificationsSection />
      </main>
      <Footer />
    </>
  )
}
