'use client';

import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('../components/ClientPage'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-green-500 font-mono animate-pulse">
        Initializing system...
      </div>
    </div>
  ),
});

export default function Page() {
  return (
    <div className="fixed inset-0 bg-black">
      <ClientPage />
    </div>
  );
}
