'use client';

import { useState, useEffect } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { DesktopInterface } from '@/components/DesktopInterface';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(() => {
    // Check if we're in the browser and if the user has completed the boot sequence
    if (typeof window !== 'undefined') {
      const hasCompleted = localStorage.getItem('bootComplete');
      return hasCompleted === 'true';
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Store the boot completion in localStorage
    localStorage.setItem('bootComplete', 'true');
  };

  // Add a way to reset the boot sequence (useful for testing)
  const handleReset = () => {
    setBootComplete(false);
    localStorage.removeItem('bootComplete');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="relative">
      {!bootComplete ? (
        <TerminalBoot onBootComplete={handleBootComplete} />
      ) : (
        <>
          <DesktopInterface />
          {/* Add a hidden reset button in the corner for testing */}
          <button
            onClick={handleReset}
            className="fixed bottom-2 right-2 text-xs text-gray-500 opacity-20 hover:opacity-100"
          >
            Reset Terminal
          </button>
        </>
      )}
    </main>
  );
}
