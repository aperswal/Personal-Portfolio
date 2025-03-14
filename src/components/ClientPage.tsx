'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a simple placeholder component instead of loading the complex DesktopInterface
const SimpleDesktop = () => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen flex flex-col items-center justify-center p-5"
         style={{background: 'linear-gradient(to bottom right, #1e3a8a, #7e22ce)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <h1 className="text-white text-4xl font-bold mb-8" style={{color: 'white', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem'}}>
        Desktop Interface Test
      </h1>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 max-w-2xl w-full shadow-xl"
           style={{backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)'}}>
        <h2 className="text-green-400 text-2xl mb-4" style={{color: 'rgb(74,222,128)', fontSize: '1.5rem', marginBottom: '1rem'}}>
          Success! The desktop environment loaded.
        </h2>
        <p className="text-white mb-4" style={{color: 'white', marginBottom: '1rem'}}>
          This is a simplified version of the desktop interface for testing purposes. 
          The fact you can see this means we've successfully moved past the loading screen.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem'}}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all cursor-pointer flex items-center justify-center"
                 style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '1rem', cursor: 'pointer'}}>
              <span className="text-white" style={{color: 'white'}}>Item {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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

// We'll keep this for reference but we won't use it
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
    }, 3000); // 3 seconds timeout - reduced from 5

    // Immediately set as mounted and not loading after a short delay
    setTimeout(() => {
      if (mounted) {
        console.log('Setting mounted and not loading');
        setIsMounted(true);
        setIsLoading(false);
      }
    }, 1000); // Just a 1 second delay for visual effect

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      console.log('ClientPage unmounting');
    };
  }, []);

  const handleReset = () => {
    console.log('Reset button clicked');
    window.location.reload();
  };

  if (isLoading || !isMounted) {
    console.log('ClientPage loading or not mounted');
    return (
      <main className="bg-black min-h-screen flex items-center justify-center" style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-green-500 font-mono animate-pulse" style={{color: 'rgb(34, 197, 94)', fontFamily: 'monospace', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>
          Loading simplified desktop environment...
          {initError && <div className="text-red-500 mt-2" style={{color: 'rgb(239, 68, 68)', marginTop: '0.5rem'}}>{initError}</div>}
        </div>
      </main>
    );
  }

  console.log('Rendering simple desktop interface');
  return (
    <main className="relative">
      <SimpleDesktop />
      <button
        onClick={handleReset}
        className="fixed bottom-2 right-2 text-xs text-gray-500 opacity-20 hover:opacity-100 bg-black px-2 py-1 rounded"
        style={{position: 'fixed', bottom: '0.5rem', right: '0.5rem', fontSize: '0.75rem', color: 'rgb(107, 114, 128)', opacity: '0.2', backgroundColor: 'black', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}
      >
        Reload Page
      </button>
    </main>
  );
} 