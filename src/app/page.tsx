'use client';

import { useState, useEffect } from 'react';
import { TerminalBoot } from '@/components/TerminalBoot';
import { DesktopInterface } from '@/components/DesktopInterface';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(() => {
    // Only check sessionStorage (clears when tab is closed)
    if (typeof window !== 'undefined') {
      const hasCompleted = sessionStorage.getItem('bootComplete');
      return hasCompleted === 'true';
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Add event listener for when the tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if it's been more than 30 minutes since last visit
        const lastVisit = sessionStorage.getItem('lastVisitTime');
        const currentTime = new Date().getTime();
        
        if (lastVisit) {
          const timeDiff = currentTime - parseInt(lastVisit);
          // If it's been more than 30 minutes, reset the boot sequence
          if (timeDiff > 30 * 60 * 1000) {
            handleReset();
          }
        }
        
        // Update last visit time
        sessionStorage.setItem('lastVisitTime', currentTime.toString());
      }
    };

    // Set initial visit time
    sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Store in sessionStorage instead of localStorage
    sessionStorage.setItem('bootComplete', 'true');
    sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
  };

  const handleReset = () => {
    setBootComplete(false);
    sessionStorage.removeItem('bootComplete');
    sessionStorage.removeItem('lastVisitTime');
  };

  if (!isMounted) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Initializing system...
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      {!bootComplete ? (
        <TerminalBoot onBootComplete={handleBootComplete} />
      ) : (
        <>
          <DesktopInterface />
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
