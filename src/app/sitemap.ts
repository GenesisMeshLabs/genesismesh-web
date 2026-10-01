import type { MetadataRoute } from "next";
import { siteConfig, sitemapRoutes } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path === "/" ? "/" : route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
