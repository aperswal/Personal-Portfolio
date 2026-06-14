import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://adiperswal.com";
  const lastModified = new Date();

  return [{ url: baseUrl, lastModified, changeFrequency: "monthly", priority: 1 }];
}
