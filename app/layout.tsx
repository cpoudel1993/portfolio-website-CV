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
  title: 'Chiranjivi Poudel | Professional Portfolio | New Zealand',
  description:
    'Chiranjivi Poudel - Reliable professional based in Hamilton, New Zealand. Process Worker at Silver Fern Farms with a background in Civil Engineering, Surveying, and Site Supervision. Eligible for full-time work in New Zealand.',
  keywords: [
    'Chiranjivi Poudel',
    'Chiranjivi Poudel New Zealand',
    'Process Worker New Zealand',
    'Civil Engineer Nepal',
    'Surveyor Hamilton',
    'Silver Fern Farms',
    'chiranjivipoudel.com.np',
  ],
  authors: [{ name: 'Chiranjivi Poudel' }],
  creator: 'Chiranjivi Poudel',
  metadataBase: new URL('https://www.chiranjivipoudel.com.np'),
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://www.chiranjivipoudel.com.np',
    siteName: 'Chiranjivi Poudel Portfolio',
    title: 'Chiranjivi Poudel | Professional Portfolio | New Zealand',
    description:
      'Chiranjivi Poudel - Professional based in Hamilton, New Zealand. Process Worker at Silver Fern Farms with Civil Engineering and Surveying background.',
    images: [
      {
        url: '/images/chiranjivi-formal.png',
        width: 800,
        height: 600,
        alt: 'Chiranjivi Poudel - Professional Portrait',
      },
    ],
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
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
  jobTitle: 'Process Worker',
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
