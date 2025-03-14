'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Simplify dynamic imports to reduce potential failures
const NoSSRTerminalBoot = dynamic(() => import('@/components/TerminalBoot'), {
  ssr: false,
  loading: () => (
    <div className="bg-black text-green-500 font-mono p-4 min-h-screen flex items-center justify-center" 
         style={{backgroundColor: 'black', color: 'rgb(34, 197, 94)', fontFamily: 'monospace'}}>
      <div className="animate-pulse" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
        Loading terminal...
      </div>
    </div>
  ),
});

const NoSSRDesktopInterface = dynamic(() => import('@/components/DesktopInterface'), {
  ssr: false,
  loading: () => (
    <div className="bg-black min-h-screen flex items-center justify-center"
         style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="text-green-500 font-mono animate-pulse"
           style={{color: 'rgb(34, 197, 94)', fontFamily: 'monospace', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
        Loading desktop...
      </div>
    </div>
  ),
});

export default function ClientPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState(0);

  // First useEffect just to handle component mount and initialization
  useEffect(() => {
    console.log('ClientPage mounted, initializing...');
    let mounted = true;

    // Add a failsafe timeout to force the app to continue
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Initialization timeout triggered - force rendering the terminal');
        setIsLoading(false);
        setIsMounted(true);
        setForceRender(prev => prev + 1); // Force a re-render
      }
    }, 3000); // Reduced to 3 seconds for faster user experience

    const initializeClient = async () => {
      try {
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
            if (mounted) {
              setIsMounted(true);
              setIsLoading(false);
            }
          }
        } else {
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
          setIsMounted(true);
          setIsLoading(false);
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate useEffect for visibility changes
  useEffect(() => {
    if (!isMounted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        try {
          const lastVisit = sessionStorage.getItem('lastVisitTime');
          const currentTime = new Date().getTime();
          
          if (lastVisit) {
            const timeDiff = currentTime - parseInt(lastVisit);
            if (timeDiff > 30 * 60 * 1000) {
              handleReset();
            }
          }
          
          sessionStorage.setItem('lastVisitTime', currentTime.toString());
        } catch (e) {
          console.error('Error handling visibility change:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
      } catch (e) {
        console.error('Error setting lastVisitTime:', e);
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

  // This is our guaranteed fallback for deployment
  if (forceRender > 0 && isLoading) {
    console.log('Force rendering terminal due to timeout');
    return (
      <main className="relative">
        <NoSSRTerminalBoot onBootComplete={handleBootComplete} />
      </main>
    );
  }

  if (isLoading || !isMounted) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center" 
            style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-green-500 font-mono animate-pulse" 
             style={{color: 'rgb(34, 197, 94)', fontFamily: 'monospace', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
          Initializing system...
          {initError && <div className="text-red-500 mt-2" style={{color: 'red', marginTop: '0.5rem'}}>{initError}</div>}
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
            style={{position: 'fixed', bottom: '0.5rem', right: '0.5rem', fontSize: '0.75rem', color: 'rgb(107, 114, 128)', opacity: 0.2}}
          >
            Reset Terminal
          </button>
        </>
      )}
    </main>
  );
} 