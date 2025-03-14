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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ClientPage mounted');
    let mounted = true;

    // Add a failsafe timeout to ensure we don't get stuck loading
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('Initialization timeout triggered - forcing completion');
        setIsLoading(false);
        setIsMounted(true);
      }
    }, 5000); // 5 seconds timeout

    const initializeClient = async () => {
      try {
        setIsLoading(true);
        // Check if we have a stored session
        if (typeof window !== 'undefined') {
          try {
            const hasCompleted = sessionStorage.getItem('bootComplete') === 'true';
            console.log('Session storage bootComplete:', hasCompleted);
            if (mounted) {
              setBootComplete(hasCompleted);
              setIsMounted(true);
              setIsLoading(false);
            }
          } catch (storageError) {
            console.error('Session storage error:', storageError);
            // Continue even if sessionStorage fails
            if (mounted) {
              setIsMounted(true);
              setIsLoading(false);
            }
          }
        } else {
          // If window is undefined, we're still in SSR but the effect is running
          // This shouldn't happen with 'use client', but add a failsafe
          console.log('Window is undefined in effect, forcing client init');
          if (mounted) {
            setIsMounted(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing client:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
        if (mounted) {
          setIsLoading(false);
          setIsMounted(true);
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      console.log('ClientPage unmounting');
    };
  }, [isLoading]);

  // Add event listener for visibility changes
  useEffect(() => {
    if (!isMounted) return;

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
        
        try {
          sessionStorage.setItem('lastVisitTime', currentTime.toString());
        } catch (e) {
          console.error('Error setting lastVisitTime:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
      } catch (e) {
        console.error('Error setting initial lastVisitTime:', e);
      }
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [isMounted]);

  const handleBootComplete = () => {
    console.log('Boot sequence completed');
    setBootComplete(true);
    try {
      sessionStorage.setItem('bootComplete', 'true');
      sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
    } catch (e) {
      console.error('Error saving boot completion:', e);
    }
  };

  const handleReset = () => {
    console.log('Resetting boot sequence');
    setBootComplete(false);
    try {
      sessionStorage.removeItem('bootComplete');
      sessionStorage.removeItem('lastVisitTime');
    } catch (e) {
      console.error('Error during reset:', e);
    }
  };

  if (isLoading || !isMounted) {
    console.log('ClientPage loading or not mounted');
    return (
      <main className="bg-black min-h-screen flex items-center justify-center" style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-green-500 font-mono animate-pulse" style={{color: 'rgb(34, 197, 94)', fontFamily: 'monospace', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
          Initializing system...
          {initError && <div className="text-red-500 mt-2">{initError}</div>}
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