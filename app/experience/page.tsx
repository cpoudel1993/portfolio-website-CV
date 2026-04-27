import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { ExperienceSection } from '@/components/experience-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Experience | Chiranjivi Poudel',
  description: 'Professional work experience of Chiranjivi Poudel including roles in production, civil engineering, and customer service.',
  openGraph: {
    title: 'Experience | Chiranjivi Poudel',
    description: 'Professional work experience of Chiranjivi Poudel.',
  },
}

export default function ExperiencePage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <ExperienceSection />
      </main>
      <Footer />
    </>
  )
}
