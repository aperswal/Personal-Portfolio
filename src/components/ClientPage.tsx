'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

console.log('Loading ClientPage module');

// Dynamically import components with no SSR and proper error boundaries
const NoSSRTerminalBoot = dynamic(
  () => {
    console.log('Loading TerminalBoot component');
    return import('./TerminalBoot')
      .then(mod => {
        console.log('TerminalBoot loaded successfully');
        return mod;
      })
      .catch(err => {
        console.error('Error loading TerminalBoot:', err);
        return () => (
          <div className="fixed inset-0 bg-black text-red-500 font-mono flex items-center justify-center">
            <div>
              <div className="mb-2">Error loading terminal component</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        );
      });
  },
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black text-green-500 font-mono flex items-center justify-center">
        <div className="animate-pulse">Loading terminal...</div>
      </div>
    ),
  }
);

const NoSSRDesktopInterface = dynamic(
  () => {
    console.log('Loading DesktopInterface component');
    return import('./DesktopInterface')
      .then(mod => {
        console.log('DesktopInterface loaded successfully');
        return mod;
      })
      .catch(err => {
        console.error('Error loading DesktopInterface:', err);
        return () => (
          <div className="fixed inset-0 bg-black text-red-500 font-mono flex items-center justify-center">
            <div>
              <div className="mb-2">Error loading desktop component</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        );
      });
  },
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Loading desktop...
        </div>
      </div>
    ),
  }
);

export default function ClientPage() {
  console.log('Rendering ClientPage');
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ClientPage mounted');
    let mounted = true;

    const initializeClient = async () => {
      try {
        console.log('Initializing client...');
        setIsLoading(true);
        // Check if we have a stored session
        if (typeof window !== 'undefined') {
          const hasCompleted = sessionStorage.getItem('bootComplete') === 'true';
          console.log('Session storage bootComplete:', hasCompleted);
          if (mounted) {
            setBootComplete(hasCompleted);
            setIsMounted(true);
            setIsLoading(false);
            console.log('Client initialized successfully');
          }
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
  }, []);

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
        
        sessionStorage.setItem('lastVisitTime', currentTime.toString());
      }
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastVisitTime', new Date().getTime().toString());
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
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Initializing system...
        </div>
      </div>
    );
  }

  console.log('Rendering main content, bootComplete:', bootComplete);
  return (
    <div className="fixed inset-0 bg-black">
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
    </div>
  );
} 