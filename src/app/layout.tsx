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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
