import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Medeor — Tactical Combat Casualty Care',
  description: 'Interactive TCCC/CLS/PFC training, CPG reference, skills videos, and Ranger Medic Handbook field guide.',
  manifest: '/manifest.json',
  themeColor: '#0a0a0f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Medeor',
  },
  openGraph: {
    title: 'Medeor — Tactical Combat Casualty Care',
    description: 'Interactive TCCC/CLS/PFC training, CPGs, skills videos, and Ranger Medic Handbook.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const GA_ID = 'G-XXXXXXXXXX';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2117457463850623"
          crossOrigin="anonymous"
