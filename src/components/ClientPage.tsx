'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR - simplified imports
const NoSSRTerminalBoot = dynamic(() => import('@/components/TerminalBoot'), {
  ssr: false,
  loading: () => (
    <div style={{
      backgroundColor: 'black',
      color: 'rgb(34, 197, 94)',
      fontFamily: 'monospace',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        Loading terminal...
      </div>
    </div>
  ),
});

const NoSSRDesktopInterface = dynamic(() => import('@/components/DesktopInterface'), {
  ssr: false,
  loading: () => (
    <div style={{
      backgroundColor: 'black',
      color: 'rgb(34, 197, 94)',
      fontFamily: 'monospace',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        Loading desktop...
      </div>
    </div>
  ),
});

export default function ClientPage() {
  // Core state
  const [bootComplete, setBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simpler initialization
  useEffect(() => {
    console.log('ClientPage component mounted');
    
    // Shorter timeout - 3 seconds
    const timeoutId = setTimeout(() => {
      console.log('Initialization timeout - forcing boot');
      setIsMounted(true);
      setIsLoading(false);
    }, 3000);
    
    // Always set isMounted to true after a small delay to ensure client-side rendering
    const mountedId = setTimeout(() => {
      setIsMounted(true);
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(mountedId);
    };
  }, []);

  // Separating sessionStorage into its own effect
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      // Once mounted, check sessionStorage
      const storedBootComplete = sessionStorage.getItem('bootComplete') === 'true';
      console.log('Session storage bootComplete:', storedBootComplete);
      setBootComplete(storedBootComplete);
    } catch (e) {
      console.error('Error reading from sessionStorage:', e);
      setError('Storage error: ' + (e instanceof Error ? e.message : String(e)));
    }
  }, [isMounted]);

  // Auto-complete terminal in production after a delay
  useEffect(() => {
    // Only in production and if we're not already in desktop mode
    if (process.env.NODE_ENV === 'production' && isMounted && !bootComplete) {
      console.log('Setting up auto-complete for production');
      const autoCompleteId = setTimeout(() => {
        console.log('Auto-completing boot sequence in production');
        setBootComplete(true);
        try {
          sessionStorage.setItem('bootComplete', 'true');
        } catch (e) {
          console.error('Failed to save boot completion state:', e);
        }
      }, 10000); // Wait 10 seconds then auto-complete
      
      return () => clearTimeout(autoCompleteId);
    }
  }, [isMounted, bootComplete]);

  const handleBootComplete = () => {
    console.log('Boot sequence completed');
    setBootComplete(true);
    try {
      sessionStorage.setItem('bootComplete', 'true');
    } catch (e) {
      console.error('Error saving boot status:', e);
    }
  };

  const handleReset = () => {
    console.log('Resetting boot sequence');
    setBootComplete(false);
    try {
      sessionStorage.removeItem('bootComplete');
    } catch (e) {
      console.error('Error clearing boot status:', e);
    }
  };

  // Loading state
  if (isLoading || !isMounted) {
    return (
      <div style={{
        backgroundColor: 'black',
        color: 'rgb(34, 197, 94)',
        fontFamily: 'monospace',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          Initializing system...
          {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {!bootComplete ? (
        <NoSSRTerminalBoot onBootComplete={handleBootComplete} />
      ) : (
        <>
          <NoSSRDesktopInterface />
          <button
            onClick={handleReset}
            style={{
              position: 'fixed',
              bottom: '8px',
              right: '8px',
              fontSize: '0.75rem',
              color: 'rgb(107, 114, 128)',
              opacity: 0.2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.2')}
          >
            Reset Terminal
          </button>
        </>
      )}
    </div>
  );
} 