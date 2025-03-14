'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import ClientPage with no SSR
const ClientComponent = dynamic(() => import('@/components/ClientPage'), {
  ssr: false,
  loading: () => (
    <div 
      style={{
        backgroundColor: 'black', 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgb(34, 197, 94)',
        fontFamily: 'monospace'
      }}
    >
      Loading application...
    </div>
  )
});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return a placeholder during SSR
  if (!mounted) {
    return (
      <div 
        style={{
          backgroundColor: 'black', 
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(34, 197, 94)',
          fontFamily: 'monospace'
        }}
      >
        Preparing environment...
      </div>
    );
  }
  
  return <ClientComponent />;
}
