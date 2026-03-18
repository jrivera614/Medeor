import './globals.css';

export const metadata = {
  title: 'Medeor — Tactical Combat Casualty Care',
  description: 'Interactive TCCC/CLS/PFC training, CPG reference, skills videos, and Ranger Medic Handbook field guide.',
  manifest: '/manifest.json',
  themeColor: '#0a0a0f',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-tou
