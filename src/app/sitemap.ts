import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://adiperswal.com";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${baseUrl}/media`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/videos`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/essays`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.7 },
  ];
}
