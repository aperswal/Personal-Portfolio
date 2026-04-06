import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "iii0suzaoyxkiy2q.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
