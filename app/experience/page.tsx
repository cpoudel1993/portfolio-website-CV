import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
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
      <NavigationServer />
      <main>
        <PageHero
          title="My Experience"
          subtitle="Professional Journey"
          description="Explore my professional background, roles, and key achievements across various industries and organizations."
          imageUrl="/api/placeholder?w=500&h=500"
        />
        <ExperienceSection />
      </main>
      <Footer />
    </>
  )
}
