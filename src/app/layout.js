import './globals.css';

export const metadata = {
  title: 'Medeor',
  description: 'Interactive TCCC, CLS, and Prolonged Field Care training platform.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Medeor',
  },
  openGraph: {
    title: 'Medeor',
    description: 'Tactical Combat Casualty Care. Interactive training, CPGs, skills videos, and Ranger Medic Handbook.',
    url: 'https://medeor.app',
    siteName: 'Medeor',
    images: [
      {
        url: 'https://medeor.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medeor',
    description: 'Tactical Combat Casualty Care. Interactive training, CPGs, and field reference.',
    images: ['https://medeor.app/og-image.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
