import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Medeor - Free TCCC/CLS/PFC Training | Quizzes, CPGs, Videos',
  description: 'Free interactive TCCC, CLS, and Prolonged Field Care training app. MARCH protocol quizzes, flashcards, 86 JTS CPG direct PDF links, Deployed Medicine videos, Walking Blood Bank module, Parkland burn calculator, GCS calculator, and Ranger Medic Handbook reference. Built for combat medics, corpsmen, PJs, and 18Ds.',
  keywords: 'TCCC, CLS, tactical combat casualty care, combat medic training, MARCH protocol, hemorrhage control, tourniquet, NPA, needle decompression, chest seal, walking blood bank, ROLO, JTS CPG, prolonged field care, RAVINES, E-PAWS-B, Ranger Medic Handbook, military medical training, 68W, combat lifesaver, PFC nursing, HITMAN, GCS calculator, Parkland formula, Deployed Medicine',
  manifest: '/manifest.json',
  themeColor: '#0a0a0f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Medeor',
  },
  openGraph: {
    title: 'Medeor - Free TCCC/CLS/PFC Training App',
    description: 'Interactive quizzes, 86 JTS CPGs, Deployed Medicine videos, calculators, and Ranger Medic Handbook. Free, no login required.',
    type: 'website',
    url: 'https://medeor.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medeor - Free TCCC/CLS Training',
    description: 'Interactive military medical training. Quizzes, CPGs, videos, calculators. Free.',
  },
  alternates: {
    canonical: 'https://medeor.app',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const GA_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://medeor.app" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Medeor",
          "url": "https://medeor.app",
          "description": "Free interactive TCCC, CLS, and Prolonged Field Care training with quizzes, flashcards, JTS CPGs, videos, and medical calculators.",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "author": { "@type": "Organization", "name": "Medeor" }
        })}} />
      </head>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
