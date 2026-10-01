import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://portfolio-flax-two-28.vercel.app",
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
