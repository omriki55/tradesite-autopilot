import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TRPCProvider } from "@/trpc/provider"
import { AuthProvider } from "@/components/auth-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tradesite-autopilot.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0f',
}

export const metadata: Metadata = {
  title: {
    default: 'Tradesite Autopilot — Trading Website Builder & Marketing Platform',
    template: '%s | Tradesite Autopilot',
  },
  description: 'Build and launch professional trading websites with AI-powered content, SEO, social media, and marketing automation. For Forex brokers, crypto exchanges, and prop firms.',
  keywords: ['trading website builder', 'forex broker website', 'crypto exchange platform', 'prop firm website', 'trading marketing automation', 'AI content generation'],
  authors: [{ name: 'Tradesite Autopilot' }],
  creator: 'Tradesite Autopilot',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Tradesite Autopilot',
    title: 'Tradesite Autopilot — Trading Website Builder & Marketing Platform',
    description: 'Build and launch professional trading websites with AI-powered content, SEO, social media, and marketing automation.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tradesite Autopilot',
    description: 'AI-powered trading website builder & marketing platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
