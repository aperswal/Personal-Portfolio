import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aditya Perswal | Portfolio",
  description: "Full-stack developer with a passion for building innovative solutions",
  keywords: ["developer", "portfolio", "full-stack", "web development"],
  authors: [{ name: "Aditya Perswal" }],
  openGraph: {
    title: "Aditya Perswal | Portfolio",
    description: "Full-stack developer with a passion for building innovative solutions",
    url: "https://adityaperswal.com",
    siteName: "Aditya Perswal Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Perswal | Portfolio",
    description: "Full-stack developer with a passion for building innovative solutions",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
