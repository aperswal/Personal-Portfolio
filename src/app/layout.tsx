import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adi Perswal",
  description:
    "Software engineer at Amazon. UIUC Computer Engineering. Builder of things that last.",
  openGraph: {
    title: "Adi Perswal",
    description:
      "Software engineer at Amazon. UIUC Computer Engineering. Builder of things that last.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
