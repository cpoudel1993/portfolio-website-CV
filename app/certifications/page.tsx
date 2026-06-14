import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
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
        <PageHero
          title="Certifications"
          subtitle="Professional Credentials"
          description="Explore my professional certifications and qualifications acquired through continuous learning and industry training."
          imageUrl="/api/placeholder?w=500&h=500"
        />
        <CertificationsSection />
      </main>
      <Footer />
    </>
  )
}
