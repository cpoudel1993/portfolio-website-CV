import { Metadata } from 'next'
import { NavigationServer } from '@/components/navigation-server'
import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'
import { getSiteSettingsAsMap } from '@/app/actions/site-settings'
import { getCachedPublicProfile } from '@/lib/public-data'
import { mapSettingsToHomepageContent } from '@/lib/homepage-content'
import { parseHighlights } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'About | Chiranjivi Poudel',
  description: 'Learn more about Chiranjivi Poudel - Civil Engineer, Production Supervisor, and Web Developer based in Hamilton, New Zealand.',
  openGraph: {
    title: 'About | Chiranjivi Poudel',
    description: 'Learn more about Chiranjivi Poudel - Civil Engineer, Production Supervisor, and Web Developer.',
  },
}

export default async function AboutPage() {
  const [settings, profile] = await Promise.all([
    getSiteSettingsAsMap(),
    getCachedPublicProfile(),
  ])
  const content = mapSettingsToHomepageContent(settings)
  const highlights = parseHighlights(settings.home_about_highlights)

  return (
    <>
      <NavigationServer />
      <main className="pt-20">
        <AboutSection content={content} highlights={highlights} profile={profile} />
      </main>
      <Footer />
    </>
  )
}
