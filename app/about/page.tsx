import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'About | Chiranjivi Poudel',
  description: 'Learn more about Chiranjivi Poudel - Civil Engineer, Production Supervisor, and Web Developer based in Hamilton, New Zealand.',
  openGraph: {
    title: 'About | Chiranjivi Poudel',
    description: 'Learn more about Chiranjivi Poudel - Civil Engineer, Production Supervisor, and Web Developer.',
  },
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
