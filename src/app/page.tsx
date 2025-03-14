import ClientPage from '@/components/ClientPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Initializing system...
        </div>
      </div>
    }>
      <ClientPage />
    </Suspense>
  );
}
