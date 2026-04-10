// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'https://viral.langtangihub.org'),
  title: {
    default: 'ViralKit — AI Content Studio',
    template: '%s | ViralKit',
  },
  description:
    'Generate AI videos & images, edit content, schedule to YouTube, Instagram, TikTok & more — all in one app. Go viral with ViralKit.',
  keywords: [
    'AI video generator',
    'AI image generator',
    'social media automation',
    'content creation',
    'fal.ai',
    'schedule posts',
    'YouTube uploader',
    'Instagram automation',
    'TikTok creator',
  ],
  authors: [{ name: 'ViralKit' }],
  creator: 'ViralKit',
  publisher: 'ViralKit',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viral.langtangihub.org',
    siteName: 'ViralKit',
    title: 'ViralKit — AI Content Studio',
    description: 'Create AI videos, images & go viral. One app for all your social content.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ViralKit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralKit — AI Content Studio',
    description: 'Create AI videos, images & go viral.',
    images: ['/og-image.png'],
    creator: '@viralkit',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ViralKit',
  },
  formatDetection: { telephone: false },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* PWA iOS specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Splash screens */}
        <link rel="apple-touch-startup-image" href="/splash/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1668x2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--font-dm)',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}