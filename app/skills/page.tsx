import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
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
        <SkillsSection />
      </main>
      <Footer />
    </>
  )
}
