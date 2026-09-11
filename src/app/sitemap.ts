import type { MetadataRoute } from "next";
import { site } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: site.url, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/chat`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
