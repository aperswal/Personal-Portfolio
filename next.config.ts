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
  // Advertise the MCP endpoint on every response so an agent that curls the site
  // discovers it can talk MCP without scraping (see public/.well-known/mcp.json).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Link", value: '</.well-known/mcp.json>; rel="mcp-server"' },
          { key: "X-MCP-Server", value: "https://www.adityaperswal.com/api/mcp" },
        ],
      },
    ];
  },
};

export default nextConfig;
