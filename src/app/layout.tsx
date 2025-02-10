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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="overflow-hidden" suppressHydrationWarning>
        <div className="fixed inset-0 bg-black">
          {children}
        </div>
      </body>
    </html>
  );
}
