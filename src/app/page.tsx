'use client';

import { useState } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { DesktopInterface } from '@/components/DesktopInterface';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

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
