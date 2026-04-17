'use client';
import { useEffect, useRef, CSSProperties } from 'react';

// AdUnit: AdSense ad slot. Pushes to adsbygoogle on mount, gated to once
// per mount to prevent double-push errors.

export interface AdUnitProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit({ slot, format = 'auto', responsive = true, style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '1.5rem 0', ...style }}>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2117457463850623"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
