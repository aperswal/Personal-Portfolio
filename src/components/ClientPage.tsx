'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const NoSSRTerminalBoot = dynamic(
  () => import('@/components/TerminalBoot').then(mod => {
    console.log('TerminalBoot module loaded:', mod);
    return mod.default;
  }),
  {
    ssr: false,
    loading: () => {
      console.log('Loading TerminalBoot component...');
      return (
        <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading terminal...</div>
        </div>
      );
    },
  }
);

const NoSSRDesktopInterface = dynamic(
  () => import('@/components/DesktopInterface').then(mod => {
    console.log('DesktopInterface module loaded:', mod);
    return mod.default;
  }),
  {
    ssr: false,
    loading: () => {
      console.log('Loading DesktopInterface component...');
      return (
        <div className="bg-black min-h-screen flex items-center justify-center">
          <div className="text-green-500 font-mono animate-pulse">
            Loading desktop...
          </div>
        </div>
      );
    },
  }
);

export default function ClientPage() {
  console.log('Rendering ClientPage');
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // First useEffect to safely check if we're in a browser environment
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect in the client
    if (!isClient) return;
    
    console.log('ClientPage mounted');
    let mounted = true;

    const initializeClient = async () => {
      try {
        setIsLoading(true);
        // Check if we have a stored session
        const hasCompleted = sessionStorage.getItem('bootComplete') === 'true';
        console.log('Session storage bootComplete:', hasCompleted);
        if (mounted) {
          setBootComplete(hasCompleted);
          setIsMounted(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing client:', error);
        if (mounted) {
          setIsLoading(false);
          setIsMounted(true);
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
      console.log('ClientPage unmounting');
    };
  }, [isClient]);

  // Add event listener for visibility changes
  useEffect(() => {
    if (!isClient || !isMounted) return;

    const handleVisibilityChange = () => {
      console.log('Visibility changed:', document.visibilityState);
      if (document.visibilityState === 'visible') {
        const lastVisit = sessionStorage.getItem('lastVisitTime');
        const currentTime = new Date().getTime();
        
        if (lastVisit) {
          const timeDiff = currentTime - parseInt(lastVisit);
          console.log('Time since last visit (minutes):', timeDiff / 1000 / 60);
          if (timeDiff > 30 * 60 * 1000) {
            console.log('Resetting due to inactivity');
            handleReset();
          }
        }
        
        sessionStorage.setItem('lastVisitTime', currentTime.toString());
      }
    };

    sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMounted, isClient]);

  const handleBootComplete = () => {
    console.log('Boot sequence completed');
    setBootComplete(true);
    sessionStorage.setItem('bootComplete', 'true');
    sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
  };

  const handleReset = () => {
    console.log('Resetting boot sequence');
    setBootComplete(false);
    sessionStorage.removeItem('bootComplete');
    sessionStorage.removeItem('lastVisitTime');
  };

  if (isLoading || !isMounted) {
    console.log('ClientPage loading or not mounted');
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Initializing system...
        </div>
      </main>
    );
  }

  console.log('Rendering main content, bootComplete:', bootComplete);
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