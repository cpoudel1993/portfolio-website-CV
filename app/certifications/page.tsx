import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
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
      <Navigation />
      <main className="pt-20">
        <CertificationsSection />
      </main>
      <Footer />
    </>
  )
}
