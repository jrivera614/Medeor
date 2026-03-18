'use client';

import dynamic from 'next/dynamic';

const TCCCApp = dynamic(() => import('./TCCCApp'), { ssr: false });

export default function Home() {
  return <TCCCApp />;
}
