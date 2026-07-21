import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, lastModified: new Date("2026-07-21"), changeFrequency: "monthly", priority: 1 }];
}
