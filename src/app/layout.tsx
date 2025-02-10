import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aditya Portfolio',
  description: 'My personal portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
