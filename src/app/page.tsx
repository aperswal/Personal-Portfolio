'use client';

import { useState, useEffect } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { DesktopInterface } from '@/components/DesktopInterface';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main>
      {!bootComplete ? (
        <TerminalBoot onBootComplete={() => setBootComplete(true)} />
      ) : (
        <DesktopInterface />
      )}
    </main>
  );
}
