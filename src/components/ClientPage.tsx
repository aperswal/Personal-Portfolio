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
  // Always set bootComplete to true to skip terminal boot
  const [bootComplete, setBootComplete] = useState(true);
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
        // Simplified initialization
        if (mounted) {
          setIsMounted(true);
          setIsLoading(false);
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

  // Simplified - removed the visibility change event listener

  const handleReset = () => {
    console.log('Reset button clicked, but no action taken in bypass mode');
    // No-op in this simplified version
  };

  if (isLoading || !isMounted) {
    console.log('ClientPage loading or not mounted');
    return (
      <main className="bg-black min-h-screen flex items-center justify-center" style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-green-500 font-mono animate-pulse" style={{color: 'rgb(34, 197, 94)', fontFamily: 'monospace', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
          Loading desktop environment...
          {initError && <div className="text-red-500 mt-2">{initError}</div>}
        </div>
      </main>
    );
  }

  console.log('Rendering desktop interface directly');
  return (
    <main className="relative">
      <NoSSRDesktopInterface />
      <button
        onClick={handleReset}
        className="fixed bottom-2 right-2 text-xs text-gray-500 opacity-20 hover:opacity-100"
      >
        Reset Terminal
      </button>
    </main>
  );
} 