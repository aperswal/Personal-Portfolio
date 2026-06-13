import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebMcpProvider } from "@/components/webmcp/webmcp-provider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adiperswal.com"),
  title: {
    default: "Adi Perswal — Software Engineer",
    template: "%s | Adi Perswal",
  },
  description:
    "Software engineer at Amazon. I like learning, building, and selling. This is my personal portfolio.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Adi Perswal",
    title: "Adi Perswal — Software Engineer",
    description:
      "Software engineer at Amazon. I like learning, building, and selling. This is my personal portfolio.",
    images: [
      {
        url: "https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/og/share-card.png",
        width: 1536,
        height: 1024,
        type: "image/png",
        alt: "AdityaOS — Adi Perswal’s macOS-style portfolio desktop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adi Perswal — Software Engineer",
    description:
      "Software engineer at Amazon. I like learning, building, and selling. This is my personal portfolio.",
    images: ["https://iii0suzaoyxkiy2q.public.blob.vercel-storage.com/og/share-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "AdityaOS",
  },
  // Curl-discoverable hint that this site speaks MCP. Agents can read these meta
  // tags (or the .well-known doc / Link header) to find the endpoint instead of scraping.
  other: {
    "mcp-server": "https://adiperswal.com/api/mcp",
    "mcp-discovery": "https://adiperswal.com/.well-known/mcp.json",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden">
        <WebMcpProvider />
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
