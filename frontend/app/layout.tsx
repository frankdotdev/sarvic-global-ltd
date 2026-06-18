import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sarvicglobal.com'),
  title: {
    default: 'Sarvic Global Ltd — Connecting Global Trade Without Boundaries',
    template: '%s | Sarvic Global Ltd',
  },
  description:
    'Sarvic Global Ltd delivers premium integrated logistics, procurement, manufacturing, automotive supply, and foreign exchange solutions across China, Turkey, and Nigeria. Your trusted global trade partner since 2020.',
  keywords: [
    'Sarvic Global', 'global logistics', 'freight forwarding Nigeria', 'China Nigeria shipping',
    'procurement Guangzhou', 'building materials supply', 'automotive procurement',
    'ocean freight Lagos', 'air cargo Nigeria', 'foreign exchange trade', 'supply chain Africa',
    'manufacturing sourcing China', 'sanitary ware Nigeria', 'apparel manufacturing',
  ],
  authors: [{ name: 'Sarvic Global Ltd', url: 'https://sarvicglobal.com' }],
  creator: 'Sarvic Global Ltd',
  publisher: 'Sarvic Global Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sarvicglobal.com',
    siteName: 'Sarvic Global Ltd',
    title: 'Sarvic Global Ltd — Connecting Global Trade Without Boundaries',
    description: 'Premium integrated logistics, procurement, manufacturing, and supply chain solutions across Asia, Europe, and Africa.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Sarvic Global Ltd' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarvic Global Ltd',
    description: 'Connecting Global Trade Without Boundaries',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sarvicglobal.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1F38',
};

// JSON-LD Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sarvic Global Ltd',
  legalName: 'Guangzhou Sarvic Global Trading Co., Ltd',
  url: 'https://sarvicglobal.com',
  logo: 'https://sarvicglobal.com/logo.png',
  foundingDate: '2020',
  description: 'Premier integrated conglomerate spanning logistics, procurement, manufacturing, and supply chain solutions.',
  email: 'sarvicglobaltd@gmail.com',
  telephone: ['+8619566805494', '+905469904659', '+2347060866333'],
  address: [
    {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressLocality: 'Guangzhou',
      addressRegion: 'Guangdong',
      streetAddress: 'Floor 4, District D, Lot D113, Guota International Trade City, 27 Guangyuan West Road, Yuexiu District',
    },
    {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Lagos',
      streetAddress: 'Plot 7 Kolawole Shonibare Street, by Eleganza Ajao Estate',
    },
  ],
  sameAs: [],
  knowsAbout: [
    'Freight Forwarding', 'Global Procurement', 'Manufacturing',
    'Automotive Procurement', 'Foreign Exchange Services', 'Supply Chain Management',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Google Translate */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'ar,zh-CN,zh-TW,en,fr,de,ha,hi,ig,it,ja,ko,la,pt,es,tr,yo',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                gaTrack: false,
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
