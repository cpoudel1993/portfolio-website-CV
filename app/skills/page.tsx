import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { PageHero } from '@/components/page-hero'
import { SkillsSection } from '@/components/skills-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Skills | Chiranjivi Poudel',
  description: 'Technical and professional skills of Chiranjivi Poudel including engineering software, programming, and industry expertise.',
  openGraph: {
    title: 'Skills | Chiranjivi Poudel',
    description: 'Technical and professional skills of Chiranjivi Poudel.',
  },
}

export default function SkillsPage() {
  return (
    <>
      <NavigationServer />
      <main>
        <PageHero
          title="My Skills"
          subtitle="Technical Expertise"
          description="Discover the technical and professional skills I've developed through years of experience in engineering and software development."
          imageUrl="/api/placeholder?w=500&h=500"
        />
        <SkillsSection />
      </main>
      <Footer />
    </>
  )
}
