import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Chiranjivi Poudel | Professional Portfolio | Nepal to New Zealand',
    template: '%s | Chiranjivi Poudel',
  },
  description:
    'Chiranjivi Poudel - Originally from Nepal, now based in Hamilton, New Zealand. Process Worker at Silver Fern Farms with a strong background in Civil Engineering, Surveying, Site Supervision, and Full-Stack Web Development. Eligible for full-time work in New Zealand.',
  keywords: [
    'Chiranjivi Poudel',
    'Chiranjivi Poudel Nepal',
    'Chiranjivi Poudel New Zealand',
    'Nepali professional New Zealand',
    'Process Worker New Zealand',
    'Civil Engineer Nepal',
    'Surveyor Hamilton',
    'Silver Fern Farms',
    'Full Stack Web Developer',
    'AutoCAD',
    'Revit',
    'SketchUp',
    'chiranjivipoudel.com.np',
    'cpoudel1993',
    'Hamilton New Zealand',
    'Waikato',
  ],
  authors: [{ name: 'Chiranjivi Poudel', url: 'https://www.chiranjivipoudel.com.np' }],
  creator: 'Chiranjivi Poudel',
  publisher: 'Chiranjivi Poudel',
  metadataBase: new URL('https://www.chiranjivipoudel.com.np'),
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://www.chiranjivipoudel.com.np',
    siteName: 'Chiranjivi Poudel Portfolio',
    title: 'Chiranjivi Poudel | From Nepal to New Zealand | Professional Portfolio',
    description:
      'Chiranjivi Poudel - Originally from Nepal, now a professional based in Hamilton, New Zealand. Civil Engineering background with expertise in Surveying, AutoCAD, Revit, SketchUp, and Web Development.',
    images: [
      {
        url: '/images/my-profile.jpg',
        width: 800,
        height: 800,
        alt: 'Chiranjivi Poudel - Professional Portrait',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chiranjivi Poudel | Professional Portfolio',
    description:
      'Chiranjivi Poudel - From Nepal to New Zealand. Civil Engineer, Surveyor, and Web Developer based in Hamilton, NZ.',
    images: ['/images/my-profile.jpg'],
  },
  alternates: {
    canonical: 'https://www.chiranjivipoudel.com.np',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.jpg',
    apple: '/apple-icon.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Chiranjivi Poudel',
  givenName: 'Chiranjivi',
  familyName: 'Poudel',
  jobTitle: 'Process Worker',
  description:
    'Chiranjivi Poudel is a Nepali-born professional currently living and working in New Zealand. With a background in Civil Engineering and expertise in Surveying, AutoCAD, Revit, SketchUp, and Web Development.',
  image: 'https://www.chiranjivipoudel.com.np/images/my-profile.jpg',
  worksFor: {
    '@type': 'Organization',
    name: 'Silver Fern Farms Ltd.',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '81 Lake Road, Frankton',
    addressLocality: 'Hamilton',
    addressRegion: 'Waikato',
    addressCountry: 'NZ',
  },
  nationality: {
    '@type': 'Country',
    name: 'Nepal',
  },
  birthPlace: {
    '@type': 'Place',
    name: 'Nepal',
  },
  email: 'c.poudel1993@gmail.com',
  telephone: '+64220153300',
  url: 'https://www.chiranjivipoudel.com.np',
  sameAs: [
    'https://www.linkedin.com/in/cpoudel1993/',
    'https://www.youtube.com/channel/UC7CJV2aO5MSQIPz8LHnobpg',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Sushma Koirala Memorial Engineering College',
  },
  knowsAbout: [
    'Civil Engineering',
    'Surveying',
    'Site Supervision',
    'Food Processing',
    'AutoCAD',
    'SketchUp',
    'Revit',
    'Full-Stack Web Development',
    'Digital Marketing',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
