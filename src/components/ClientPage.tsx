'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const NoSSRTerminalBoot = dynamic(() => import('@/components/TerminalBoot'), {
  ssr: false,
  loading: () => (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading terminal...</div>
    </div>
  ),
});

const NoSSRDesktopInterface = dynamic(() => import('@/components/DesktopInterface'), {
  ssr: false,
  loading: () => (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-green-500 font-mono animate-pulse">
        Loading desktop...
      </div>
    </div>
  ),
});

export default function ClientPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if we have a stored session
    if (typeof window !== 'undefined') {
      const hasCompleted = sessionStorage.getItem('bootComplete') === 'true';
      setBootComplete(hasCompleted);
    }

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
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
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

  // Show nothing until mounted
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
        <NoSSRTerminalBoot onBootComplete={handleBootComplete} />
      ) : (
        <>
          <NoSSRDesktopInterface />
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