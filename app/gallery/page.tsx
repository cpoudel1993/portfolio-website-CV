import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { GallerySection } from '@/components/gallery-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Gallery | Chiranjivi Poudel',
  description: 'Photo gallery showcasing professional and personal moments of Chiranjivi Poudel.',
  openGraph: {
    title: 'Gallery | Chiranjivi Poudel',
    description: 'Photo gallery showcasing professional and personal moments.',
  },
}

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <GallerySection />
      </main>
      <Footer />
    </>
  )
}
